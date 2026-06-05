'use client';

import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";

const salons = [
  {
    id: 1,
    name: 'Bounce Salon & Spa, Banjara Hills',
    address: 'Shop No 8-2-686/8/6/1a, 1st floor, 12th square building, opp audi car show room, road no 12, banjara\nHyderabad, TELANGANA 500034\nIndia',
    email: 'bounce.banjarahills@gmail.com',
    category: 'Hair Care',
    distance: '2.5 mi',
  },
  {
    id: 2,
    name: 'Bounce Unisex Salon, Panjagutta',
    address: 'unit no. L2- shop 36, first floor, l & t mall, panjagutta, survey no 1/1, ward no 89, block e khairt\nHyderabad, TELANGANA 500082\nIndia',
    category: 'Hair Care',
    distance: '2.6 mi',
  },
  {
    id: 3,
    name: 'AAKAARA Salon & Beauty',
    address: 'Aparna Crest Building, Ground Floor, Rear Portion,, Banjara Hills, Road Number 2, Hyderabad,\nTelangana',
    category: 'Hair Care',
    distance: '3.8 mi',
  },
];

const categories = ['Hair Care', 'Hair Color', 'Body'];

export default function LocatorPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);

  const toggle = (cat) =>
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const filtered = salons.filter((s) => {
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase());
    const matchCat = selected.length === 0 || selected.includes(s.category);
    return matchSearch && matchCat;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--primary-brown)' }}>
          <div className="max-w-7xl mx-auto px-6 py-10">
            <h1 className="text-4xl mb-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Locators</h1>
            <div className="flex gap-0 h-[600px]">
              <div className="w-80 flex-shrink-0 flex flex-col border border-gray-200 overflow-hidden">
                <div className="flex border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Type a postcode or address..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm outline-none bg-white"
                  />
                  <button className="px-3 py-2 text-white" style={{ backgroundColor: 'var(--primary-brown)' }}>
                    <Search size={16} />
                  </button>
                </div>
                <div className="flex gap-4 px-3 py-2 border-b border-gray-200 bg-white">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-1 text-xs cursor-pointer">
                      <input type="checkbox" checked={selected.includes(cat)} onChange={() => toggle(cat)} className="accent-current" />
                      {cat}
                    </label>
                  ))}
                </div>
                <div className="overflow-y-auto flex-1 bg-white">
                  {filtered.map((salon) => (
                    <div key={salon.id} className="flex gap-3 px-3 py-4 border-b border-gray-100">
                      <div className="mt-1 flex-shrink-0">
                        <MapPin size={18} style={{ color: 'var(--primary-brown)' }} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--secondary-blue)' }}>{salon.distance}</p>
                        <p className="text-sm font-medium mb-1">{salon.name}</p>
                        <p className="text-xs text-gray-500 whitespace-pre-line mb-1">{salon.address}</p>
                        {salon.email && (
                          <a href={`mailto:${salon.email}`} className="text-xs underline text-gray-600 block mb-1">{salon.email}</a>
                        )}
                        <p className="text-xs text-gray-500">{salon.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <iframe
                  title="Salon Locator Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d121840.87099817937!2d78.4867!3d17.385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <BestSellers />
      <Footer />
    </div>
  );
}
