/**
 * CalculatorModel.js
 * ------------------
 * MVC - Model Katmanı
 * Hesap makinesi durumunu (state) ve iş mantığını (business logic) yönetir.
 * Görünümden (View) tamamen bağımsızdır.
 */
 
const CalculatorModel = {
  /** Ekranda gösterilen anlık değer */
  currentValue: '0',
 
  /** İşlem öncesi kaydedilen önceki değer */
  previousValue: null,
 
  /** Seçili matematiksel operatör (+, -, ×, ÷) */
  operator: null,
 
  /** Operatör seçildikten sonra yeni sayı bekleniyor mu? */
  waitingForOperand: false,
 
  /**
   * Rakam veya nokta tuşuna basıldığında çağrılır.
   * @param {string} digit - Girilen rakam ya da '.'
   */
  inputDigit(digit) {
    // Operatör seçildiyse yeni sayıya başla
    if (this.waitingForOperand) {
      this.currentValue = String(digit);
      this.waitingForOperand = false;
      return;
    }
 
    // Birden fazla nokta girişini engelle
    if (digit === '.' && this.currentValue.includes('.')) return;
 
    // Başındaki sıfırı koru ama "00" yazmayı engelle
    this.currentValue =
      this.currentValue === '0' && digit !== '.'
        ? String(digit)
        : this.currentValue + digit;
  },
 
  /**
   * Yüzde (%) tuşuna basıldığında çağrılır.
   * Mevcut değeri 100'e böler.
   */
  inputPercent() {
    const value = parseFloat(this.currentValue);
    if (isNaN(value)) return;
    this.currentValue = String(value / 100);
  },
 
  /**
   * +/- tuşuna basıldığında çağrılır.
   * Değerin işaretini tersine çevirir.
   */
  toggleSign() {
    const value = parseFloat(this.currentValue);
    if (isNaN(value)) return;
    this.currentValue = String(value * -1);
  },
 
  /**
   * Operatör tuşuna basıldığında çağrılır (+, -, ×, ÷).
   * Bekleyen bir işlem varsa önce onu hesaplar.
   * @param {string} op - Seçilen operatör
   */
  setOperator(op) {
    const current = parseFloat(this.currentValue);
 
    // Zincir işlem: önceki operatör varsa hesapla
    if (this.operator && !this.waitingForOperand) {
      const result = this._calculate(parseFloat(this.previousValue), current, this.operator);
      this.currentValue = this._format(result);
      this.previousValue = this.currentValue;
    } else {
      this.previousValue = this.currentValue;
    }
 
    this.operator = op;
    this.waitingForOperand = true;
  },
 
  /**
   * Eşittir (=) tuşuna basıldığında çağrılır.
   * Bekleyen operatörü uygulayarak sonucu hesaplar.
   */
  calculate() {
    if (!this.operator || this.waitingForOperand) return;
 
    const prev = parseFloat(this.previousValue);
    const current = parseFloat(this.currentValue);
    const result = this._calculate(prev, current, this.operator);
 
    this.currentValue = this._format(result);
    this.previousValue = null;
    this.operator = null;
    this.waitingForOperand = false;
  },
 
  /**
   * AC (All Clear) tuşuna basıldığında çağrılır.
   * Tüm state'i sıfırlar.
   */
  reset() {
    this.currentValue = '0';
    this.previousValue = null;
    this.operator = null;
    this.waitingForOperand = false;
  },
 
  // ─── Private Yardımcı Metodlar ────────────────────────────────────────────
 
  /**
   * İki sayı üzerinde verilen operatörü uygular.
   * @param {number} a - Sol operand
   * @param {number} b - Sağ operand
   * @param {string} op - Operatör
   * @returns {number} Hesaplama sonucu
   * @private
   */
  _calculate(a, b, op) {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 'Hata';
      default:  return b;
    }
  },
 
  /**
   * Sonucu ekrana uygun biçimde formatlar.
   * Çok uzun ondalık sayıları kısaltır.
   * @param {number|string} value
   * @returns {string}
   * @private
   */
  _format(value) {
    if (value === 'Hata') return 'Hata';
    const num = parseFloat(value);
    if (isNaN(num)) return '0';
    // Ondalık fazlaysa yuvarla
    return parseFloat(num.toFixed(10)).toString();
  },
};
 
export default CalculatorModel;