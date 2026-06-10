'use client';

import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div style={{ backgroundColor: 'var(--background)', fontFamily: 'var(--font-sans-family)' }} className="min-h-screen py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-light text-center mb-16 text-slate-950">Terms and Conditions</h1>
            <div className="prose prose-slate max-w-none">
              <p className="text-sm leading-7 text-slate-600 mb-6">
                Last update: April 2021
              </p>
              
              <h2 className="text-2xl font-medium text-slate-950 mb-4">Scope of Validity</h2>
              <p className="text-sm leading-7 text-slate-600 mb-6">
                1.1 These General Terms and Conditions (T&amp;C) apply to all contracts between Hetafu and a consumer that concern the purchase from our online shop. You are a consumer as understood under applicable consumer protection laws if you are a natural person who enters into a legal transaction for purposes that wholly or predominantly are outside of your trade, business or profession.
              </p>
              <p className="text-sm leading-7 text-slate-600 mb-6">
                1.2 With your order from our online shop you agree to our T&amp;C in their current version.
              </p>
              <p className="text-sm leading-7 text-slate-600 mb-6">
                1.3 In no circumstances do we accept any alternative contractual terms even in cases where we do not expressly object to their inclusion.
              </p>
              
              <h2 className="text-2xl font-medium text-slate-950 mb-4">Conclusion of Contract</h2>
              <p className="text-sm leading-7 text-slate-600 mb-6">
                2.1 We conclude contracts with you via our online shop exclusively in the English language. By placing, presenting and advertising products in our online shop, we are not making a binding offer to conclude a contract with regard to the purchase of these products, but merely wish to inform you and invite you to submit an offer to purchase.
              </p>
              <p className="text-sm leading-7 text-slate-600 mb-6">
                2.2 Only after you conclude your order by pressing the button &ldquo;Confirm your order with an obligation to pay&rdquo; are you submitting a binding contractual offer for the goods. We only enter into contract with you after we have sent you a further e-mail with an acceptance of your offer or after we send the ordered goods for dispatch, whichever occurs first.
              </p>
              
              <h2 className="text-2xl font-medium text-slate-950 mb-4">Prices, Shipping Costs and Payment</h2>
              <p className="text-sm leading-7 text-slate-600 mb-6">
                3.1 The prices quoted on the product pages are binding and stated in local currency including applicable taxes. Our prices do not include shipping costs. If shipping costs apply, we will show the amount before triggering the binding order.
              </p>
              <p className="text-sm leading-7 text-slate-600 mb-6">
                3.2 Payment can be made using the payment methods specified in the order process. The purchase price is due for payment after conclusion of the contract.
              </p>
              
              <h2 className="text-2xl font-medium text-slate-950 mb-4">Delivery Conditions</h2>
              <p className="text-sm leading-7 text-slate-600 mb-6">
                4.1 We will only accept your order for goods if the delivery address is in India. The delivery is usually performed by a shipping company commissioned by us.
              </p>
              <p className="text-sm leading-7 text-slate-600 mb-6">
                4.2 In the ordering process, we will inform you of the estimated delivery date. If the goods are not available, we will refund any payments already made.
              </p>
              
              <h2 className="text-2xl font-medium text-slate-950 mb-4">Warranty and Guarantees</h2>
              <p className="text-sm leading-7 text-slate-600 mb-6">
                7.1 We shall be liable for material defects of delivered products in accordance with applicable statutory provisions. During the expected lifespan of your product your legal rights entitle you to: up to 30 days: if your goods are faulty, then you can get an immediate refund; up to six months: if your goods cannot be repaired or replaced, then you&apos;re entitled to a full refund.
              </p>
              
              <h2 className="text-2xl font-medium text-slate-950 mb-4">Right of Withdrawal</h2>
              <p className="text-sm leading-7 text-slate-600 mb-6">
                9. You have a right of withdrawal within 14 days without giving any reason. To exercise the right, you must inform us of your decision to withdraw from this contract. We shall reimburse to you all payments received, without undue delay and in any event not later than 14 days from the day on which we are informed about your decision.
              </p>
              
              <h2 className="text-2xl font-medium text-slate-950 mb-4">Limitation of Liability</h2>
              <p className="text-sm leading-7 text-slate-600 mb-6">
                8.1 If we fail to comply with these terms, we are responsible for loss or damage you suffer that is a foreseeable result of our breaking this contract. We do not exclude or limit our liability where it would be unlawful to do so.
              </p>
              <p className="text-sm leading-7 text-slate-600 mb-6">
                8.2 We only supply the products for domestic and private use. If you use the products for any commercial, business or re-sale purpose we will have no liability to you for any loss of profit.
              </p>
              
              <h2 className="text-2xl font-medium text-slate-950 mb-4">Data Protection</h2>
              <p className="text-sm leading-7 text-slate-600 mb-6">
                The protection of your personal data is very important to us. We process your personal data in connection with your order exclusively in accordance with applicable legal provisions. Details can be found in our Privacy Policy.
              </p>
              
              <h2 className="text-2xl font-medium text-slate-950 mb-4">Miscellaneous</h2>
              <p className="text-sm leading-7 text-slate-600 mb-6">
                13.1 The law of India shall apply. Should one or more provisions become invalid, this shall not affect the validity of the remaining provisions.
              </p>
              <p className="text-sm leading-7 text-slate-600 mb-6">
                13.2 We are entitled to amend the T&amp;C with effect for the future. If we do so, we will notify you.
              </p>
              
              <h2 className="text-2xl font-medium text-slate-950 mb-4">Contact Us</h2>
              <p className="text-sm leading-7 text-slate-600">
                You can reach our customer service by e-mailing contactus@hetafu.com.
              </p>
            </div>
          </div>
        </div>
      </main>
      <BestSellers />
      <Footer />
    </div>
  );
}