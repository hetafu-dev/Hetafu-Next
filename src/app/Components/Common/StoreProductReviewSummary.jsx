import { Star } from 'lucide-react';

function Stars({ rating, size = 14 }) {
  const value = Number(rating) || 0;
  return (
    <div className="flex items-center gap-0.5 text-secondary-blue">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.floor(value) ? 'currentColor' : i - 0.5 <= value ? 'currentColor' : 'none'}
          stroke="currentColor"
        />
      ))}
    </div>
  );
}

export default function StoreProductReviewSummary({ rating = 0, reviews = 0, size = 14 }) {
  const reviewCount = Number(reviews) || 0;
  const ratingLabel = reviewCount > 0 ? Number(rating).toFixed(1) : '0.0';

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Stars rating={parseFloat(ratingLabel)} size={size} />
      <span className="text-xs font-semibold text-primary-brown">{ratingLabel}</span>
      <span className="text-xs text-gray-500">
        {reviewCount} review{reviewCount === 1 ? '' : 's'}
      </span>
    </div>
  );
}
