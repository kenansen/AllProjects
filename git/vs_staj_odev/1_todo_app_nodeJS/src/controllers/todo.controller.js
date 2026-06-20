// Veritabanındaki 'Todo' (yapılacaklar) taslağımızı alıp projemize dahil ediyoruz.
const Todo = require('../models/todo.model');

/**
 * @description Tüm Todo'ları getirir (Read)
 */


// "exports": Bu işlemi dışarıya aç ki başkaları da kullanabilsin.
// "async": İşlem zaman alacak, bitene kadar bekle (asenkron).
// "req": Bize gelen istek (kullanıcı ne istiyor?), "res": Bizim cevabımız.
exports.getAllTodos = async (req, res) => {
  // "try": Buradaki kodları çalıştırmayı dene.
  try {
    // "await": Veritabanında arama yap ve bulana kadar burada bekle.
    const todos = await Todo.find();
    // 200 kodu "Her şey yolunda" demek. Bulduğumuz verileri cevap olarak yolla.
    res.status(200).json(todos);
  } catch (error) { 
    // "catch": Eğer denerken hata çıkarsa sistemi çökertme, hatayı yakala.
    // 500 kodu "Sunucuda/Sistemde hata çıktı" demek. Hatayı cevapla.
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Yeni bir Todo oluşturur (Create)
 */
exports.createTodo = async (req, res) => {
  try {
    // "req.body": Kullanıcının bize form aracılığıyla gönderdiği veriler.
    const { name, status } = req.body;
    // Gelen verilerle yepyeni bir kayıt paketi hazırlıyoruz.
    const newTodo = new Todo({ name, status });
    // Hazırladığımız paketi veritabanına kaydedip kaydolana kadar bekliyoruz.
    const savedTodo = await newTodo.save();
    // 201 kodu "Başarıyla yeni bir şey oluşturuldu" demek.
    res.status(201).json(savedTodo);
  } catch (error) {
    // 400 kodu "Kullanıcı hatalı/eksik veri yolladı" demek.
    res.status(400).json({ message: error.message });
  }
};

/**
 * @description ID'ye göre bir Todo'yu günceller (Update)
 */
exports.updateTodo = async (req, res) => {
  try {
    // "req.params": İnternet linkinin sonuna yazılan numara (id).
    const { id } = req.params;
    // Kullanıcının gönderdiği yeni isim ve durum bilgilerini alıyoruz.
    const { name, status } = req.body;
    
    // { new: true } güncellenmiş veriyi döndürmesini sağlar, runValidators ise enum kurallarını kontrol eder
    // Veritabanında numarayı bul ve gönderdiğimiz yeni bilgilerle değiştirip bekle.
    const updatedTodo = await Todo.findByIdAndUpdate(
      id, 
      { name, status }, 
      { new: true, runValidators: true }
    );

    // Eğer öyle bir kayıt veritabanında yoksa, 404 "Öyle bir şey bulamadım" hatası ver.
    if (!updatedTodo) return res.status(404).json({ message: 'Todo bulunamadı' });
    // Varsa ve güncellediyse, 200 "Tamamdır" de ve dosyanın yeni halini yolla.
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @description ID'ye göre bir Todo'yu siler (Delete)
 */
exports.deleteTodo = async (req, res) => {
  try {
    // Silinecek şeyin kimlik numarasını linkten aldık.
    const { id } = req.params;
    // Veritabanında bu kimliği bul ve direkt çöp kutusuna at, bitene kadar bekle.
    const deletedTodo = await Todo.findByIdAndDelete(id);
    
    // Öyle bir şey zaten yoksa, 404 ile "Bulamadım ki sileyim" de.
    if (!deletedTodo) return res.status(404).json({ message: 'Todo bulunamadı' });
    // Sildiyse 200 ile "Başarıyla silindi" mesajı gönder.
    res.status(200).json({ message: 'Todo başarıyla silindi' });
  } catch (error) {
    // Silmeye çalışırken bir şeyler ters giderse 500 koduyla sistem hatası ver.
    res.status(500).json({ message: error.message });
  }
};