import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/lib/ThemeContext';
import FloatingControls from '@/components/theme/FloatingControls';
import Portal from '@/pages/Portal';
import Article from '@/pages/Article';
import MaterialPaletteLab from '@/pages/MaterialPaletteLab';
import NotFound from '@/pages/NotFound';

const AppRoutes = () => {
  const location = useLocation();
  const showFloatingControls = location.pathname !== '/material-palette';

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Portal />} />
        <Route path="/material-palette" element={<MaterialPaletteLab />} />
        <Route path="/article/:appName" element={<Article />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showFloatingControls ? <FloatingControls /> : null}
    </ThemeProvider>
  );
};

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
