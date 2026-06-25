/**
 * Load Razorpay checkout script once.
 */
export function loadRazorpayScript() {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Open Razorpay hosted checkout for card / UPI / netbanking.
 * When orderId is provided, Razorpay loads the charge amount from the order — do not pass amount.
 */
export async function openRazorpayCheckout({
  key,
  orderId,
  name,
  email,
  phone,
  description = 'Hetafu order payment',
}) {
  if (!orderId) {
    throw new Error('Payment could not be started. Missing order reference.');
  }

  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error('Unable to load payment gateway. Please try again.');
  }

  return new Promise((resolve, reject) => {
    const options = {
      key,
      currency: 'INR',
      name: 'Hetafu',
      description,
      order_id: orderId,
      prefill: {
        name: name || '',
        email: email || '',
        contact: phone || '',
      },
      theme: {
        color: '#5a3e36',
      },
      handler: (response) => {
        resolve({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: () => {
          reject(new Error('Payment cancelled'));
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      const message = response?.error?.description || 'Payment failed. Please try again.';
      reject(new Error(message));
    });
    rzp.open();
  });
}
