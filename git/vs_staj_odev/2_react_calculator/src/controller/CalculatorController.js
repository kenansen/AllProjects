    /**
 * CalculatorController.js
 * -----------------------
 * MVC - Controller Katmanı
 * Model ile View arasındaki köprüdür.
 * Kullanıcı etkileşimlerini alır, modeli günceller ve
 * View'ın yeniden render edilmesi için state setter'ı çağırır.
 */
 
import CalculatorModel from '../model/CalculatorModel';
 
/**
 * CalculatorController factory fonksiyonu.
 * Her oturum için tek bir model örneği kullanır.
 *
 * @param {Function} setDisplay - React setState; ekranda gösterilecek değeri günceller
 * @returns {Object} Kullanıcı olaylarına karşılık gelen handler nesnesi
 */
const CalculatorController = (setDisplay) => {
 
  /** Modeli güncelledikten sonra View'ı senkronize eder */
  const _sync = () => setDisplay(CalculatorModel.currentValue);
 
  return {
    /**
     * Rakam ya da nokta (.) tuşuna basılınca çağrılır.
     * @param {string} digit
     */
    handleDigit(digit) {
      CalculatorModel.inputDigit(digit);
      _sync();
    },
 
    /**
     * Operatör tuşlarına (+, -, ×, ÷) basılınca çağrılır.
     * @param {string} op
     */
    handleOperator(op) {
      CalculatorModel.setOperator(op);
      _sync();
    },
 
    /**
     * Eşittir (=) tuşuna basılınca çağrılır.
     */
    handleEquals() {
      CalculatorModel.calculate();
      _sync();
    },
 
    /**
     * AC tuşuna basılınca çağrılır; her şeyi sıfırlar.
     */
    handleReset() {
      CalculatorModel.reset();
      _sync();
    },
 
    /**
     * +/- tuşuna basılınca çağrılır; işaret tersler.
     */
    handleToggleSign() {
      CalculatorModel.toggleSign();
      _sync();
    },
 
    /**
     * % tuşuna basılınca çağrılır; değeri 100'e böler.
     */
    handlePercent() {
      CalculatorModel.inputPercent();
      _sync();
    },
  };
};
 
export default CalculatorController;