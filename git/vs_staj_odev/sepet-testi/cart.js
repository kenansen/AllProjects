/** 
 * 
 * Alışveriş sepetindeki ürünlerin toplam tutarını hesaplayan ana fonksiyon.
 * @param {Array} cartItems - Sepetteki ürünlerin listesi (Nesne dizisi).
 * @param {string} discountCode - Uygulanacak indirim kodu (Opsiyonel).
 */
function calculateCartTotal(cartItems, discountCode = '') {
  
  // GÜVENLİK KONTROLÜ: Gelen verinin bir liste (array) olup olmadığını kontrol eder.
  // Eğer liste değilse programın çökmesini engellemek için hata fırlatır.
  if (!Array.isArray(cartItems)) {
    throw new Error('cartItems must be an array');
  }

  // BOŞ SEPET KONTROLÜ: Eğer sepet boşsa hesaplama yapmaya gerek duymaz,
  // doğrudan sıfır değerlerini içeren bir sonuç nesnesi döndürür.
  if (cartItems.length === 0) {
    return { total: 0, discountApplied: 0, finalTotal: 0, items: [] };
  }

  // VERİ DÜZENLEME (MAP): Ham ürün verilerini işleyerek standart bir yapıya kavuşturur.
  const processedItems = cartItems.map((item) => {
    // Ürünün adı yoksa veya fiyatı geçersizse (sayı değilse veya negatifse) hata fırlatır.
    if (!item || typeof item.price !== 'number' || item.price < 0 || !item.name) {
      throw new Error('Invalid item in cart: price and name are required');
    }

    // MİKTAR KONTROLÜ: Ürün adedi girilmemişse veya 0'dan küçükse varsayılan olarak 1 kabul eder.
    const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1;
    
    // Her ürün için alt toplamı (fiyat * adet) hesaplayıp yeni bir nesne döndürür.
    return {
      name: item.name,
      price: item.price,
      quantity,
      subtotal: item.price * quantity,
    };
  });

  // TOPLAM TUTAR HESAPLAMA: Tüm ürünlerin alt toplamlarını toplayarak sepetin ham tutarını bulur.
  const total = processedItems.reduce((sum, item) => sum + item.subtotal, 0);

  // İNDİRİM MANTIĞI: Başlangıçta indirimi 0 olarak belirler.
  let discountApplied = 0;
  if (discountCode) {
    // İndirim kodunu büyük harfe çevirerek harf duyarlılığını ortadan kaldırır.
    switch (discountCode.toUpperCase()) {
      case 'SAVE10':
        discountApplied = total * 0.1; // Toplam tutar üzerinden %10 indirim
        break;
      case 'SAVE20':
        discountApplied = total * 0.2; // Toplam tutar üzerinden %20 indirim
        break;
      case 'FREESHIP':
        // Eğer toplam tutar 50 ve üzeriyse 5 birim kargo indirimi uygular.
        discountApplied = total >= 50 ? 5 : 0; 
        break;
      default:
        discountApplied = 0; // Geçersiz kod girilirse indirim yapmaz.
    }
  }

  // NİHAİ TUTAR: Toplamdan indirimi çıkarır. Math.max ile sonucun eksiye düşmesini engeller.
  const finalTotal = Math.max(total - discountApplied, 0); 

  // SONUÇ DÖNDÜRME: Tüm değerleri kuruş hassasiyeti (2 basamak) için düzenleyip nesne olarak döner.
  return {
    total: Number(total.toFixed(2)),           
    discountApplied: Number(discountApplied.toFixed(2)), 
    finalTotal: Number(finalTotal.toFixed(2)), 
    items: processedItems, // İşlenmiş ürün listesini de sonuca ekler.
  };
}

// Fonksiyonun test dosyasından veya başka dosyalardan çağrılabilmesini sağlar.
module.exports = calculateCartTotal;