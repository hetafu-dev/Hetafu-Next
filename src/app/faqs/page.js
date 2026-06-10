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
      { question: 'What is Hetafu argan oil infused products?', answer: 'Hetafu products are infused with argan oil - nature&apos;s liquid gold, rich in antioxidants, fatty acids, and vitamin E that nourishes deeply while delivering visible results for hair and skin.' },
      { question: 'How do I use Hetafu hair products?', answer: 'Apply to clean, towel-dried hair. Start with a small amount and work through from mid-length to ends. Do not apply to scalp. For best results, use regularly as part of your hair care routine.' },
      { question: 'Are Hetafu products suitable for all hair types?', answer: 'Yes, our argan oil infused formulations work for all hair types. However, those with fine or oily hair should use lighter amounts to avoid weighing hair down.' },
      { question: 'Where can I purchase Hetafu&reg; products?', answer: 'Hetafu products are available through authorized retailers, salons, and online platforms. Visit our store locator to find retailers near you.' },
      { question: 'Are Hetafu products cruelty-free?', answer: 'Yes, Hetafu is committed to being cruelty-free. We do not test on animals and ensure all our products meet cruelty-free standards.' },
    ],
  },
  {
    title: 'Orders & Shipping',
    items: [
      { question: 'What payment methods do you accept?', answer: 'We accept all major credit/debit cards, UPI, and other digital payment methods through our secure checkout.' },
      { question: 'How long does delivery take?', answer: 'Orders are typically delivered within 3-5 business days. Express shipping options may be available at checkout.' },
      { question: 'Can I track my order?', answer: 'Yes, once your order is shipped, you will receive a tracking number via email to monitor your delivery status.' },
      { question: 'What is your return policy?', answer: 'We offer a 30-day return policy for unopened products. Contact our customer service for assistance with returns.' },
    ],
  },
  {
    title: 'Account & Subscriptions',
    items: [
      { question: 'Do you offer subscription options?', answer: 'Yes, you can subscribe to receive your favorite products regularly with auto-delivery options at discounted prices.' },
      { question: 'How do I manage my subscription?', answer: 'Log into your account to manage delivery frequency, update payment methods, or cancel your subscription at any time.' },
      { question: 'How do I create an account?', answer: 'Click &ldquo;Sign In&rdquo; at the top of the page and follow the prompts to create your account using your email address.' },
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
        <div className="min-h-screen bg-background font-sans py-20">
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
                          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === itemIndex ? 'max-h-96 pb-6' : 'max-h-0'}`}>
                            <div className="text-sm leading-7 text-slate-600">{item.answer}</div>
                          </div>
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