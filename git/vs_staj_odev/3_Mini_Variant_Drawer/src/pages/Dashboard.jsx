import { Box, Typography, CircularProgress } from '@mui/material';
import { useDashboard }    from '../context/DashboardContext';
import useDashboardData    from '../hooks/useDashboardData';
import StatCard   from '../components/molecules/StatCard';
import NotesCard  from '../components/molecules/NotesCard';

const LOREM = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

const Dashboard = () => {
  const { notes, setNotes } = useDashboard();
  const { stats, loading }  = useDashboardData();

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" fontWeight="bold">Dashboard</Typography>

      {/* Üst satır: Completed + Ongoing */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {stats.slice(0, 2).map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </Box>

      {/* Alt satır: Lorem Ipsum + Next Projects */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 2 }}>
          <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
            {LOREM}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <StatCard {...stats[2]} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;