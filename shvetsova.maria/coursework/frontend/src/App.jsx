import {Route, Routes} from 'react-router-dom';
import {Layout} from './components/Layout/Layout';
import {HomePage} from './pages/HomePage/HomePage';
import {LoginPage} from './pages/LoginPage/LoginPage';
import {CatalogPage} from './pages/CatalogPage/CatalogPage';
import {CartPage} from './pages/CartPage/CartPage';
import {ProtectedRoute} from '@/components/ProtectedRoute/ProtectedRoute';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/catalog"
          element={
            <ProtectedRoute>
              <CatalogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}
