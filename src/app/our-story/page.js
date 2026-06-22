'use client';

import { useState } from 'react';
import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";

const slides = [
  {
    title: 'Health',
    text: 'Backed by science and clinical research. Every product is formulated with proven ingredients.',
  },
  {
    title: 'Taste',
    text: 'Pleasant enough for daily use. No harsh chemicals or bitter aftertastes.',
  },
  {
    title: 'Fun',
    text: 'So oral care becomes a habit, not a task. Making dental nutrition enjoyable for everyone.',
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
            <div className="max-w-xl text-white">
              <h1 className="text-3xl md:text-6xl text-primary-brown font-bold mb-5">Our Story</h1>
              <p className="text-md leading-7 text-secondary-blue">
                Why Hetafu Was Created
              </p>
              <p className="text-sm leading-7 mt-4 text-primary-brown">
                Our journey began with a simple but troubling observation. Despite brushing, flossing, and repeated dental treatments, millions of people continue to suffer from dental problems. Families spend heavily on care, patients return again and again, yet long term oral health rarely improves.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 — How It Started + image + The Brand Today */}
        <section className="bg-background">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 px-12 md:px-20 py-16">
              <h2 className="text-3xl font-light">How It Started</h2>
              <p className="text-sm leading-8 text-slate-600 mt-4">
                With over 30 years of combined experience in health and nutrition research, we had worked on nutritional solutions for many parts of the body. But one area stood out as completely neglected: the mouth.
              </p>
              <p className="text-sm leading-8 text-slate-600 mt-4">
                Oral care was focused on cleaning, repairing, and treating but not on nourishing.
              </p>
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
            <h2 className="text-3xl font-light mb-6">Our Research & Experience</h2>
          </div>

          {/* What the Data Revealed - Left Image, Right Content */}
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2">
              <img
                src="https://uk.moroccanoil.com/cdn/shop/files/D2314A-MO.Com_Category_Shopify-Launch_Desktop_Oil.jpg?v=1695212663&width=1440"
                alt="What the Data Revealed"
                className="w-full h-[480px] object-cover"
              />
            </div>
            <div className="md:w-1/2 px-12 md:px-20 py-16">
              <h3 className="text-2xl font-light mb-6">What the Data Revealed</h3>
              <p className="text-sm leading-8 text-slate-600 mb-6">
                As researchers, we looked deeper into global oral health data and clinical outcomes. The findings were clear:
              </p>
              <ul className="text-sm leading-8 text-slate-600 mb-6 space-y-2">
                <li>• Over 3.2 billion people live with untreated dental conditions</li>
                <li>• More than 530 million children already suffer from dental disease</li>
                <li>• Nearly 1 billion children are at risk of losing their teeth early</li>
              </ul>
              <p className="text-sm leading-8 text-slate-600 italic">
                These are not just numbers. They represent pain, repeated treatments, and declining quality of life.
              </p>
              <p className="text-sm leading-8 text-slate-600 mt-6">
                We realized the problem was not effort it was approach.
              </p>
            </div>
          </div>

          {/* The Gap We Found - Right Image, Left Content */}
          <div className="flex flex-col md:flex-row items-center bg-background">
            <div className="md:w-1/2 px-12 md:px-20 py-16">
              <h3 className="text-2xl font-light mb-6">The Gap We Found in Oral Care</h3>
              <p className="text-sm leading-8 text-slate-600 mb-6">
                Teeth, gums, and oral tissues are living structures. Like bones, muscles, and skin, they require specific nutrients to stay strong and resilient.
              </p>
              <p className="text-sm leading-8 text-slate-600 mb-4 font-semibold">
                Yet traditional oral care:
              </p>
              <ul className="text-sm leading-8 text-slate-600 mb-6 space-y-2">
                <li>• Focuses on external cleaning</li>
                <li>• Relies heavily on chemicals</li>
                <li>• Ignores the nutritional needs of oral tissues</li>
                <li>• Disrupts the natural oral microbiome</li>
              </ul>
              <p className="text-sm leading-8 text-slate-600">
                This is the gap that had been missing from dentistry: <span className="font-bold">Dental Nutrition.</span>
              </p>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://uk.moroccanoil.com/cdn/shop/files/os7.webp?v=1684219925&width=1440"
                alt="The Gap We Found"
                className="w-full h-[480px] object-cover"
              />
            </div>
          </div>
        </section>

        {/* Section 2.5 — Our Mission */}
        <section className="bg-background">
          <div className="text-center px-6 py-16">
            <h2 className="text-3xl font-light mb-6">Our Mission</h2>
            <h3 className="text-2xl font-light mb-6">Nourishing the Mouth From Within</h3>
            <p className="text-sm leading-8 text-slate-600 mb-6 max-w-2xl mx-auto">
              After years of focused research, we confirmed what biology already suggests: Healthy teeth need nutrition, not just cleaning.
            </p>
            <p className="text-sm leading-8 text-slate-600 font-semibold mb-12 max-w-2xl mx-auto">
              Our mission is to make dental nutrition a daily habit, not an occasional treatment.
            </p>
            <p className="text-sm leading-8 text-slate-600 mb-12">
              Hetafu products are designed to:
            </p>

            {/* Bouncing Cards with Glass Effect */}
            <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto mb-12">
              <style>{`
                @keyframes bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-10px); }
                }
                .card-bounce {
                  animation: bounce 2s infinite;
                }
                .card-bounce:nth-child(2) {
                  animation-delay: 0.2s;
                }
                .card-bounce:nth-child(3) {
                  animation-delay: 0.4s;
                }
                .card-bounce:nth-child(4) {
                  animation-delay: 0.6s;
                }
              `}</style>
              
              <div className="card-bounce w-full sm:w-[calc(50%-12px)] md:w-[calc(25%-18px)]">
                <div className="backdrop-blur-md bg-white/30 border border-white/60 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <p className="text-sm font-semibold text-primary-brown">Support oral health from the inside</p>
                </div>
              </div>

              <div className="card-bounce w-full sm:w-[calc(50%-12px)] md:w-[calc(25%-18px)]">
                <div className="backdrop-blur-md bg-white/30 border border-white/60 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <p className="text-sm font-semibold text-primary-brown">Maintain bacterial balance</p>
                </div>
              </div>

              <div className="card-bounce w-full sm:w-[calc(50%-12px)] md:w-[calc(25%-18px)]">
                <div className="backdrop-blur-md bg-white/30 border border-white/60 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <p className="text-sm font-semibold text-primary-brown">Strengthen enamel naturally</p>
                </div>
              </div>

              <div className="card-bounce w-full sm:w-[calc(50%-12px)] md:w-[calc(25%-18px)]">
                <div className="backdrop-blur-md bg-white/30 border border-white/60 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <p className="text-sm font-semibold text-primary-brown">Aid healing throughout the day</p>
                </div>
              </div>
            </div>

            <p className="text-sm leading-8 text-slate-600 italic max-w-2xl mx-auto">
              We believe prevention through nutrition is more effective, sustainable, and humane than repeated repairs.
            </p>
          </div>
        </section>

        {/* Section 3 — Our Promises slider */}
        <section className="bg-background">
          <div className="relative z-10 flex items-center justify-center h-full px-12 md:px-20 bg-background">
            <h2 className="text-3xl font-light text-center pb-6">The Hetafu Promise</h2>
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
          <div className="bg-primary-brown text-white py-16 px-6">
            <div className="max-w-2xl mx-auto">
              <p className="text-sm leading-8 mb-8">
                <span className="font-semibold">Health. Taste. Fun.</span>
              </p>
              <p className="text-sm leading-8 mb-8">
                Our promise is simple. Every Hetafu product is created with three principles:
              </p>
              <ul className="space-y-4 text-sm mb-8">
                <li className="flex items-start gap-3">
                  <span className="font-bold">Health</span>
                  <span className="flex-1">— backed by science and clinical research</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold">Taste</span>
                  <span className="flex-1">— pleasant enough for daily use</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold">Fun</span>
                  <span className="flex-1">— so oral care becomes a habit, not a task</span>
                </li>
              </ul>
              <p className="text-sm leading-8 mb-6">
                Using our decades of R&D experience, we develop dental nutrition products with safe, proven, food grade ingredients.
              </p>
              <p className="text-sm leading-8 italic mb-6">
                If a product is not safe or effective enough for our own families, it will never reach yours.
              </p>
              <div className="border-t border-white/20 pt-6 text-xs">
                <p>No harsh chemicals.</p>
                <p>No bitter aftertastes.</p>
                <p className="mt-2">Only science-backed dental nutrition you can trust.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <BestSellers />
      <Footer />
    </div>
  );
}
