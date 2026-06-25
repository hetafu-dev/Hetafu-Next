import { apiClient } from './apiClient';

export async function fetchMyOrders(page = 1, pageSize = 10) {
  return apiClient.get(`/customer/orders?page=${page}&page_size=${pageSize}`);
}
export async function fetchCheckoutQuote({ items, paymentMethod }) {
  return apiClient.requestWithoutAuth('/ecommerce/store/checkout/quote', {
    method: 'POST',
    body: JSON.stringify({
      items,
      payment_method: paymentMethod,
    }),
  });
}

/**
 * Place a storefront order (COD or initiate online payment).
 */
export async function placeEcommerceOrder(orderPayload) {
  return apiClient.requestWithoutAuth('/ecommerce/order', {
    method: 'POST',
    body: JSON.stringify(orderPayload),
  });
}

/**
 * Verify Razorpay payment and create the order on the backend.
 */
export async function verifyEcommercePayment({ orderData, razorpayPaymentId, razorpayOrderId, razorpaySignature }) {
  return apiClient.requestWithoutAuth('/ecommerce/verify-payment', {
    method: 'POST',
    body: JSON.stringify({
      order_data: orderData,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_order_id: razorpayOrderId,
      razorpay_signature: razorpaySignature,
    }),
  });
}
