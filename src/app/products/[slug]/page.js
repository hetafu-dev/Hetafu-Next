'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronDown, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useCountry } from '@/app/context/CountryContext';
import Navbar from '@/app/Components/Common/Navbar/Page';
import Footer from '@/app/Components/Common/Footer/Page';
import BestSellers from '@/app/Components/Common/BestSellers/Page';

const ALL_PRODUCTS = {
  pops: {
    id: 1,
    name: 'Dollipops',
    category: 'POPS',
    price: 75.00,
    rating: 4.7,
    reviewCount: 347,
    description: 'Our professional-grade teeth whitening strips deliver professional-level results from the comfort of home. These advanced strips use a safe, enamel-friendly formula that effectively removes stains from coffee, wine, and tobacco, revealing a brighter, whiter smile in just 2 weeks.',
    variants: ['Green Apple', 'Mixed Berry'],
    variantLabel: 'Flavour',
    images: [
      '/Images/Products/Dollipops/Dollipop.png',
      '/Images/Products/Dollipops/Dollipop1.png',
      '/Images/Products/Dollipops/Dollipop2.png',
      '/Images/Products/Dollipops/Dollipop3.png',
      '/Images/Products/Dollipops/Dollipop4.png',
    ],
    accordion: {
      details: 'This delightful fragrance brings together vibrant fruity notes of raspberry and pear, blended with creamy vanilla and a hint of caramel.',
      ingredients: 'ALCOHOL DENAT., PARFUM (FRAGRANCE), AQUA (WATER), BENZYL SALICYLATE, LIMONENE, COUMARIN, LINALOOL, BENZYL BENZOATE, CITRAL, GERANIOL.',
      'how-to-use': ['Spray on pulse points: wrists, neck, and behind the ears', 'Apply to freshly moisturized skin for longer lasting scent', 'Keep away from direct sunlight and heat', 'Store in a cool, dry place'],
    },
    sectionImage: '/Images/Products/Dollipops/Dollipopsection2.png',
    sectionTitle: ['A Decade', 'in the making'],
    sectionBody: 'Our Mediterranean-inspired signature scent has inspired requests for a perfume since the beginning. After years of development and countless iterations, our iconic fragrance is now available in an eau de parfum.',
    postcardImage: '/Images/Products/Dollipops/Dollipopsection3.png',
    postcardTitle: ['Postcards From', 'puglia'],
    postcardBody: 'When the time came to bring Dollipops to life, Puglia, Italy was chosen as the perfect backdrop. With its wildflower cliffs and sparkling turquoise seas, it\'s a true manifestation of the wild Mediterranean vistas that inspired the fragrance.',
    postcardQuote: '"It kind of transported me back home—just feeling fresh and being in summer," said campaign star Adria Arjona.',
    notes: [
      { label: 'top', description: 'sweet violet · blooming jasmine · soft citrus', image: '/Images/Products/Dollipops/DIng1.png' },
      { label: 'mid', description: 'black pepper · velvet woods · clove vanilla', image: '/Images/Products/Dollipops/DIng2.png' },
      { label: 'base', description: 'silky sandalwood · shimmery musk · spicy amber', image: '/Images/Products/Dollipops/DIng3.png' },
    ],
    reviewList: [
      { id: 1, name: 'Dorothy M.', initials: 'DM', avatarColor: '#d4b896', rating: 5, date: '06/11/24', title: 'LOVE IT', body: 'These whitening strips are amazing! I noticed a difference after just a few uses. My teeth are noticeably whiter and the application process is so easy.', helpful: 0, notHelpful: 0, verified: true },
      { id: 2, name: 'Sally T.', initials: 'ST', avatarColor: '#b8c9a3', rating: 4, date: '06/01/24', title: 'HAPPY', body: 'Ordered these whitening strips for my daughter, she loves them! We were both impressed with the results after 2 weeks of use.', helpful: 0, notHelpful: 0, verified: true },
      { id: 3, name: 'Laura W.', initials: 'LW', avatarColor: '#c9b0b0', rating: 5, date: '03/29/24', title: 'LOVE THE RESULTS', body: "I've tried many whitening products and these are by far the best. They work gently without causing any sensitivity.", helpful: 0, notHelpful: 0, verified: true },
      { id: 4, name: 'Ashleigh C.', initials: 'AC', avatarColor: '#a8bfd4', rating: 5, date: '03/23/24', title: 'THE BEST', body: 'My favorite whitening product of all time 💕 absolutely love the results I always get compliments on how white my smile is.', helpful: 0, notHelpful: 0, verified: true },
      { id: 5, name: 'Dominique L.', initials: 'DL', avatarColor: '#d4c4a8', rating: 4, date: '03/13/24', title: 'GREAT PRODUCT', body: "I love that these strips are easy to use and actually deliver on their promises. My teeth are noticeably whiter.", helpful: 0, notHelpful: 0, verified: true },
    ],
  },
  bits: {
    id: 2,
    name: 'Dentabits',
    category: 'BITS',
    price: 45.00,
    rating: 4.8,
    reviewCount: 256,
    description: 'Introducing Dentabits - our revolutionary whitening bits that transform your oral care routine. These eco-friendly, dissolvable bits pack a powerful punch of natural enamel-safe ingredients that remove surface stains while freshening breath. Perfect for travel and daily use.',
    variants: ['Mint', 'Cinnamon'],
    variantLabel: 'Flavour',
    images: [
      '/Images/Products/CUTE/cutebits.png',
      '/Images/Products/CUTE/cutepowder.png',
    ],
    accordion: {
      details: 'Dentabits are compact, dissolvable oral care tablets packed with enamel-safe whitening minerals and breath-freshening actives.',
      ingredients: 'XYLITOL, SODIUM BICARBONATE, CALCIUM CARBONATE, MAGNESIUM STEARATE, SPEARMINT OIL, PEPPERMINT OIL, STEVIA LEAF EXTRACT.',
      'how-to-use': ['Pop one bit in your mouth and let it dissolve', 'Brush teeth as normal for 2 minutes', 'Rinse thoroughly', 'Use twice daily for best results'],
    },
    sectionImage: '/Images/Products/CUTE/cutebits.png',
    sectionTitle: ['Years of Research', 'in every bit'],
    sectionBody: 'After years of research and development, we created Dentabits to revolutionize oral care. Our dissolvable whitening bits combine natural ingredients with advanced technology to deliver professional-level results from the comfort of your home.',
    postcardImage: '/Images/Products/CUTE/cutepowder.png',
    postcardTitle: ['Inspired By', 'nature'],
    postcardBody: 'Dentabits was born from a desire to make oral care sustainable and effective. Every ingredient is sourced responsibly, and our zero-plastic packaging means you can care for your smile while caring for the planet.',
    postcardQuote: '"Dentabits represents the future of oral care - effective, convenient, and environmentally responsible." — Dr. Amanda Chen',
    notes: [
      { label: 'natural', description: 'fluoride free · eco-friendly · cruelty free', image: '/Images/Products/CUTE/cutebits.png' },
      { label: 'whitening', description: 'polishing minerals · enamel safe · stain removal', image: '/Images/Products/CUTE/cutepowder.png' },
      { label: 'fresh', description: 'long lasting · minty cool · alcohol free', image: '/Images/Products/CUTE/cutebits.png' },
    ],
    reviewList: [
      { id: 1, name: 'Sarah J.', initials: 'SJ', avatarColor: '#d4b896', rating: 5, date: '05/15/24', title: 'AMAZING RESULTS', body: "I've been using Dentabits for two weeks and my teeth are noticeably whiter. The bits are so convenient for travel.", helpful: 0, notHelpful: 0, verified: true },
      { id: 2, name: 'Mike T.', initials: 'MT', avatarColor: '#b8c9a3', rating: 5, date: '04/28/24', title: 'CONVENIENT & EFFECTIVE', body: 'As someone who travels frequently, these bits are a game-changer. No more bulky toothpaste tubes.', helpful: 0, notHelpful: 0, verified: true },
      { id: 3, name: 'Emma W.', initials: 'EW', avatarColor: '#c9b0b0', rating: 4, date: '03/20/24', title: 'LOVE THE ECO-FRIENDLY ASPECT', body: "Finally, a toothpaste alternative that's good for the planet! The dissolvable bits eliminate plastic waste.", helpful: 0, notHelpful: 0, verified: true },
      { id: 4, name: 'Lisa C.', initials: 'LC', avatarColor: '#a8bfd4', rating: 5, date: '02/15/24', title: 'MY NEW FAVORITE', body: "Dentabits has completely converted me. My dentist even commented on how much cleaner my teeth look!", helpful: 0, notHelpful: 0, verified: true },
      { id: 5, name: 'David L.', initials: 'DL', avatarColor: '#d4c4a8', rating: 5, date: '01/30/24', title: 'WORTH EVERY PENNY', body: 'The whitening effects are real. After a month of use, coffee and wine stains have significantly reduced.', helpful: 0, notHelpful: 0, verified: true },
    ],
  },
  cute: {
    id: 3,
    name: 'Cute Mouthwash',
    category: 'CUTE',
    price: 35.00,
    rating: 4.6,
    reviewCount: 189,
    description: 'Introducing Cute - our gentle, alcohol-free formula that leaves your breath fresh and your mouth feeling clean all day long. Infused with natural mint and xylitol, this kid-friendly formula is perfect for the whole family, with zero harsh chemicals and a deliciously sweet mint flavour.',
    variants: ['Sweet Mint', 'Bubblegum'],
    variantLabel: 'Flavour',
    images: [
      '/Images/Products/CUTE/cutebits.png',
      '/Images/Products/CUTE/cutepowder.png',
    ],
    accordion: {
      details: 'Cute is our alcohol-free oral care formula designed for the whole family. Gentle on sensitive gums, tough on bad breath.',
      ingredients: 'AQUA (WATER), XYLITOL, ALOE BARBADENSIS LEAF JUICE, GLYCERIN, SPEARMINT OIL, SODIUM BENZOATE, CITRIC ACID, STEVIA REBAUDIANA LEAF EXTRACT.',
      'how-to-use': ['Measure 10ml and swish for 30 seconds', 'Spit and do not rinse with water', 'Use after brushing morning and night', 'Safe for children aged 6 and above'],
    },
    sectionImage: '/Images/Products/CUTE/cutebits.png',
    sectionTitle: ['Gentle on everyone', 'in the family'],
    sectionBody: 'Our alcohol-free formula was developed with families in mind. No harsh chemicals, no burning sensation - just fresh, clean breath that lasts all day. Perfect for kids and adults with sensitive gums.',
    postcardImage: '/Images/Products/CUTE/cutepowder.png',
    postcardTitle: ['Made For', 'every smile'],
    postcardBody: 'When we created Cute, we wanted a product that brought families together. Our formula has become a staple in households across the world, making oral care simple and enjoyable for everyone.',
    postcardQuote: '"It transformed our morning routine - even the kids ask to use it." — Happy Mom, Chicago',
    notes: [
      { label: 'natural mint', description: 'refreshing · cooling · invigorating', image: '/Images/Products/CUTE/cutebits.png' },
      { label: 'xylitol', description: 'tooth-friendly · natural sweetener', image: '/Images/Products/CUTE/cutepowder.png' },
      { label: 'aloe vera', description: 'soothing · gentle · healing', image: '/Images/Products/CUTE/cutebits.png' },
    ],
    reviewList: [
      { id: 1, name: 'Jennifer K.', initials: 'JK', avatarColor: '#d4b896', rating: 5, date: '05/22/24', title: 'KIDS LOVE IT!', body: 'Finally a formula my kids actually want to use! The cute packaging and mild mint flavour make their morning routine so much easier.', helpful: 0, notHelpful: 0, verified: true },
      { id: 2, name: 'Maria S.', initials: 'MS', avatarColor: '#b8c9a3', rating: 5, date: '04/18/24', title: 'GENTLE ON SENSITIVE GUMS', body: "I've always struggled with sensitive gums, but this alcohol-free formula is amazing. No burning sensation, just fresh breath.", helpful: 0, notHelpful: 0, verified: true },
      { id: 3, name: 'Robert T.', initials: 'RT', avatarColor: '#c9b0b0', rating: 4, date: '03/30/24', title: 'GOOD VALUE', body: "Great value for money and the natural ingredients make me feel good about what I'm giving my family.", helpful: 0, notHelpful: 0, verified: true },
      { id: 4, name: 'Sarah L.', initials: 'SL', avatarColor: '#a8bfd4', rating: 5, date: '02/14/24', title: 'ECO-FRIENDLY PACKAGING', body: "Love that it's good for the planet too. The product works great!", helpful: 3, notHelpful: 0, verified: true },
      { id: 5, name: 'Amanda P.', initials: 'AP', avatarColor: '#d4c4a8', rating: 5, date: '01/25/24', title: 'FRESH BREATH ALL DAY', body: 'I use this twice a day and my breath stays fresh literally all day. Highly recommend!', helpful: 2, notHelpful: 0, verified: true },
    ],
  },
  smarts: {
    id: 4,
    name: 'Denta Smarts',
    category: 'SMARTS',
    price: 55.00,
    rating: 4.9,
    reviewCount: 312,
    description: 'Introducing Denta Smarts - our intelligent enamel protection serum that uses advanced nanotechnology to repair and strengthen weakened tooth enamel. Formulated with dentists and backed by clinical studies, this powerful daily treatment reverses early signs of decay, reduces sensitivity, and creates a protective barrier that lasts up to 12 hours.',
    variants: ['Original', 'Sensitive'],
    variantLabel: 'Formula',
    images: [
      '/Images/Products/Smarts/Prime.png',
    ],
    accordion: {
      details: 'Denta Smarts uses nano-hydroxyapatite technology to actively remineralise and repair tooth enamel at the microscopic level.',
      ingredients: 'AQUA (WATER), NANO-HYDROXYAPATITE, XYLITOL, GLYCERIN, SODIUM FLUORIDE, POTASSIUM NITRATE, CARRAGEENAN, SODIUM BENZOATE, SPEARMINT OIL.',
      'how-to-use': ['Apply a small amount to a clean toothbrush', 'Brush gently for 2 minutes', 'Spit and leave residue for 5 minutes before rinsing', 'Use twice daily morning and night'],
    },
    sectionImage: '/Images/Products/Smarts/Prime.png',
    sectionTitle: ['Science you can', 'trust for your smile'],
    sectionBody: 'Developed over 8 years with leading dental researchers, Denta Smarts represents the cutting edge of at-home dental care. Our proprietary nanotechnology actively repairs damaged enamel, blocks sensitivity, and prevents future decay.',
    postcardImage: '/Images/Products/Smarts/Prime.png',
    postcardTitle: ['Stories From', 'our users'],
    postcardBody: 'Thousands of dentists and patients across the world have made Denta Smarts part of their daily routine. Real people, real results — backed by 5 clinical studies with over 2,000 participants.',
    postcardQuote: '"My dentist couldn\'t believe the improvement in my enamel health in just 6 months." — Sarah M., Verified User',
    notes: [
      { label: 'nano-hydroxyapatite', description: 'mineral restoration · enamel rebuilding', image: '/Images/Products/Smarts/Prime.png' },
      { label: 'fluoride-free', description: 'safe · natural · effective', image: '/Images/Products/Smarts/Prime.png' },
      { label: 'xylitol enriched', description: 'cavity prevention · pH balancing', image: '/Images/Products/Smarts/Prime.png' },
    ],
    reviewList: [
      { id: 1, name: 'Dr. James K.', initials: 'JK', avatarColor: '#d4b896', rating: 5, date: '05/15/24', title: 'DENTIST APPROVED!', body: 'As a practicing dentist, I can confidently say this product is revolutionary. My patients show measurable improvement in enamel strength after just 3 months.', helpful: 24, notHelpful: 0, verified: true },
      { id: 2, name: 'Lisa M.', initials: 'LM', avatarColor: '#b8c9a3', rating: 5, date: '04/28/24', title: 'SENSITIVITY GONE!', body: "I've suffered from severe tooth sensitivity for years. After using Denta Smarts for 6 weeks, my sensitivity is completely gone. Life changing!", helpful: 18, notHelpful: 0, verified: true },
      { id: 3, name: 'Robert T.', initials: 'RT', avatarColor: '#c9b0b0', rating: 5, date: '03/20/24', title: 'MY DENTIST WAS IMPRESSED', body: 'During my last checkup, my dentist asked what I was doing differently - early cavity signs had reversed.', helpful: 12, notHelpful: 0, verified: true },
      { id: 4, name: 'Sarah L.', initials: 'SL', avatarColor: '#a8bfd4', rating: 5, date: '02/10/24', title: 'CLINICALLY PROVEN', body: "After 6 months of use, I'm a believer. My enamel feels stronger than ever.", helpful: 9, notHelpful: 0, verified: true },
      { id: 5, name: 'Amanda P.', initials: 'AP', avatarColor: '#d4c4a8', rating: 4, date: '01/05/24', title: 'EFFECTIVE, BUT PRICY', body: "This product definitely works - my dentist noticed the difference immediately. It pays for itself in reduced dental bills.", helpful: 5, notHelpful: 1, verified: true },
    ],
  },
};

