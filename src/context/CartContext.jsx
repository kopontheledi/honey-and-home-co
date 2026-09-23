import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() =>
    JSON.parse(localStorage.getItem('hh-cart') || '[]')
  );

  useEffect(() => {
    localStorage.setItem('hh-cart', JSON.stringify(items));
  }, [items]);

  const add = (product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...currentItems, { ...product, qty: 1 }];
    });
  };

  const remove = (id) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  const setQty = (id, qty) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, qty) }
          : item
      )
    );
  };

  const clear = () => {
    setItems([]);
  };

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        add,
        remove,
        setQty,
        clear,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);