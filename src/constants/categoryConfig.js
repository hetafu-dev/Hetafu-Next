export const STORE_CATEGORIES = ['POPS', 'CUTE', 'BITS', 'SMARTS'];

export const CATEGORY_SLUGS = STORE_CATEGORIES.map((key) => key.toLowerCase());

export const CATEGORY_CONFIG = {
  POPS: {
    title: 'DolliPops',
    displayName: 'Dollipops',
    defaultPrice: 29.0,
    description:
      "Experience our iconic signature scent. L'Originale Eau de Parfum offers a complex, long lasting scent experience, while Hair & Body Fragrance Mist is ideal for a lightweight refresh or retouching throughout the day.",
    heroImage: '/Images/Products/Dollipops/Dollipoppagetop.png',
    variantLabel: 'Flavour',
    defaultVariant: 'Green Apple',
    staticBaseSlug: 'pops-green-apple',
    packOptions: {
      defaultPackId: 'pack-30',
      options: [
        { id: 'pack-30', label: 'Pack of 30', priceMultiplier: 30 },
        { id: 'pack-60', label: 'Pack of 60', priceMultiplier: 60 },
      ],
    },
    variants: [
      {
        label: 'Green Apple',
        staticSlug: 'pops-green-apple',
        defaultPrice: 29.0,
        keywords: ['green apple', 'green-apple', 'doillipop green', 'doillipop'],
        fallbackImages: [
          '/Images/Products/Dollipops/Dollipop.png',
          '/Images/Products/Dollipops/Dollipop1.png',
          '/Images/Products/Dollipops/Dollipop2.png',
          '/Images/Products/Dollipops/Dollipop3.png',
          '/Images/Products/Dollipops/Dollipop4.png',
        ],
      },
      {
        label: 'Mixed Berry',
        staticSlug: 'pops-mixed-berry',
        defaultPrice: 29.0,
        keywords: ['mixed berry', 'mixed-berry', 'dollipop mixed'],
        fallbackImages: [
          '/Images/Products/Dollipops/Mixedberry.png',
          '/Images/Products/Dollipops/Mixedberry1.png',
          '/Images/Products/Dollipops/Mixedberry2.png',
          '/Images/Products/Dollipops/Mixedberry3.png',
          '/Images/Products/Dollipops/Mixedberry4.png',
        ],
      },
    ],
  },
  CUTE: {
    title: 'Cute Mouthwash',
    displayName: 'Cute Mouthwash',
    description:
      'Introducing Cute - our gentle, alcohol-free formula that leaves your breath fresh and your mouth feeling clean all day long. Infused with natural mint and xylitol, this kid-friendly formula is perfect for the whole family.',
    heroImage: '/Images/Products/CUTE/Cutepagetop.png',
    variantLabel: 'Variant',
    defaultVariant: 'Powder',
    staticBaseSlug: 'cute-powder',
    defaultPrice: 249.0,
    variants: [
      {
        label: 'Powder',
        staticSlug: 'cute-powder',
        defaultPrice: 249.0,
        keywords: ['powder'],
        packOptions: {
          defaultPackId: '180g',
          options: [
            { id: '180g', label: '180g', priceMultiplier: 1 },
            { id: '250g', label: '250g', priceMultiplier: 1.35 },
          ],
        },
        fallbackImages: [
          '/Images/Products/CUTE/cutepowder.png',
          '/Images/Products/CUTE/cutepowder1.png',
          '/Images/Products/CUTE/cutepowder2.png',
          '/Images/Products/CUTE/cutepowder3.png',
          '/Images/Products/CUTE/cutepowder4.png',
        ],
      },
      {
        label: 'Tablets',
        staticSlug: 'cute-tablets',
        defaultPrice: 199.0,
        keywords: ['tablets', 'tablet'],
        packOptions: {
          defaultPackId: 'pack-1',
          options: [
            { id: 'pack-1', label: 'Pack of 1', priceMultiplier: 1 },
            { id: 'pack-2', label: 'Pack of 2', priceMultiplier: 2, priceAdjustment: -50 },
          ],
        },
        fallbackImages: [
          '/Images/Products/CUTE/cutetablets.png',
          '/Images/Products/CUTE/cutetablets1.png',
          '/Images/Products/CUTE/cutetablets2.png',
          '/Images/Products/CUTE/cutetablets3.png',
          '/Images/Products/CUTE/cutetablets4.png',
        ],
      },
    ],
  },
  BITS: {
    title: 'Denta Bits',
    displayName: 'Dentabits',
    description:
      'Introducing Dentabits - our revolutionary whitening bits that transform your oral care routine. These eco-friendly, dissolvable bits pack a powerful punch of natural enamel-safe ingredients that remove surface stains while freshening breath.',
    heroImage: '/Images/Products/Bits/Dentabitspagetop.png',
    variantLabel: 'Flavour',
    defaultVariant: 'Mint',
    staticBaseSlug: 'bits-dentabits',
    defaultPrice: 299.0,
    packOptions: {
      defaultPackId: 'pack-1',
      alwaysShow: true,
      options: [{ id: 'pack-1', label: 'Pack of 1', priceMultiplier: 1 }],
    },
    variants: [
      {
        label: 'Mint',
        staticSlug: 'bits-dentabits',
        keywords: ['dentabits', 'mint', 'bits'],
        fallbackImages: [
          '/Images/Products/Bits/Dentabits.png',
          '/Images/Products/Bits/Dentabits1.png',
          '/Images/Products/Bits/Dentabits2.png',
          '/Images/Products/Bits/Dentabits3.png',
          '/Images/Products/Bits/Dentabits4.png',
        ],
      },
    ],
  },
  SMARTS: {
    title: 'Denta Smarts',
    displayName: 'Denta Smarts',
    description:
      'Introducing Denta Smarts - our intelligent enamel protection serum that uses advanced nanotechnology to repair and strengthen weakened tooth enamel. Formulated with dentists and backed by clinical studies, this powerful daily treatment reverses early signs of decay.',
    heroImage: '/Images/Products/Smarts/Smartspagetop.png',
    variantLabel: 'Formula',
    defaultVariant: 'Junior Smarts',
    staticBaseSlug: 'smarts-prime',
    defaultPrice: 299.0,
    packOptions: {
      defaultPackId: 'pack-1',
      options: [
        { id: 'pack-1', label: 'Pack of 1', priceMultiplier: 1 },
        { id: 'pack-3', label: 'Pack of 3', priceMultiplier: 3, priceAdjustment: -50 },
      ],
    },
    variants: [
      {
        label: 'Junior Smarts',
        staticSlug: 'smarts-junior',
        keywords: ['junior'],
        disclaimer: 'junior smarts only for the kids',
        fallbackImages: ['/Images/Products/Smarts/junior.png',
          '/Images/Products/Smarts/junior1.png',
          '/Images/Products/Smarts/junior2.png',
          '/Images/Products/Smarts/junior3.png',
          '/Images/Products/Smarts/junior4.png',
        ],
      },
      {
        label: 'Prime Smarts',
        staticSlug: 'smarts-prime',
        keywords: ['prime'],
        disclaimer: 'prime smarts for adult',
        fallbackImages: ['/Images/Products/Smarts/prime.png',
          '/Images/Products/Smarts/prime1.png',
          '/Images/Products/Smarts/prime2.png',
          '/Images/Products/Smarts/prime3.png',
          '/Images/Products/Smarts/prime4.png',
        ],
      },
      {
        label: 'Dia Smarts',
        staticSlug: 'smarts-dia',
        keywords: ['dia'],
        disclaimer: 'dia smarts for diabetics',
        fallbackImages: ['/Images/Products/Smarts/dia.png',
          '/Images/Products/Smarts/dia1.png',
          '/Images/Products/Smarts/dia2.png',
          '/Images/Products/Smarts/dia3.png',
          '/Images/Products/Smarts/dia4.png',
        ],
      },
      {
        label: 'Pink Smarts',
        staticSlug: 'smarts-pink',
        keywords: ['pink'],
        disclaimer: 'pink smarts for women',
        fallbackImages: ['/Images/Products/Smarts/pink.png',
          '/Images/Products/Smarts/pink1.png',
          '/Images/Products/Smarts/pink2.png',
          '/Images/Products/Smarts/pink3.png',
          '/Images/Products/Smarts/pink4.png',
        ],
      },
    ],
  },
};

export function slugToCategoryKey(slug) {
  const key = (slug || '').trim().toUpperCase();
  return STORE_CATEGORIES.includes(key) ? key : null;
}