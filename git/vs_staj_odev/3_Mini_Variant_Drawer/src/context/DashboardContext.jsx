/**
 * DashboardContext
 * Global state: drawer açık/kapalı, notlar
 * useContext ile tüm ağaçtan erişilir
 */
import { createContext, useContext, useState } from 'react';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notes, setNotes] = useState('');

  /** Drawer toggle fonksiyonu */
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  return (
    <DashboardContext.Provider value={{ drawerOpen, toggleDrawer, notes, setNotes }}>
      {children}
    </DashboardContext.Provider>
  );
};

/** Context consumer hook — Provider dışında kullanılırsa hata fırlatır */
export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be inside DashboardProvider');
  return ctx;
};