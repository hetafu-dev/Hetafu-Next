'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import { useCountry } from '@/app/context/CountryContext';
import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";

const productData = {
  id: 4,
  name: 'Denta Smarts',
  category: 'SMARTS',
  price: 55.00,
  originalPrice: 55.00,
  rating: 4.9,
  reviews: 312,
  description: 'Introducing Denta Smarts - our intelligent enamel protection serum that uses advanced nanotechnology to repair and strengthen weakened tooth enamel. Formulated with dentists and backed by clinical studies, this powerful daily treatment reverses early signs of decay, reduces sensitivity, and creates a protective barrier that lasts up to 12 hours.',
  sizes: [
    { size: '100ml', price: 55.00 },
    { size: '50ml', price: 35.00 },
    { size: '15ml', price: 15.00 },
  ],
  rewardPoints: 55,
  images: [
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
  ],
  thumbnails: [
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
  ],
  fragranceSample: true,
  sampleDescription: 'A free 15ml travel-sized Denta Smarts is included with every full-size purchase.',
};

const allReviews = [
  { id: 1, name: 'Dr. James K.', initials: 'JK', avatarColor: '#d4b896', rating: 5, date: '05/15/24', title: 'DENTIST APPROVED!', body: 'As a practicing dentist with 20 years of experience, I can confidently say this product is revolutionary. My patients who use Denta Smarts show measurable improvement in enamel strength after just 3 months.', helpful: 24, notHelpful: 0, verified: true },
  { id: 2, name: 'Lisa M.', initials: 'LM', avatarColor: '#b8c9a3', rating: 5, date: '04/28/24', title: 'SENSITIVITY GONE!', body: "I've suffered from severe tooth sensitivity for years. After using Denta Smarts twice daily for 6 weeks, my sensitivity is completely gone. Life changing!", helpful: 18, notHelpful: 0, verified: true },
  { id: 3, name: 'Robert T.', initials: 'RT', avatarColor: '#c9b0b0', rating: 5, date: '03/20/24', title: 'MY DENTIST WAS IMPRESSED', body: 'During my last checkup, my dentist asked what I was doing differently - my gums were healthier and early cavity signs had reversed. Worth every penny.', helpful: 12, notHelpful: 0, verified: true },
  { id: 4, name: 'Sarah L.', initials: 'SL', avatarColor: '#a8bfd4', rating: 5, date: '02/10/24', title: 'CLINICALLY PROVEN TECHNOLOGY', body: "After 6 months of use, I'm a believer. The results speak for themselves. My enamel feels stronger than ever.", helpful: 9, notHelpful: 0, verified: true },
  { id: 5, name: 'Amanda P.', initials: 'AP', avatarColor: '#d4c4a8', rating: 4, date: '01/05/24', title: 'EFFECTIVE, BUT PRICY', body: "This product definitely works - my dentist noticed the difference immediately. It is a bit pricey, but since it reduces my dental bills, it pays for itself.", helpful: 5, notHelpful: 1, verified: true },
];

const REVIEWS_PER_PAGE = 5;

const ratingBreakdown = [
  { stars: 5, percent: 85 },
  { stars: 4, percent: 10 },
  { stars: 3, percent: 3 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 1 },
];

