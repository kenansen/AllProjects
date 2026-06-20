"""
Flask API - Müşteri Churn Prediction
GÜNCELLEME: Model başarı skorlarını (ROC AUC) saklayıp API üzerinden sunma özelliği eklendi.
"""

from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.metrics import roc_auc_score, make_scorer
import xgboost as xgb
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)

# Global değişkenler
models = {}
model_performance = {} # YENİ: Model skorlarını tutacak sözlük
scaler = None
feature_columns = []
country_features = []

def load_and_train_models():
    """CSV'yi yükle, veriyi zaman bazlı ayır ve modelleri eğit"""
    global models, scaler, feature_columns, country_features, model_performance
    
    try:
        df = pd.read_csv('customer_data.csv', encoding='latin-1')
    except FileNotFoundError:
        print("🔴 HATA: 'customer_data.csv' dosyası bulunamadı. Lütfen kontrol edin.")
        return
    
    # --- Veri Ön İşleme (Aynı kalıyor) ---
    df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'], format='%m/%d/%Y %H:%M')
    df = df[df['CustomerID'].notna()]
    df = df[(df['Quantity'] > 0) & (df['UnitPrice'] > 0)]
    df['TotalSpent'] = df['Quantity'] * df['UnitPrice']
    
    T_max = df['InvoiceDate'].max()
    T_feat = T_max - timedelta(days=180)
    T_obs_start = T_feat + timedelta(days=1)
    df_feat = df[df['InvoiceDate'] <= T_feat]
    max_date_feat = df_feat['InvoiceDate'].max()
    df_future = df[df['InvoiceDate'] >= T_obs_start]
    future_buyers = df_future['CustomerID'].unique()
    
    customer_country = df_feat.groupby('CustomerID')['Country'].first().reset_index()
    top_countries_by_spent = df_feat.groupby('Country')['TotalSpent'].sum().sort_values(ascending=False)
    top_countries = top_countries_by_spent.drop('United Kingdom', errors='ignore').head(5).index.tolist()
    customer_country['Country_Filtered'] = customer_country['Country'].apply(
        lambda x: x if x in top_countries else ('United Kingdom' if x == 'United Kingdom' else 'Other')
    )
    country_dummies = pd.get_dummies(customer_country[['CustomerID', 'Country_Filtered']], 
                                     columns=['Country_Filtered'], prefix='Country', drop_first=True)
    country_features = [col for col in country_dummies.columns if col.startswith('Country_')]
    
    customer_agg = df_feat.groupby('CustomerID').agg({
        'InvoiceNo': 'nunique', 'Quantity': 'sum', 'TotalSpent': 'sum',
        'StockCode': 'nunique', 'InvoiceDate': ['min', 'max']
    }).reset_index()
    customer_agg.columns = ['CustomerID', 'NumPurchases', 'TotalQuantity',
                            'TotalSpent', 'NumProducts', 'FirstPurchase', 'LastPurchase']
    
    customer_agg['Recency'] = (max_date_feat - customer_agg['LastPurchase']).dt.days
    customer_agg['Tenure'] = (customer_agg['LastPurchase'] - customer_agg['FirstPurchase']).dt.days + 1
    safe_purchases = customer_agg['NumPurchases'].replace(0, 1)
    customer_agg['AvgOrderValue'] = customer_agg['TotalSpent'] / safe_purchases
    customer_agg['AvgDaysBetweenPurchases'] = customer_agg['Tenure'] / safe_purchases
    customer_agg['ProductDiversity'] = customer_agg['NumProducts'] / safe_purchases
    
    T_90_days = max_date_feat - timedelta(days=90)
    df_90_days = df_feat[df_feat['InvoiceDate'] >= T_90_days]
    spending_90_days = df_90_days.groupby('CustomerID')['TotalSpent'].sum().rename('Spent_90Days')
    customer_agg = customer_agg.merge(spending_90_days, on='CustomerID', how='left').fillna(0)
    safe_total_spent = customer_agg['TotalSpent'].replace(0, 1)
    customer_agg['RecentSpendingRatio'] = customer_agg['Spent_90Days'] / safe_total_spent
    customer_agg.loc[customer_agg['Spent_90Days'] == 0, 'RecentSpendingRatio'] = 0
    
    customer_agg = customer_agg.set_index('CustomerID').join(country_dummies.set_index('CustomerID')).reset_index()
    customer_agg[country_features] = customer_agg[country_features].fillna(0)
    customer_agg['Churn'] = 1 
    customer_agg.loc[customer_agg['CustomerID'].isin(future_buyers), 'Churn'] = 0 
    
    print("\n----------------------------------------------------")
    print(f"📈 Dahil Edilen Ülkeler: {top_countries}")
    print(f"📊 Churn Dağılımı: {customer_agg['Churn'].value_counts().to_dict()}")
    print("----------------------------------------------------")
    
    feature_columns = ['NumPurchases', 'TotalQuantity', 'TotalSpent', 'NumProducts',
                       'Recency', 'Tenure', 'AvgOrderValue', 'AvgDaysBetweenPurchases',
                       'ProductDiversity', 'RecentSpendingRatio'] + country_features
    X = customer_agg[feature_columns].fillna(0).replace([np.inf, -np.inf], 0)
    y = customer_agg['Churn']
    
    class_counts = y.value_counts()
    churn_ratio = class_counts[0] / class_counts[1] if 1 in class_counts else 1.0
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.3, random_state=42, stratify=y
    )
    
    print("----------------------------------------------------")
    print("🧠 XGBoost İçin Grid Search Başlatılıyor...")
    
    param_grid_xgb = {
        'n_estimators': [100, 150],
        'max_depth': [4, 6],
        'learning_rate': [0.1, 0.05],
        'gamma': [0, 0.1],
    }
    
    auc_scorer = make_scorer(roc_auc_score, needs_proba=True)
    
    grid_search_xgb = GridSearchCV(
        estimator=xgb.XGBClassifier(
            objective='binary:logistic',
            use_label_encoder=False,
            eval_metric='logloss',
            scale_pos_weight=churn_ratio,
            random_state=42
        ),
        param_grid=param_grid_xgb,
        scoring=auc_scorer,
        cv=5,
        verbose=1,
        n_jobs=-1
    )
    
    grid_search_xgb.fit(X_train, y_train)
    models['XGBoost'] = grid_search_xgb.best_estimator_
    print(f"✅ XGBoost En İyi Parametreler: {grid_search_xgb.best_params_}")
    
    models['Random Forest'] = RandomForestClassifier(
        n_estimators=100, max_depth=5, min_samples_split=50, 
        min_samples_leaf=20, random_state=42, class_weight='balanced'
    )
    models['Decision Tree'] = DecisionTreeClassifier(
        max_depth=4, min_samples_split=100, 
        min_samples_leaf=30, random_state=42, class_weight='balanced'
    )
    models['Logistic Regression'] = LogisticRegression(
        max_iter=1000, C=0.01, penalty='l2', random_state=42, class_weight='balanced'
    )
    models['Support Vector Machine'] = SVC(
        probability=True, C=0.1, kernel='rbf', random_state=42, class_weight='balanced' 
    )

    print("\n----------------------------------------------------")
    print("🧠 Model Eğitim Sonuçları (Performans Kaydediliyor)")
    print("----------------------------------------------------")
    
    # Model_performance sözlüğünü sıfırla
    model_performance = {}

    for name, model in models.items():
        if name != 'XGBoost':
             model.fit(X_train, y_train)
        
        y_prob = model.predict_proba(X_test)[:, 1] if hasattr(model, "predict_proba") else None
        
        test_auc = roc_auc_score(y_test, y_prob) if y_prob is not None else 0.0
        cv_scores = cross_val_score(model, X_scaled, y, cv=5, scoring='roc_auc', n_jobs=-1)
        mean_cv_auc = cv_scores.mean()

        # YENİ: Performansı sözlüğe kaydet
        model_performance[name] = {
            "test_auc": round(test_auc, 4),
            "cv_mean_auc": round(mean_cv_auc, 4)
        }
        
        print(f"🎯 {name}")
        print(f"   - Test ROC AUC: {test_auc:.4f}")
        print(f"   - Cross-Validation Mean AUC: {mean_cv_auc:.4f}")
    
    print("✅ Modeller eğitildi ve performanslar kaydedildi!")

