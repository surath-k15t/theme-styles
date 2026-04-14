import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/lib/ThemeContext';
import FloatingControls from '@/components/theme/FloatingControls';
import Portal from '@/pages/Portal';
import Article from '@/pages/Article';
import MaterialPaletteLab from '@/pages/MaterialPaletteLab';
import NotFound from '@/pages/NotFound';

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Portal />} />
        <Route path="/material-palette" element={<MaterialPaletteLab />} />
        <Route path="/article/:appName" element={<Article />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FloatingControls />
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
