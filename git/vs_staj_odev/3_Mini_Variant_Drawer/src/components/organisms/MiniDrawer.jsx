import { useNavigate, useLocation } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import {
  Drawer, List, Divider, IconButton,
  ListItem, ListItemButton, ListItemIcon, ListItemText,
  Collapse, Box, Button, Tooltip
} from '@mui/material';
import ChevronLeftIcon   from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon  from '@mui/icons-material/ChevronRight';
import DashboardIcon     from '@mui/icons-material/Dashboard';
import FolderIcon        from '@mui/icons-material/Folder';
import ExpandLess        from '@mui/icons-material/ExpandLess';
import ExpandMore        from '@mui/icons-material/ExpandMore';
import AddIcon           from '@mui/icons-material/Add';
import { useState }      from 'react';
import { useDashboard }  from '../../context/DashboardContext';
import DrawerHeader      from '../atoms/DrawerHeader';

const DRAWER_WIDTH = 240;

const openedMixin = (theme) => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const StyledDrawer = styled(Drawer, { shouldForwardProp: (p) => p !== 'open' })(
  ({ theme, open }) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open  && { ...openedMixin(theme),  '& .MuiDrawer-paper': openedMixin(theme)  }),
    ...(!open && { ...closedMixin(theme),  '& .MuiDrawer-paper': closedMixin(theme)  }),
  }),
);

const PROJECT_SUBS = [
  { label: 'All Projects',       path: '/projects'           },
  { label: 'Ongoing Projects',   path: '/projects/ongoing'   },
  { label: 'Next Projects',      path: '/projects/next'      },
  { label: 'Completed Projects', path: '/projects/completed' },
];

const MiniDrawer = () => {
  const theme = useTheme();
  const navigate    = useNavigate();
  const { pathname } = useLocation();
  const { drawerOpen, toggleDrawer } = useDashboard();
  const [projectsOpen, setProjectsOpen] = useState(true);

  return (
    <StyledDrawer variant="permanent" open={drawerOpen}>
      <DrawerHeader>
        <IconButton onClick={toggleDrawer}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />

      <List>
        {/* Dashboard */}
        <ListItem disablePadding sx={{ display: 'block' }}>
          <Tooltip title={!drawerOpen ? 'Dashboard' : ''} placement="right">
            <ListItemButton
              onClick={() => navigate('/')}
              sx={{
                minHeight: 48,
                justifyContent: drawerOpen ? 'initial' : 'center',
                px: 2.5,
                bgcolor: pathname === '/' ? 'action.selected' : 'transparent',
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: drawerOpen ? 3 : 'auto', justifyContent: 'center' }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" sx={{ opacity: drawerOpen ? 1 : 0 }} />
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {/* Projects ana başlık */}
        <ListItem disablePadding sx={{ display: 'block' }}>
          <Tooltip title={!drawerOpen ? 'Projects' : ''} placement="right">
            <ListItemButton
              onClick={() => { if (drawerOpen) setProjectsOpen(!projectsOpen); else navigate('/projects'); }}
              sx={{
                minHeight: 48,
                justifyContent: drawerOpen ? 'initial' : 'center',
                px: 2.5,
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: drawerOpen ? 3 : 'auto', justifyContent: 'center', color: 'white' }}>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="Projects" sx={{ opacity: drawerOpen ? 1 : 0 }} />
              {drawerOpen && (projectsOpen ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {/* Projects alt menüsü */}
        <Collapse in={drawerOpen && projectsOpen} timeout="auto" unmountOnExit>
          <List disablePadding>
            {PROJECT_SUBS.map(({ label, path }) => (
              <ListItemButton
                key={path}
                onClick={() => navigate(path)}
                sx={{ pl: 4, bgcolor: pathname === path ? 'action.selected' : 'transparent' }}
              >
                <ListItemText primary={`- ${label}`} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>

      {/* Create Project butonu — en alta */}
      <Box sx={{ mt: 'auto', p: 2, display: drawerOpen ? 'block' : 'none' }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<AddIcon />}
          onClick={() => alert('Create Project clicked!')}
        >
          Create Project
        </Button>
      </Box>
    </StyledDrawer>
  );
};

export default MiniDrawer;