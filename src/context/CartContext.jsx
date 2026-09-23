import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('hh-cart') || '[]'
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      'hh-cart',
      JSON.stringify(items)
    );
  }, [items]);

  const add = (product) => {
    const stock = Number(product.stock ?? 0);

    if (stock <= 0) {
      return;
    }

    setItems((currentItems) => {
      const existingItem =
        currentItems.find(
          (item) => item.id === product.id
        );

      if (existingItem) {
        if (existingItem.qty >= stock) {
          return currentItems;
        }

        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                stock,
                qty: Math.min(
                  item.qty + 1,
                  stock
                ),
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          stock,
          qty: 1,
        },
      ];
    });
  };

  const remove = (id) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== id
      )
    );
  };

  const setQty = (id, quantity) => {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const stock = Number(
          item.stock ?? 0
        );

        const newQuantity = Math.max(
          1,
          Math.min(
            Number(quantity) || 1,
            stock
          )
        );

        return {
          ...item,
          qty: newQuantity,
        };
      })
    );
  };

  const clear = () => {
    setItems([]);
  };

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          Number(item.qty),
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

export const useCart = () =>
  useContext(CartContext);