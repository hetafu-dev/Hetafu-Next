/** Line total for a cart row (unit price × quantity). */
import {
  getDefaultPackId,
  resolvePackPrice,
  resolveStoreProductPackOptions,
} from '@/utils/packOptions';
import { resolveStorefrontImageUrl } from '@/utils/productImages';

export function getLineTotal(item) {
  const unit = Number(item?.price) || 0;
  const qty = item?.qty ?? 1;
  return unit * qty;
}

/** MongoDB ObjectId (24 hex chars). */
export function isMongoObjectId(id) {
  return /^[a-f\d]{24}$/i.test(String(id || ''));
}

/** Map backend store cart API item → frontend cart row. */
export function mapStoreCartItem(row) {
  const variant = row.variant_label || row.pack_id || '';
  return {
    id: row.id,
    productId: row.product_id,
    name: row.product_name,
    variant,
    price: Number(row.price) || 0,
    originalPrice: null,
    qty: row.quantity,
    promo: null,
    image: resolveStorefrontImageUrl(row.product_image, '/Images/Products/Dollipops/Dollipop.png'),
    packId: row.pack_id || null,
    serverSynced: true,
  };
}

export function mapStoreCartSummary(summary) {
  return (summary?.items || []).map(mapStoreCartItem);
}

/** Map storefront API product to carousel / add-to-bag shape. */
export function mapStoreProduct(product, fallbackImage = null) {
  const basePrice = Number(product.discount_price ?? product.price ?? 0);
  const packOptions = resolveStoreProductPackOptions(product);
  const defaultPackId = getDefaultPackId(packOptions);
  const defaultPack = packOptions?.options?.find((o) => o.id === defaultPackId) || packOptions?.options?.[0] || null;
  const price = resolvePackPrice(basePrice, defaultPack);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category || product.category_name || 'Product',
    basePrice,
    packOptions,
    defaultPackId,
    price,
    originalPrice: product.original_price ?? null,
    image: resolveStorefrontImageUrl(
      product.image_url || product.images?.[0],
      fallbackImage,
    ),
    link: product.slug ? `/products/${product.slug}` : `/products/${(product.category || '').toLowerCase()}`,
    rating: Number(product.average_rating ?? product.rating ?? 0) || 0,
    reviews: Number(product.review_count ?? product.reviews ?? 0) || 0,
  };
}
