'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import { useCountry } from '@/app/context/CountryContext';
import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";

const productData = {
  id: 2,
  name: 'Dentabits',
  category: 'BITS',
  price: 45.00,
  originalPrice: 45.00,
  rating: 4.8,
  reviews: 256,
  volume: '50ml',
  description: 'Introducing Dentabits - our revolutionary whitening bits that transform your oral care routine. These eco-friendly, dissolvable bits pack a powerful punch of natural enamel-safe ingredients that remove surface stains while freshening breath. Perfect for travel and daily use.',
  sizes: [
    { size: '50ml', price: 45.00 },
    { size: '30ml', price: 32.00 },
    { size: '10ml', price: 15.00 },
  ],
  rewardPoints: 45,
  images: [
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80',
  ],
  thumbnails: [
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
  ],
  fragranceSample: true,
  sampleDescription: 'A free travel pack is included with every full-size Dentabits purchase.',
};

const allReviews = [
  { id: 1, name: 'Sarah J.', initials: 'SJ', avatarColor: '#d4b896', rating: 5, date: '05/15/24', title: 'AMAZING RESULTS', body: "I've been using Dentabits for two weeks and my teeth are noticeably whiter. The bits are so convenient for travel and they leave my mouth feeling fresh all day.", helpful: 0, notHelpful: 0, verified: true },
  { id: 2, name: 'Mike T.', initials: 'MT', avatarColor: '#b8c9a3', rating: 5, date: '04/28/24', title: 'CONVENIENT & EFFECTIVE', body: 'As someone who travels frequently, these bits are a game-changer. No more bulky toothpaste tubes. They work great and leave my breath fresh.', helpful: 0, notHelpful: 0, verified: true },
  { id: 3, name: 'Emma W.', initials: 'EW', avatarColor: '#c9b0b0', rating: 4, date: '03/20/24', title: 'LOVE THE ECO-FRIENDLY ASPECT', body: "Finally, a toothpaste alternative that's good for the planet! The dissolvable bits eliminate plastic waste, and they clean my teeth just as well as traditional toothpaste.", helpful: 0, notHelpful: 0, verified: true },
  { id: 4, name: 'Lisa C.', initials: 'LC', avatarColor: '#a8bfd4', rating: 5, date: '02/15/24', title: 'MY NEW FAVORITE', body: "I was skeptical at first, but Dentabits has completely converted me. My dentist even commented on how much cleaner my teeth look at my last checkup!", helpful: 0, notHelpful: 0, verified: true },
  { id: 5, name: 'David L.', initials: 'DL', avatarColor: '#d4c4a8', rating: 5, date: '01/30/24', title: 'WORTH EVERY PENNY', body: 'The whitening effects are real. After a month of use, coffee and wine stains have significantly reduced. Highly recommend to anyone looking for a better oral care solution.', helpful: 0, notHelpful: 0, verified: true },
];

const REVIEWS_PER_PAGE = 5;

const ratingBreakdown = [
  { stars: 5, percent: 82 },
  { stars: 4, percent: 12 },
  { stars: 3, percent: 4 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 1 },
];

