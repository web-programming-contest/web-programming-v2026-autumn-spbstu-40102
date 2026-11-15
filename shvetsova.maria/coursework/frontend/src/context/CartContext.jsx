import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useAuth} from './AuthContext';

const CartContext = createContext(null);

const storageKey = (login) => `gadget-hub:cart:${login}`;

function readCart(login) {
  if (!login) {
    return [];
  }
  try {
    return JSON.parse(localStorage.getItem(storageKey(login))) ?? [];
  } catch {
    return [];
  }
}

export function CartProvider({children}) {
  const {user} = useAuth();
  const login = user?.login;

  const [cart, setCart] = useState(() => ({
    owner: login,
    items: readCart(login),
  }));

  if (cart.owner !== login) {
    setCart({owner: login, items: readCart(login)});
  }

  const items = cart.owner === login ? cart.items : [];

  useEffect(() => {
    if (!cart.owner) {
      return;
    }
    localStorage.setItem(storageKey(cart.owner), JSON.stringify(cart.items));
  }, [cart]);

  const updateItems = useCallback((updater) => {
    setCart((current) => ({...current, items: updater(current.items)}));
  }, []);

  const add = useCallback(
    (product) => {
      updateItems((current) => {
        const existing = current.find((item) => item.id === product.id);
        if (existing) {
          return current.map((item) =>
            item.id === product.id
              ? {...item, quantity: item.quantity + 1}
              : item,
          );
        }
        const {id, name, price, image} = product;
        return [...current, {id, name, price, image, quantity: 1}];
      });
    },
    [updateItems],
  );

  const decrement = useCallback(
    (id) => {
      updateItems((current) =>
        current
          .map((item) =>
            item.id === id ? {...item, quantity: item.quantity - 1} : item,
          )
          .filter((item) => item.quantity > 0),
      );
    },
    [updateItems],
  );

  const remove = useCallback(
    (ids) => {
      updateItems((current) =>
        current.filter((item) => !ids.includes(item.id)),
      );
    },
    [updateItems],
  );

  const clear = useCallback(() => updateItems(() => []), [updateItems]);

  const value = useMemo(
    () => ({
      items,
      totalCount: items.reduce((sum, item) => sum + item.quantity, 0),
      getQuantity: (id) => items.find((item) => item.id === id)?.quantity ?? 0,
      add,
      decrement,
      remove,
      clear,
    }),
    [items, add, decrement, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart нужно использовать внутри CartProvider');
  }
  return context;
}