# --- YENİ ENDPOINT: MODEL PERFORMANSLARINI GETİR ---
@app.route('/model_metrics', methods=['GET'])
def get_model_metrics():
    """Eğitilen modellerin performans skorlarını döndürür"""
    global model_performance
    if not model_performance:
        return jsonify({'success': False, 'error': 'Modeller henüz eğitilmedi'}), 503
    
    return jsonify({
        'success': True,
        'metrics': model_performance
    })

@app.route('/predict', methods=['POST'])
def predict_churn():
    """Churn tahmini yap"""
    global country_features
    try:
        data = request.json
        if not data:
             return jsonify({'success': False, 'error': 'JSON veri gövdesi (body) bulunamadı.'}), 400

        try:
            quantity = float(data.get('quantity', 1))
            price = float(data.get('price', 10))
            frequency = int(data.get('frequency', 1))
            recency_days = int(data.get('recency', 30))
            tenure_days = int(data.get('tenure', 180))
            num_product_types = int(data.get('numProducts', 1))
            input_country = data.get('country', 'United Kingdom')
            model_name = data.get('model', 'XGBoost')
        except (ValueError, TypeError) as e:
            return jsonify({'success': False, 'error': f'Giriş parametreleri hatalı veya eksik. Hata: {str(e)}'}), 400

        num_purchases = max(1, frequency)
        total_quantity = quantity * num_purchases
        total_spent = quantity * price * num_purchases
        num_products = max(1, num_product_types)
        recency = recency_days
        tenure = max(1, tenure_days) 
        
        avg_order_value = total_spent / num_purchases
        avg_days_between = tenure / num_purchases if num_purchases > 1 else 30
        product_diversity = num_products / num_purchases

        spent_90_days = total_spent if recency <= 90 else (total_spent * (90/tenure))
        safe_total_spent = total_spent if total_spent > 0 else 1
        recent_spending_ratio = spent_90_days / safe_total_spent
        recent_spending_ratio = min(1.0, recent_spending_ratio) 

        base_features = [
            num_purchases, total_quantity, total_spent, num_products,
            recency, tenure, avg_order_value, avg_days_between,
            product_diversity, recent_spending_ratio
        ]
        
        country_vector = [0] * len(country_features)
        
        country_col_name = f'Country_Filtered_{input_country}'
        
        if country_col_name in country_features:
            index = country_features.index(country_col_name)
            country_vector[index] = 1
        elif input_country != 'United Kingdom':
             country_col_name_other = 'Country_Filtered_Other'
             if country_col_name_other in country_features:
                 index = country_features.index(country_col_name_other)
                 country_vector[index] = 1

        final_features = base_features + country_vector
        features = np.array([final_features], dtype=np.float64)

        if scaler is None or not models:
             return jsonify({
                 'success': False,
                 'error': 'Modeller henüz yüklenmedi veya eğitilmedi. Lütfen sunucuyu kontrol edin.'
             }), 503 
        
        features_scaled = scaler.transform(features)
        model = models.get(model_name)
        
        if model is None:
             return jsonify({
                 'success': False,
                 'error': f'Model bulunamadı: {model_name}. Mevcut modeller: {list(models.keys())}'
             }), 400
             
        churn_prob = model.predict_proba(features_scaled)[0][1] * 100
        
        return jsonify({
            'success': True,
            'churnProbability': round(churn_prob, 2),
            'model': model_name,
            'message': f'{model_name} ile tahmin başarılı, Ülke: {input_country}'
        })
        
    except Exception as e:
        print(f"Tahmin sırasında beklenmedik hata: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Sunucu tarafında beklenmedik bir hata oluştu.',
            'details': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """API sağlık kontrolü"""
    return jsonify({'status': 'OK', 'models_loaded': len(models)})

if __name__ == '__main__':
    print("🚀 Modeller yükleniyor...")
    load_and_train_models()
    print("🌐 Flask API başlatılıyor...")
    app.run(host='0.0.0.0', port=5000, debug=True)