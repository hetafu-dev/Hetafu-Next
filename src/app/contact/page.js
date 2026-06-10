'use client';

import { useState } from 'react';
import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";

const REGARDING_OPTIONS = [
  'Order / Delivery',
  'Product Enquiry',
  'Returns & Refunds',
  'Account & Loyalty',
  'General Enquiry',
];

export default function ContactPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', name: '', regarding: '', subject: '', description: '', attachment: null });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="min-h-screen bg-background text-primary-brown font-sans">
          <div className="max-w-5xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
            {!showForm ? (
              <>
                <div className="text-center">
                  <h1 className="text-4xl sm:text-5xl">Contact information</h1>
                  <p className="mx-auto mt-8 max-w-2xl sm:text-lg leading-8">
                    At Hetafu, we value your comments and feedback.
                  </p>
                  <p className="mx-auto mt-4 max-w-xl leading-7">
                    Submit a request using the link below.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center justify-center rounded-none bg-[#401E17] px-10 py-3 mt-10 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#2f1614]"
                  >
                    CONTACT US
                  </button>
                </div>
                <div className="mt-16 sm:mt-20">
                  <div className="overflow-hidden rounded-3xl shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80"
                      alt="Contact hero"
                      className="h-[420px] w-full object-cover"
                    />
                  </div>
                </div>
              </>
            ) : submitted ? (
              <div className="text-center py-20">
                <h2 className="text-3xl font-light mb-4">Thank you!</h2>
                <p className="text-slate-600 mb-8">Your request has been submitted. A member of our support team will respond as soon as possible.</p>
                <button onClick={() => { setShowForm(false); setSubmitted(false); }}                     className="text-sm underline underline-offset-4 text-primary-brown">
                  Back to Contact
                </button>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <button onClick={() => setShowForm(false)} className="text-sm mb-8 flex items-center gap-1 hover:opacity-70">
                  ← Back
                </button>
                <h1 className="text-3xl font-light mb-2">Submit a request</h1>
                <p className="text-xs text-slate-500 mb-8">Fields marked with an asterisk (*) are required.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Your email address *</label>
                    <input type="email" required value={form.email} onChange={set('email')} className="w-full border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:border-slate-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Please enter your full name *</label>
                    <input type="text" required value={form.name} onChange={set('name')} className="w-full border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:border-slate-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">I am contacting you regarding *</label>
                    <select required value={form.regarding} onChange={set('regarding')} className="w-full border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:border-slate-600 bg-white appearance-none">
                      <option value="">Select a topic</option>
                      {REGARDING_OPTIONS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Subject *</label>
                    <input type="text" required value={form.subject} onChange={set('subject')} className="w-full border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:border-slate-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Description *</label>
                    <p className="text-xs text-slate-500 mb-2">Please enter the details of your request. A member of our support staff will respond as soon as possible.</p>
                    <textarea required rows={6} value={form.description} onChange={set('description')} className="w-full border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:border-slate-600 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Attachments</label>
                    <input type="file" onChange={(e) => setForm((f) => ({ ...f, attachment: e.target.files[0] }))} className="text-sm text-slate-600" />
                  </div>
                  <p className="text-xs text-slate-500 leading-6 border-t border-slate-200 pt-6">
                    Hetafu is committed to protecting your privacy. Any personal information provided to us as part of this service request will be used solely to address and resolve your issue. Please avoid sending us any sensitive information, including images where you or others are identifiable. You have the right to access, correct, or request deletion of your data at any time. For more details, please refer to our{' '}
                    <a href="#" className="underline">Privacy Policy</a>.
                  </p>
                  <button type="submit" className="w-full py-4 text-white text-sm font-bold uppercase tracking-widest transition hover:bg-[#2f1614] bg-primary-brown">
                    SUBMIT
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
      <BestSellers />
      <Footer />
    </div>
  );
}
