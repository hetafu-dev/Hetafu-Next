"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Search, Handbag, User, Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { IN, JP, US, CA, MX, BR, AT, BE, DK, DE, ES, FI, FR, GR, GB, IT } from "country-flag-icons/react/3x2";
import { FaTooth } from "react-icons/fa6";
import { useCart } from "@/app/context/CartContext";
import { useCountry } from "@/app/context/CountryContext";
import { getStoredUser } from '@/utils/authStorage';
import { fetchAllStoreProductsForSearch } from '@/services/productService';

const NAV_LINKS = [
  { href: '/products/pops', label: 'POPS' },
  { href: '/products/cute', label: 'CUTE' },
  { href: '/products/bits', label: 'BITS' },
  { href: '/products/smarts', label: 'SMARTS' },
  { href: '/dosage-calculator', label: 'QUIZ' },
];

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
  const [countrySearch, setCountrySearch] = useState("");
  const [expandedRegions, setExpandedRegions] = useState({ ASIA: true, AMERICA: true, EUROPE: true });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchProducts, setSearchProducts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchInputRef = useRef(null);
  const countrySearchRef = useRef(null);
  const countryDropdownRef = useRef(null);
  const { itemCount, setDrawerOpen } = useCart();
  const { selectedCountry, setSelectedCountry, countriesByRegion, currency } = useCountry();

  useEffect(() => {
    setIsLoggedIn(!!getStoredUser());
  }, []);

  useEffect(() => {
    if (!searchOpen) return undefined;

    let cancelled = false;
    setSearchLoading(true);

    fetchAllStoreProductsForSearch()
      .then((products) => {
        if (!cancelled) setSearchProducts(products);
      })
      .catch(() => {
        if (!cancelled) setSearchProducts([]);
      })
      .finally(() => {
        if (!cancelled) setSearchLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [searchOpen]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return searchProducts.filter((product) =>
      product.name.toLowerCase().includes(query)
      || product.category.toLowerCase().includes(query)
      || product.description.toLowerCase().includes(query),
    );
  }, [searchQuery, searchProducts]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery("");
        setShowCountryDropdown(false);
        setCountrySearch("");
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
        setCountrySearch("");
      }
    };
    if (showCountryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCountryDropdown]);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-primary-brown text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-7 min-w-0 gap-2">
          <div className="relative min-w-0 shrink" ref={countryDropdownRef}>
            <button
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-5 h-4 rounded-full overflow-hidden shadow-sm">
                <FlagIcon code={selectedCountry.countryCode} />
              </div>
              <span className="font-bold tracking-wide truncate max-w-[120px] sm:max-w-none">{selectedCountry.name}</span>
              {showCountryDropdown ? (
                <ChevronUp size={14} className="text-white/80" />
              ) : (
                <ChevronDown size={14} className="text-white/80" />
              )}
            </button>

            {showCountryDropdown && (
              <div className="absolute top-full left-0 mt-3 bg-white text-gray-900 rounded-xl shadow-2xl z-50 w-80 overflow-hidden border border-gray-100">
                <div className="p-3 border-b border-gray-100 bg-gray-50/50">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      ref={countrySearchRef}
                      type="text"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder="Search country..."
                      className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-secondary-blue focus:ring-1 focus:ring-secondary-blue/20 transition-all"
                    />
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {Object.entries(countriesByRegion).map(([region, countries]) => {
                    const filteredCountries = countries.filter((country) =>
                      country.name.toLowerCase().includes(countrySearch.toLowerCase())
                    );
                    if (filteredCountries.length === 0) return null;

                    const isExpanded = expandedRegions[region] ?? true;

                    return (
                      <div key={region} className="border-b border-gray-100 last:border-b-0">
                        <button
                          onClick={() =>
                            setExpandedRegions((prev) => ({
                              ...prev,
                              [region]: !prev[region],
                            }))
                          }
                          className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50/80 hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-xs font-bold tracking-wider text-gray-600 uppercase">
                            {region}
                          </span>
                          {isExpanded ? (
                            <ChevronUp size={14} className="text-gray-400" />
                          ) : (
                            <ChevronDown size={14} className="text-gray-400" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="bg-white">
                            {filteredCountries.map((country) => (
                              <button
                                key={country.code}
                                onClick={() => {
                                  setSelectedCountry(country);
                                  setShowCountryDropdown(false);
                                  setCountrySearch("");
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                  selectedCountry.code === country.code
                                    ? "bg-secondary-blue/10 text-secondary-blue"
                                    : "hover:bg-gray-50 text-gray-700"
                                }`}
                              >
                                <div className="w-6 h-4 rounded-full overflow-hidden shadow-sm flex-shrink-0">
                                  <FlagIcon code={country.countryCode} />
                                </div>
                                <span className="flex-1 text-sm font-medium">{country.name}</span>
                                {selectedCountry.code === country.code && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-secondary-blue" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {countrySearch && Object.values(countriesByRegion).every((countries) =>
                    !countries.some((country) =>
                      country.name.toLowerCase().includes(countrySearch.toLowerCase())
                    )
                  ) && (
                    <div className="px-4 py-6 text-center">
                      <p className="text-gray-400 text-sm">No countries found</p>
                      <p className="text-gray-300 text-xs mt-1">Try a different search term</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 md:gap-6 items-center shrink-0">
            <a href="/locator" className="flex items-center gap-1 whitespace-nowrap">
              <MapPin size={16} className="shrink-0" />
              <span className="font-bold hidden sm:inline">Clinic Locators</span>
            </a>
            <a href="http://test.dentalnutrition.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 whitespace-nowrap">
              <FaTooth size={16} className="shrink-0" />
              <span className="font-bold hidden md:inline">Dental Nutrition</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="relative border-b border-gray-300 bg-background text-primary-brown font-sans">
        {searchOpen ? (
          <>
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <div className="flex items-center h-20 w-full gap-4">
                <Search size={22} className="text-gray-400 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 w-full min-w-0 py-3 text-base bg-transparent border-0 focus:outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer flex-shrink-0"
                  aria-label="Close search"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {searchQuery.trim() && (
              <div className="w-full border-t border-gray-200 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
                  {searchLoading ? (
                    <p className="py-6 text-center text-sm text-gray-500">Loading products...</p>
                  ) : filteredProducts.length === 0 ? (
                    <p className="py-6 text-center text-sm text-gray-500">No products found</p>
                  ) : (
                    <div className="py-2 max-h-80 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={closeSearch}
                          className="flex items-center gap-3 px-2 py-3 hover:bg-gray-100 transition-colors duration-200 rounded-lg"
                        >
                          <div className="w-14 h-14 bg-gray-200 rounded overflow-hidden flex-shrink-0">
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
                            <p className="text-sm font-semibold text-primary-brown">{currency}{product.price.toFixed(2)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
            <div className="flex justify-between items-center h-20 gap-2 md:gap-4 min-w-0">
              <div className="flex items-center shrink-0">
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

              <div className="hidden md:flex gap-4 lg:gap-10 xl:gap-20 items-center font-bold flex-1 justify-center min-w-0 tracking-wide xl:tracking-widest">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className="hover:opacity-70 transition-opacity whitespace-nowrap shrink-0">
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-4 md:gap-6 shrink-0">
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="cursor-pointer p-1"
                  aria-label="Open search"
                >
                  <Search size={20} />
                </button>

                <Link href={isLoggedIn ? '/account' : '/account/login'} className="cursor-pointer">
                  <User size={20} />
                </Link>
                <button type="button" onClick={() => setDrawerOpen(true)} className="relative cursor-pointer">
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
                <div className="flex flex-col gap-3 text-sm font-bold">
                  {NAV_LINKS.map((link) => (
                    <Link key={link.href} href={link.href} className="px-2 py-2 rounded-md">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}