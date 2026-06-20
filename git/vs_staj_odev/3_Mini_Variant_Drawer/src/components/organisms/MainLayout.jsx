/**
 * MainLayout — Organism
 * Tüm sayfa iskeletini sarar: TopBar + MiniDrawer + içerik alanı.
 * @param {ReactNode} children — sayfa içeriği
 */
import { Box } from '@mui/material';
import TopBar      from './TopBar';
import MiniDrawer  from './MiniDrawer';
import DrawerHeader from '../atoms/DrawerHeader';

const MainLayout = ({ children }) => (
  <Box sx={{ display: 'flex' }}>
    <TopBar />
    <MiniDrawer />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <DrawerHeader /> {/* AppBar yüksekliği kadar boşluk */}
      {children}
    </Box>
  </Box>
);

export default MainLayout;