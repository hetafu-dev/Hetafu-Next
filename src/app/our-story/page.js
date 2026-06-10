'use client';

import { useState } from 'react';
import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";

const slides = [
  {
    title: 'Uncompromising On Care',
    text: 'Looking good is just the start. Helping you achieve soft, touchable hair and skin is our ultimate priority—one of the many reasons we include argan oil in every single one of our products.',
  },
  {
    title: 'Rooted In Nature',
    text: "Every formula begins with argan oil—nature's liquid gold. Rich in antioxidants, fatty acids, and vitamin E, it nourishes deeply while delivering visible results.",
  },
  {
    title: 'Crafted With Purpose',
    text: 'From formulation to packaging, every decision is made with intention. We believe beauty should be both effective and responsible.',
  },
];

export default function OurStoryPage() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-background font-sans text-primary-brown">
        {/* Section 1 — Hero with overlay text */}
        <section className="relative w-full h-[70vh] overflow-hidden">
          <img
            src="https://uk.moroccanoil.com/cdn/shop/files/os1.webp?v=1684219765&width=2880"
            alt="Behind The Brand"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-10 flex items-center h-full px-12 md:px-20">
            <div className="max-w-xs text-white">
              <h1 className="text-3xl md:text-4xl font-light mb-5">Behind The Brand</h1>
              <p className="text-sm leading-7">
                As pioneers in argan oil-infused beauty, our passion is to create luxurious beauty
                products that inspire confidence and empower individuality.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 — How It Started + image + The Brand Today */}
        <section className="bg-background">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 px-12 md:px-20 py-16">
              <h2 className="text-3xl font-light">How It Started</h2>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://uk.moroccanoil.com/cdn/shop/files/D2314A-MO.Com_Category_Shopify-Launch_Desktop_Oil.jpg?v=1695212663&width=1440"
                alt="How It Started"
                className="w-full h-[480px] object-cover"
              />
            </div>
          </div>
          <div className="text-center px-6 py-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-light mb-6">The Brand Today</h2>
            <p className="text-sm leading-8 text-slate-600">
              What began a decade ago as a single, revolutionary product that pioneered a new category in the beauty
              industry has grown into a full line of hair and body products, all infused with nourishing, antioxidant-rich argan oil.
            </p>
          </div>
        </section>

        {/* Section 3 — Our Promises slider */}
        <section>
          <div className="relative z-10 flex items-center justify-center h-full px-12 md:px-20 bg-background">
            <h2 className="text-3xl font-light text-center pb-6">Our Promises</h2>
          </div>
          <div className="relative w-full h-[60vh] overflow-hidden">
            <img
              src="https://uk.moroccanoil.com/cdn/shop/files/os7.webp?v=1684219925&width=1440"
              alt="Our Promises"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative z-10 flex items-center h-full px-12 md:px-20">
              <div className="max-w-sm text-white">
                <h3 className="text-2xl md:text-3xl font-light mb-4">{slides[current].title}</h3>
                <p className="text-sm leading-7">{slides[current].text}</p>
              </div>
            </div>
            <button
              onClick={() => setCurrent((current + 1) % slides.length)}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full border border-white flex items-center justify-center text-white hover:bg-white/20 transition"
              aria-label="Next"
            >
              ›
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition ${i === current ? 'bg-white' : 'bg-white/40'}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <BestSellers />
      <Footer />
    </div>
  );
}
