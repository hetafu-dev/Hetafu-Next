'use client';

import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";

const clinics = [
  {
    id: 1,
    name: 'Hetafu Dental Clinic, Banjara Hills',
    address: 'Shop No 8-2-686/8/6/1a, 1st floor, 12th square building, opp audi car show room, road no 12, banjara\nHyderabad, TELANGANA 500034\nIndia',
    email: 'clinic.banjarahills@hetafu.com',
    category: 'General Dentistry',
    distance: '2.5 mi',
  },
  {
    id: 2,
    name: 'Hetafu Dental Care, Panjagutta',
    address: 'unit no. L2- shop 36, first floor, l & t mall, panjagutta, survey no 1/1, ward no 89, block e khairt\nHyderabad, TELANGANA 500082\nIndia',
    email: 'clinic.panjagutta@hetafu.com',
    category: 'Orthodontics',
    distance: '2.6 mi',
  },
  {
    id: 3,
    name: 'Hetafu Smile Studio, Aparna Crest',
    address: 'Aparna Crest Building, Ground Floor, Rear Portion,, Banjara Hills, Road Number 2, Hyderabad,\nTelangana',
    email: 'clinic.aparna@hetafu.com',
    category: 'Cosmetic Dentistry',
    distance: '3.8 mi',
  },
];

export default function LocatorPage() {
  const [search, setSearch] = useState('');

  const filtered = clinics.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="flex flex-col bg-background font-sans text-primary-brown overflow-x-clip">
      <Navbar />
      <main>
        <div className="bg-background text-primary-brown py-8 md:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-6 md:mb-8">Clinic Locators</h1>

            <div className="flex flex-col lg:flex-row border border-gray-200 overflow-hidden lg:h-[600px]">
              {/* Clinic list */}
              <div className="w-full lg:w-80 lg:flex-shrink-0 flex flex-col lg:h-full max-h-[45vh] sm:max-h-[50vh] lg:max-h-none">
                <div className="flex border-b border-gray-200 bg-white">
                  <input
                    type="text"
                    placeholder="Type a postcode or address..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 min-w-0 px-3 py-2.5 sm:py-3 text-sm outline-none bg-white"
                  />
                  <button
                    type="button"
                    className="px-3 sm:px-4 py-2.5 sm:py-3 text-white bg-primary-brown shrink-0"
                    aria-label="Search clinics"
                  >
                    <Search size={16} />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 bg-white min-h-0">
                  {filtered.length === 0 ? (
                    <p className="px-4 py-8 text-sm text-center text-gray-500">No clinics found for your search.</p>
                  ) : (
                    filtered.map((clinic) => (
                      <div key={clinic.id} className="flex gap-3 px-3 sm:px-4 py-4 border-b border-gray-100 last:border-b-0">
                        <div className="mt-1 shrink-0">
                          <MapPin size={18} className="text-primary-brown" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold mb-0.5 text-secondary-blue">{clinic.distance}</p>
                          <p className="text-sm sm:text-base font-medium mb-1">{clinic.name}</p>
                          <p className="text-xs sm:text-sm text-gray-500 whitespace-pre-line mb-1 break-words">{clinic.address}</p>
                          {clinic.email && (
                            <a
                              href={`mailto:${clinic.email}`}
                              className="text-xs sm:text-sm underline text-gray-600 block mb-1 break-all"
                            >
                              {clinic.email}
                            </a>
                          )}
                          <p className="text-xs sm:text-sm text-gray-500">{clinic.category}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Map */}
              <div className="w-full h-[280px] sm:h-[360px] md:h-[420px] lg:h-auto lg:flex-1 lg:min-h-0">
                <iframe
                  title="Clinic Locator Map"
                  className="w-full h-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d121840.87099817937!2d78.4867!3d17.385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                />
              </div>
            </div>
          </div>
        </div>

        <BestSellers />
      </main>
      <Footer />
    </div>
  );
}
