'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import { useCountry } from '@/app/context/CountryContext';
import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";

const productData = {
  id: 3,
  name: 'Cute Mouthwash',
  category: 'CUTE',
  price: 35.00,
  originalPrice: 35.00,
  rating: 4.6,
  reviews: 189,
  description: 'Introducing Cute Mouthwash - our gentle, alcohol-free formula that leaves your breath fresh and your mouth feeling clean all day long. Infused with natural mint and xylitol, this kid-friendly mouthwash is perfect for the whole family, with zero harsh chemicals and a deliciously sweet mint flavor.',
  sizes: [
    { size: '500ml', price: 35.00 },
    { size: '250ml', price: 22.00 },
    { size: '100ml', price: 12.00 },
  ],
  rewardPoints: 35,
  images: [
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
  ],
  thumbnails: [
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
  ],
  fragranceSample: true,
  sampleDescription: 'A free travel-sized Cute Mouthwash is included with every full-size purchase.',
};

const allReviews = [
  { id: 1, name: 'Jennifer K.', initials: 'JK', avatarColor: '#d4b896', rating: 5, date: '05/22/24', title: 'KIDS LOVE IT!', body: 'Finally a mouthwash my kids actually want to use! The cute packaging and mild mint flavor make their morning routine so much easier.', helpful: 0, notHelpful: 0, verified: true },
  { id: 2, name: 'Maria S.', initials: 'MS', avatarColor: '#b8c9a3', rating: 5, date: '04/18/24', title: 'GENTLE ON SENSITIVE GUMS', body: "I've always struggled with sensitive gums, but this alcohol-free mouthwash is amazing. No burning sensation, just fresh breath and healthy gums.", helpful: 0, notHelpful: 0, verified: true },
  { id: 3, name: 'Robert T.', initials: 'RT', avatarColor: '#c9b0b0', rating: 4, date: '03/30/24', title: 'GOOD VALUE', body: "The 500ml bottle lasts forever. Great value for money and the natural ingredients make me feel good about what I'm putting in my body.", helpful: 0, notHelpful: 0, verified: true },
  { id: 4, name: 'Sarah L.', initials: 'SL', avatarColor: '#a8bfd4', rating: 5, date: '02/14/24', title: 'ECO-FRIENDLY PACKAGING', body: "Love that the bottle is made from recycled plastic! The product works great and it's good for the planet too.", helpful: 3, notHelpful: 0, verified: true },
  { id: 5, name: 'Amanda P.', initials: 'AP', avatarColor: '#d4c4a8', rating: 5, date: '01/25/24', title: 'FRESH BREATH ALL DAY', body: 'I use this twice a day and my breath stays fresh literally all day. No need for gum or mints. Highly recommend!', helpful: 2, notHelpful: 0, verified: true },
];

const REVIEWS_PER_PAGE = 5;

const ratingBreakdown = [
  { stars: 5, percent: 75 },
  { stars: 4, percent: 16 },
  { stars: 3, percent: 6 },
  { stars: 2, percent: 2 },
  { stars: 1, percent: 1 },
];

