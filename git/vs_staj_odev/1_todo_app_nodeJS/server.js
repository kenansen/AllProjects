// .env dosyasındaki gizli ayarları (şifreler, port numaraları vb.) sisteme yükle.
require('dotenv').config();

// Uygulamanın ana ayarlarının ve rotalarının olduğu dosyayı çağır.
const app = require('./src/app');

// Veritabanına bağlanmamızı sağlayan fonksiyonu dosyadan getir.
const connectDB = require('./src/config/db');

// Sunucu hangi kapıdan (port) yayın yapacak? 
// Gizli dosyada (APP_PORT) varsa onu kullan, yoksa varsayılan olarak 3000'i kullan.
const PORT = process.env.APP_PORT || 3000;

// Önce veritabanına bağlanmayı dene, bağlandıktan sonra (then) içindeki işleri yap.
connectDB().then(() => {
  // Sunucuyu belirlenen kapıdan (PORT) dış dünyaya aç ve çalıştır.
  app.listen(PORT, () => {
    // Siyah ekrana (terminale) her şeyin yolunda olduğunu ve adresi yaz.
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
    console.log(`API Dokümantasyonu (Swagger): http://localhost:${PORT}/api-docs`);
  });
});