/**
 * PieChart — Atom
 * SVG tabanlı donut grafik.
 * @param {number} percentage  0-100
 * @param {string} color       dolgu rengi
 * @param {number} size        svg boyutu (px)
 * @param {number} strokeWidth halka kalınlığı
 */
import { Box, Typography } from '@mui/material';

const PieChart = ({ percentage = 0, color = '#1976d2', size = 110, strokeWidth = 13 }) => {
  const radius        = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset        = circumference - (percentage / 100) * circumference;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Arka plan halkası */}
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e0e0e0" strokeWidth={strokeWidth} />
        {/* İlerleme halkası */}
        <circle
          cx={size/2} cy={size/2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <Typography variant="caption" fontWeight="bold" sx={{ position: 'absolute' }}>
        {percentage}%
      </Typography>
    </Box>
  );
};

export default PieChart;