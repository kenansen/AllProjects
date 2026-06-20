import { useState, useEffect } from 'react';

const useDashboardData = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats([
        { id: 1, title: 'Completed Projects', percentage: 30, color: '#1976d2' },
        { id: 2, title: 'Ongoing Projects',   percentage: 30, color: '#42a5f5' },
        { id: 3, title: 'Next Projects',      percentage: 30, color: '#90caf9' },
      ]);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return { stats, loading };
};

export default useDashboardData;