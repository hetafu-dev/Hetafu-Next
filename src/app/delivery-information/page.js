'use client';

import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";

export default function DeliveryInformationPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div style={{ backgroundColor: 'var(--background)', fontFamily: 'var(--font-sans-family)' }} className="min-h-screen py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-light text-center mb-16 text-slate-950">Delivery Information</h1>
            <div className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-medium text-slate-950 mb-4">Shipping Policy</h2>
              
              <h3 className="text-xl font-medium text-slate-900 mb-3">Delivery Information</h3>
              <ul className="text-sm leading-7 text-slate-600 mb-6 list-disc pl-6">
                <li>Free Delivery when you spend ₹599 or more (Excluding remote areas).</li>
                <li>Standard Delivery ₹50 Including GST for orders below ₹599.</li>
                <li>All orders from Remote Areas* - ₹150 Including GST.</li>
                <li>No delivery takes place on National Holidays and Sundays.</li>
                <li>Estimated delivery time: 3-7 business days across India.</li>
              </ul>

              <h3 className="text-xl font-medium text-slate-900 mb-3">Where We Deliver</h3>
              <p className="text-sm leading-7 text-slate-600 mb-4">
                An order placed on Hetafu.in may only be delivered to an address in India.
              </p>
              <ul className="text-sm leading-7 text-slate-600 mb-6 list-disc pl-6">
                <li>At the moment we can only send orders to street addresses, we deliver to most PO Box addresses in major cities.</li>
                <li>We are currently unable to ship to any international address, but we are expanding our reach soon.</li>
                <li>We deliver to all serviceable pin codes across India's 28 states and 8 union territories.</li>
              </ul>

              <h3 className="text-xl font-medium text-slate-900 mb-3">* Remote Area's Pin codes:</h3>
              <p className="text-sm leading-7 text-slate-600 mb-4">
                Remote areas include certain locations in North East India, Jammu & Kashmir, Ladakh, and some island territories:
              </p>
              <ul className="text-sm leading-7 text-slate-600 mb-6 list-disc pl-6">
                <li>All pin codes in Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura</li>
                <li>Jammu & Kashmir: 193301 onwards (except major cities)</li>
                <li>Ladakh: All pin codes (194101 - 194404)</li>
                <li>Andaman & Nicobar Islands: All pin codes (744101 - 744301)</li>
                <li>Lakshadweep: All pin codes (682551 - 682559)</li>
              </ul>

              <h3 className="text-xl font-medium text-slate-900 mb-3">We do not ship to the following locations:</h3>
              <p className="text-sm leading-7 text-slate-600 mb-6">Currently, there are no locations within India that we are unable to service. However, in rare cases of extreme weather conditions or political unrest, delivery may be delayed to certain areas.</p>

              <h3 className="text-xl font-medium text-slate-900 mb-3">How to track your order:</h3>
              <p className="text-sm leading-7 text-slate-600 mb-4">
                Your order will be delivered through our trusted logistics partners including Delhivery, Blue Dart, and India Post. You can check the status of your order on our website using your tracking number, which can be found on the shipment confirmation email you got from us, or under My Account, on our website.
              </p>
              <p className="text-sm leading-7 text-slate-600 mb-6">
                For the purpose of verifying delivery, our shipping provider may collect the recipient's signature or photograph the package at the point of delivery. By completing your purchase, you consent to and authorize such documentation as part of the proof of delivery process. For more information about our privacy practices, please refer to our <a href="/privacy-policy" className="underline">Privacy Policy</a>.
              </p>
              
              <p className="text-sm leading-7 text-slate-600 mb-6">
                For questions, please contact customer service via email: <a href="mailto:reachthebest@hetafu.com" className="text-blue-500">reachthebest@hetafu.com</a> or call our toll-free number: 1800-XXX-XXXX
              </p>
            </div>
          </div>
        </div>
        <BestSellers />
      </main>
      <Footer />
    </div>
  );
}