"use client";
import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const carouselSlides = [
  {
    src: "/Images/Banners/banner2.png",
    // Optional: add a wider desktop banner (recommended 3840×1920, 2:1) to avoid side gaps without cropping
    desktopSrc: "/Images/Banners/banner2-desktop.png",
    title: null,
    description: null,
  },
  {
    src: "/Images/Banners/banner1.png",
    desktopSrc: "/Images/Banners/banner1-desktop.png",
    title: null,
    description: null,
  },
];


const products = [
  {
    id: 1,
    name: "Pops Whitening Strips",
    category: "POPS",
    price: 40.00,
    description: "Professional-grade teeth whitening strips that deliver visible results in. Safe for enamel. Safe for enamel and easy to use.",
    image: "/Images/Products/Dollipops/Dollipopmockup.png",
    link: "/products/pops"
  },
  {
    id: 2,
    name: "Dentabits Whitening Bits",
    category: "BITS",
    price: 45.00,
    description: "Revolutionary dissolvable whitening bits that transform your oral care routine. Eco-friendly and perfect for travel.",
    image: "/Images/Products/Bits/Dentabits.png",
    link: "/products/bits"
  },
  {
    id: 3,
    name: "Cute Mouthwash",
    category: "CUTE",
    price: 35.00,
    description: "Gentle, alcohol-free family-friendly mouthwash that keeps breath fresh all day. Kid-safe and made with natural ingredients.",
    image: "/Images/Products/CUTE/cutemouthwash.png",
    link: "/products/cute"
  },
  {
    id: 4,
    name: "Denta Smarts Serum",
    category: "SMARTS",
    price: 55.00,
    description: "Advanced nanotechnology enamel protection serum that repairs and strengthens weakened tooth enamel. Dentist-formulated.",
    image: "/Images/Products/Smarts/prime.png",
    link: "/products/smarts"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrentSlide((s) => (s - 1 + carouselSlides.length) % carouselSlides.length);
  const nextSlide = () => setCurrentSlide((s) => (s + 1) % carouselSlides.length);

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-primary-brown overflow-x-clip">
      <Navbar />
      <main className="flex-1">
        {/* Hero: mobile/tablet = full 16:9 visible | desktop = 2:1 container, edge-to-edge */}
        <section className="relative w-full overflow-hidden bg-background min-h-[200px] h-[min(calc(100dvh-7rem),56.25vw)] sm:min-h-[240px] lg:aspect-[2/1] lg:h-auto lg:min-h-0">
          <div className="absolute inset-0">
            {carouselSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-2000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              >
                {/* Mobile & tablet: show full banner, no crop */}
                <Image
                  src={slide.src}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-contain object-center lg:hidden"
                  sizes="100vw"
                  priority={index === 0}
                />
                {/* Desktop: 2:1 banner fills the 2:1 hero box */}
                <Image
                  src={slide.desktopSrc || slide.src}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="hidden lg:block object-cover object-center"
                  sizes="100vw"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Carousel Arrows */}
          <button
            onClick={prevSlide}
            className="absolute cursor-pointer left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 rounded-full p-1.5 sm:p-2 transition"
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="sm:w-6 sm:h-6">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute cursor-pointer right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 rounded-full p-1.5 sm:p-2 transition"
            aria-label="Next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="sm:w-6 sm:h-6">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Carousel Dots */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition ${index === currentSlide ? 'bg-black/50' : 'bg-black/20'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 md:py-16 px-4 overflow-hidden">
<div className="max-w-7xl mx-auto">
             <div className="flex justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12">
               {products.map((product) => (
                 <Link href={product.link} key={product.id} className="flex flex-col items-center group">
                   <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                     <Image
                       src={product.image}
                       alt={product.category}
                       width={96}
                       height={96}
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                     />
                   </div>
                   <p className="mt-2 sm:mt-3 md:mt-4 text-[10px] sm:text-xs md:text-sm font-medium text-primary-brown text-center leading-tight">
                     {product.category}
                   </p>
                 </Link>
               ))}
             </div>
           </div>
        </section>

        {/* Our Products Section */}
        <section className="py-6 md:py-10 px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-center mb-6 md:mb-10 text-primary-brown">
            Our Products
          </h2>
          <div className="max-w-7xl mx-auto flex flex-col gap-0">
            {products.map((product, index) => (
              <Link
                key={product.id}
                href={product.link}
                className={`group flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} lg:h-[42vh]`}
              >
                {/* Image */}
                <div className="relative w-full lg:w-1/2 h-[40vw] min-h-[200px] lg:h-full flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-background text-primary-brown">
                    {product.category}
                  </div>
                </div>
                {/* Content */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-6 lg:py-10 bg-background">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-medium mb-2 md:mb-3 text-primary-brown">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-4 md:mb-6 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    {/* <span className="text-lg sm:text-xl md:text-2xl font-semibold text-primary-brown">
                      ${product.price.toFixed(2)}
                    </span> */}
                    <span className="inline-flex items-center gap-1.5 font-medium group-hover:gap-3 transition-all text-xs sm:text-sm text-primary-brown">
                      View Product
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
      <BestSellers />
      <Footer />
    </div>
  );
}