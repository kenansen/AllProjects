/**
 * NavItem — Molecule
 * Sidebar navigasyon öğesi.
 * Drawer kapalıyken sadece ikon gösterir (mini variant davranışı).
 * @param {string}    label   görüntü metni
 * @param {ReactNode} icon    MUI ikon
 * @param {boolean}   open    drawer durumu
 * @param {boolean}   active  aktif route mi?
 * @param {function}  onClick tıklama handler
 */
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';

const NavItem = ({ label, icon, open, active = false, onClick }) => (
  <ListItem disablePadding sx={{ display: 'block' }}>
    <Tooltip title={!open ? label : ''} placement="right">
      <ListItemButton
        onClick={onClick}
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
          bgcolor: active ? 'action.selected' : 'transparent',
          borderRadius: 1,
          mx: 0.5,
          my: 0.3,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : 'auto',
            justifyContent: 'center',
            color: active ? 'primary.main' : 'text.secondary',
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={label}
          sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.2s' }}
        />
      </ListItemButton>
    </Tooltip>
  </ListItem>
);

export default NavItem;