const sharedStyles = `
  .product-page-breadcrumb a { color: #a08862; text-decoration: none; transition: color 0.2s; }
  .product-page-breadcrumb a:hover { color: #401E17; }
  .thumbnail-btn { border: 2px solid transparent; transition: all 0.2s; cursor: pointer; }
  .thumbnail-btn.active { border-color: #401E17; }
  .size-btn { padding: 12px 24px; border: 1px solid #d4c5b2; background: #fff; cursor: pointer; transition: all 0.2s; font-size: 13px; letter-spacing: 0.05em; }
  .size-btn.active { background: #401E17; color: #fdf8f4; border-color: #401E17; }
  .add-to-cart-btn { width: 100%; padding: 16px; background: #401E17; color: #fdf8f4; border: none; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: background 0.2s; }
  .add-to-cart-btn:hover { background: #5a2c23; }
  .other-product-card { transition: all 0.3s ease; }
  .other-product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
  @media (max-width: 768px) { .product-main-grid { grid-template-columns: 1fr !important; } }
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
  .decade-section { max-width: 1400px; margin: 0 auto; padding: 80px 40px 60px; font-family: "Futura BT Book", sans-serif; background-color: #fdf8f4; color: #401E17; }
  .decade-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 0; align-items: start; }
  .decade-hero { position: relative; padding-right: 40px; }
  .decade-hero-img { width: 100%; max-width: 480px; aspect-ratio: 3/4; object-fit: cover; border-radius: 4px; display: block; }
  .notes-cluster { position: absolute; bottom: -10px; left: 10px; display: flex; flex-direction: column; gap: 16px; }
  .polaroid { background: #fff; padding: 8px 8px 24px 8px; box-shadow: 0 4px 18px rgba(0,0,0,0.10); width: 130px; transform: rotate(-2deg); transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: default; }
  .polaroid:nth-child(2) { transform: rotate(1.5deg); } .polaroid:nth-child(3) { transform: rotate(-1deg); margin-left: 40px; }
  .polaroid:hover { transform: rotate(0deg) scale(1.04) !important; box-shadow: 0 10px 32px rgba(0,0,0,0.16); z-index: 10; }
  .polaroid img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; }
  .polaroid-note-label { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 13px; color: #888; text-align: center; margin-top: 6px; }
  .polaroid-note-desc { font-size: 9px; color: #aaa; text-align: center; margin-top: 2px; line-height: 1.5; font-weight: 300; }
  .decade-copy { padding-top: 20px; padding-left: 20px; }
  .decade-eyebrow { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #887766; margin-bottom: 16px; }
  .decade-headline { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 300; font-style: italic; color: #401E17; line-height: 1.15; margin: 0 0 28px; }
  .decade-divider { width: 48px; height: 1px; background: #d4c5b2; margin-bottom: 28px; }
  .decade-sub { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #a08862; font-weight: 500; margin-bottom: 12px; }
  .decade-body { font-size: 14px; line-height: 1.85; color: #554433; font-weight: 300; max-width: 380px; margin-bottom: 40px; }
  .scent-polaroid-right { background: #fff; padding: 10px 10px 28px 10px; box-shadow: 0 6px 24px rgba(0,0,0,0.10); width: 200px; transform: rotate(1deg); margin-left: auto; margin-right: 40px; transition: transform 0.3s ease; }
  .scent-polaroid-right:hover { transform: rotate(0deg) scale(1.03); }
  .scent-polaroid-right img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
  .scent-caption { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 14px; color: #888; text-align: center; margin-top: 8px; }
  @media (max-width: 768px) { .decade-inner { grid-template-columns: 1fr; } .decade-hero { padding-right: 0; margin-bottom: 120px; } .decade-copy { padding-left: 0; } }
  .postcards-section { max-width: 1400px; margin: 0 auto; padding: 80px 40px 100px; font-family: "Futura BT Book", sans-serif; background-color: #fdf8f4; color: #401E17; }
  .postcards-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .postcards-collage { position: relative; height: 420px; }
  .pc-polaroid { position: absolute; background: #fff; padding: 10px 10px 30px 10px; box-shadow: 0 6px 24px rgba(0,0,0,0.12); transition: transform 0.35s ease, box-shadow 0.35s ease; cursor: pointer; }
  .pc-polaroid:hover { transform: rotate(0deg) scale(1.05) !important; box-shadow: 0 16px 40px rgba(0,0,0,0.18); z-index: 20 !important; }
  .pc-polaroid img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
  .pc-caption { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 12px; color: #999; text-align: center; margin-top: 6px; }
  .postcards-copy { padding-left: 20px; }
  .postcards-headline { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 300; color: #401E17; line-height: 1.2; margin: 0 0 8px; }
  .postcards-headline em { font-style: italic; color: #a08862; }
  .postcards-divider { width: 48px; height: 1px; background: #d4c5b2; margin: 24px 0; }
  .postcards-body { font-size: 14px; line-height: 1.9; color: #554433; font-weight: 300; max-width: 400px; margin-bottom: 28px; }
  .postcards-quote { border-left: 2px solid #a08862; padding-left: 20px; margin: 0; max-width: 380px; }
  .postcards-quote p { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 16px; line-height: 1.7; color: #443322; margin: 0 0 8px; }
  .postcards-quote cite { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #887766; font-style: normal; font-weight: 500; }
  @media (max-width: 768px) { .postcards-inner { grid-template-columns: 1fr; } .postcards-collage { height: 380px; } .postcards-copy { padding-left: 0; } }
  .rv-select { appearance: none; -webkit-appearance: none; background-color: #fff; border: 1px solid #d4c5b2; border-radius: 2px; padding: 8px 32px 8px 14px; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #401E17; cursor: pointer; background-repeat: no-repeat; background-position: right 12px center; transition: border-color 0.2s; }
  .rv-select:hover { border-color: #a08862; } .rv-select:focus { outline: none; border-color: #401E17; }
  .write-review-btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 22px; background: #401E17; color: #fdf8f4; border: none; border-radius: 2px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; }
  @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .review-card-anim { animation: fadeSlideUp 0.35s ease both; }
  .review-card-anim:nth-child(1) { animation-delay: 0.0s; } .review-card-anim:nth-child(2) { animation-delay: 0.05s; }
  .review-card-anim:nth-child(3) { animation-delay: 0.10s; } .review-card-anim:nth-child(4) { animation-delay: 0.15s; }
  .review-card-anim:nth-child(5) { animation-delay: 0.20s; }
`;

