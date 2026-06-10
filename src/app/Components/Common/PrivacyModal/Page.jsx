'use client';

import { useState, useEffect } from 'react';

export default function PrivacyModal({ isOpen, onClose }) {
  const [preferences, setPreferences] = useState({
    social: false,
    functional: false,
    targeting: false,
    performance: false,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAllowAll = () => {
    setPreferences({ social: true, functional: true, targeting: true, performance: true });
    onClose();
  };

  const handleRejectAll = () => {
    setPreferences({ social: false, functional: false, targeting: false, performance: false });
    onClose();
  };

  const handleConfirmChoices = () => {
    onClose();
  };

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-slate-950">Privacy Preference Center</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-950 text-2xl">&times;</button>
          </div>
          
          <p className="text-sm text-slate-600 mb-6">
            When you visit any website, it may store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences, or your device, and is mostly used to make the site work as you expect. The information does not usually identify you directly, but it can give you a more personalized web experience. Because we respect your right to privacy, you can choose not to allow some types of cookies. Click on the different category headings to learn more and change our default settings. Blocking some types of cookies may impact your experience of the site and the services we are able to offer.
          </p>

          <div className="flex gap-4 mb-6">
            <button 
              onClick={handleAllowAll}
              className="flex-1 bg-slate-950 text-white py-2 px-4 rounded font-semibold hover:bg-slate-800 transition"
            >
              Allow All
            </button>
            <button 
              onClick={() => {}}
              className="flex-1 border border-slate-950 text-slate-950 py-2 px-4 rounded font-semibold hover:bg-slate-50 transition"
            >
              Manage Consent Preferences
            </button>
          </div>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-950">Strictly Necessary Cookies</span>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Always Active</span>
              </div>
            </div>

            <div className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-950">Social Media Cookies</span>
                <span className="text-xs text-slate-500">{preferences.social ? 'Active' : 'Inactive'}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={preferences.social}
                  onChange={() => handleToggle('social')}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-950"></div>
              </label>
            </div>

            <div className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-950">Functional Cookies</span>
                <span className="text-xs text-slate-500">{preferences.functional ? 'Active' : 'Inactive'}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={preferences.functional}
                  onChange={() => handleToggle('functional')}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-950"></div>
              </label>
            </div>

            <div className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-950">Targeting Cookies</span>
                <span className="text-xs text-slate-500">{preferences.targeting ? 'Active' : 'Inactive'}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={preferences.targeting}
                  onChange={() => handleToggle('targeting')}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-950"></div>
              </label>
            </div>

            <div className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-950">Performance Cookies</span>
                <span className="text-xs text-slate-500">{preferences.performance ? 'Active' : 'Inactive'}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={preferences.performance}
                  onChange={() => handleToggle('performance')}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-950"></div>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button 
              onClick={handleRejectAll}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition"
            >
              Reject All
            </button>
            <button 
              onClick={handleConfirmChoices}
              className="px-6 py-2 bg-slate-950 text-white rounded hover:bg-slate-800 transition font-semibold"
            >
              Confirm My Choices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}