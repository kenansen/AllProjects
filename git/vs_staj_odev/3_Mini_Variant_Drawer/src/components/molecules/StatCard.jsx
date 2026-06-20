/**
 * StatCard — Molecule
 * İstatistik başlığı + donut grafik kartı.
 * @param {string} title       metrik adı
 * @param {number} percentage  yüzde değeri
 * @param {string} color       grafik rengi
 */
import { Card, CardContent, Typography } from '@mui/material';
import PieChart from '../atoms/PieChart';

const StatCard = ({ title, percentage, color }) => (
  <Card elevation={2} sx={{ flex: 1, minWidth: 180 }}>
    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
      <Typography variant="subtitle2" fontWeight="medium" textAlign="center">
        {title}
      </Typography>
      <PieChart percentage={percentage} color={color} />
    </CardContent>
  </Card>
);

export default StatCard;