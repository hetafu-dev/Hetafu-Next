'use client';

import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

const INITIAL_ITEMS = [
  {
    id: 1,
    name: '🎁 Shower Gel Fragrance Original -30ml',
    variant: '30ml Size',
    price: 0,
    originalPrice: 9.5,
    qty: null,
    promo: 'Spend 55 GBP get Body mist and Shower gel 30ml',
    image: 'https://uk.moroccanoil.com/cdn/shop/files/D2314A-MO.Com_Category_Shopify-Launch_Desktop_Oil.jpg?v=1695212663&width=200',
  },
  {
    id: 2,
    name: '🎁 Hair & Body Fragrance Mist - 30ml',
    variant: 'Travel - 30 Ml Size',
    price: 0,
    originalPrice: 13.5,
    qty: null,
    promo: 'Spend 55 GBP get Body mist and Shower gel 30ml',
    image: 'https://uk.moroccanoil.com/cdn/shop/files/os1.webp?v=1684219765&width=200',
  },
  {
    id: 3,
    name: "🎁 L'Originale Eau de Parfum - sample 1.5ml",
    variant: '1.5ml Size',
    price: 0,
    originalPrice: null,
    qty: null,
    promo: null,
    image: 'https://uk.moroccanoil.com/cdn/shop/files/os7.webp?v=1684219925&width=200',
  },
  {
    id: 4,
    name: "L'Originale Eau de Parfum",
    variant: '100ml',
    price: 404,
    originalPrice: null,
    qty: 4,
    pricePerUnit: '£101.00/100ml',
    promo: null,
    image: 'https://uk.moroccanoil.com/cdn/shop/files/D2314A-MO.Com_Category_Shopify-Launch_Desktop_Oil.jpg?v=1695212663&width=200',
  },
  {
    id: 5,
    name: 'Moroccanoil Treatment - Be An Original',
    variant: '125ML',
    price: 38.5,
    originalPrice: null,
    qty: 1,
    pricePerUnit: '£30.80/100ml',
    promo: null,
    image: 'https://uk.moroccanoil.com/cdn/shop/files/os1.webp?v=1684219765&width=200',
  },
];

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
