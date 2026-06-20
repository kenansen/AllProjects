/**
 * Projects Page
 * MUI Tabs ile filtrelenmiş proje listesi.
 */
import { useState } from 'react';
import {
  Box, Typography, Card, CardContent,
  LinearProgress, Tabs, Tab
} from '@mui/material';

const ALL_PROJECTS = [
  { id: 1, name: 'Website Redesign',  status: 'ongoing',   progress: 60  },
  { id: 2, name: 'Mobile App',        status: 'completed', progress: 100 },
  { id: 3, name: 'API Integration',   status: 'next',      progress: 10  },
  { id: 4, name: 'Admin Dashboard',   status: 'ongoing',   progress: 45  },
  { id: 5, name: 'Database Migration',status: 'completed', progress: 100 },
  { id: 6, name: 'Auth Module',       status: 'next',      progress: 5   },
];

const TABS = [
  { label: 'All Projects',       value: 'all'       },
  { label: 'Ongoing Projects',   value: 'ongoing'   },
  { label: 'Next Projects',      value: 'next'      },
  { label: 'Completed Projects', value: 'completed' },
];

const STATUS_LABELS = {
  ongoing:   'Ongoing',
  completed: 'Completed',
  next:      'Next',
};

const Projects = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all'
    ? ALL_PROJECTS
    : ALL_PROJECTS.filter((p) => p.status === activeTab);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" fontWeight="bold">Projects</Typography>

      {/* Tab başlıkları */}
      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {TABS.map(({ label, value }) => (
          <Tab key={value} label={label} value={value} />
        ))}
      </Tabs>

      {/* Proje kartları */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        {filtered.length === 0 && (
          <Typography color="text.secondary">No projects found.</Typography>
        )}
        {filtered.map(({ id, name, status, progress }) => (
          <Card key={id} elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="medium">{name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {STATUS_LABELS[status]}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                color={
                  status === 'completed' ? 'success' :
                  status === 'ongoing'   ? 'primary' : 'warning'
                }
              />
              <Typography variant="caption" color="text.secondary">
                {progress}%
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Projects;