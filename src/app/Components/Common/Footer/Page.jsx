import {
  TiSocialFacebook,
  TiSocialInstagram,
  TiSocialYoutube,
} from "react-icons/ti";
import { FaTwitter } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-slate-950 border-t border-slate-400" style={{ backgroundColor: 'var(--background)', fontFamily: 'var(--font-sans-family)', color: 'var(--primary-brown)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 xl:grid-cols-[repeat(3,minmax(0,1fr))_380px]">
          <div>
            <h2 className="text-lg font-semibold">ABOUT HETAFU</h2>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li>
                <a href="/our-story" className="transition hover:text-slate-950">
                 Our Story
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-950">
                 Clinical Trials
                </a>
              </li>
            </ul>
            <p className="mt-5 text-xs text-slate-500">
              Manufacture information : <a href="https://lasarkaali.com/" target="_blank" rel="noopener noreferrer" className="underline transition text-xs">
                LASARKAALI LIFE SCIENCES PRIVATE LIMITED
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">SUPPORT</h2>
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
                <a href="#" className="transition hover:text-slate-950">
                 Delivery Information
                </a>
              </li>
            </ul>
          </div>

          

          <div>
            <h2 className="text-lg font-semibold">Contact Us</h2>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li>
                <a href="#" className="transition hover:text-slate-950">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-950">
                  Sign In
                </a>
              </li>
              <li>
                <a href="/locator" className="transition hover:text-slate-950">
                  Locators
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
              By providing your email address you are agreeing to receive email communications from DECIEM Inc., its affiliates, brands (The Ordinary, NIOD, and LOoPHA) and/or marketing partners. This can be changed at any time. Please refer to our{' '}
              <a href="https://theordinary.com/en-in/privacy-policy.html" className="underline transition hover:text-slate-950" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="https://theordinary.com/en-in/terms.html" className="underline transition hover:text-slate-950" target="_blank" rel="noopener noreferrer">
                Terms of Use
              </a>{' '}
              for more details or{' '}
              <a href="https://theordinary.com/en-in/contact-us.html" className="underline transition hover:text-slate-950" target="_blank" rel="noopener noreferrer">
                Contact Us
              </a>.
            </p>
            <div className="mt-6 flex items-center gap-4 text-2xl text-slate-700">
              <a href="#" className="transition hover:text-slate-950" aria-label="Facebook">
                <TiSocialFacebook />
              </a>
              <a href="#" className="transition hover:text-slate-950" aria-label="Instagram">
                <TiSocialInstagram />
              </a>
              <a href="#" className="transition hover:text-slate-950" aria-label="YouTube">
                <TiSocialYoutube />
              </a>
              <a href="#" className="transition hover:text-slate-950" aria-label="Twitter">
                <FaTwitter />
              </a>
            </div>
          </div>

          
        </div>

        <div className="mt-10 border-t border-slate-400 pt-4">
          <div className="flex flex-col gap-2 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p className=" tracking-[0.06em]">&copy; {currentYear} HETAFU</p>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-1 text-[12px] uppercase tracking-[0.08em]> font-bold"style={{ color: 'var(--primary-brown)' }}>
              <a href="#" >
                Your Privacy Choices
              </a>
              <a href="#" >
                Privacy Policy
              </a>
              <a href="#" >
                Terms of Service
              </a>
            </div>
            <p className=" tracking-[0.06em] text-slate-95">All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}