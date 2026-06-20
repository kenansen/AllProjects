/**
 * App.js
 * ------
 * Uygulama kök bileşeni.
 * Model, Controller ve View katmanlarını bir araya getirir.
 *
 * Veri akışı:
 *   Kullanıcı tıklar
 *     → Controller handler tetiklenir
 *       → Model güncellenir
 *         → setDisplay çağrılır
 *           → CalcDisplay yeniden render edilir
 */

import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CalcDisplay from './components/CalcDisplay';
import CalcGrid    from './components/CalcGrid';
import CalculatorController from './controller/CalculatorController';

/**
 * App bileşeni — hesap makinesini sayfada konumlandırır.
 */
function App() {
  /** Ekranda gösterilecek değer; Controller tarafından güncellenir */
  const [display, setDisplay] = useState('0');

  /**
   * Controller'ı useMemo ile oluştur:
   * setDisplay değişmediği sürece yeniden oluşturulmaz.
   */
  const controller = useMemo(
    () => CalculatorController(setDisplay),
    [setDisplay]
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      {/* Başlık */}
      <Typography
        variant="h6"
        sx={{
          color: '#8E8E93',
          fontFamily: '"SF Pro Display", "Helvetica Neue", sans-serif',
          fontWeight: 300,
          marginBottom: 3,
          letterSpacing: '0.05em',
        }}
      >
        Calculator
      </Typography>

      {/* Hesap makinesi gövdesi */}
      <Box sx={{ width: '100%', maxWidth: 320 }}>
        {/* Ekran — Model'deki currentValue'yu gösterir */}
        <CalcDisplay value={display} />

        {/* Tuş takımı — Controller handler'larını alır */}
        <CalcGrid controller={controller} />
      </Box>
    </Box>
  );
}

export default App;
