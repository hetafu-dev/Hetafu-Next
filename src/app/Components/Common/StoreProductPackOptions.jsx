'use client';

import { useMemo, useState } from 'react';
import {
  getDefaultPackId,
  getPackOption,
  resolvePackPrice,
  shouldShowPackOptions,
} from '@/utils/packOptions';
import { isMongoObjectId } from '@/utils/cartUtils';

export function StoreProductPackOptions({ packOptions, selectedPackId, onSelectPack }) {
  if (!shouldShowPackOptions(packOptions)) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {packOptions.options.map((pack) => (
        <button
          key={pack.id}
          type="button"
          onClick={() => onSelectPack(pack.id)}
          className="px-2 py-1 text-[10px] font-medium border rounded transition-all cursor-pointer"
          style={{
            color: selectedPackId === pack.id ? 'var(--primary-brown)' : '#6b7280',
            borderColor: selectedPackId === pack.id ? 'var(--secondary-blue)' : '#e5e7eb',
            backgroundColor: selectedPackId === pack.id ? '#fffbeb' : 'transparent',
          }}
        >
          {pack.label}
        </button>
      ))}
    </div>
  );
}

/** Selected pack + display price + cart payload for storefront product cards. */
export function useStoreProductPack(product) {
  const [selectedPackId, setSelectedPackId] = useState(
    () => product.defaultPackId ?? getDefaultPackId(product.packOptions),
  );

  const selectedPack = useMemo(
    () => getPackOption(product.packOptions, selectedPackId),
    [product.packOptions, selectedPackId],
  );

  const displayPrice = resolvePackPrice(product.basePrice ?? product.price, selectedPack);

  const buildCartItem = () => {
    const baseCartId = product.id;
    const packSuffix = selectedPack?.id ? `-${selectedPack.id}` : '';
    return {
      id: `${baseCartId}${packSuffix}`,
      productId: isMongoObjectId(baseCartId) ? baseCartId : null,
      packId: selectedPack?.id || null,
      name: product.name,
      variant: selectedPack?.label || product.category,
      price: displayPrice,
      originalPrice: product.originalPrice ?? null,
      qty: 1,
      promo: null,
      image: product.image,
    };
  };

  return {
    selectedPackId,
    setSelectedPackId,
    selectedPack,
    displayPrice,
    buildCartItem,
  };
}
