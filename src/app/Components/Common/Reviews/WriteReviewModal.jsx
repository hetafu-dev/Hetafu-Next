'use client';

import { useState } from 'react';
import { submitProductReview } from '@/services/reviewService';

export default function WriteReviewModal({ productId, productName, customerName, onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreeTerms) {
      setError('Please agree to the Privacy Policy and Terms and Conditions');
      return;
    }
    if (!rating) {
      setError('Please select a star rating');
      return;
    }

    setSubmitting(true);
    try {
      await submitProductReview(productId, { rating, title, body });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-xl">
          <div className="flex justify-between items-start gap-4 mb-5">
            <div>
              <h2 className="text-xl font-semibold text-primary-brown">Write a review</h2>
              {productName && (
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{productName}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-primary-brown mb-2">
                Rating *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="cursor-pointer"
                    aria-label={`${star} stars`}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill={star <= rating ? '#1998B1' : '#e8ddd0'}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="review-title" className="block text-xs font-bold tracking-widest uppercase text-primary-brown mb-2">
                Title *
              </label>
              <input
                id="review-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-secondary-blue/40"
              />
            </div>

            <div>
              <label htmlFor="review-body" className="block text-xs font-bold tracking-widest uppercase text-primary-brown mb-2">
                Your review *
              </label>
              <textarea
                id="review-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-secondary-blue/40"
              />
            </div>

            {customerName && (
              <p className="text-sm text-slate-600">
                Posting as <span className="font-semibold text-primary-brown">{customerName}</span>
              </p>
            )}

            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1"
                required
              />
              <span>I agree to the Privacy Policy and Terms and Conditions *</span>
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-primary-brown text-white text-xs font-bold tracking-widest uppercase rounded hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit review'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
