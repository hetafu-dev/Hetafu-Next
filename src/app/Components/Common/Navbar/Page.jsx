"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Search, Handbag, User, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { IN, JP, US, CA, MX, BR, AT, BE, DK, DE, ES, FI, FR, GR, GB, IT } from "country-flag-icons/react/3x2";
import { FaTooth } from "react-icons/fa6";
import { useCart } from "@/app/context/CartContext";
import { useCountry } from "@/app/context/CountryContext";

// All products data for search
const ALL_PRODUCTS = {
  pops: {
    id: 1,
    name: 'Dollipops',
    category: 'POPS',
    price: 75.00,
    slug: 'pops',
    image: '/Images/Products/Dollipops/Dollipop.png',
    description: 'Our professional-grade teeth whitening strips deliver professional-level results from the comfort of home.',
  },
  bits: {
    id: 2,
    name: 'Dentabits',
    category: 'BITS',
    price: 45.00,
    slug: 'bits',
    image: '/Images/Products/CUTE/cutebits.png',
    description: 'Revolutionary dissolvable whitening bits that transform your oral care routine.',
  },
  cute: {
    id: 3,
    name: 'Cute Mouthwash',
    category: 'CUTE',
    price: 35.00,
    slug: 'cute',
    image: '/Images/Products/CUTE/cutemouthwash1.png',
    description: 'Gentle, alcohol-free family-friendly mouthwash that keeps breath fresh all day.',
  },
  smarts: {
    id: 4,
    name: 'Denta Smarts',
    category: 'SMARTS',
    price: 55.00,
    slug: 'smarts',
    image: '/Images/Products/Smarts/Prime.png',
    description: 'Advanced nanotechnology enamel protection serum that repairs and strengthens weakened tooth enamel.',
  },
};

const productsList = Object.values(ALL_PRODUCTS);

const flagMap = {
  IN: IN,
  JP: JP,
  US: US,
  CA: CA,
  MX: MX,
  BR: BR,
  AT: AT,
  BE: BE,
  DK: DK,
  DE: DE,
  ES: ES,
  FI: FI,
  FR: FR,
  GR: GR,
  GB: GB,
  IT: IT,
};

const FlagIcon = ({ code }) => {
  const FlagComponent = flagMap[code];
  return FlagComponent ? <FlagComponent title={code} /> : null;
};

export default function Navbar() {
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const { itemCount, setDrawerOpen } = useCart();
  const { selectedCountry, setSelectedCountry, countriesByRegion } = useCountry();

  // Filter products based on search query
  const filteredProducts = productsList.filter(product => {
    const searchLower = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower)
    );
  });

  // Focus search input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    // Prevent body scroll when search is open
    if (searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [searchOpen]);

  // Close search on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-primary-brown text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-7">
          {/* Country selector */}
          <div className="relative">
            <button
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              className="flex items-center gap-2"
            >
              <div className="w-5 h-4 rounded-full overflow-hidden">
                <FlagIcon code={selectedCountry.countryCode} />
              </div>
              <span className="font-bold">{selectedCountry.name}</span>
            </button>

            {/* Country dropdown */}
            {showCountryDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white text-gray-900 rounded-lg shadow-lg z-50 w-72 max-h-96 overflow-y-auto">
                {Object.entries(countriesByRegion).map(([region, countries]) => (
                  <div key={region}>
                    <div className="px-4 py-3 font-bold text-sm border-b text-gray-900 bg-gray-50 sticky top-0">
                      {region}
                    </div>
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => {
                          setSelectedCountry(country);
                          setShowCountryDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 border-b text-left"
                      >
                        <div className="w-6 h-4 rounded-full overflow-hidden">
                          <FlagIcon code={country.countryCode} />
                        </div>
                        <span className="flex-1">{country.name}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right side icons */}
          <div className="flex gap-6 items-center">
            <a href="/locator" className="flex items-center gap-1">
              <MapPin size={16} />
              <span className="font-bold">Clinic Locators</span>
            </a>
            <a href="http://dentalnutrition.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <FaTooth size={16} />
              <span className="font-bold">Dental Nutrition</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="relative border-b border-gray-300 bg-background text-primary-brown font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <button
                type="button"
                className="mr-4 md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
                aria-label="Toggle menu"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu size={24} />
              </button>
              <Link href="/" className="w-32 block">
                <Image
                  src="/Images/Logos/LogoBlack.svg"
                  alt="Hetafu Logo"
                  width={100}
                  height={40}
                  priority
                />
              </Link>
            </div>

            {/* Navigation menu */}
            <div className="hidden tracking-widest md:flex gap-20 items-center font-bold">
              <a href="/products/pops">POPS</a>
              <a href="/products/cute">CUTE</a>
              <a href="/products/bits">BITS</a>
              <a href="/products/smarts">SMARTS</a>
              <a href="/dosage-calculator">QUIZ</a>
            </div>

            {/* Search icon */}
            <div className="p-2 flex items-center gap-6 relative" >
              <button onClick={() => setSearchOpen(true)} className="cursor-pointer"><Search size={20} /></button>
              
              {/* Search Dropdown - Positioned relative to this container */}
              {searchOpen && (
                <div className="absolute right-0 top-full mt-3 w-96 bg-white border border-gray-200 shadow-2xl rounded-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                  {/* Search Input */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                      <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-10 pr-10 py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-secondary-blue transition-all duration-300"
                      />
                      <button
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                        aria-label="Close search"
                      >
                        <X size={18} className="text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* Search Results - Compact list */}
                  <div className="max-h-80 overflow-y-auto">
                    {searchQuery ? (
                      <>
                        {filteredProducts.length === 0 ? (
                          <div className="p-6 text-center">
                            <p className="text-gray-500 text-sm">No products found</p>
                            <p className="text-gray-400 text-xs mt-1">Try "whitening" or "strips"</p>
                          </div>
                        ) : (
                          <div className="py-2">
                            {filteredProducts.map((product) => (
                              <Link
                                key={product.id}
                                href={`/products/${product.slug}`}
                                onClick={() => {
                                  setSearchOpen(false);
                                  setSearchQuery("");
                                }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                              >
                                <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={56}
                                    height={56}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold tracking-wider text-primary-brown/70 uppercase">{product.category}</p>
                                  <h3 className="text-sm font-bold text-secondary-blue truncate">{product.name}</h3>
                                  <p className="text-sm font-semibold text-primary-brown">${product.price.toFixed(2)}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      // Show quick list when no search yet
                      <div className="py-2">
                        <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Quick Access</p>
                        {productsList.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={56}
                                height={56}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold tracking-wider text-primary-brown/70 uppercase">{product.category}</p>
                              <h3 className="text-sm font-bold text-secondary-blue truncate">{product.name}</h3>
                              <p className="text-sm font-semibold text-primary-brown">${product.price.toFixed(2)}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Link href="/signin" className="cursor-pointer"><User size={20} /></Link>
              <button onClick={() => setDrawerOpen(true)} className="relative cursor-pointer">
                <Handbag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center bg-secondary-blue">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {showMobileMenu && (
            <div className="md:hidden mt-2 border-t border-gray-200 py-4">
              <div className="flex flex-col gap-3 text-sm font-bold" >
                <a href="/products/pops" className="px-2 py-2 rounded-md">POPS</a>
                <a href="/products/cute" className="px-2 py-2 rounded-md">CUTE</a>
                <a href="/products/bits" className="px-2 py-2 rounded-md">BITS</a>
                <a href="/products/smarts" className="px-2 py-2 rounded-md">SMARTS</a>
                <a href="/dosage-calculator" className="px-2 py-2 rounded-md">QUIZ</a>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}