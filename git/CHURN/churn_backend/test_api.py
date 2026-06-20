import requests
import json

# API'nin çalıştığı adres
URL = "http://127.0.0.1:5000/predict"

# 🎯 TAHMİN İÇİN GÖNDERİLECEK JSON VERİSİ (Body)
# Bu veriler, tahmin yapılacak tek bir müşteriyi temsil eder.
data = {
    "quantity": 10,          # Bir faturadaki ortalama ürün miktarı
    "price": 5.5,            # Ortalama ürün fiyatı
    "frequency": 12,         # 180 günlük periyotta yaptığı toplam alışveriş sayısı (NumPurchases)
    "recency": 10,           # Son alışverişin kaç gün önce olduğu (Recency)
    "tenure": 365,           # Müşteri olma süresi (gün)
    "numProducts": 30,       # Toplam aldığı farklı ürün çeşidi
    "country": "Germany",    # Almanya'dan gelen bir müşteri
    "model": "Random Forest" # Kullanılacak modelin adı
}

# İstek gönderme
try:
    response = requests.post(URL, json=data)
    response.raise_for_status() # Hata kodlarını (4xx, 5xx) yakalar

    # Yanıtı JSON formatında yazdır
    result = response.json()
    
    print("\n--- API Yanıtı ---")
    print(json.dumps(result, indent=4, ensure_ascii=False))
    print("------------------")

    if result.get('success'):
        print(f"\n✅ Başarı: Müşteri Kayıp Olasılığı: %{result['churnProbability']}")
    else:
        print(f"\n❌ Hata: {result.get('error')}")

except requests.exceptions.RequestException as e:
    print(f"\n❌ İstek Hatası: Sunucuya ulaşılamadı. Flask API'niz çalışıyor mu? Hata: {e}")