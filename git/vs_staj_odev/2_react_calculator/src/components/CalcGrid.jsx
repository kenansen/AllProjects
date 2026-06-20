/**
 * CalcGrid.jsx
 * ------------
 * Composite Component — Tüm tuş düzenini oluşturan ızgara bileşeni.
 * CalcButton atomik bileşenlerini CSS Grid içinde düzenler.
 * Controller handler'larını prop olarak alır; mantık bu bileşende yoktur.
 */

import React from 'react';
import Box from '@mui/material/Box';
import CalcButton from './CalcButton';

/**
 * CalcGrid bileşeni.
 *
 * @param {Object}   props
 * @param {Object}   props.controller - CalculatorController'dan gelen handler nesnesi
 */
const CalcGrid = ({ controller }) => {

  /**
   * Buton tanımları — düzen, etiket, tür ve onClick belirlenir.
   * type: 'operator' | 'action' | 'number'
   * wide: true → gridColumn: span 2  (0 tuşu)
   */
  const buttons = [
    // Satır 1 — Fonksiyon tuşları
    { label: 'AC',  type: 'action',   onClick: controller.handleReset      },
    { label: '+/-', type: 'action',   onClick: controller.handleToggleSign },
    { label: '%',   type: 'action',   onClick: controller.handlePercent    },
    { label: '÷',   type: 'operator', onClick: () => controller.handleOperator('÷') },

    // Satır 2
    { label: '7', type: 'number', onClick: () => controller.handleDigit('7') },
    { label: '8', type: 'number', onClick: () => controller.handleDigit('8') },
    { label: '9', type: 'number', onClick: () => controller.handleDigit('9') },
    { label: '×', type: 'operator', onClick: () => controller.handleOperator('×') },

    // Satır 3
    { label: '4', type: 'number', onClick: () => controller.handleDigit('4') },
    { label: '5', type: 'number', onClick: () => controller.handleDigit('5') },
    { label: '6', type: 'number', onClick: () => controller.handleDigit('6') },
    { label: '-', type: 'operator', onClick: () => controller.handleOperator('-') },

    // Satır 4
    { label: '1', type: 'number', onClick: () => controller.handleDigit('1') },
    { label: '2', type: 'number', onClick: () => controller.handleDigit('2') },
    { label: '3', type: 'number', onClick: () => controller.handleDigit('3') },
    { label: '+', type: 'operator', onClick: () => controller.handleOperator('+') },

    // Satır 5
    { label: '0', type: 'number', wide: true, onClick: () => controller.handleDigit('0') },
    { label: '.', type: 'number', onClick: () => controller.handleDigit('.') },
    { label: '=', type: 'operator', onClick: controller.handleEquals },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        backgroundColor: '#1C1C1E',
        padding: '10px',
        borderRadius: '0 0 16px 16px',
      }}
    >
      {buttons.map((btn, index) => (
        <CalcButton
          key={index}
          label={btn.label}
          onClick={btn.onClick}
          variant={btn.type}
          wide={btn.wide || false}
        />
      ))}
    </Box>
  );
};

export default CalcGrid;