function StarRow({ rating, size = 14 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= rating ? '#a08862' : '#e8ddd0'}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
    </span>
  );
}

function GentleFormulaSection() {
  const keyIngredients = [
    { label: 'natural mint', description: 'refreshing · cooling · invigorating', image: 'https://images.unsplash.com/photo-1591382386627-349b692688ff?w=300&q=80', alt: 'Fresh mint leaves' },
    { label: 'xylitol', description: 'tooth-friendly · natural sweetener', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80', alt: 'Natural birch xylitol' },
    { label: 'aloe vera', description: 'soothing · gentle · healing', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&q=80', alt: 'Aloe vera leaf' },
  ];
  return (
    <section className="decade-section">
      <div className="decade-inner">
        <div className="decade-hero">
          <img src="https://images.unsplash.com/photo-1559757175-7cb006c06479?w=400&q=80" alt="Cute Mouthwash bottle" className="decade-hero-img" />
          <div className="notes-cluster">
            {keyIngredients.map((note) => (
              <div key={note.label} className="polaroid">
                <img src={note.image} alt={note.alt} />
                <div className="polaroid-note-label">{note.label}</div>
                <div className="polaroid-note-desc">{note.description}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="decade-copy">
          <p className="decade-eyebrow">The Story Behind the Product</p>
          <h2 className="decade-headline">Gentle on everyone<br />in the family</h2>
          <div className="decade-divider" />
          <p className="decade-sub">Mouth care, simplified</p>
          <p className="decade-body">Our alcohol-free formula was developed with families in mind. No harsh chemicals, no burning sensation - just fresh, clean breath that lasts all day. Perfect for kids and adults with sensitive gums.</p>
          <div className="scent-polaroid-right">
            <img src="https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&q=80" alt="Mouthwash bottle detail" />
            <div className="scent-caption">key ingredients</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PostcardsSection() {
  const collageImages = [
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', alt: 'Family brushing teeth', caption: 'Family time, USA', rotate: '-3deg', top: '0px', left: '0px', width: '260px' },
    { src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500&q=80', alt: 'Healthy smile', caption: 'Healthy smiles', rotate: '2deg', top: '180px', left: '140px', width: '220px' },
    { src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80', alt: 'Fresh morning routine', caption: '', rotate: '-1.5deg', top: '60px', left: '310px', width: '190px' },
  ];
  return (
    <section className="postcards-section">
      <div className="postcards-inner">
        <div className="postcards-collage">
          {collageImages.map((img, i) => (
            <div key={i} className="pc-polaroid" style={{ top: img.top, left: img.left, width: img.width, transform: `rotate(${img.rotate})`, zIndex: collageImages.length - i }}>
              <img src={img.src} alt={img.alt} />
              {img.caption && <div className="pc-caption">{img.caption}</div>}
            </div>
          ))}
        </div>
        <div className="postcards-copy">
          <h2 className="postcards-headline">Postcards <em>From</em></h2>
          <div className="postcards-divider" />
          <p className="postcards-body">When we created Cute Mouthwash, we wanted a product that brought families together. Our mouthwash has become a staple in households across America, making oral care simple and enjoyable for everyone.</p>
          <blockquote className="postcards-quote">
            <p>"It transformed our morning routine - even the kids ask to use it."</p>
            <cite>— Happy Mom, Chicago</cite>
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
  const sortedReviews = [...filteredReviews].sort((a, b) => { if (sortBy === 'highest') return b.rating - a.rating; if (sortBy === 'lowest') return a.rating - b.rating; return 0; });
  const paginatedReviews = sortedReviews.slice((currentPage - 1) * REVIEWS_PER_PAGE, currentPage * REVIEWS_PER_PAGE);
  const overallRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1);
  const handleHelpful = (id, type) => setHelpfulMap(prev => ({ ...prev, [id]: prev[id] === type ? null : type }));
  const handlePageChange = (page) => { setCurrentPage(page); document.getElementById('reviews-section-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  return (
    <section id="reviews-section-anchor" style={{ maxWidth: 1400, margin: '0 auto', padding: '80px 40px 100px', fontFamily: '"Futura BT Book", sans-serif', backgroundColor: '#fdf8f4', borderTop: '1px solid #e8ddd0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px', flexWrap: 'wrap', gap: '32px' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', margin: '0 0 8px', color: '#401E17' }}>Customer Reviews</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <StarRow rating={Math.round(parseFloat(overallRating))} size={16} />
            <span style={{ fontSize: '14px', color: '#554433' }}>{overallRating} · {allReviews.length} reviews</span>
          </div>
        </div>
        <button className="write-review-btn"><Edit3 size={14} /> Write a review</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '48px' }}>
        <div>
          <h4 style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#887766', margin: '0 0 16px' }}>Rating Breakdown</h4>
          {ratingBreakdown.map((item) => (
            <div key={item.stars} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', width: '20px', color: '#554433' }}>{item.stars}</span>
              <StarRow rating={item.stars} size={12} />
              <div style={{ flex: 1, height: '4px', backgroundColor: '#e8ddd0', borderRadius: '2px', overflow: 'hidden' }}><div style={{ width: `${item.percent}%`, height: '100%', backgroundColor: '#a08862' }} /></div>
              <span style={{ fontSize: '11px', color: '#aaa', width: '30px', textAlign: 'right' }}>{item.percent}%</span>
            </div>
          ))}
          <h4 style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#887766', margin: '24px 0 16px' }}>Filter & Sort</h4>
          <select className="rv-select" style={{ marginBottom: '12px', width: '100%' }} value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
            <option value="all">All Ratings</option><option value="5">5 Stars Only</option><option value="4">4 Stars Only</option><option value="3">3 Stars Only</option><option value="2">2 Stars Only</option><option value="1">1 Star Only</option>
          </select>
          <select className="rv-select" style={{ width: '100%' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="verified">Most Recent</option><option value="highest">Highest Rated</option><option value="lowest">Lowest Rated</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {paginatedReviews.map((review) => (
            <div key={review.id} className="review-card-anim" style={{ paddingBottom: '32px', borderBottom: '1px solid #e8ddd0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: review.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#401E17' }}>{review.initials}</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#401E17' }}>{review.name}</div>
                    {review.verified && <span style={{ fontSize: '10px', color: '#a08862', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Verified Buyer</span>}
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: '#aaa' }}>{review.date}</span>
              </div>
              <div style={{ marginBottom: '8px' }}><StarRow rating={review.rating} /></div>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#401E17', margin: '0 0 8px' }}>{review.title}</h4>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#554433', margin: '0 0 16px' }}>{review.body}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#887766' }}>Was this helpful?</span>
                <button onClick={() => handleHelpful(review.id, 'helpful')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', border: '1px solid #d4c5b2', borderRadius: '2px', backgroundColor: helpfulMap[review.id] === 'helpful' ? '#a08862' : '#fff', color: helpfulMap[review.id] === 'helpful' ? '#fff' : '#401E17', cursor: 'pointer', fontSize: '11px' }}><ThumbsUp size={12} /> Yes</button>
                <button onClick={() => handleHelpful(review.id, 'nothelpful')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', border: '1px solid #d4c5b2', borderRadius: '2px', backgroundColor: helpfulMap[review.id] === 'nothelpful' ? '#a08862' : '#fff', color: helpfulMap[review.id] === 'nothelpful' ? '#fff' : '#401E17', cursor: 'pointer', fontSize: '11px' }}><ThumbsDown size={12} /> No</button>
              </div>
            </div>
          ))}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '40px' }}>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} style={{ padding: '8px 16px', border: '1px solid #d4c5b2', backgroundColor: currentPage === 1 ? '#f5f0ea' : '#fff', color: currentPage === 1 ? '#aaa' : '#401E17', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', borderRadius: '2px' }}><ChevronLeft size={16} /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => handlePageChange(page)} style={{ width: '36px', height: '36px', border: page === currentPage ? '1px solid #401E17' : '1px solid #d4c5b2', backgroundColor: page === currentPage ? '#401E17' : '#fff', color: page === currentPage ? '#fdf8f4' : '#401E17', cursor: 'pointer', borderRadius: '2px', fontSize: '13px' }}>{page}</button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} style={{ padding: '8px 16px', border: '1px solid #d4c5b2', backgroundColor: currentPage === totalPages ? '#f5f0ea' : '#fff', color: currentPage === totalPages ? '#aaa' : '#401E17', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', borderRadius: '2px' }}><ChevronRight size={16} /></button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function CutePage() {
  const [selectedSize, setSelectedSize] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { currency } = useCountry();

  const currentProduct = { ...productData, price: productData.sizes[selectedSize].price };

  return (
    <div className="flex flex-col min-h-screen">
      <style>{sharedStyles}</style>
      <Navbar />
      <main className="flex-1" style={{ fontFamily: '"Futura BT Book", sans-serif', backgroundColor: '#fdf8f4', color: '#401E17' }}>
        <div className="product-page-breadcrumb" style={{ padding: '24px 40px', borderBottom: '1px solid #e8ddd0' }}>
          <Link href="/" style={{ fontSize: '13px' }}>Home</Link>
          <span style={{ margin: '0 8px', color: '#d4c5b2' }}>/</span>
          <span style={{ fontSize: '13px', color: '#401E17' }}>{currentProduct.category}</span>
          <span style={{ margin: '0 8px', color: '#d4c5b2' }}>/</span>
          <span style={{ fontSize: '13px', color: '#401E17' }}>{currentProduct.name}</span>
        </div>
        <div className="product-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', padding: '60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
          <div>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <img src={currentProduct.images[currentImage]} alt={currentProduct.name} style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {currentProduct.thumbnails.map((thumb, i) => (
                <button key={i} onClick={() => setCurrentImage(i)} className={`thumbnail-btn ${currentImage === i ? 'active' : ''}`} style={{ width: '80px', height: '80px', borderRadius: '4px', overflow: 'hidden' }}>
                  <img src={thumb} alt={`Thumbnail ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#a08862', fontWeight: '500' }}>{currentProduct.category}</span>
            <h1 style={{ fontSize: '42px', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', margin: '8px 0 12px', lineHeight: '1.1' }}>{currentProduct.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '24px', fontWeight: '500' }}>{currency}{currentProduct.price.toFixed(2)}</span>
              <span style={{ fontSize: '13px', color: '#887766' }}>{currentProduct.rating} ({currentProduct.reviews} reviews)</span>
            </div>
            <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#554433', marginBottom: '28px' }}>{currentProduct.description}</p>
            <h4 style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#887766', margin: '0 0 12px' }}>Select Size</h4>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              {currentProduct.sizes.map((size, i) => (
                <button key={i} onClick={() => setSelectedSize(i)} className={`size-btn ${selectedSize === i ? 'active' : ''}`}>{size.size} - {currency}{size.price.toFixed(2)}</button>
              ))}
            </div>
            <h4 style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#887766', margin: '0 0 12px' }}>Quantity</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: 'fit-content', marginBottom: '24px' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '40px', height: '40px', border: '1px solid #d4c5b2', backgroundColor: '#fff', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
              <span style={{ fontSize: '16px', minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={{ width: '40px', height: '40px', border: '1px solid #d4c5b2', backgroundColor: '#fff', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
            <button className="add-to-cart-btn">Add to Cart - {currency}{(currentProduct.price * quantity).toFixed(2)}</button>
            {currentProduct.fragranceSample && <p style={{ fontSize: '12px', color: '#887766', textAlign: 'center', marginTop: '12px', lineHeight: '1.5' }}>{currentProduct.sampleDescription}</p>}
            <div style={{ marginTop: '32px', padding: '20px', border: '1px solid #d4c5b2', borderRadius: '4px' }}>
              <p style={{ margin: '0', fontSize: '13px', color: '#554433' }}><strong>Earn {currentProduct.rewardPoints} reward points</strong> with this purchase.</p>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px 60px' }}>
          <h2 style={{ fontSize: '28px', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', margin: '0 0 32px', textAlign: 'center' }}>Explore Our Other Products</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <Link href="/products/pops" className="other-product-card" style={{ padding: '20px', border: '1px solid #e8ddd0', borderRadius: '4px', textDecoration: 'none', color: '#401E17' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontFamily: 'Cormorant Garamond, serif' }}>Dollipops</h3>
              <p style={{ margin: '0', fontSize: '14px', color: '#a08862' }}>From {currency}75.00</p>
            </Link>
            <Link href="/products/bits" className="other-product-card" style={{ padding: '20px', border: '1px solid #e8ddd0', borderRadius: '4px', textDecoration: 'none', color: '#401E17' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontFamily: 'Cormorant Garamond, serif' }}>Dentabits</h3>
              <p style={{ margin: '0', fontSize: '14px', color: '#a08862' }}>From {currency}45.00</p>
            </Link>
            <Link href="/products/smarts" className="other-product-card" style={{ padding: '20px', border: '1px solid #e8ddd0', borderRadius: '4px', textDecoration: 'none', color: '#401E17' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontFamily: 'Cormorant Garamond, serif' }}>Denta Smarts</h3>
              <p style={{ margin: '0', fontSize: '14px', color: '#a08862' }}>From {currency}55.00</p>
            </Link>
          </div>
        </div>
        <GentleFormulaSection />
        <PostcardsSection />
        <ReviewsSection />
      </main>
      <BestSellers />
      <Footer />
    </div>
  );
}
