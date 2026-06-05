import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";
import Link from "next/link";
import Image from "next/image";


const products = [
  {
    id: 1,
    name: "Pops Whitening Strips",
    category: "POPS",
    price: 40.00,
    description: "Professional-grade teeth whitening strips that deliver visible results in. Safe for enamel. Safe for enamel and easy to use.",
    image: "/Images/Products/Dollipops/Dollipop.png",
    link: "/products/pops"
  },
  {
    id: 2,
    name: "Dentabits Whitening Bits",
    category: "BITS",
    price: 45.00,
    description: "Revolutionary dissolvable whitening bits that transform your oral care routine. Eco-friendly and perfect for travel.",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80",
    link: "/products/bits"
  },
  {
    id: 3,
    name: "Cute Mouthwash",
    category: "CUTE",
    price: 35.00,
    description: "Gentle, alcohol-free family-friendly mouthwash that keeps breath fresh all day. Kid-safe and made with natural ingredients.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
    link: "/products/cute"
  },
  {
    id: 4,
    name: "Denta Smarts Serum",
    category: "SMARTS",
    price: 55.00,
    description: "Advanced nanotechnology enamel protection serum that repairs and strengthens weakened tooth enamel. Dentist-formulated.",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80",
    link: "/products/smarts"
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#fdf8f4', fontFamily: '"Futura BT Book", sans-serif', color: '#401E17' }}>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-start text-left text-white overflow-hidden">
          <video
            className="absolute inset-0 w-full h-[80vh]  object-cover"
            src="https://uk.moroccanoil.com/cdn/shop/videos/c/vp/a5b257bc5fe545f586b8c76788c0006d/a5b257bc5fe545f586b8c76788c0006d.HD-1080p-7.2Mbps-81251974.mp4?v=0"
            autoPlay
            loop
            muted
            playsInline
          ></video>
          <div className="absolute inset-0 bg-black opacity-20"></div> {/* Overlay for better text readability */}
          <div className="relative z-10 max-w-xl mx-auto md:ml-20 p-8">
            <h1 className="text-5xl md:text-6xl font-light mb-6" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#fff' }}>
              Discover the Future of Dental Care
            </h1>
            <p className="text-xl mb-10" style={{ color: '#fff' }}>
              Explore our range of innovative oral care products designed to keep your smile healthy, bright, and beautiful.
            </p>
            <Link
              href="#products"
              className="inline-block px-8 py-4 text-black font-semibold rounded-full transition hover:opacity-90"
              style={{ backgroundColor: '#fff' }}
            >
              Explore Our Products
            </Link>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex space-x-8 overflow-x-auto justify-center">
              {products.map((product) => (
                <Link href={`/category/${product.category.toLowerCase()}`} key={product.id} className="flex-shrink-0 flex flex-col items-center group">
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Image
                      src={product.image}
                      alt={product.category}
                      width={96}
                      height={96}
                      objectFit="contain"
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="mt-4 text-lg font-medium" style={{ color: '#401E17' }}>{product.category}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid Section */}
        <section id="products" className="">
          <div>
            <h2 className="text-4xl font-light text-center mb-16" style={{ fontFamily: 'var(--font-signature-family)', color: 'var(--primary-brown)' }}>
              Our Products
            </h2>
            <div className="flex flex-col">
              {products.map((product, index) => (
                <Link
                  key={product.id}
                  href={product.link}
                  className={`group bg-white overflow-hidden transition-all duration-300 flex flex-col md:flex-row ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Image Section */}
                  <div className="relative h-80 w-full md:w-1/2 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                      <div className="w-full h-full relative">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          style={{ objectFit: 'contain' }}
                          className="group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full" style={{ backgroundColor: 'var(--background)', color: 'var(--primary-brown)' }}>
                      {product.category}
                    </div>
                  </div>
                  {/* Text Content Section */}
                  <div className="p-8 w-full md:w-1/2 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-medium mb-3" style={{ color: 'var(--primary-brown)' }}>
                        {product.name}
                      </h3>
                      <p className="text-slate-600 mb-6 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-semibold" style={{ color: 'var(--primary-brown)' }}>
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="inline-flex items-center gap-2 font-medium group-hover:gap-3 transition-all" style={{ color: 'var(--primary-brown)' }}>
                        View Product
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        {/* <section className="py-20 px-4" style={{ backgroundColor: '#401E17' }}>
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-light mb-12 text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Why Choose Hetafu?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-white">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Dentist Approved</h3>
                <p className="text-white/80">All our products are formulated and tested by leading dental professionals.</p>
              </div>
              <div className="text-white">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Eco-Friendly</h3>
                <p className="text-white/80">Sustainable packaging and cruelty-free formulas that are good for you and the planet.</p>
              </div>
              <div className="text-white">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Clinically Proven</h3>
                <p className="text-white/80">Backed by rigorous clinical studies to ensure safety and effectiveness.</p>
              </div>
            </div>
          </div>
        </section> */}
      </main>
      <BestSellers />
      <Footer />
    </div>
  );
}