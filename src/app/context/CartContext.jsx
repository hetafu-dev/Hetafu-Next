'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStoredUser } from '@/utils/authStorage';
import { isMongoObjectId, mapStoreCartSummary } from '@/utils/cartUtils';
import {
  fetchStoreCart,
  addToStoreCart,
  updateStoreCartItem,
  removeStoreCartItem,
  clearStoreCart,
} from '@/services/cartService';

const CartContext = createContext(null);

const GUEST_CART_KEY = 'hetafu_guest_cart';

function loadGuestCart() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGuestCart(items) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

function buildLocalLineId(item) {
  const productId = item.productId || item.id;
  const pack = item.packId ? `-${item.packId}` : '';
  return `${productId}${pack}`;
}

function normalizeLocalItem(item) {
  const productId = item.productId || (isMongoObjectId(item.id) ? item.id : null);
  return {
    ...item,
    id: item.id || buildLocalLineId(item),
    productId,
    qty: item.qty ?? 1,
    serverSynced: false,
  };
}

function mergeLocalLines(prev, incoming) {
  const normalized = normalizeLocalItem(incoming);
  const lineKey = normalized.id;
  const exists = prev.find((i) => i.id === lineKey);
  if (exists) {
    return prev.map((i) =>
      i.id === lineKey && i.qty !== null
        ? { ...i, qty: i.qty + (normalized.qty || 1) }
        : i,
    );
  }
  return [...prev, { ...normalized, id: lineKey }];
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartReady, setCartReady] = useState(false);

  const isLoggedIn = () => Boolean(getStoredUser());

  const applyServerCart = useCallback((summary) => {
    setItems(mapStoreCartSummary(summary));
  }, []);

  const syncFromServer = useCallback(async () => {
    if (!isLoggedIn()) {
      setItems(loadGuestCart());
      return;
    }
    try {
      const summary = await fetchStoreCart();
      applyServerCart(summary);
      saveGuestCart([]);
    } catch {
      setItems(loadGuestCart());
    }
  }, [applyServerCart]);

  const mergeGuestCartToServer = useCallback(async () => {
    const guestItems = loadGuestCart();
    if (!guestItems.length) return;

    for (const item of guestItems) {
      const productId = item.productId || item.id;
      if (!isMongoObjectId(productId)) continue;
      try {
        await addToStoreCart({
          product_id: productId,
          quantity: item.qty ?? 1,
          variant_label: item.variant || null,
          pack_id: item.packId || null,
          unit_price: item.price,
        });
      } catch (err) {
        console.warn('Guest cart merge failed for item:', productId, err?.message);
      }
    }
    saveGuestCart([]);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (isLoggedIn()) {
        await mergeGuestCartToServer();
        if (!cancelled) await syncFromServer();
      } else {
        if (!cancelled) setItems(loadGuestCart());
      }
      if (!cancelled) setCartReady(true);
    }

    init();

    const onAuthChange = () => {
      if (isLoggedIn()) {
        mergeGuestCartToServer().then(() => syncFromServer());
      } else {
        setItems(loadGuestCart());
      }
    };

    window?.addEventListener('auth:login', onAuthChange);
    window?.addEventListener('auth:logout', onAuthChange);

    return () => {
      cancelled = true;
      window?.removeEventListener('auth:login', onAuthChange);
      window?.removeEventListener('auth:logout', onAuthChange);
    };
  }, [mergeGuestCartToServer, syncFromServer]);

  useEffect(() => {
    if (!cartReady || isLoggedIn()) return;
    saveGuestCart(items);
  }, [items, cartReady]);

  const removeItem = async (id) => {
    const item = items.find((i) => i.id === id);
    if (isLoggedIn() && item?.serverSynced) {
      try {
        const summary = await removeStoreCartItem(id);
        applyServerCart(summary);
        return;
      } catch (err) {
        console.warn('Remove from server cart failed:', err?.message);
      }
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty = async (id, delta) => {
    const item = items.find((i) => i.id === id);
    if (!item || item.qty === null) return;
    const newQty = Math.max(1, item.qty + delta);

    if (isLoggedIn() && item.serverSynced) {
      try {
        const summary = await updateStoreCartItem(id, newQty);
        applyServerCart(summary);
        return;
      } catch (err) {
        console.warn('Update server cart qty failed:', err?.message);
      }
    }

    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: newQty } : i)),
    );
  };

  const pushItem = async (item, openDrawer) => {
    const normalized = normalizeLocalItem(item);
    const productId = normalized.productId;

    if (isLoggedIn() && isMongoObjectId(productId)) {
      try {
        const summary = await addToStoreCart({
          product_id: productId,
          quantity: normalized.qty ?? 1,
          variant_label: normalized.variant || null,
          pack_id: normalized.packId || null,
          unit_price: normalized.price,
        });
        applyServerCart(summary);
        if (openDrawer) setDrawerOpen(true);
        return;
      } catch (err) {
        console.warn('Add to server cart failed, using local cart:', err?.message);
      }
    }

    setItems((prev) => mergeLocalLines(prev, normalized));
    if (openDrawer) setDrawerOpen(true);
  };

  const addItem = (item) => pushItem(item, true);
  const addItemNoDrawer = (item) => pushItem(item, false);

  const clearCart = async () => {
    if (isLoggedIn()) {
      try {
        const summary = await clearStoreCart();
        applyServerCart(summary);
        return;
      } catch (err) {
        console.warn('Clear server cart failed:', err?.message);
      }
    }
    setItems([]);
    saveGuestCart([]);
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * (i.qty ?? 1), 0);
  const itemCount = items.reduce((sum, i) => sum + (i.qty ?? 1), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        removeItem,
        updateQty,
        addItem,
        addItemNoDrawer,
        clearCart,
        subtotal,
        itemCount,
        drawerOpen,
        setDrawerOpen,
        cartReady,
        syncFromServer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
