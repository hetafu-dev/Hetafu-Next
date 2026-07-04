'use client';

import { useState, useEffect } from 'react';
import {
  TiSocialFacebook,
  TiSocialInstagram,
  TiSocialYoutube,
} from "react-icons/ti";
import { FaTwitter } from "react-icons/fa";
import PrivacyModal from "../PrivacyModal/Page";
import { getStoredUser } from '@/utils/authStorage';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getStoredUser());
  }, []);

  return (
    <>
      <footer className="border-t border-slate-400 bg-background text-primary-brown font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-10 xl:grid-cols-[repeat(3,minmax(0,1fr))_380px]">
            <div>
              <h2 className="text-lg font-semibold">About Hetafu</h2>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                <li>
                  <a href="/our-story" className="transition hover:text-slate-950">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="https://test.dentalnutrition.org/sustainability" target="_blank" rel="noopener noreferrer" className="transition hover:text-slate-950">
                    Sustainability
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Support</h2>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                <li>
                  <a href="/contact" className="transition hover:text-slate-950">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/faqs" className="transition hover:text-slate-950">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="/delivery-information" className="transition hover:text-slate-950">
                    Delivery Information
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Contact Us</h2>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                <li>
                  <a href="/track-order" className="transition hover:text-slate-950">
                    Track Order
                  </a>
                </li>
                <li>
                  <a href={isLoggedIn ? "/account" : "/account/login"} className="transition hover:text-slate-950">
                    {isLoggedIn ? "My Account" : "Sign In"}
                  </a>
                </li>
                <li>
                  <a href="/locator" className="transition hover:text-slate-950">
                    Clinic Locators
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Stay In Touch</h2>
              <form className="mt-6">
                <label htmlFor="footer-email" className="sr-only">
                  Email Address
                </label>
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                  <input
                    id="footer-email"
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    className="text-slate-950 font-semibold transition hover:text-slate-700"
                    aria-label="Subscribe"
                  >
                    →
                  </button>
                </div>
              </form>
              <p className="mt-4 text-xs text-slate-500">
                By providing your email address you are agreeing to receive email communications from Hetafu. This can be changed at any time. Please refer to our{' '}
                <a href="/privacy-policy" className="underline transition hover:text-slate-950">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="/terms-of-service" className="underline transition hover:text-slate-950">
                  Terms of Service
                </a>{' '}
                for more details.
              </p>
              <div className="mt-6 flex items-center gap-4 text-2xl text-slate-700">
                <a href="https://www.facebook.com/people/Hetafu/61569349617864/" className="transition hover:text-slate-950" aria-label="Facebook">
                  <TiSocialFacebook />
                </a>
                <a href="https://www.instagram.com/hetafu_/" className="transition hover:text-slate-950" aria-label="Instagram">
                  <TiSocialInstagram />
                </a>
                <a href="https://www.youtube.com/@thehetafu" className="transition hover:text-slate-950" aria-label="YouTube">
                  <TiSocialYoutube />
                </a>
                <a href="https://x.com/hetafu_" className="transition hover:text-slate-950" aria-label="Twitter">
                  <FaTwitter />
                </a>
              </div>
              <p className="mt-2 text-xs font-bold text-slate-500">
                Manufacture info : <a href="https://lasarkaali.com/" target="_blank" rel="noopener noreferrer" className="underline transition text-xs">
                  LASARKAALI LIFE SCIENCES PRIVATE LIMITED
                </a>
              </p>
            </div>

          </div>

          <div className="mt-5 border-t border-slate-400 pt-4">
            <div className="flex flex-col gap-2 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
               <p className="tracking-[0.06em]" suppressHydrationWarning>&copy; {currentYear} HETAFU INDIA PRIVATE LIMITED</p>
              <div className="flex items-center gap-x-10 gap-y-1 text-primary-brown text-[12px] tracking-[0.09em] font-bold">
                <button onClick={() => setShowPrivacyModal(true)} className="transition hover:text-slate-950 text-left">
                  Your Privacy Choices
                </button>
                <a href="/privacy-policy" className="transition hover:text-slate-950">
                  Privacy Policy
                </a>
                <a href="/terms-of-service" className="transition hover:text-slate-950">
                  Terms of Service
                </a>
              </div>
              <p className="tracking-[0.06em] text-slate-95">All Rights Reserved</p>
            </div>
          </div>
        </div>
      </footer>
      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </>
  );
}