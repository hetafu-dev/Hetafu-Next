'use client';

import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

// Start with empty cart - no static items
const INITIAL_ITEMS = [];

export function CartProvider({ children }) {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id, delta) =>
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.qty !== null ? { ...i, qty: Math.max(1, i.qty + delta) } : i
      )
    );

  const addItem = (item) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev.map((i) => i.id === item.id && i.qty !== null ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    setDrawerOpen(true);
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * (i.qty ?? 1), 0);
  const itemCount = items.reduce((sum, i) => sum + (i.qty ?? 1), 0);

  return (
    <CartContext.Provider value={{ items, removeItem, updateQty, addItem, subtotal, itemCount, drawerOpen, setDrawerOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);