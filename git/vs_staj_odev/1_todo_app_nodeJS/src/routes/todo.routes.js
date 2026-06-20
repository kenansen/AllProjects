// Express adında, web sitesi veya API yapmamızı aşırı kolaylaştıran ana kütüphaneyi dosyamıza çağırıyoruz. 
// 'require' kelimesi "bu paketi bul ve getir" demektir. 
// 'const' ise bu paketi içine koyduğumuz sabit kutunun türüdür, sonradan değiştirilemez.
const express = require('express');

// Express'in içinden "Router" yani "Yönlendirici" aracını alıp çalıştırıyoruz. 
// Bu aslında bir trafik polisidir. Gelen bağlantıları "sen şu işleme, sen bu işleme" diye dağıtacak.
const router = express.Router();

// Asıl işleri (veri ekleme, silme, okuma vs.) yapan asıl beyin dosyamızı (controller) çağırıyoruz.
// Parantez içindeki '../' kısmı "bulunduğun klasörden bir üst klasöre çık" demektir.
// Sonra 'controllers' klasörüne gir ve 'todo.controller' dosyasını al getir dedik.
const todoController = require('../controllers/todo.controller');

// EĞER biri uygulamamıza veri okumak/görmek için gelirse (GET isteği) ve tam ana adresteyse ('/'),
// git bizim beyin dosyamızdaki "getAllTodos" (tüm yapılacakları getir) isimli fonksiyonu/işlemi çalıştır.
router.get('/', todoController.getAllTodos);

// EĞER biri uygulamamıza yepyeni bir veri kaydetmek/göndermek isterse (POST isteği) ve ana adresteyse ('/'),
// git beyin dosyamızdaki "createTodo" (yeni yapılacak madde oluştur) işlemini çalıştır.
router.post('/', todoController.createTodo);

// EĞER biri var olan bir veriyi değiştirmek/güncellemek isterse (PUT isteği) 
// ve adresin sonuna değiştireceği şeyin özel kimlik numarasını yazarsa (':id' kısmı "sıra numarası veya kimlik" demektir),
// git beyin dosyamızdaki "updateTodo" (yapılacak maddeyi güncelle) işlemini çalıştır.
router.put('/:id', todoController.updateTodo);

// EĞER biri bir veriyi tamamen sistemden silmek isterse (DELETE isteği) 
// ve silmek istediği şeyin kimlik numarasını verirse (':id'),
// git beyin dosyamızdaki "deleteTodo" (yapılacak maddeyi sil) işlemini çalıştır.
router.delete('/:id', todoController.deleteTodo);

// Bütün kurallarını yazdığımız bu "trafik polisi" sistemini dışarıya açıyoruz/aktarıyoruz (module.exports).
// Bunu yapıyoruz ki, projemizin diğer ana dosyaları bu ayarları görüp içeriğine dahil edebilsin.
module.exports = router;