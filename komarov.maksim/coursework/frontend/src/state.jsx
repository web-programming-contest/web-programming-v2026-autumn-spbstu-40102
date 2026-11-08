import {createContext, useContext, useEffect, useState} from 'react';
import {api, cartKey, parseCart, MAX_QUANTITY} from './shop.js';

const ShopContext = createContext(null);
export const useShop = () => useContext(ShopContext);

function readCart(user, products) {
  try {
    const parsed = parseCart(localStorage.getItem(cartKey(user)));
    return Object.fromEntries(
      Object.entries(parsed).filter(([id]) =>
        products.some((p) => p.id === Number(id)),
      ),
    );
  } catch {
    return {};
  }
}

export function ShopProvider({children}) {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [modal, setModal] = useState(null);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    Promise.all([
      api('/goods', {signal: controller.signal}),
      api('/session', {signal: controller.signal}),
    ])
      .then(([goods, session]) => {
        setProducts(goods);
        const name = session.authenticated ? session.user : null;
        setUser(name);
        setCart(name ? readCart(name, goods) : {});
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [attempt]);

  useEffect(() => {
    const listener = (event) => {
      if (user && event.key === cartKey(user)) {
        setCart(readCart(user, products));
      }
    };
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, [user, products]);

  function saveCart(next) {
    if (!user) {
      return;
    }
    try {
      if (Object.keys(next).length) {
        localStorage.setItem(cartKey(user), JSON.stringify(next));
      } else {
        localStorage.removeItem(cartKey(user));
      }
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
    setCart(next);
  }

  function setQuantity(id, quantity) {
    if (
      !user ||
      !Number.isInteger(quantity) ||
      !products.some((p) => p.id === id)
    ) {
      return;
    }
    const next = {...cart};
    if (quantity <= 0) {
      delete next[id];
    } else {
      next[id] = Math.min(quantity, MAX_QUANTITY);
    }
    saveCart(next);
  }

  async function login(username, password) {
    const session = await api('/login', {
      method: 'POST',
      body: JSON.stringify({username, password}),
    });
    setUser(session.user);
    setCart(readCart(session.user, products));
  }

  async function logout() {
    await api('/logout', {method: 'POST', body: '{}'});
    setUser(null);
    setCart({});
  }

  function removeProducts(ids) {
    saveCart(
      Object.fromEntries(
        Object.entries(cart).filter(([id]) => !ids.includes(Number(id))),
      ),
    );
  }

  function expireSession() {
    setUser(null);
    setCart({});
  }

  const count = Object.values(cart).reduce((sum, n) => sum + n, 0);
  const items = products
    .filter((p) => cart[p.id])
    .map((p) => ({...p, quantity: cart[p.id]}));
  const total = items.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        user,
        cart,
        items,
        count,
        total,
        loading,
        error,
        storageError,
        login,
        logout,
        setQuantity,
        removeProducts,
        clearCart: () => saveCart({}),
        expireSession,
        modal,
        showModal: setModal,
        closeModal: () => setModal(null),
        retry: () => setAttempt((n) => n + 1),
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
