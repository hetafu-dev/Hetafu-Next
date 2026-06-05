'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useCountry } from '@/app/context/CountryContext';
import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";

const productData = {
  id: 1,
  name: 'Dollipops',
  category: 'POPS',
  price: 75.00,
  originalPrice: 75.00,
  rating: 4.7,
  reviews: 347,
  volume: '100ml',
  description: 'Our professional-grade teeth whitening strips deliver professional-level results from the comfort of home. These advanced strips use a safe, enamel-friendly formula that effectively removes stains from coffee, wine, and tobacco, revealing a brighter, whiter smile in just 2 weeks. Easy to apply and gentle on sensitive teeth.',
  sizes: [
    { size: '28 Strips (14 day supply)', price: 75.00 },
    { size: '56 Strips (28 day supply)', price: 130.00 },
    { size: '14 Strips (7 day trial)', price: 35.00 },
  ],
  rewardPoints: 75,
  images: [
    '/Images/Products/Dollipops/Dollipop.png',
    '/Images/Products/Dollipops/Dollipop1.png',
    '/Images/Products/Dollipops/Dollipop2.png',
    '/Images/Products/Dollipops/Dollipop3.png', 
  ],
  thumbnails: [
    '/Images/Products/Dollipops/Dollipop.png',
    '/Images/Products/Dollipops/Dollipop1.png',
    '/Images/Products/Dollipops/Dollipop2.png',
    '/Images/Products/Dollipops/Dollipop3.png',
  ],
  fragranceSample: true,
  sampleDescription: 'A free matching sample is included with every 60ml or 100ml perfume purchase.',
};

const allReviews = [
  { id: 1, name: 'Dorothy M.', initials: 'DM', avatarColor: '#d4b896', rating: 5, date: '06/11/24', title: 'LOVE IT', body: "These whitening strips are amazing! I noticed a difference after just a few uses. My teeth are noticeably whiter and the application process is so easy. The strips stay in place and don't cause any sensitivity.", helpful: 0, notHelpful: 0, verified: true },
  { id: 2, name: 'Sally T.', initials: 'ST', avatarColor: '#b8c9a3', rating: 4, date: '06/01/24', title: 'HAPPY', body: 'Ordered these whitening strips for my daughter, she loves them! We were both impressed with the results after 2 weeks of use. The packaging is beautiful and the product is high quality.', helpful: 0, notHelpful: 0, verified: true },
  { id: 3, name: 'Laura W.', initials: 'LW', avatarColor: '#c9b0b0', rating: 5, date: '03/29/24', title: 'LOVE THE RESULTS', body: "I've tried many whitening products and these are by far the best. They work gently without causing any sensitivity, and my teeth are several shades whiter. Will definitely repurchase!", helpful: 0, notHelpful: 0, verified: true },
  { id: 4, name: 'Ashleigh C.', initials: 'AC', avatarColor: '#a8bfd4', rating: 5, date: '03/23/24', title: 'THE BEST', body: 'My favorite whitening product of all time 💕 absolutely love the results I always get compliments on how white my smile is. Worth every penny!', helpful: 0, notHelpful: 0, verified: true },
  { id: 5, name: 'Dominique L.', initials: 'DL', avatarColor: '#d4c4a8', rating: 4, date: '03/13/24', title: 'GREAT PRODUCT', body: "I love that these strips are easy to use and actually deliver on their promises. My teeth are noticeably whiter and I've recommended them to all my friends.", helpful: 0, notHelpful: 0, verified: true },
  { id: 6, name: 'Emma R.', initials: 'ER', avatarColor: '#c4b0d4', rating: 5, date: '02/28/24', title: 'ABSOLUTELY STUNNING', body: 'This perfume is a masterpiece. The scent evolves beautifully throughout the day and I always receive compliments when wearing it. Worth every penny!', helpful: 3, notHelpful: 0, verified: true },
  { id: 7, name: 'Priya K.', initials: 'PK', avatarColor: '#b0d4c4', rating: 5, date: '02/15/24', title: 'MY SIGNATURE SCENT', body: "I've been searching for a signature scent for years and this is finally it. Sweet but not overpowering, sophisticated but playful. I'm on my third bottle.", helpful: 5, notHelpful: 0, verified: true },
  { id: 8, name: 'Charlotte B.', initials: 'CB', avatarColor: '#d4a8a8', rating: 3, date: '01/30/24', title: 'NICE BUT SHORT LASTING', body: 'The scent itself is gorgeous and exactly what I expected. However I find it fades quite quickly — maybe 3-4 hours at most. Would love a longer-lasting version.', helpful: 2, notHelpful: 1, verified: true },
  { id: 9, name: 'Isabelle M.', initials: 'IM', avatarColor: '#a8c4b0', rating: 5, date: '01/18/24', title: 'GIFT WORTHY', body: 'Bought this as a gift for my best friend and she absolutely loves it. The packaging is gorgeous and the scent is divine. Already planning to order one for myself!', helpful: 4, notHelpful: 0, verified: true },
  { id: 10, name: 'Natalie F.', initials: 'NF', avatarColor: '#c4d4a8', rating: 4, date: '01/05/24', title: 'LOVELY EVERYDAY SCENT', body: 'Light, fresh, and incredibly wearable. This has become my go-to for everyday wear. It layers beautifully with the matching body lotion too.', helpful: 1, notHelpful: 0, verified: true },
];