const FAQ_ITEMS = [
  { key: 'dental-nutrition', question: 'What does Dental Nutrition mean?', answer: 'Dental Nutrition means oral care in an edible form. It is the science of using nutrients to support teeth, gums, and oral microbiome health. Our products are designed to nourish and protect the mouth, beyond just brushing and flossing.' },
  { key: 'teeth-nutrition', question: 'Why do teeth need nutrition?', answer: 'Teeth and gums are living tissues that need nutrients to stay strong, resist decay, and recover from everyday damage. Targeted nutrition helps maintain enamel strength, gum health, and overall oral balance.' },
  { key: 'vs-brushing', question: 'How does Dental nutrition differ from brushing?', answer: 'Brushing works for only 1-2 minutes, leaving the mouth unprotected for the rest of the day. Dental Nutrition helps maintain a stable, healthy oral environment for the remaining 23 hours and 58 minutes.' },
  { key: 'hetafu-better', question: 'Why are Hetafu products better than other oral care products?', answer: "Hetafu is the world's first Dental Nutrition approach, offering edible oral care that nourishes teeth, gums, and the oral microbiome. Unlike regular oral care products that kill both good and bad bacteria, Hetafu selectively reduces harmful microbes within 1 minute while supporting beneficial ones." },
  { key: 'replace-brushing', question: 'Does Dental Nutrition replace brushing and flossing?', answer: "No, it doesn't replace them. Dental Nutrition works alongside brushing and flossing to provide all-day protection, microbiome balance, and targeted oral support that regular cleaning cannot offer." },
];

