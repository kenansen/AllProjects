/**
 * App.jsx — Root
 * MUI ThemeProvider + DashboardContext + React Router
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { DashboardProvider } from './context/DashboardContext';
import MainLayout  from './components/organisms/MainLayout';
import Dashboard   from './pages/Dashboard';
import Projects    from './pages/Projects';

const theme = createTheme({
  palette: {
    primary:    { main: '#1976d2' },
    background: { default: '#f5f5f5' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/"         element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
            </Routes>
          </MainLayout>
        </Router>
      </DashboardProvider>
    </ThemeProvider>
  );
}

export default App;