function DecadeSection() {
  const oralCareNotes = [
    { label: 'natural', description: 'fluoride free · eco-friendly · cruelty free', image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=300&q=80', alt: 'Natural ingredients - top benefits' },
    { label: 'whitening', description: 'polishing minerals · enamel safe · stain removal', image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=300&q=80', alt: 'Whitening properties - mid benefits' },
    { label: 'fresh', description: 'long lasting freshness · minty cool · alcohol free', image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&q=80', alt: 'Fresh breath - base benefits' },
  ];

  return (
    <section className="decade-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
        .decade-section { max-width: 1400px; margin: 0 auto; padding: 80px 40px 60px; font-family: "Futura BT Book", sans-serif; background-color: #fdf8f4; color: #401E17; }
        .decade-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 0; align-items: start; }
        .decade-hero { position: relative; padding-right: 40px; }
        .decade-hero-img { width: 100%; max-width: 480px; aspect-ratio: 3/4; object-fit: cover; border-radius: 4px; display: block; }
        .notes-cluster { position: absolute; bottom: -10px; left: 10px; display: flex; flex-direction: column; gap: 16px; }
        .polaroid { background: #fff; padding: 8px 8px 24px 8px; box-shadow: 0 4px 18px rgba(0,0,0,0.10); width: 130px; transform: rotate(-2deg); transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: default; }
        .polaroid:nth-child(2) { transform: rotate(1.5deg); }
        .polaroid:nth-child(3) { transform: rotate(-1deg); margin-left: 40px; }
        .polaroid:hover { transform: rotate(0deg) scale(1.04) !important; box-shadow: 0 10px 32px rgba(0,0,0,0.16); z-index: 10; }
        .polaroid img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; }
        .polaroid-note-label { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 13px; color: #888; text-align: center; margin-top: 6px; letter-spacing: 0.03em; }
        .polaroid-note-desc { font-size: 9px; color: #aaa; text-align: center; margin-top: 2px; line-height: 1.5; font-weight: 300; letter-spacing: 0.04em; }
        .decade-copy { padding-top: 20px; padding-left: 20px; }
        .decade-eyebrow { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #887766; font-weight: 400; margin-bottom: 16px; }
        .decade-headline { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 300; font-style: italic; color: #401E17; line-height: 1.15; margin: 0 0 28px; letter-spacing: -0.01em; }
        .decade-divider { width: 48px; height: 1px; background: #d4c5b2; margin-bottom: 28px; }
        .decade-sub { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #a08862; font-weight: 500; margin-bottom: 12px; }
        .decade-body { font-size: 14px; line-height: 1.85; color: #554433; font-weight: 300; max-width: 380px; margin-bottom: 40px; }
        .scent-polaroid-right { background: #fff; padding: 10px 10px 28px 10px; box-shadow: 0 6px 24px rgba(0,0,0,0.10); width: 200px; transform: rotate(1deg); margin-left: auto; margin-right: 40px; transition: transform 0.3s ease; }
        .scent-polaroid-right:hover { transform: rotate(0deg) scale(1.03); }
        .scent-polaroid-right img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .scent-caption { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 14px; color: #888; text-align: center; margin-top: 8px; letter-spacing: 0.05em; }
        @media (max-width: 768px) { .decade-inner { grid-template-columns: 1fr; } .decade-hero { padding-right: 0; margin-bottom: 120px; } .decade-copy { padding-left: 0; } }
      `}</style>
      <div className="decade-inner">
        <div className="decade-hero">
          <img src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&q=80" alt="Dentabits oral care product" className="decade-hero-img" />
          <div className="notes-cluster">
            {oralCareNotes.map((note) => (
              <div key={note.label} className="polaroid">
                <img src={note.image} alt={note.alt} />
                <div className="polaroid-note-label">{note.label}</div>
                <div className="polaroid-note-desc">{note.description}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="decade-copy">
          <p className="decade-eyebrow">The Story Behind the Bits</p>
          <h2 className="decade-headline">Years of Research<br />in every bit</h2>
          <div className="decade-divider" />
          <p className="decade-sub">Transform Your Smile</p>
          <p className="decade-body">After years of research and development, we created Dentabits to revolutionize oral care. Our dissolvable whitening bits combine natural ingredients with advanced technology to deliver professional-level results from the comfort of your home. Safe for daily use on all enamel types.</p>
          <div className="scent-polaroid-right">
            <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&q=80" alt="Dentabits bottle detail" />
            <div className="scent-caption">key benefits</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PostcardsSection() {
  const collageImages = [
    { src: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&q=80', alt: 'Dental professional smiling', caption: 'Dentist Approved', rotate: '-3deg', top: '0px', left: '0px', width: '260px' },
    { src: 'https://images.unsplash.com/photo-1588776814546-1ff20c6e55af?w=500&q=80', alt: 'Bright white smile', caption: 'Brighter Smile', rotate: '2deg', top: '180px', left: '140px', width: '220px' },
    { src: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&q=80', alt: 'Eco-friendly packaging', caption: 'Sustainable Choice', rotate: '-1.5deg', top: '60px', left: '310px', width: '190px' },
  ];

  return (
    <section className="postcards-section">
      <style>{`
        .postcards-section { max-width: 1400px; margin: 0 auto; padding: 80px 40px 100px; font-family: "Futura BT Book", sans-serif; background-color: #fdf8f4; color: #401E17; }
        .postcards-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .postcards-collage { position: relative; height: 420px; }
        .pc-polaroid { position: absolute; background: #fff; padding: 10px 10px 30px 10px; box-shadow: 0 6px 24px rgba(0,0,0,0.12); transition: transform 0.35s ease, box-shadow 0.35s ease; cursor: pointer; }
        .pc-polaroid:hover { transform: rotate(0deg) scale(1.05) !important; box-shadow: 0 16px 40px rgba(0,0,0,0.18); z-index: 20 !important; }
        .pc-polaroid img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .pc-caption { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 12px; color: #999; text-align: center; margin-top: 6px; letter-spacing: 0.05em; }
        .postcards-copy { padding-left: 20px; }
        .postcards-headline { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 300; color: #401E17; line-height: 1.2; margin: 0 0 8px; letter-spacing: -0.01em; }
        .postcards-headline em { font-style: italic; color: #a08862; }
        .postcards-divider { width: 48px; height: 1px; background: #d4c5b2; margin: 24px 0; }
        .postcards-body { font-size: 14px; line-height: 1.9; color: #554433; font-weight: 300; max-width: 400px; margin-bottom: 28px; }
        .postcards-quote { border-left: 2px solid #a08862; padding-left: 20px; margin: 0; max-width: 380px; }
        .postcards-quote p { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 16px; line-height: 1.7; color: #443322; margin: 0 0 8px; }
        .postcards-quote cite { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #887766; font-style: normal; font-weight: 500; }
        @media (max-width: 768px) { .postcards-inner { grid-template-columns: 1fr; } .postcards-collage { height: 380px; } .postcards-copy { padding-left: 0; } }
      `}</style>
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
          <h2 className="postcards-headline">Testimonials <em>From</em></h2>
          <div className="postcards-divider" />
          <p className="postcards-body">When we developed Dentabits, we worked closely with dental professionals to ensure our formula was not only effective but completely safe for daily use. The result is a product that dentists recommend and customers love.</p>
          <blockquote className="postcards-quote">
            <p>"Dentabits represents the future of oral care - effective, convenient, and environmentally responsible. My patients love the results."</p>
            <cite>— Dr. Amanda Chen, Dental Professional</cite>
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

  const StarRow = ({ rating, size = 14 }) => (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= rating ? '#a08862' : '#e8ddd0'}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
    </span>
  );

  return (
    <section id="reviews-section-anchor" style={{ maxWidth: 1400, margin: '0 auto', padding: '80px 40px 100px', fontFamily: '"Futura BT Book", sans-serif', backgroundColor: '#fdf8f4', borderTop: '1px solid #e8ddd0' }}>
      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .review-card-anim { animation: fadeSlideUp 0.35s ease both; }
        .review-card-anim:nth-child(1) { animation-delay: 0.0s; } .review-card-anim:nth-child(2) { animation-delay: 0.05s; }
        .review-card-anim:nth-child(3) { animation-delay: 0.10s; } .review-card-anim:nth-child(4) { animation-delay: 0.15s; }
        .review-card-anim:nth-child(5) { animation-delay: 0.20s; }
        .rv-select { appearance: none; -webkit-appearance: none; background-color: #fff; border: 1px solid #d4c5b2; border-radius: 2px; padding: 8px 32px 8px 14px; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #401E17; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23a08862'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; transition: border-color 0.2s; }
        .rv-select:hover { border-color: #a08862; } .rv-select:focus { outline: none; border-color: #401E17; }
        .write-review-btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 22px; background: #401E17; color: #fdf8f4; border: none; border-radius: 2px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; transition: background 0.2s, transform 0.15s; white-space: nowrap; }
      `}</style>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, marginBottom: 60 }}>
        <div>
          <h3 style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#887766', marginBottom: 16 }}>Customer Reviews</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: '48px', fontFamily: 'Cormorant Garamond, serif', color: '#401E17' }}>{overallRating}</span>
            <div>
              <StarRow rating={Math.round(parseFloat(overallRating))} size={16} />
              <p style={{ fontSize: '11px', color: '#887766', marginTop: 4 }}>{productData.reviews} reviews</p>
            </div>
          </div>
          <div style={{ marginTop: 32 }}>
            {ratingBreakdown.map((item) => (
              <div key={item.stars} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: '12px', width: 20 }}>{item.stars}</span>
                <StarRow rating={item.stars} size={12} />
                <div style={{ flex: 1, height: 4, backgroundColor: '#e8ddd0', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${item.percent}%`, height: '100%', backgroundColor: '#a08862' }} />
                </div>
                <span style={{ fontSize: '11px', color: '#887766', width: 30, textAlign: 'right' }}>{item.percent}%</span>
              </div>
            ))}
          </div>
          <button className="write-review-btn" style={{ marginTop: 40 }}><Edit3 size={14} /> Write a Review</button>
        </div>
        <div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
            <select className="rv-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="verified">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
            <select className="rv-select" value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          <div>
            {paginatedReviews.map((review) => (
              <div key={review.id} className="review-card-anim" style={{ padding: '24px 0', borderBottom: '1px solid #e8ddd0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: review.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600, color: '#fff' }}>{review.initials}</div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#401E17' }}>{review.name} {review.verified && <span style={{ fontSize: '10px', backgroundColor: '#a08862', color: '#fff', padding: '2px 6px', borderRadius: 2, marginLeft: 8 }}>Verified</span>}</p>
                      <StarRow rating={review.rating} size={12} />
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#887766' }}>{review.date}</span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#401E17', marginBottom: 8 }}>{review.title}</h4>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#554433', marginBottom: 16 }}>{review.body}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#887766' }}>Was this helpful?</span>
                  <button onClick={() => handleHelpful(review.id, 'helpful')} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '11px', color: helpfulMap[review.id] === 'helpful' ? '#a08862' : '#887766' }}><ThumbsUp size={12} /> Yes ({helpfulMap[review.id] === 'helpful' ? (review.helpful + 1) : review.helpful})</button>
                  <button onClick={() => handleHelpful(review.id, 'nothelpful')} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '11px', color: helpfulMap[review.id] === 'nothelpful' ? '#a08862' : '#887766' }}><ThumbsDown size={12} /> No ({helpfulMap[review.id] === 'nothelpful' ? (review.notHelpful + 1) : review.notHelpful})</button>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 40 }}>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} style={{ padding: '8px 16px', border: '1px solid #d4c5b2', backgroundColor: currentPage === 1 ? '#f5f5f5' : '#fff', color: currentPage === 1 ? '#ccc' : '#401E17', borderRadius: 2, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}><ChevronLeft size={16} /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => handlePageChange(page)} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', border: page === currentPage ? '1px solid #401E17' : '1px solid #d4c5b2', backgroundColor: page === currentPage ? '#401E17' : '#fff', color: page === currentPage ? '#fff' : '#401E17', borderRadius: 2, cursor: 'pointer' }}>{page}</button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} style={{ padding: '8px 16px', border: '1px solid #d4c5b2', backgroundColor: currentPage === totalPages ? '#f5f5f5' : '#fff', color: currentPage === totalPages ? '#ccc' : '#401E17', borderRadius: 2, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}><ChevronRight size={16} /></button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function BitsPage() {
  const [selectedSize, setSelectedSize] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { currency } = useCountry();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 40px', fontFamily: '"Futura BT Book", sans-serif' }}>
          <nav style={{ display: 'flex', gap: 8, fontSize: '12px', color: '#887766' }}>
            <Link href="/" style={{ color: '#887766', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/products/bits" style={{ color: '#401E17', textDecoration: 'none', fontWeight: 500 }}>{productData.name}</Link>
          </nav>
        </div>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 40px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, fontFamily: '"Futura BT Book", sans-serif' }}>
          <div>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', backgroundColor: '#fff', borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
              <Image src={productData.images[currentImage]} alt={productData.name} fill style={{ objectFit: 'contain' }} priority />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {productData.thumbnails.map((img, i) => (
                <button key={i} onClick={() => setCurrentImage(i)} style={{ width: 80, height: 80, border: i === currentImage ? '2px solid #401E17' : '2px solid transparent', borderRadius: 4, overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
                  <Image src={img} alt={`${productData.name} thumbnail ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>
          <div style={{ paddingTop: 20 }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#887766', marginBottom: 8 }}>{productData.category}</p>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, color: '#401E17', margin: '0 0 12px' }}>{productData.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ display: 'inline-flex', gap: 2 }}>{[1,2,3,4,5].map(i => <svg key={i} width={14} height={14} viewBox="0 0 24 24" fill={i <= Math.round(productData.rating) ? '#a08862' : '#e8ddd0'}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}</div>
              <span style={{ fontSize: '13px', color: '#887766' }}>{productData.rating} ({productData.reviews} reviews)</span>
            </div>
            <p style={{ fontSize: '28px', color: '#401E17', marginBottom: 24 }}>{currency}{productData.sizes[selectedSize].price.toFixed(2)}</p>
            <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#554433', marginBottom: 32 }}>{productData.description}</p>
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#887766', marginBottom: 12 }}>Size: {productData.sizes[selectedSize].size}</p>
              <div style={{ display: 'flex', gap: 12 }}>
                {productData.sizes.map((size, i) => (
                  <button key={i} onClick={() => setSelectedSize(i)} style={{ padding: '12px 24px', border: i === selectedSize ? '2px solid #401E17' : '1px solid #d4c5b2', backgroundColor: i === selectedSize ? '#401E17' : '#fff', color: i === selectedSize ? '#fff' : '#401E17', borderRadius: 2, cursor: 'pointer', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.2s' }}>{size.size} - {currency}{size.price.toFixed(2)}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#887766', marginBottom: 12 }}>Quantity</p>
              <div style={{ display: 'flex', alignItems: 'center', width: 'fit-content', border: '1px solid #d4c5b2' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '12px 16px', border: 'none', backgroundColor: '#fff', cursor: 'pointer', fontSize: '18px' }}>-</button>
                <span style={{ padding: '12px 24px', fontSize: '14px' }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '12px 16px', border: 'none', backgroundColor: '#fff', cursor: 'pointer', fontSize: '18px' }}>+</button>
              </div>
            </div>
            <button style={{ width: '100%', padding: '16px', backgroundColor: '#401E17', color: '#fff', border: 'none', borderRadius: 2, fontSize: '13px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background-color 0.2s', marginBottom: 16 }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a2c22'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#401E17'}>
              Add to Cart - ${(productData.sizes[selectedSize].price * quantity).toFixed(2)}
            </button>
            <p style={{ fontSize: '12px', color: '#887766', textAlign: 'center' }}>Earn {productData.rewardPoints * quantity} reward points with this purchase</p>
            {productData.fragranceSample && (
              <div style={{ marginTop: 32, padding: '20px', border: '1px solid #d4c5b2', borderRadius: 4 }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#401E17', marginBottom: 8 }}>🎁 Free Sample Included</p>
                <p style={{ fontSize: '12px', color: '#554433', lineHeight: 1.6 }}>{productData.sampleDescription}</p>
              </div>
            )}
          </div>
        </div>
        <DecadeSection />
        <PostcardsSection />
        <ReviewsSection />
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 40px', borderTop: '1px solid #e8ddd0' }}>
          <h3 style={{ fontSize: '24px', fontFamily: 'Cormorant Garamond, serif', textAlign: 'center', marginBottom: 40, color: '#401E17' }}>Explore Our Other Products</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
            <Link href="/products/cute" style={{ textDecoration: 'none' }}><div style={{ backgroundColor: '#fff', padding: 30, borderRadius: 4, textAlign: 'center', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}><h4 style={{ fontSize: '20px', fontFamily: 'Cormorant Garamond, serif', color: '#401E17', marginBottom: 8 }}>Cute Mouthwash</h4><p style={{ fontSize: '13px', color: '#887766' }}>Discover fresh breath</p></div></Link>
            <Link href="/products/smarts" style={{ textDecoration: 'none' }}><div style={{ backgroundColor: '#fff', padding: 30, borderRadius: 4, textAlign: 'center', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}><h4 style={{ fontSize: '20px', fontFamily: 'Cormorant Garamond, serif', color: '#401E17', marginBottom: 8 }}>Denta Smarts</h4><p style={{ fontSize: '13px', color: '#887766' }}>Smart oral care</p></div></Link>
            <Link href="/products/pops" style={{ textDecoration: 'none' }}><div style={{ backgroundColor: '#fff', padding: 30, borderRadius: 4, textAlign: 'center', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}><h4 style={{ fontSize: '20px', fontFamily: 'Cormorant Garamond, serif', color: '#401E17', marginBottom: 8 }}>Dollipops</h4><p style={{ fontSize: '13px', color: '#887766' }}>Our signature product</p></div></Link>
          </div>
        </div>
      </main>
      <BestSellers />
      <Footer />
    </div>
  );
}
