import { apiClient } from './apiClient';

export async function fetchStoreCart() {
  return apiClient.get('/ecommerce/store/cart');
}

export async function addToStoreCart(payload) {
  return apiClient.post('/ecommerce/store/cart/items', payload);
}

export async function updateStoreCartItem(cartItemId, quantity) {
  return apiClient.put(`/ecommerce/store/cart/items/${cartItemId}`, { quantity });
}

export async function removeStoreCartItem(cartItemId) {
  return apiClient.delete(`/ecommerce/store/cart/items/${cartItemId}`);
}

export async function clearStoreCart() {
  return apiClient.delete('/ecommerce/store/cart');
}
