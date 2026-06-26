"use client";
import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const carouselSlides = [
  {
    src: "/Images/Banners/banner1.png",
    title: null,
    description: null,
  },
  {
    src: "/Images/Banners/banner1.png",
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
    image: "/Images/Products/CUTE/cutemouthwash1.png",
    link: "/products/bits"
  },
  {
    id: 3,
    name: "Cute Mouthwash",
    category: "CUTE",
    price: 35.00,
    description: "Gentle, alcohol-free family-friendly mouthwash that keeps breath fresh all day. Kid-safe and made with natural ingredients.",
    image: "/Images/Products/CUTE/cutepowder.png",
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
  const [activeProduct, setActiveProduct] = useState(0);

  // Re-enable carousel for 2 banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % carouselSlides.length);
    }, 7000); // Increased to 7 seconds per slide for slower rotation
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrentSlide((s) => (s - 1 + carouselSlides.length) % carouselSlides.length);
  const nextSlide = () => setCurrentSlide((s) => (s + 1) % carouselSlides.length);

  const goToProduct = (index) => {
    setActiveProduct(index);
  };

  const activeProductRef = useRef(0);
  useEffect(() => {
    activeProductRef.current = activeProduct;
  }, [activeProduct]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const section = document.getElementById('products-section');
          if (!section) return;
          const sectionTop = section.offsetTop;

          const relativeScroll = scrollY - sectionTop;
          const activeIndex = Math.max(0, Math.min(
            products.length - 1,
            Math.round(relativeScroll / windowHeight)
          ));

          if (activeIndex !== activeProductRef.current) {
            setActiveProduct(activeIndex);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-primary-brown">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section - Carousel */}
        <section className="relative h-screen flex items-center justify-start text-left overflow-hidden">
          <div className="absolute inset-0 w-full h-screen">
            {carouselSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-2000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              >
                <Image
                  src={slide.src}
                  alt={`Slide ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Carousel Arrows */}
          <button
            onClick={prevSlide}
            className="absolute cursor-pointer left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 rounded-full p-2 transition"
            aria-label="Previous"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 rounded-full p-2 transition"
            aria-label="Next"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Carousel Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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
        <section className="py-8 md:py-16 px-2 md:px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex space-x-4 md:space-x-8 overflow-x-auto justify-center pb-2">
              {products.map((product) => (
                <Link href={product.link} key={product.id} className="flex-shrink-0 flex flex-col items-center group">
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Image
                      src={product.image}
                      alt={product.category}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="mt-4 text-lg font-medium text-primary-brown">{product.category}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Products Scroll Section */}
        <div id="products-section" className="relative" style={{ height: '400vh' }}>
          <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-2 md:px-4">
            <h2 className="text-2xl md:text-4xl font-light text-center mb-4 md:mb-8 text-primary-brown">
              Our Products
            </h2>

            <div className="relative w-full px-0 md:px-4" style={{ height: '98vh' }}>
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="absolute inset-0"
                  style={{
                    opacity: index === activeProduct ? 1 : 0,
                    transition: 'opacity 300ms ease-in-out',
                    pointerEvents: index === activeProduct ? 'auto' : 'none',
                  }}
                >
                  <Link
                    href={product.link}
                    className="group flex flex-col md:flex-row overflow-hidden w-full h-full bg-background text-primary-brown"
                  >
                    {index % 2 === 0 ? (
                      <>
                        {/* Image */}
                        <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          <div className="absolute top-2 md:top-4 left-2 md:left-4 px-2 md:px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-background text-primary-brown">
                            {product.category}
                          </div>
                        </div>
                        {/* Content */}
                        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center px-4 md:px-16 py-6 md:py-12">
                          <h3 className="text-xl md:text-3xl font-medium mb-2 md:mb-4 text-primary-brown">
                            {product.name}
                          </h3>
                          <p className="text-sm md:text-slate-600 mb-4 md:mb-8 leading-relaxed md:text-lg">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xl md:text-3xl font-semibold text-primary-brown">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="inline-flex items-center gap-2 font-medium group-hover:gap-4 transition-all text-sm md:text-base text-primary-brown">
                              View Product
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Content */}
                        <div 
                          className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center px-4 md:px-16 py-6 md:py-12 order-1 md:order-none"
                          style={{
                            backgroundImage: index === 1 ? `url(/Images/Products/CUTE/cutemouthwash1left.png)` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        >
                          <h3 className="text-xl md:text-3xl font-medium mb-2 md:mb-4 text-primary-brown">
                            {product.name}
                          </h3>
                          <p className="text-sm md:text-slate-600 mb-4 md:mb-8 leading-relaxed md:text-lg">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xl md:text-3xl font-semibold text-primary-brown">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="inline-flex items-center gap-2 font-medium group-hover:gap-4 transition-all text-sm md:text-base text-primary-brown">
                              View Product
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                        {/* Image */}
                        <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex-shrink-0 order-0 md:order-none">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          <div className="absolute top-2 md:top-4 right-2 md:right-4 px-2 md:px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-background text-primary-brown">
                            {product.category}
                          </div>
                        </div>
                      </>
                    )}
                  </Link>
                </div>
              ))}
            </div>

            {/* Dot indicators */}
            <div className="flex gap-2 md:gap-3 mt-4 md:6">
              {products.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const section = document.getElementById('products-section');
                    if (section) {
                      window.scrollTo({
                        top: section.offsetTop + (i * window.innerHeight),
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeProduct ? 'bg-primary-brown scale-140' : 'bg-gray-300'}`}
                />
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