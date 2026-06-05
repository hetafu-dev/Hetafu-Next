'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";

const categories = [
  {
    title: 'Products',
    items: [
      { question: 'Do Moroccanoil products contain safe levels of PH?', answer: 'Yes. The pH levels vary from 3.5 to 7.0 for Moroccanoil products that contain water.' },
      { question: 'Can I use Moroccanoil products on my body?', answer: 'Moroccanoil treatment includes specific ingredients designed to beautifully transform hair. For Moroccanoil body products, please visit our body line.' },
      { question: 'Can I use Moroccanoil while I am pregnant or nursing?', answer: 'We recommend consulting your physician. All ingredients used are listed on our packaging.' },
      { question: 'Where can I purchase Moroccanoil® products?', answer: 'Moroccanoil products are available through authorized retailers, salons, and online platforms. Visit our store locator to find retailers near you.' },
      { question: 'Do Moroccanoil products contain silicones?', answer: 'Some Moroccanoil products contain silicones, while others are silicone-free. Check the product label or contact our customer service for specific product information.' },
    ],
  },
  {
    title: 'Moroccanoil Rewards',
    items: [
      { question: 'What is Moroccanoil Rewards?', answer: 'Moroccanoil Rewards is a loyalty program that lets you earn points on purchases and redeem them for discounts, special offers, and exclusive experiences.' },
      { question: 'How do I earn points?', answer: 'You earn points by making eligible purchases, referring friends, and participating in special promotions and campaigns.' },
      { question: 'How are my points calculated for each order?', answer: 'Points are assigned based on the value of qualifying products in your order. Details are provided in the program terms and conditions.' },
      { question: 'Do my points expire?', answer: 'Points may expire after a period of inactivity. Check the rewards program details for the current expiration policy.' },
    ],
  },
];

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div style={{ backgroundColor: 'var(--background)', fontFamily: 'var(--font-sans-family)' }} className="min-h-screen py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-light text-center mb-16 text-slate-950">FAQ</h1>
            <div className="space-y-16">
              {categories.map((category, categoryIndex) => (
                <section key={category.title}>
                  <h2 className="text-2xl font-medium text-center text-slate-950 mb-8">{category.title}</h2>
                  <div className="divide-y divide-slate-200">
                    {category.items.map((item, index) => {
                      const itemIndex = `${categoryIndex}-${index}`;
                      return (
                        <div key={itemIndex} className={`px-6 ${index !== category.items.length - 1 ? 'border-b border-slate-300' : ''}`}>
                          <button onClick={() => toggleAccordion(itemIndex)} className="w-full flex items-center justify-between py-6 text-left text-slate-950 hover:text-slate-900 transition-colors">
                            <span className="text-base font-semibold leading-6">{item.question}</span>
                            <ChevronDown size={24} className={`text-slate-950 flex-shrink-0 ml-4 transition-transform duration-300 ${openIndex === itemIndex ? 'transform rotate-180' : ''}`} />
                          </button>
                          {openIndex === itemIndex && (
                            <div className="pb-6 text-sm leading-7 text-slate-600">{item.answer}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <BestSellers />
      <Footer />
    </div>
  );
}