const REVIEWS_PER_PAGE = 5;

const ratingBreakdown = [
  { stars: 5, percent: 78 },
  { stars: 4, percent: 14 },
  { stars: 3, percent: 5 },
  { stars: 2, percent: 2 },
  { stars: 1, percent: 1 },
];

function DecadeSection() {
  const fragranceNotes = [
    { label: 'top', description: 'sweet violet · blooming jasmine · soft citrus', image: 'https://uk.moroccanoil.com/cdn/shop/files/D3685_MO.Com_Content_Modules_EDP_Launch_Polaroid_592x698_e18821dc-3d68-434e-9ea0-e3d16e84a50f_1.png?v=1740314381&width=270', alt: 'White gardenia flower — top notes' },
    { label: 'mid', description: 'black pepper · velvet woods · clove vanilla', image: 'https://uk.moroccanoil.com/cdn/shop/files/D3685_MO.Com_Content_Modules_EDP_Launch_Polaroid_592x698_e18821dc-3d68-434e-9ea0-e3d16e84a50f_1.png?v=1740314381&width=270', alt: 'Warm spice mid notes' },
    { label: 'base', description: 'silky sandalwood · shimmery musk · spicy amber', image: 'https://uk.moroccanoil.com/cdn/shop/files/D3685_MO.Com_Content_Modules_EDP_Launch_Polaroid_592x698_e18821dc-3d68-434e-9ea0-e3d16e84a50f_1.png?v=1740314381&width=270', alt: 'Amber resin base notes' },
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-10 py-20 bg-[#fdf8f4]" style={{ fontFamily: '"Futura BT Book", sans-serif', color: '#401E17' }}>
      <div className="grid grid-cols-2" style={{ gridTemplateRows: 'auto auto' }}>
        <div className="relative">
          <img src="/Images/Products/Dollipops/Dollipopsection2.png" alt="Woman wearing Dollipops fragrance" className="w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center pl-30">
          <h2 className="text-5xl font-light mb-2" style={{ fontFamily: '"Futura BT Book", sans-serif', letterSpacing: '-0.02em' }}>A Decade</h2>
          <p className="text-5xl italic font-light mb-8" style={{ fontFamily: 'var(--font-signature)', color: '#1998B1', letterSpacing: '-0.02em' }}>in the making</p>
          <div className="w-12 h-0.5 bg-[#d4c5b2] mb-8"></div>
          <p className="text-sm leading-relaxed text-[#554433] mb-8 max-w-md" style={{ lineHeight: '1.7' }}>Our Mediterranean-inspired signature scent has inspired requests for a perfume since the beginning. After years of development and countless iterations, our iconic fragrance is now available in an eau de parfum.</p>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#401E17] mb-4" style={{ letterSpacing: '0.12em' }}>Be Transported</p>
          <p className="text-sm leading-relaxed text-[#554433]" style={{ lineHeight: '1.7' }}>Apply to pulse points for a long-lasting scent. The fragrance is intensified by warmth from the body.</p>
        </div>
        <div className="relative pt-4" style={{ height: '640px' }}>
          <div className="absolute flex items-start gap-6" style={{ top: 0, left: 0, transform: 'rotate(-7deg)' }}>
            <div className="bg-white shadow-md flex-shrink-0" style={{ width: '260px', padding: '10px' }}>
              <img src={fragranceNotes[0].image} alt={fragranceNotes[0].alt} className="w-full aspect-square object-cover" />
            </div>
            <div className="pt-8">
              <p className="text-center mb-2" style={{ fontFamily: 'var(--font-signature)', fontSize: '2.7rem', color: 'var(--secondary-blue)' }}>top</p>
              {fragranceNotes[0].description.split(' · ').map((line, i) => (
                <p key={i} className="text-center leading-relaxed m-0" style={{ fontSize: '13px' }}>{line}</p>
              ))}
            </div>
          </div>
          <div className="absolute flex items-start gap-6" style={{ top: '220px', left: '430px', transform: 'rotate(-8deg)' }}>
            <div className="bg-white shadow-md flex-shrink-0" style={{ width: '260px', padding: '10px' }}>
              <img src={fragranceNotes[2].image} alt={fragranceNotes[2].alt} className="w-full aspect-square object-cover" />
            </div>
            <div className="pt-2">
              <p className="text-center mb-2" style={{ fontFamily: 'var(--font-signature)', fontSize: '2.7rem', color: 'var(--secondary-blue)' }}>base</p>
              {fragranceNotes[2].description.split(' · ').map((line, i) => (
                <p key={i} className="text-center leading-relaxed m-0" style={{ fontSize: '13px' }}>{line}</p>
              ))}
            </div>
          </div>
          <div className="absolute flex items-start gap-6" style={{ top: '430px', left: 0, transform: 'rotate(3deg)' }}>
            <div className="bg-white shadow-md flex-shrink-0" style={{ width: '260px', padding: '10px' }}>
              <img src={fragranceNotes[1].image} alt={fragranceNotes[1].alt} className="w-full aspect-square object-cover" />
            </div>
            <div className="pt-2">
              <p className="text-center mb-2" style={{ fontFamily: 'var(--font-signature)', fontSize: '2.7rem', color: 'var(--secondary-blue)' }}>mid</p>
              {fragranceNotes[1].description.split(' · ').map((line, i) => (
                <p key={i} className="text-center leading-relaxed m-0" style={{ fontSize: '13px' }}>{line}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-start justify-end pt-4">
          <div className="bg-white shadow-md hover:shadow-lg transition-all" style={{ width: '460px', transform: 'rotate(2deg)', padding: '14px' }}>
            <img src="https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&q=80" alt="Scent notes" className="w-full object-cover rounded-sm" />
            <p className="text-center mt-4 pr-1" style={{ fontFamily: 'var(--font-signature)', fontSize: '3.4rem' }}>scent notes</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PostcardsSection() {
  return (
    <section className="max-w-[1400px] mx-auto px-10 py-20 bg-[#fdf8f4] text-[#401E17]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-15 items-center">
        <div className="relative w-full" style={{ height: '520px' }}>
          <img src="/Images/Products/Dollipops/Dollipopsection3.png" alt="Mediterranean landscape" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col lg:pl-5">
          <h2 className="text-5xl font-light text-[#401E17] leading-tight mb-1 tracking-tight">Postcards From</h2>
          <p className="text-5xl italic font-light text-[#1998B1] mb-6 tracking-tight" style={{ fontFamily: 'var(--font-signature)' }}>puglia</p>
          <div className="w-12 h-0.5 bg-[#1998B1] mb-7"></div>
          <p className="text-sm leading-[1.9] text-[#554433] font-light max-w-sm mb-8">
            When the time came to bring Dollipops to life, Puglia, Italy was chosen as the perfect backdrop. With its wildflower cliffs and sparkling turquoise seas, it's a true manifestation of the wild Mediterranean vistas that inspired the fragrance.
          </p>
          <blockquote className="border-l-[3px] border-[#1998B1] pl-5 max-w-md">
            <p className="text-base leading-[1.8] text-[#401E17] font-light mb-3 italic">
              "It kind of transported me back home—just feeling fresh and being in summer," said campaign star Adria Arjona.
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('verified');
  const [filterRating, setFilterRating] = useState('all');
  const [helpfulMap, setHelpfulMap] = useState({});

  const totalPages = Math.ceil(allReviews.length / REVIEWS_PER_PAGE);
  const filteredReviews = allReviews.filter(r => filterRating === 'all' ? true : r.rating === parseInt(filterRating));
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    return 0;
  });
  const paginatedReviews = sortedReviews.slice((currentPage - 1) * REVIEWS_PER_PAGE, currentPage * REVIEWS_PER_PAGE);
  const overallRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1);

  const handleHelpful = (id, type) => setHelpfulMap(prev => ({ ...prev, [id]: prev[id] === type ? null : type }));
  const handlePageChange = (page) => {
    setCurrentPage(page);
    document.getElementById('reviews-section-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const StarRow = ({ rating, size = 14 }) => (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= rating ? '#1998B1' : '#e8ddd0'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </span>
  );

  return (
    <section id="reviews-section-anchor" className="max-w-[1400px] mx-auto px-10 py-20 bg-[#fdf8f4] border-t border-[#e8ddd0]">
      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .review-card-anim { animation: fadeSlideUp 0.35s ease both; }
        .review-card-anim:nth-child(1) { animation-delay: 0.0s; }
        .review-card-anim:nth-child(2) { animation-delay: 0.05s; }
        .review-card-anim:nth-child(3) { animation-delay: 0.10s; }
        .review-card-anim:nth-child(4) { animation-delay: 0.15s; }
        .review-card-anim:nth-child(5) { animation-delay: 0.20s; }
      `}</style>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <span className="text-4xl lg:text-5xl font-light text-[#401E17] leading-tight">{overallRating}</span>
          <div>
            <StarRow rating={Math.round(parseFloat(overallRating))} size={18} />
            <p className="text-xs text-[#887766] tracking-widest uppercase mt-1">Based on {allReviews.length} reviews</p>
          </div>
        </div>
        <button className="inline-flex cursor-pointer items-center gap-2 px-5 py-2.5 bg-[var(--primary-brown)] text-white border-none rounded text-xs font-semibold tracking-wider uppercase transition-all hover:bg-[#5a2e24]">
          <Edit3 size={13} /> Write a Review
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-6 border-b border-[#e8ddd0]">
        <select className="appearance-none bg-white border border-[#d4c5b2] rounded px-3.5 py-2 text-xs tracking-widest uppercase text-[#401E17] cursor-pointer" value={filterRating} onChange={e => { setFilterRating(e.target.value); setCurrentPage(1); }}>
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-[#887766] tracking-widest uppercase">Sort by:</span>
          <select className="appearance-none bg-white border border-[#d4c5b2] rounded px-3.5 py-2 text-xs tracking-widest uppercase text-[#401E17] cursor-pointer" value={sortBy} onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}>
            <option value="verified">Verified purchase</option>
            <option value="highest">Highest rated</option>
            <option value="lowest">Lowest rated</option>
          </select>
        </div>
      </div>
      <div className="mx-auto max-w-6xl" key={`${currentPage}-${sortBy}-${filterRating}`}>
        {paginatedReviews.map((review, idx) => (
          <div key={review.id}>
            <div className="review-card-anim py-7 grid grid-cols-[180px_1fr] gap-6">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-[#401E17] tracking-wider flex-shrink-0" style={{ backgroundColor: review.avatarColor }}>{review.initials}</div>
                  <div>
                    <p className="m-0 text-sm font-semibold text-[#401E17] tracking-wider">{review.name}</p>
                    <StarRow rating={review.rating} size={11} />
                  </div>
                </div>
                <p className="m-0 text-xs text-[#a08862] tracking-wider">{review.date}</p>
              </div>
              <div>
                <h4 className="m-0 mb-2.5 text-sm font-bold text-[#401E17] tracking-wider uppercase">{review.title}</h4>
                <p className="m-0 mb-5 text-sm leading-[1.8] text-[#554433] font-light">{review.body}</p>
                <div className="flex items-center gap-4">
                  {review.verified && <span className="text-xs text-[#a08862] tracking-wider uppercase flex items-center gap-1"><svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#a08862" strokeWidth={2.5}><polyline points="20 6 9 17 4 12"/></svg>Was this review helpful?</span>}
                  <button className={`inline-flex items-center gap-1.5 border rounded px-2.5 py-1 text-xs tracking-wider uppercase transition-all ${helpfulMap[review.id] === 'up' ? 'bg-[#401E17] text-[#fdf8f4] border-[#401E17]' : 'border-[#e8ddd0] text-[#887766] hover:border-[#a08862] hover:text-[#401E17]'}`} onClick={() => handleHelpful(review.id, 'up')}><ThumbsUp size={10} />{review.helpful + (helpfulMap[review.id] === 'up' ? 1 : 0)}</button>
                  <button className={`inline-flex items-center gap-1.5 border rounded px-2.5 py-1 text-xs tracking-wider uppercase transition-all ${helpfulMap[review.id] === 'down' ? 'bg-[#401E17] text-[#fdf8f4] border-[#401E17]' : 'border-[#e8ddd0] text-[#887766] hover:border-[#a08862] hover:text-[#401E17]'}`} onClick={() => handleHelpful(review.id, 'down')}><ThumbsDown size={10} />{review.notHelpful + (helpfulMap[review.id] === 'down' ? 1 : 0)}</button>
                </div>
              </div>
            </div>
            {idx < paginatedReviews.length - 1 && <hr className="border-none border-t border-[#f0e8df]" />}
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-12 pt-8 border-t border-[#e8ddd0]">
          <button className="w-8.5 h-8.5 inline-flex cursor-pointer items-center justify-center text-xs font-medium transition-all hover:border-[#401E17] hover:bg-[#401E17] hover:text-[#fdf8f4] disabled:opacity-35 disabled:cursor-default" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page"><ChevronLeft size={14} /></button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
            const showPage = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
            const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
            const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;
            if (showEllipsisBefore || showEllipsisAfter) return <span key={`ellipsis-${page}`} className="text-xs px-0.5">…</span>;
            if (!showPage) return null;
            return <button key={page} className={`w-8.5 h-8.5 cursor-pointer inline-flex items-center justify-center text-xs font-medium transition-all ${currentPage === page ? 'bg-[#401E17] text-[#fdf8f4] border-[#401E17]' : 'border-[#d4c5b2] hover:border-[#401E17] hover:bg-[#401E17] hover:text-[#fdf8f4]'}`} onClick={() => handlePageChange(page)}>{page}</button>;
          })}
          <button className="w-8.5 h-8.5 cursor-pointer inline-flex items-center justify-center text-xs font-medium transition-all hover:border-[#401E17] hover:bg-[#401E17] hover:text-[#fdf8f4] disabled:opacity-35 disabled:cursor-default" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page"><ChevronRight size={14} /></button>
        </div>
      )}
    </section>
  );
}

export default function PopsPage() {
  const [selectedSize, setSelectedSize] = useState(productData.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(productData.images[0]);
  const [thumbStart, setThumbStart] = useState(0);
  const [openAccordion, setOpenAccordion] = useState('dental-nutrition');
  const [selectedFlavour, setSelectedFlavour] = useState('Green Apple');

  const VISIBLE = 5;
  const THUMB_H = 100;
  const THUMB_GAP = 8;
  const MAIN_H = VISIBLE * THUMB_H + (VISIBLE - 1) * THUMB_GAP;

  const { addItem } = useCart();
  const { currency } = useCountry();
  const handleAddToBag = () => {
    addItem({ id: productData.id, name: productData.name, variant: selectedSize.size, price: selectedSize.price, originalPrice: null, qty: quantity, promo: null, image: productData.images[0] });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto p-8" style={{ fontFamily: 'var(--font-sans)', backgroundColor: 'var(--background-color)', color: 'var(--primary-brown)' }}>
          <div className="flex items-center gap-2 mb-3 text-sm uppercase tracking-wider" style={{ color: 'var(--primary-brown)' }}>
            <Link href="/" className="no-underline font-bold transition-colors hover:text-amber-700">HOME</Link>
            <span className="mx-1">&gt;</span>
            <span className="font-bold">{productData.name.toUpperCase()} {productData.category.toUpperCase()}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12" style={{ alignItems: 'start' }}>
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex flex-col items-center gap-2 flex-shrink-0" style={{ width: '98px' }}>
                <button onClick={() => setThumbStart(s => Math.max(0, s - 1))} disabled={thumbStart === 0} className="w-full py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-30">↑</button>
                {productData.thumbnails.slice(thumbStart, thumbStart + VISIBLE).map((thumbnail, index) => (
                  <div key={thumbStart + index} onClick={() => setMainImage(thumbnail)} className={`flex-shrink-0 cursor-pointer overflow-hidden border-2 bg-amber-50 transition-all hover:border-amber-600 ${mainImage === thumbnail ? 'border-amber-700' : 'border-gray-200'}`}>
                    <Image src={thumbnail} alt={`${productData.name} ${thumbStart + index + 1}`} width={88} height={100} unoptimized className="w-full h-full object-cover" />
                  </div>
                ))}
                <button onClick={() => setThumbStart(s => Math.min(productData.thumbnails.length - VISIBLE, s + 1))} disabled={thumbStart + VISIBLE >= productData.thumbnails.length} className="w-full py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-30">↓</button>
              </div>
              <div className="flex-1 min-w-0 bg-amber-50">
                <Image src={mainImage} alt={productData.name} width={423} height={580} priority unoptimized className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-4xl md:text-[clamp(1.5rem,4vw,2.5rem)] font-bold italic tracking-wide m-0" style={{ color: 'var(--secondary-blue)', fontFamily: 'var(--font-signature)' }}>{productData.name}</h1>
              <p className="text-base m-0 capitalize" style={{ color: '#554433' }}>{productData.category}</p>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-2xl md:text-[clamp(1.25rem,3vw,1.75rem)] font-bold" >{currency}{productData.price.toFixed(2)}</span>
                  <span className="text-sm font-semibold uppercase tracking-wider"  >Flavour: {selectedFlavour}</span>
                </div>
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity" onClick={() => document.getElementById('reviews-section-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                  <div className="flex gap-1">{[...Array(5)].map((_, i) => <span key={i} className="text-lg" style={{ color: 'var(--secondary-blue)' }}>★</span>)}</div>
                  <span className="font-semibold"  >{productData.rating}</span>
                  <span className="text-sm" style={{ color: '#554433' }}>{productData.reviews} reviews</span>
                </div>
              </div>
              <p className="leading-relaxed m-0 text-base">{productData.description}</p>
              <div className="flex flex-wrap gap-3 mt-6">
                {['Green Apple', 'Mixed Berry'].map((flavour) => (
                  <button key={flavour} onClick={() => setSelectedFlavour(flavour)} className="px-4 py-2 rounded text-sm font-medium transition-all cursor-pointer" style={{ backgroundColor: selectedFlavour === flavour ? 'var(--secondary-blue)' : '#f0e8df', color: selectedFlavour === flavour ? '#fdf8f4' : '#401E17', border: '2px solid', borderColor: selectedFlavour === flavour ? 'var(--secondary-blue)' : 'transparent' }}>{flavour}</button>
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-8">
                <label className="text-sm font-bold tracking-wider">QUANTITY</label>
                <div className="flex flex-row gap-4">
                  <div className="flex border-1 rounded overflow-hidden" style={{ borderColor: 'var(--secondary-blue)', height: '56px', width: 'fit-content' }}>
                    <button className="w-10 border-none cursor-pointer text-xl transition-colors hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" style={{ backgroundColor: '#fff', color: '#401E17' }} onClick={() => quantity > 1 && setQuantity(quantity - 1)} disabled={quantity === 1}>−</button>
                    <input type="text" value={quantity} readOnly className="w-[60px] border-none border-x text-center text-base focus:outline-none flex items-center justify-center" style={{ borderColor: 'var(--secondary-blue)', color: '#401E17', cursor: 'default' }} />
                    <button className="w-10 border-none cursor-pointer text-xl transition-colors hover:bg-amber-50 flex items-center justify-center" style={{ backgroundColor: '#fff', color: '#401E17' }} onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                  <button className="flex-1 p-4 text-white border-none rounded text-base font-bold uppercase tracking-wider cursor-pointer transition-colors hover:bg-amber-800 active:bg-amber-900" style={{ backgroundColor: 'var(--secondary-blue)', height: '56px' }} onClick={handleAddToBag}>ADD TO BAG</button>
                </div>
              </div>
              <div className="mt-8 pt-8">
                {['details', 'ingredients', 'how-to-use'].map((key) => (
                  <div key={key} className="border-b" style={{ borderColor: '#d4c5b2' }}>
                    <button className="w-full flex items-center justify-between py-4 text-left" onClick={() => setOpenAccordion(openAccordion === key ? null : key)}>
                      <span className="text-base font-semibold uppercase tracking-wider"  >{key === 'how-to-use' ? 'How to Use' : key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${openAccordion === key ? 'rotate-180' : ''}`} style={{ color: '#554433' }} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openAccordion === key ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                      {key === 'details' && <p className="leading-relaxed text-sm" style={{ color: '#554433' }}>This delightful fragrance brings together vibrant fruity notes of raspberry and pear, blended with creamy vanilla and a hint of caramel.</p>}
                      {key === 'ingredients' && <p className="leading-relaxed text-sm" style={{ color: '#554433' }}>ALCOHOL DENAT., PARFUM (FRAGRANCE), AQUA (WATER), BENZYL SALICYLATE, LIMONENE, COUMARIN, LINALOOL, BENZYL BENZOATE, CITRAL, GERANIOL.</p>}
                      {key === 'how-to-use' && <ul className="leading-relaxed text-sm list-disc pl-4" style={{ color: '#554433' }}><li>Spray on pulse points: wrists, neck, and behind the ears</li><li>Apply to freshly moisturized skin for longer lasting scent</li><li>Keep away from direct sunlight and heat</li><li>Store in a cool, dry place</li></ul>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[1000px] mx-auto px-8 py-16">
          <h1 className="text-3xl md:text-[clamp(2.5rem,4vw,3.5rem)] font-bold tracking-wide text-center m-0 mb-12" style={{ color: 'var(--secondary-blue)', fontFamily: 'var(--font-signature)' }}>faq</h1>
          <div>
            {[
              { key: 'dental-nutrition', question: 'What does Dental Nutrition mean?', answer: 'Dental Nutrition means oral care in an edible form. It is the science of using nutrients to support teeth, gums, and oral microbiome health. Our products are designed to nourish and protect the mouth, beyond just brushing and flossing.' },
              { key: 'teeth-nutrition', question: 'Why do teeth need nutrition?', answer: 'Teeth and gums are living tissues that need nutrients to stay strong, resist decay, and recover from everyday damage. Targeted nutrition helps maintain enamel strength, gum health, and overall oral balance.' },
              { key: 'vs-brushing', question: 'How does Dental nutrition differ from brushing?', answer: 'Brushing works for only 1-2 minutes, leaving the mouth unprotected for the rest of the day. Dental Nutrition helps maintain a stable, healthy oral environment for the remaining 23 hours and 58 minutes.' },
              { key: 'hetafu-better', question: 'Why are Hetafu products better than other oral care products?', answer: "Hetafu is the world's first Dental Nutrition approach, offering edible oral care that nourishes teeth, gums, and the oral microbiome. Unlike regular oral care products that kill both good and bad bacteria, Hetafu selectively reduces harmful microbes within 1 minute while supporting beneficial ones, providing longer-lasting protection beyond brushing." },
              { key: 'replace-brushing', question: 'Does Dental Nutrition replace brushing and flossing?', answer: "No, it doesn't replace them. Dental Nutrition works alongside brushing and flossing to provide all-day protection, microbiome balance, and targeted oral support that regular cleaning cannot offer." },
            ].map((faq) => (
              <div key={faq.key} className="border-b" style={{ borderColor: '#d4c5b2' }}>
                <button className="w-full flex items-center justify-between py-4 text-left" onClick={() => setOpenAccordion(openAccordion === faq.key ? null : faq.key)}>
                  <span className="text-base font-semibold uppercase tracking-wider"  >{faq.question}</span>
                  <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${openAccordion === faq.key ? 'rotate-180' : ''}`} style={{ color: '#554433' }} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === faq.key ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                  <p className="leading-relaxed text-sm" style={{ color: '#554433' }}>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DecadeSection />
        <PostcardsSection />
        <ReviewsSection />
      </main>
      <BestSellers />
      <Footer />
    </div>
  );
}