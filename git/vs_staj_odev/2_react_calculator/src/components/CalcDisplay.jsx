/**
 * CalcDisplay.jsx
 * ---------------
 * Atomic Component — Hesap makinesi ekran bileşeni.
 * Modelden gelen anlık değeri görüntüler.
 * Uzun sayılar için yazı boyutunu otomatik küçültür.
 */

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * CalcDisplay bileşeni.
 *
 * @param {Object} props
 * @param {string} props.value - Gösterilecek sayı/metin
 */
const CalcDisplay = ({ value }) => {

  /**
   * Değer uzunluğuna göre dinamik font boyutu hesaplar.
   * @returns {string} CSS font-size değeri
   */
  const getFontSize = () => {
    if (value.length > 9)  return '2rem';
    if (value.length > 6)  return '2.8rem';
    return '3.5rem';
  };

  return (
    <Box
      sx={{
        backgroundColor: '#1C1C1E',
        borderRadius: '16px 16px 0 0',
        padding: '16px 20px 12px',
        textAlign: 'right',
        minHeight: '90px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
      }}
    >
      <Typography
        sx={{
          color: '#FFFFFF',
          fontSize: getFontSize(),
          fontFamily: '"SF Pro Display", "Helvetica Neue", sans-serif',
          fontWeight: 300,
          letterSpacing: '-1px',
          lineHeight: 1,
          wordBreak: 'break-all',
          transition: 'font-size 0.1s ease',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

export default CalcDisplay;
