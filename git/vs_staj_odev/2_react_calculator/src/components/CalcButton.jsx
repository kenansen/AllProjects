/**
 * CalcButton.jsx
 * --------------
 * Atomic Component — Hesap makinesi tek tuş bileşeni.
 * MUI Button kullanır; renk ve genişlik dışarıdan prop ile belirlenir.
 * Yeniden kullanılabilir, bağımsız bir birimdir.
 */

import React from 'react';
import Button from '@mui/material/Button';

/**
 * CalcButton bileşeni.
 *
 * @param {Object}   props
 * @param {string}   props.label      - Buton üzerinde görünecek metin
 * @param {Function} props.onClick    - Tıklama olayı handler'ı
 * @param {'operator'|'action'|'number'} props.variant - Renk teması
 * @param {boolean}  [props.wide]     - true ise buton iki sütun genişliğinde olur (0 tuşu)
 */
const CalcButton = ({ label, onClick, variant = 'number', wide = false }) => {

  /** Her varyant için MUI arka plan rengi */
  const colorMap = {
    operator: '#FF9F0A',   // Turuncu — operatör tuşları
    action:   '#505050',   // Koyu gri — AC, +/-, %
    number:   '#D4D4D2',   // Açık gri — rakamlar
  };

  /** Hover rengi */
  const hoverMap = {
    operator: '#FFB340',
    action:   '#686868',
    number:   '#E8E8E6',
  };

  /** Metin rengi: operatör ve action tuşlarda beyaz, number'da siyah */
  const textColor = variant === 'number' ? '#1C1C1E' : '#FFFFFF';

  return (
    <Button
      onClick={onClick}
      sx={{
        backgroundColor: colorMap[variant],
        color: textColor,
        fontFamily: '"SF Pro Display", "Helvetica Neue", sans-serif',
        fontSize: '1.3rem',
        fontWeight: 400,
        borderRadius: '50px',
        /* wide=true → 0 butonu için tam genişlik */
        gridColumn: wide ? 'span 2' : 'span 1',
        minWidth: 0,
        padding: '18px 0',
        textTransform: 'none',
        transition: 'background-color 0.15s ease',
        '&:hover': {
          backgroundColor: hoverMap[variant],
        },
        '&:active': {
          opacity: 0.8,
        },
      }}
    >
      {label}
    </Button>
  );
};

export default CalcButton;
