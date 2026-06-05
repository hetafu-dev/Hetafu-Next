"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Search, Handbag, User, Menu } from "lucide-react";
import { useState } from "react";
import { IN, JP, US, CA, MX, BR, AT, BE, DK, DE, ES, FI, FR, GR, GB, IT } from "country-flag-icons/react/3x2";
import { FaTooth } from "react-icons/fa6";
import { useCart } from "@/app/context/CartContext";
import { useCountry } from "@/app/context/CountryContext";

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
  const { itemCount, setDrawerOpen } = useCart();
  const { selectedCountry, setSelectedCountry, countriesByRegion } = useCountry();

  return (
    <>
      {/* Top utility bar */}
      <div style={{ backgroundColor: "var(--color-primary-brown)" }} className="text-white text-sm">
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
              <span className="font-bold">LOCATORS</span>
            </a>
            <a href="http://dentalnutrition.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <FaTooth size={16} />
              <span className="font-bold">DN</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="bg-white border-b border-gray-300" style={{ fontFamily: "var(--font-sans)", backgroundColor: "var(--background)", color: "var(--primary-brown)" }}>
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
              <a href="#">QUIZ</a>
            </div>

            {/* Search icon */}
            <div className="p-2 flex items-center gap-6" >
              <button className="cursor-pointer"><Search size={20} /></button>
              <button className="cursor-pointer"><User size={20} /></button>
              <button onClick={() => setDrawerOpen(true)} className="relative cursor-pointer">
                <Handbag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center" style={{ backgroundColor: 'var(--secondary-blue)' }}>
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
                <a href="#" className="px-2 py-2 rounded-md">QUIZ</a>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}