'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/app/Components/Common/Navbar/Page';
import Footer from '@/app/Components/Common/Footer/Page';
import BestSellers from '@/app/Components/Common/BestSellers/Page';

const SMARTS_PRODUCTS = [
  {
    id: 1,
    name: 'Prime Smarts',
    slug: 'smarts-prime',
    image: '/Images/Products/Smarts/Prime.png',
    price: 55.00,
    rating: 4.9,
    reviewCount: 312,
  },
  {
    id: 2,
    name: 'Junior Smarts',
    slug: 'smarts-junior',
    image: '/Images/Products/Smarts/Prime.png',
    price: 55.00,
    rating: 4.9,
    reviewCount: 312,
  },
  {
    id: 3,
    name: 'Dia Smarts',
    slug: 'smarts-dia',
    image: '/Images/Products/Smarts/Prime.png',
    price: 55.00,
    rating: 4.9,
    reviewCount: 312,
  },
  {
    id: 4,
    name: 'Pink Smarts',
    slug: 'smarts-pink',
    image: '/Images/Products/Smarts/Prime.png',
    price: 55.00,
    rating: 4.9,
    reviewCount: 312,
  },
];

function StarRow({ rating, size = 14 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= rating ? '#1998B1' : '#e8ddd0'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </span>
  );
}

export default function SmartsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative w-full" style={{ backgroundColor: '#fdf8f4' }}>
          <div className="py-12 md:py-20">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <div className="flex-shrink-0 px-4 md:px-10 lg:w-1/3">
                <h1 className="text-4xl md:text-5xl font-bold text-primary-brown mb-4 leading-tight">Denta Smarts</h1>
                <p className="text-base text-[#554433] leading-relaxed">
                  Introducing Denta Smarts - our intelligent enamel protection serum that uses advanced nanotechnology to repair and strengthen weakened tooth enamel. Formulated with dentists and backed by clinical studies, this powerful daily treatment reverses early signs of decay.
                </p>
              </div>
              <div className="w-full lg:w-2/3">
                <Image
                  src="/Images/Products/Smarts/Smartspagetop.png"
                  alt="Smarts Hero"
                  width={600}
                  height={400}
                  unoptimized
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid Section */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-12 md:py-20">
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4 mb-10">
            <h2 className="text-3xl md:text-4xl font-light text-primary-brown">Our Products</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#887766] tracking-widest uppercase">Sort by:</span>
              <select className="appearance-none bg-white border border-[#d4c5b2] rounded px-3.5 py-2 text-xs tracking-widest uppercase text-[#401E17] cursor-pointer">
                <option>Featured</option>
              </select>
              <span className="text-sm text-[#887766] tracking-widest uppercase">4 Products</span>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {SMARTS_PRODUCTS.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <div className="flex flex-col h-full cursor-pointer group">
                  <div className="relative overflow-hidden bg-gray-100 mb-4 flex-grow">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={500}
                      unoptimized
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-primary-brown mb-2 group-hover:text-secondary-blue transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <StarRow rating={Math.round(product.rating)} size={14} />
                    <span className="text-xs text-[#887766]">{product.reviewCount} reviews</span>
                  </div>
                  <p className="text-lg font-bold text-primary-brown">
                    £{product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <BestSellers />
      <Footer />
    </div>
  );
}