const REVIEWS_PER_PAGE = 5;

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

function DecadeSection({ product }) {
  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-10 py-12 md:py-20 bg-[#fdf8f4]" style={{ fontFamily: 'var(--font-sans)', color: 'var(--primary-brown)' }}>
      {/* Original desktop layout preserved, only mobile responsiveness added */}
      <div className="hidden lg:grid grid-cols-2" style={{ gridTemplateRows: 'auto auto' }}>
        <div className="relative">
          <img src={product.sectionImage} alt={product.name} className="w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center pl-30">
          <h2 className="text-5xl font-light mb-2" style={{ fontFamily: '"Futura BT Book", sans-serif', letterSpacing: '-0.02em' }}>{product.sectionTitle[0]}</h2>
          <p className="text-5xl italic font-light mb-8" style={{ fontFamily: 'var(--font-signature)', color: '#1998B1', letterSpacing: '-0.02em' }}>{product.sectionTitle[1]}</p>
          <div className="w-12 h-0.5 bg-[#d4c5b2] mb-8"></div>
          <p className="text-sm leading-relaxed text-[#554433] mb-8 max-w-md" style={{ lineHeight: '1.7' }}>{product.sectionBody}</p>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#401E17] mb-4" style={{ letterSpacing: '0.12em' }}>Be Transported</p>
        </div>
        <div className="relative pt-4" style={{ height: '640px' }}>
          <div className="absolute flex items-start gap-6" style={{ top: 0, left: 0, transform: 'rotate(-7deg)' }}>
            <div className="bg-white shadow-md flex-shrink-0" style={{ width: '280px', padding: '10px' }}>
              <img src={product.notes[0].image} alt={product.notes[0].label} className="w-full aspect-square object-cover" />
            </div>
            <div className="pt-8">
              <p className="text-center mb-2" style={{ fontFamily: 'var(--font-signature)', fontSize: '2.7rem', color: 'var(--secondary-blue)' }}>{product.notes[0].label}</p>
              {product.notes[0].description.split(' · ').map((line, i) => (
                <p key={i} className="text-center leading-relaxed m-0" style={{ fontSize: '13px' }}>{line}</p>
              ))}
            </div>
          </div>
          <div className="absolute flex items-start gap-6" style={{ top: '220px', left: '420px', transform: 'rotate(-8deg)' }}>
            <div className="bg-white shadow-md flex-shrink-0" style={{ width: '280px', padding: '10px' }}>
              <img src={product.notes[2].image} alt={product.notes[2].label} className="w-full aspect-square object-cover" />
            </div>
            <div className="pt-2">
              <p className="text-center mb-2" style={{ fontFamily: 'var(--font-signature)', fontSize: '2.7rem', color: 'var(--secondary-blue)' }}>{product.notes[2].label}</p>
              {product.notes[2].description.split(' · ').map((line, i) => (
                <p key={i} className="text-center leading-relaxed m-0" style={{ fontSize: '13px' }}>{line}</p>
              ))}
            </div>
          </div>
          <div className="absolute flex items-start gap-6" style={{ top: '430px', left: 0, transform: 'rotate(3deg)' }}>
            <div className="bg-white shadow-md flex-shrink-0" style={{ width: '280px', padding: '10px' }}>
              <img src={product.notes[1].image} alt={product.notes[1].label} className="w-full aspect-square object-cover" />
            </div>
            <div className="pt-2">
              <p className="text-center mb-2" style={{ fontFamily: 'var(--font-signature)', fontSize: '2.7rem', color: 'var(--secondary-blue)' }}>{product.notes[1].label}</p>
              {product.notes[1].description.split(' · ').map((line, i) => (
                <p key={i} className="text-center leading-relaxed m-0" style={{ fontSize: '13px' }}>{line}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-start relative justify-end">
          <div className="bg-white shadow-md absolute hover:shadow-lg transition-all" style={{ width: '550px', left: '220px', transform: 'rotate(10deg)', padding: '14px' }}>
            <img src={product.postcardImage} alt={product.name} className="w-full h-[500px] object-cover rounded-sm" />
            <p className="text-center mt-4 pr-1" style={{ fontFamily: 'var(--font-signature)', fontSize: '3.4rem' }}>key benefits</p>
          </div>
        </div>
      </div>
      {/* Mobile-specific layout that doesn't affect desktop */}
      <div className="lg:hidden grid grid-cols-1 gap-8">
        <div className="relative">
          <img src={product.sectionImage} alt={product.name} className="w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center px-4">
          <h2 className="text-3xl font-light mb-2" style={{ fontFamily: '"Futura BT Book", sans-serif', letterSpacing: '-0.02em' }}>{product.sectionTitle[0]}</h2>
          <p className="text-3xl italic font-light mb-8" style={{ fontFamily: 'var(--font-signature)', color: '#1998B1', letterSpacing: '-0.02em' }}>{product.sectionTitle[1]}</p>
          <div className="w-12 h-0.5 bg-[#d4c5b2] mb-8"></div>
          <p className="text-sm leading-relaxed text-[#554433] mb-8 max-w-md" style={{ lineHeight: '1.7' }}>{product.sectionBody}</p>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#401E17] mb-4" style={{ letterSpacing: '0.12em' }}>Be Transported</p>
        </div>
        <div className="relative pt-4" style={{ minHeight: '800px' }}>
            <div className="absolute flex items-start gap-4" style={{ top: '20px', left: '10px', transform: 'rotate(-7deg)' }}>
              <div className="bg-white shadow-md flex-shrink-0" style={{ width: '220px', padding: '10px' }}>
                <img src={product.notes[0].image} alt={product.notes[0].label} className="w-full aspect-square object-cover" />
              </div>
              <div className="pt-8">
                <p className="text-center mb-2" style={{ fontFamily: 'var(--font-signature)', fontSize: '2rem', color: 'var(--secondary-blue)' }}>{product.notes[0].label}</p>
                {product.notes[0].description.split(' · ').map((line, i) => (
                  <p key={i} className="text-center leading-relaxed m-0" style={{ fontSize: '12px' }}>{line}</p>
                ))}
              </div>
            </div>
            <div className="absolute flex items-start gap-4" style={{ top: '350px', left: '30%', transform: 'rotate(-8deg)' }}>
              <div className="bg-white shadow-md flex-shrink-0" style={{ width: '200px', padding: '10px' }}>
                <img src={product.notes[2].image} alt={product.notes[2].label} className="w-full aspect-square object-cover" />
              </div>
              <div className="pt-2">
                <p className="text-center mb-2" style={{ fontFamily: 'var(--font-signature)', fontSize: '1.8rem', color: 'var(--secondary-blue)' }}>{product.notes[2].label}</p>
                {product.notes[2].description.split(' · ').map((line, i) => (
                  <p key={i} className="text-center leading-relaxed m-0" style={{ fontSize: '11px' }}>{line}</p>
                ))}
              </div>
            </div>
            <div className="absolute flex items-start gap-4" style={{ top: '580px', left: '20px', transform: 'rotate(3deg)' }}>
              <div className="bg-white shadow-md flex-shrink-0" style={{ width: '200px', padding: '10px' }}>
                <img src={product.notes[1].image} alt={product.notes[1].label} className="w-full aspect-square object-cover" />
              </div>
              <div className="pt-2">
                <p className="text-center mb-2" style={{ fontFamily: 'var(--font-signature)', fontSize: '1.8rem', color: 'var(--secondary-blue)' }}>{product.notes[1].label}</p>
                {product.notes[1].description.split(' · ').map((line, i) => (
                  <p key={i} className="text-center leading-relaxed m-0" style={{ fontSize: '11px' }}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        <div className="flex items-start relative justify-center" style={{ minHeight: '450px' }}>
          <div className="bg-white shadow-md absolute hover:shadow-lg transition-all" style={{ width: '90%', transform: 'rotate(5deg)', padding: '14px' }}>
            <img src={product.postcardImage} alt={product.name} className="w-full h-auto object-cover rounded-sm" />
            <p className="text-center mt-4 pr-1" style={{ fontFamily: 'var(--font-signature)', fontSize: '2.5rem' }}>key benefits</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PostcardsSection({ product }) {
  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-10 py-12 md:py-20 bg-[#fdf8f4] text-[#401E17]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-15 items-center">
        <div className="relative w-full order-2 lg:order-none" style={{ minHeight: '320px', height: 'auto' }}>
          <img src={product.postcardImage} alt={product.postcardTitle[0]} className="w-full h-auto object-cover" />
        </div>
        <div className="flex flex-col px-4 lg:pl-5 order-1 lg:order-none">
          <h2 className="text-3xl md:text-5xl font-light text-[#401E17] leading-tight mb-1 tracking-tight">{product.postcardTitle[0]}</h2>
          <p className="text-3xl md:text-5xl italic font-light text-[#1998B1] mb-6 tracking-tight" style={{ fontFamily: 'var(--font-signature)' }}>{product.postcardTitle[1]}</p>
          <div className="w-12 h-0.5 bg-[#1998B1] mb-7"></div>
          <p className="text-sm leading-[1.9] text-[#554433] font-light max-w-sm mb-8">{product.postcardBody}</p>
          <blockquote className="border-l-[3px] border-[#1998B1] pl-5 max-w-md">
            <p className="text-base leading-[1.8] text-[#401E17] font-light mb-3 italic">{product.postcardQuote}</p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

function ReviewsSection({ product }) {
  const allReviews = product.reviewList;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('verified');
  const [filterRating, setFilterRating] = useState('all');
  const [helpfulMap, setHelpfulMap] = useState({});
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [formData, setFormData] = useState({ rating: 0, title: '', review: '', name: '', email: '', agreeTerms: false });

  const filteredReviews = allReviews.filter(r => filterRating === 'all' ? true : r.rating === parseInt(filterRating));
  const sortedReviews = [...filteredReviews].sort((a, b) => { if (sortBy === 'highest') return b.rating - a.rating; if (sortBy === 'lowest') return a.rating - b.rating; return 0; });
  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = sortedReviews.slice((currentPage - 1) * REVIEWS_PER_PAGE, currentPage * REVIEWS_PER_PAGE);
  const overallRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1);

  const handleHelpful = (id, type) => setHelpfulMap(prev => ({ ...prev, [id]: prev[id] === type ? null : type }));
  const handlePageChange = (page) => { setCurrentPage(page); document.getElementById('reviews-section-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const handleInputChange = (e) => { const { name, value, type, checked } = e.target; setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value })); };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) { alert('Please agree to the Privacy Policy and Terms and Conditions'); return; }
    alert('Thank you for your review!');
    setIsReviewModalOpen(false);
    setFormData({ rating: 0, title: '', review: '', name: '', email: '', agreeTerms: false });
  };

  return (
        <section id="reviews-section-anchor" className="max-w-[1400px] mx-auto" style={{ position: 'relative', paddingTop: '100px' }}>
      {isReviewModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsReviewModalOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[#401E17]">Share your experience</h2>
                <button onClick={() => setIsReviewModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#401E17] mb-2">Rate your experience *</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} type="button" onClick={() => setFormData(prev => ({ ...prev, rating: star }))}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill={star <= formData.rating ? '#1998B1' : '#e8ddd0'}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-[#401E17] mb-2">A short title for your review *</label>
                  <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-4 py-2 border border-[#d4c5b2] rounded focus:outline-none focus:ring-2 focus:ring-[#1998B1]" />
                </div>
                <div>
                  <label htmlFor="review" className="block text-sm font-medium text-[#401E17] mb-2">Write your review *</label>
                  <textarea id="review" name="review" value={formData.review} onChange={handleInputChange} required rows="4" className="w-full px-4 py-2 border border-[#d4c5b2] rounded focus:outline-none focus:ring-2 focus:ring-[#1998B1]" />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#401E17] mb-2">Your name *</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-2 border border-[#d4c5b2] rounded focus:outline-none focus:ring-2 focus:ring-[#1998B1]" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#401E17] mb-2">Your email address *</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-2 border border-[#d4c5b2] rounded focus:outline-none focus:ring-2 focus:ring-[#1998B1]" />
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="agreeTerms" name="agreeTerms" checked={formData.agreeTerms} onChange={handleInputChange} required className="mt-1" />
                  <label htmlFor="agreeTerms" className="text-sm text-[#401E17]">By submitting this review, I agree to the <a href="#" className="text-[#1998B1] underline">Privacy Policy</a> and <a href="#" className="text-[#1998B1] underline">Terms and Conditions</a> *</label>
                </div>
                <button type="submit" className="w-full py-3 bg-[var(--primary-brown)] text-white font-semibold uppercase tracking-wider rounded hover:bg-[#5a2e24] transition-all">Send</button>
              </form>
            </div>
          </div>
        </>
      )}
      <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginTop: '-30px' }}>
        <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
          <img src="https://cdn.shopify.com/s/files/1/0178/3798/1796/files/footer_plants.png" alt="decorative plants" style={{ height: '150px', width: 'auto', display: 'block' }} />
        </div>
        <svg className="w-full" viewBox="0 0 1400 80" preserveAspectRatio="none" style={{ display: 'block', position: 'relative', zIndex: 2, height: '100px' }}>
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#fdf8f4', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: 'var(--color-background)', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path d="M0,40 Q350,15 700,40 T1400,40 L1400,80 L0,80 Z" fill="url(#waveGradient)" stroke="none"/>
        </svg>
        <div style={{ position: 'absolute', top: '-70px', left: '50%', transform: 'translateX(-50%)', zIndex: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="https://cdn.shopify.com/s/files/1/0178/3798/1796/files/tiger_head.png" alt="tiger head" style={{ width: '280px', height: 'auto', marginBottom: '-30px' }} />
        </div>
        <div style={{ position: 'absolute', top: '26px', left: '50%', transform: 'translateX(-50%)', zIndex: 4, display: 'flex', gap: '90px' }}>
          <img src="https://cdn.shopify.com/s/files/1/0178/3798/1796/files/left_leg.png" alt="tiger left paw" style={{ width: '75px', height: 'auto' }} />
          <img src="https://cdn.shopify.com/s/files/1/0178/3798/1796/files/right_leg.png" alt="tiger right paw" style={{ width: '75px', height: 'auto' }} />
        </div>
      </div>
      <div className="px-4 md:px-10 py-12 md:py-20">
        <style>{`
          @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          .review-card-anim { animation: fadeSlideUp 0.35s ease both; }
          .review-card-anim:nth-child(1) { animation-delay: 0.0s; }
          .review-card-anim:nth-child(2) { animation-delay: 0.05s; }
          .review-card-anim:nth-child(3) { animation-delay: 0.10s; }
          .review-card-anim:nth-child(4) { animation-delay: 0.15s; }
          .review-card-anim:nth-child(5) { animation-delay: 0.20s; }
        `}</style>
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <span className="text-3xl md:text-4xl lg:text-5xl font-light text-[#401E17] leading-tight">{overallRating}</span>
            <div>
              <StarRow rating={Math.round(parseFloat(overallRating))} size={18} />
              <p className="text-xs text-[#887766] tracking-widest uppercase mt-1">Based on {product.reviewCount} reviews</p>
            </div>
          </div>
          <button onClick={() => setIsReviewModalOpen(true)} className="inline-flex cursor-pointer items-center gap-2 px-5 py-2.5 bg-[var(--primary-brown)] text-white border-none rounded text-xs font-semibold tracking-wider uppercase transition-all hover:bg-[#5a2e24]">
            <Edit3 size={13} /> Write a Review
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-6 border-b border-[#e8ddd0]">
          <select className="appearance-none bg-white border border-[#d4c5b2] rounded px-3.5 py-2 text-xs tracking-widest uppercase text-[#401E17] cursor-pointer" value={filterRating} onChange={e => { setFilterRating(e.target.value); setCurrentPage(1); }}>
            <option value="all">All Ratings</option>
            {[5,4,3,2,1].map(s => <option key={s} value={s}>{s} Stars</option>)}
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
              <div className="review-card-anim py-7 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 md:gap-6">
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
                  <div className="flex flex-wrap items-center gap-4">
                    {review.verified && <span className="text-xs text-[#a08862] tracking-wider uppercase flex items-center gap-1"><svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#a08862" strokeWidth={2.5}><polyline points="20 6 9 17 4 12"/></svg>Was this helpful?</span>}
                    <button className={`inline-flex items-center gap-1.5 border rounded px-2.5 py-1 text-xs tracking-wider uppercase transition-all ${helpfulMap[review.id] === 'up' ? 'bg-[#401E17] text-[#fdf8f4] border-[#401E17]' : 'border-[#e8ddd0] text-[#887766] hover:border-[#a08862]'}`} onClick={() => handleHelpful(review.id, 'up')}><ThumbsUp size={10} />{review.helpful + (helpfulMap[review.id] === 'up' ? 1 : 0)}</button>
                    <button className={`inline-flex items-center gap-1.5 border rounded px-2.5 py-1 text-xs tracking-wider uppercase transition-all ${helpfulMap[review.id] === 'down' ? 'bg-[#401E17] text-[#fdf8f4] border-[#401E17]' : 'border-[#e8ddd0] text-[#887766] hover:border-[#a08862]'}`} onClick={() => handleHelpful(review.id, 'down')}><ThumbsDown size={10} />{review.notHelpful + (helpfulMap[review.id] === 'down' ? 1 : 0)}</button>
                  </div>
                </div>
              </div>
              {idx < paginatedReviews.length - 1 && <hr className="border-none border-t border-[#f0e8df]" />}
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-12 pt-8 border-t border-[#e8ddd0]">
            <button className="w-8.5 h-8.5 inline-flex cursor-pointer items-center justify-center text-xs font-medium transition-all hover:bg-[#401E17] hover:text-[#fdf8f4] disabled:opacity-35 disabled:cursor-default" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft size={14} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} className={`w-8.5 h-8.5 cursor-pointer inline-flex items-center justify-center text-xs font-medium transition-all ${currentPage === page ? 'bg-[#401E17] text-[#fdf8f4]' : 'border border-[#d4c5b2] hover:bg-[#401E17] hover:text-[#fdf8f4]'}`} onClick={() => handlePageChange(page)}>{page}</button>
            ))}
            <button className="w-8.5 h-8.5 cursor-pointer inline-flex items-center justify-center text-xs font-medium transition-all hover:bg-[#401E17] hover:text-[#fdf8f4] disabled:opacity-35 disabled:cursor-default" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}><ChevronRight size={14} /></button>
          </div>
        )}
      </div>
    </section>
  );
}

export default function ProductPage({ params }) {
  const product = ALL_PRODUCTS[params.slug];
  if (!product) return notFound();

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [thumbStart, setThumbStart] = useState(0);
  const [openAccordion, setOpenAccordion] = useState('dental-nutrition');

  const VISIBLE = 5;

  const { addItem } = useCart();
  const { currency } = useCountry();

  const handleAddToBag = () => {
    addItem({ id: product.id, name: product.name, variant: selectedVariant, price: product.price, originalPrice: null, qty: quantity, promo: null, image: product.images[0] });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 py-6 md:px-8 md:py-8" style={{ fontFamily: 'var(--font-sans)', backgroundColor: 'var(--background-color)', color: 'var(--primary-brown)' }}>
          <div className="flex items-center gap-2 mb-3 text-sm uppercase tracking-wider" style={{ color: 'var(--primary-brown)' }}>
            <Link href="/" className="no-underline font-bold transition-colors hover:text-amber-700">HOME</Link>
            <span className="mx-1">&gt;</span>
            <span className="font-bold">{product.name.toUpperCase()} {product.category.toUpperCase()}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 mt-8 md:mt-12" style={{ alignItems: 'start' }}>
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Thumbnails hidden on mobile, only visible on lg screens and above */}
              <div className="hidden lg:flex flex-col items-center gap-2 flex-shrink-0" style={{ width: '98px' }}>
                <button onClick={() => setThumbStart(s => Math.max(0, s - 1))} disabled={thumbStart === 0} className="w-full py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-30">↑</button>
                {product.images.slice(thumbStart, thumbStart + VISIBLE).map((thumbnail, index) => (
                  <div key={thumbStart + index} onClick={() => setMainImage(thumbnail)} className={`flex-shrink-0 cursor-pointer overflow-hidden border-2 bg-amber-50 transition-all hover:border-amber-600 ${mainImage === thumbnail ? 'border-amber-700' : 'border-gray-200'}`}>
                    <Image src={thumbnail} alt={`${product.name} ${thumbStart + index + 1}`} width={88} height={100} unoptimized className="w-full h-full object-cover" />
                  </div>
                ))}
                <button onClick={() => setThumbStart(s => Math.min(product.images.length - VISIBLE, s + 1))} disabled={thumbStart + VISIBLE >= product.images.length} className="w-full py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-30">↓</button>
              </div>
              {/* Main product image - fully responsive for all screens */}
              <div className="w-full bg-amber-50 lg:flex-1 lg:min-w-0">
                <Image 
                  src={mainImage} 
                  alt={product.name} 
                  width={423} 
                  height={580} 
                  priority 
                  unoptimized 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-4xl md:text-[clamp(1.5rem,4vw,2.5rem)] font-bold italic tracking-wide m-0" style={{ color: 'var(--secondary-blue)', fontFamily: 'var(--font-signature)' }}>{product.name}</h1>
              <p className="text-base m-0 capitalize" style={{ color: '#554433' }}>{product.category}</p>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-2xl md:text-[clamp(1.25rem,3vw,1.75rem)] font-bold">{currency}{product.price.toFixed(2)}</span>
                  <span className="text-sm font-semibold uppercase tracking-wider">{product.variantLabel}: {selectedVariant}</span>
                </div>
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity" onClick={() => document.getElementById('reviews-section-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                  <StarRow rating={Math.round(product.rating)} size={18} />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-sm" style={{ color: '#554433' }}>{product.reviewCount} reviews</span>
                </div>
              </div>
              <p className="leading-relaxed m-0 text-base">{product.description}</p>
              <div className="flex flex-wrap gap-3 mt-6">
                {product.variants.map((variant) => (
                  <button key={variant} onClick={() => setSelectedVariant(variant)} className="px-4 py-2 rounded text-sm font-medium transition-all cursor-pointer" style={{ color: selectedVariant === variant ? 'var(--primary-brown)' : '#401E17', border: '2px solid', borderColor: selectedVariant === variant ? 'var(--secondary-blue)' : 'transparent' }}>{variant}</button>
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-8">
                <label className="text-sm font-bold tracking-wider">QUANTITY</label>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <div className="flex border-1 rounded overflow-hidden shrink-0" style={{ borderColor: 'var(--secondary-blue)', height: '56px', minWidth: '140px', width: '100%', maxWidth: '180px' }}>
                    <button className="w-10 p-2 border-none cursor-pointer text-xl transition-colors hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0" style={{ backgroundColor: '#fff', color: '#401E17' }} onClick={() => quantity > 1 && setQuantity(quantity - 1)} disabled={quantity === 1}>−</button>
                    <input type="text" value={quantity} readOnly className="flex-1 border-none border-x text-center text-base focus:outline-none min-w-0" style={{ borderColor: 'var(--secondary-blue)', color: '#401E17', cursor: 'default' }} />
                    <button className="w-10 p-2 border-none cursor-pointer text-xl transition-colors hover:bg-amber-50 flex items-center justify-center shrink-0" style={{ backgroundColor: '#fff', color: '#401E17' }} onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                  <button className="flex-1 p-4 border-1 rounded text-base font-bold uppercase tracking-wider cursor-pointer transition-colors w-full sm:w-auto" style={{ height: '56px', borderColor: 'var(--secondary-blue)', color: 'var(--primary-brown)' }} onClick={handleAddToBag}>ADD TO BAG</button>
                </div>
              </div>
              <div className="mt-8 pt-8">
                {['details', 'ingredients', 'how-to-use'].map((key) => (
                  <div key={key} className="border-b" style={{ borderColor: '#d4c5b2' }}>
                    <button className="w-full flex items-center justify-between py-4 text-left" onClick={() => setOpenAccordion(openAccordion === key ? null : key)}>
                      <span className="text-base font-semibold uppercase tracking-wider">{key === 'how-to-use' ? 'How to Use' : key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${openAccordion === key ? 'rotate-180' : ''}`} style={{ color: '#554433' }} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openAccordion === key ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                      {key === 'how-to-use'
                        ? <ul className="leading-relaxed text-sm list-disc pl-4" style={{ color: '#554433' }}>{product.accordion['how-to-use'].map((step, i) => <li key={i}>{step}</li>)}</ul>
                        : <p className="leading-relaxed text-sm" style={{ color: '#554433' }}>{product.accordion[key]}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <h1 className="text-3xl md:text-[clamp(2.5rem,4vw,3.5rem)] font-bold tracking-wide text-center m-0 mb-12" style={{ color: 'var(--secondary-blue)', fontFamily: 'var(--font-signature)' }}>faq</h1>
          <div>
            {FAQ_ITEMS.map((faq) => (
              <div key={faq.key} className="border-b" style={{ borderColor: '#d4c5b2' }}>
                <button className="w-full flex items-center justify-between py-4 text-left" onClick={() => setOpenAccordion(openAccordion === faq.key ? null : faq.key)}>
                  <span className="text-sm md:text-base font-semibold uppercase tracking-wider">{faq.question}</span>
                  <ChevronDown className={`w-6 h-6 transition-transform duration-300 flex-shrink-0 ${openAccordion === faq.key ? 'rotate-180' : ''}`} style={{ color: '#554433' }} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === faq.key ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                  <p className="leading-relaxed text-sm" style={{ color: '#554433' }}>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DecadeSection product={product} />
        <PostcardsSection product={product} />
        <ReviewsSection product={product} />
      </main>
      <BestSellers />
      <Footer />
    </div>
  );
}