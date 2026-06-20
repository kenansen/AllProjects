/**
 * TopBar — Organism
 * Drawer açıkken genişliğini ayarlayan MUI AppBar.
 * Hamburger ikon → toggleDrawer (Context üzerinden).
 */
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { useDashboard } from '../../context/DashboardContext';

const DRAWER_WIDTH = 240;

const StyledAppBar = styled(AppBar, { shouldForwardProp: (p) => p !== 'open' })(
  ({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: DRAWER_WIDTH,
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
);

const TopBar = () => {
  const { drawerOpen, toggleDrawer } = useDashboard();

  return (
    <StyledAppBar position="fixed" open={drawerOpen}>
      <Toolbar>
        {/* Drawer açıkken hamburger ikonu gizlenir */}
        <IconButton
          color="inherit" edge="start" onClick={toggleDrawer}
          sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>Dashboard</Typography>
      </Toolbar>
    </StyledAppBar>
  );
};

export default TopBar;