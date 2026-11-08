import {useEffect} from 'react';
import {Navigate, Route, Routes, useLocation} from 'react-router-dom';
import {LoaderCircle} from 'lucide-react';
import {ShopProvider, useShop} from './state.jsx';
import {Header, Footer, ModalHost} from './components.jsx';
import {
  HomePage,
  LoginPage,
  CatalogPage,
  CartPage,
  NotFoundPage,
} from './pages.jsx';

function Protected({children}) {
  const {user} = useShop();
  return user ? children : <Navigate to="/login" replace />;
}

function Shell() {
  const {loading, error, retry, storageError, closeModal} = useShop();
  const {pathname} = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    closeModal();
  }, [pathname]);
  return (
    <>
      <a className="skip-link" href="#content">
        К содержимому
      </a>
      <Header />
      <div id="content" className="page-content">
        {storageError && (
          <p className="storage-warning" role="alert">
            Браузер не разрешил сохранить корзину. При обновлении страницы
            изменения могут потеряться.
          </p>
        )}
        {loading ? (
          <main className="app-loading" role="status">
            <LoaderCircle size={30} className="spin" />
            <p>Загружаем Gadget Hub…</p>
          </main>
        ) : error ? (
          <main className="app-loading">
            <h1>Магазин временно недоступен</h1>
            <p role="alert">{error}</p>
            <button className="button button-blue" onClick={retry}>
              Попробовать ещё раз
            </button>
          </main>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/catalog"
              element={
                <Protected>
                  <CatalogPage />
                </Protected>
              }
            />
            <Route
              path="/cart"
              element={
                <Protected>
                  <CartPage />
                </Protected>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        )}
      </div>
      <Footer />
      <ModalHost />
    </>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <Shell />
    </ShopProvider>
  );
}
