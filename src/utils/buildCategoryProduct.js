import { CATEGORY_CONFIG } from '@/constants/categoryConfig';
import {
  matchVariantLabel,
  resolveProductImages,
  resolveProductImageGallery,
  resolveProductPrice,
  resolveProductName,
} from '@/utils/productImages';
import { getPackOptionsForVariant } from '@/utils/packOptions';

/**
 * Build variant catalog + default product for a category page (single-page variant UX).
 */
export function buildCategoryProductState(categoryKey, apiItems = [], staticProducts = {}) {
  const config = CATEGORY_CONFIG[categoryKey];
  if (!config) return null;

  const variantCatalog = {};
  const variantLabels = [];

  for (const variantDef of config.variants) {
    const apiItem = (apiItems || []).find((item) => matchVariantLabel(item.name, variantDef));
    const staticItem = staticProducts[variantDef.staticSlug] || staticProducts[config.staticBaseSlug] || null;

    const fallbackImages = variantDef.fallbackImages?.length
      ? variantDef.fallbackImages
      : staticItem?.images || [];

    const apiImages = apiItem?.images?.length
      ? apiItem.images
      : apiItem?.image_url
        ? [apiItem.image_url]
        : [];

    const images = resolveProductImages(apiImages, fallbackImages);
    const imageGallery = resolveProductImageGallery(apiImages, fallbackImages);
    const price = resolveProductPrice(apiItem, staticItem, variantDef, config);
    const apiName = resolveProductName(apiItem, variantDef, config);
    const packOptions = getPackOptionsForVariant(variantDef, config);

    variantCatalog[variantDef.label] = {
      id: apiItem?.id ?? staticItem?.id ?? variantDef.staticSlug,
      slug: apiItem?.slug ?? variantDef.staticSlug,
      apiName,
      name: apiName,
      displayName: config.displayName || config.title,
      variantName: variantDef.label,
      description: apiItem
        ? (apiItem.description || config.description || '')
        : (staticItem?.description || config.description || ''),
      price,
      packOptions,
      original_price: apiItem?.original_price ?? null,
      sku: apiItem?.sku ?? null,
      images,
      fallbackImages,
      imageGallery,
      image_url: images[0] || null,
      is_in_stock: apiItem?.is_in_stock ?? true,
      sectionImage: staticItem?.sectionImage ?? images[0],
      postcardImage: staticItem?.postcardImage ?? images[0],
      notes: staticItem?.notes,
      accordion: staticItem?.accordion,
      sectionTitle: staticItem?.sectionTitle,
      sectionBody: staticItem?.sectionBody,
      postcardTitle: staticItem?.postcardTitle,
      postcardBody: staticItem?.postcardBody,
      postcardQuote: staticItem?.postcardQuote,
      rating: apiItem?.id
        ? (apiItem.average_rating ?? 0)
        : (staticItem?.rating ?? 0),
      reviewCount: apiItem?.id
        ? (apiItem.review_count ?? 0)
        : (staticItem?.reviewCount ?? 0),
      reviewList: apiItem?.id ? [] : (staticItem?.reviewList || []),
    };

    variantLabels.push(variantDef.label);
  }

  const defaultVariant = config.defaultVariant && variantCatalog[config.defaultVariant]
    ? config.defaultVariant
    : variantLabels[0];

  const defaultEntry = variantCatalog[defaultVariant];
  const defaultVariantDef = config.variants.find((v) => v.label === defaultVariant) || config.variants[0];
  const baseStatic = staticProducts[config.staticBaseSlug] || staticProducts[defaultVariantDef?.staticSlug] || {};

  const product = {
    id: defaultEntry?.id,
    apiName: defaultEntry?.apiName,
    name: defaultEntry?.name || config.displayName,
    displayName: config.displayName || config.title,
    category: categoryKey,
    price: defaultEntry?.price ?? config.defaultPrice ?? 0,
    description: defaultEntry?.description ?? config.description ?? '',
    images: defaultEntry?.images?.length ? defaultEntry.images : defaultVariantDef?.fallbackImages || [],
    fallbackImages: defaultEntry?.fallbackImages || defaultVariantDef?.fallbackImages || [],
    imageGallery: defaultEntry?.imageGallery,
    variants: variantLabels.length ? variantLabels : [defaultVariant],
    variantLabel: config.variantLabel || 'Flavour',
    packOptions: defaultEntry?.packOptions || getPackOptionsForVariant(defaultVariantDef, config),
    rating: defaultEntry?.rating ?? 0,
    reviewCount: defaultEntry?.reviewCount ?? 0,
    reviewList: defaultEntry?.reviewList ?? [],
    accordion: defaultEntry?.accordion ?? baseStatic.accordion,
    sectionImage: defaultEntry?.sectionImage ?? baseStatic.sectionImage,
    sectionTitle: defaultEntry?.sectionTitle ?? baseStatic.sectionTitle,
    sectionBody: defaultEntry?.sectionBody ?? baseStatic.sectionBody,
    postcardImage: defaultEntry?.postcardImage ?? baseStatic.postcardImage,
    postcardTitle: defaultEntry?.postcardTitle ?? baseStatic.postcardTitle,
    postcardBody: defaultEntry?.postcardBody ?? baseStatic.postcardBody,
    postcardQuote: defaultEntry?.postcardQuote ?? baseStatic.postcardQuote,
    notes: defaultEntry?.notes ?? baseStatic.notes,
  };

  return { product, variantCatalog, defaultVariant };
}
