import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom"
import Header from "./shared/header/Header.tsx"
import Footer from "./shared/footer/Footer.tsx"
import HomePage from "./pages/home/HomePage.tsx"
import LoginPage from "./pages/login/LoginPage.tsx"
import CatalogPage from "./pages/ catalog/CatalogPage.tsx"
import CartPage from "./pages/cart/CartPage.tsx"
import {AuthProvider} from "./shared/contexts/AuthContext.tsx";
import {CartProvider} from "./shared/contexts/CartContext.tsx";

function App() {
  return (
      <AuthProvider>
          <CartProvider>
              <BrowserRouter>
                  <Header/>
                  <Routes>
                      <Route path="/" element={<HomePage />}></Route>
                      <Route path="/login" element={<LoginPage />}></Route>
                      <Route path="/catalog" element={<CatalogPage />}></Route>
                      <Route path="/cart" element={<CartPage />}></Route>
                      <Route path="*" element={<Navigate to="/"/>}></Route>
                  </Routes>
                  <Footer/>
              </BrowserRouter>
          </CartProvider>
      </AuthProvider>
  )
}

export default App