const sharedStyles = `
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
  .product-page-breadcrumb a { color: #a08862; text-decoration: none; transition: color 0.2s; }
  .product-page-breadcrumb a:hover { color: #401E17; }
  .thumbnail-btn { border: 2px solid transparent; transition: all 0.2s; cursor: pointer; }
  .thumbnail-btn.active { border-color: #401E17; }
  .size-btn { padding: 12px 24px; border: 1px solid #d4c5b2; background: #fff; cursor: pointer; transition: all 0.2s; font-size: 13px; letter-spacing: 0.05em; }
  .size-btn.active { background: #401E17; color: #fdf8f4; border-color: #401E17; }
  .add-to-cart-btn { width: 100%; padding: 16px; background: #401E17; color: #fdf8f4; border: none; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: background 0.2s; }
  .add-to-cart-btn:hover { background: #5a2c23; }
  @media (max-width: 768px) { .product-main-grid { grid-template-columns: 1fr !important; } }
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

function ScienceSection() {
  const keyTechnologies = [
    { label: 'nano-hydroxyapatite', description: 'mineral restoration · enamel rebuilding', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&q=80', alt: 'Molecular structure visualization' },
    { label: 'fluoride-free', description: 'safe · natural · effective', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&q=80', alt: 'Natural ingredients' },
    { label: 'xylitol enriched', description: 'cavity prevention · pH balancing', image: 'https://images.unsplash.com/photo-1606761568499-6ca5037fcbac?w=300&q=80', alt: 'Laboratory research' },
  ];
  return (
    <section className="decade-section">
      <div className="decade-inner">
        <div className="decade-hero">
          <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&q=80" alt="Denta Smarts serum" className="decade-hero-img" />
          <div className="notes-cluster">
            {keyTechnologies.map((tech) => (
              <div key={tech.label} className="polaroid">
                <img src={tech.image} alt={tech.alt} />
                <div className="polaroid-note-label">{tech.label}</div>
                <div className="polaroid-note-desc">{tech.description}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="decade-copy">
          <p className="decade-eyebrow">Years of research</p>
          <h2 className="decade-headline">Science you can<br />trust for your smile</h2>
          <div className="decade-divider" />
          <p className="decade-sub">Clinically proven results</p>
          <p className="decade-body">Developed over 8 years with leading dental researchers, Denta Smarts represents the cutting edge of at-home dental care. Our proprietary nanotechnology actively repairs damaged enamel, blocks sensitivity, and prevents future decay. Backed by 5 clinical studies with over 2,000 participants.</p>
          <div className="scent-polaroid-right">
            <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80" alt="Dental research laboratory" />
            <div className="scent-caption">key technologies</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PostcardsSection() {
  const collageImages = [
    { src: 'https://images.unsplash.com/photo-1588776814546-1ff20c6e55af?w=600&q=80', alt: 'Dental checkup', caption: 'Dentist-approved, USA', rotate: '-3deg', top: '0px', left: '0px', width: '260px' },
    { src: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=500&q=80', alt: 'Healthy smile', caption: 'Life-changing results', rotate: '2deg', top: '180px', left: '140px', width: '220px' },
    { src: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80', alt: 'Modern dental practice', caption: '', rotate: '-1.5deg', top: '60px', left: '310px', width: '190px' },
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
          <h2 className="postcards-headline">Stories <em>From</em></h2>
          <div className="postcards-divider" />
          <p className="postcards-body">Thousands of dentists and patients across America have made Denta Smarts part of their daily routine. Real people, real results.</p>
          <blockquote className="postcards-quote">
            <p>"My dentist couldn't believe the improvement in my enamel health in just 6 months."</p>
            <cite>— Sarah M., Verified User</cite>
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
              <div style={{ flex: 1, height: '4px', backgroundColor: '#e8ddd0', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${item.percent}%`, height: '100%', backgroundColor: '#a08862' }} />
              </div>
              <span style={{ fontSize: '11px', color: '#aaa', width: '30px', textAlign: 'right' }}>{item.percent}%</span>
            </div>
          ))}
          <h4 style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#887766', margin: '24px 0 16px' }}>Filter & Sort</h4>
          <select className="rv-select" style={{ marginBottom: '12px', width: '100%' }} value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
            <option value="all">All Ratings</option>
            <option value="5">5 Stars Only</option><option value="4">4 Stars Only</option><option value="3">3 Stars Only</option><option value="2">2 Stars Only</option><option value="1">1 Star Only</option>
          </select>
          <select className="rv-select" style={{ width: '100%' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="verified">Most Recent</option><option value="highest">Highest Rated</option><option value="lowest">Lowest Rated</option>
          </select>
        </div>
        <div>
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
          </div>
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

export default function SmartsPage() {
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
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#887766' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#a08862"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {currentProduct.rating} ({currentProduct.reviews} reviews)
              </span>
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
            <Link href="/products/pops" className="other-product-card" style={{ padding: '20px', border: '1px solid #e8ddd0', borderRadius: '4px', transition: 'all 0.3s ease', textDecoration: 'none', color: '#401E17' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontFamily: 'Cormorant Garamond, serif' }}>Dollipops</h3>
              <p style={{ margin: '0', fontSize: '14px', color: '#a08862' }}>From {currency}75.00</p>
            </Link>
            <Link href="/products/bits" className="other-product-card" style={{ padding: '20px', border: '1px solid #e8ddd0', borderRadius: '4px', transition: 'all 0.3s ease', textDecoration: 'none', color: '#401E17' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontFamily: 'Cormorant Garamond, serif' }}>Dentabits</h3>
              <p style={{ margin: '0', fontSize: '14px', color: '#a08862' }}>From {currency}45.00</p>
            </Link>
            <Link href="/products/cute" className="other-product-card" style={{ padding: '20px', border: '1px solid #e8ddd0', borderRadius: '4px', transition: 'all 0.3s ease', textDecoration: 'none', color: '#401E17' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontFamily: 'Cormorant Garamond, serif' }}>Cute Mouthwash</h3>
              <p style={{ margin: '0', fontSize: '14px', color: '#a08862' }}>From {currency}35.00</p>
            </Link>
          </div>
        </div>
        <ScienceSection />
        <PostcardsSection />
        <ReviewsSection />
      </main>
      <BestSellers />
      <Footer />
    </div>
  );
}
