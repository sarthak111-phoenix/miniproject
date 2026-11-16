'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cookie, X, Check, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieConsentBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Never show cookie consent banner in admin portal
    if (pathname?.startsWith('/admin') || (typeof window !== 'undefined' && window.location.hostname.startsWith('admin.'))) {
      return;
    }

    try {
      const consent = localStorage.getItem('saarthi_cookie_consent');
      if (!consent) {
        // Show after a short delay for non-intrusive appearance
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Storage restricted
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('saarthi_cookie_consent', 'accepted');
    } catch {}
    setVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('saarthi_cookie_consent', 'essential_only');
    } catch {}
    setVisible(false);
  };

  if (pathname?.startsWith('/admin') || (typeof window !== 'undefined' && window.location.hostname.startsWith('admin.'))) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 pointer-events-auto"
        >
          <div className="relative p-5 rounded-2xl bg-[#1A1715] text-[#F5F2EC] border border-[#3A332C] shadow-2xl overflow-hidden backdrop-blur-md">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#948170] via-[#D5C3A5] to-[#948170]" />

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2A2420] border border-[#3A332C] flex items-center justify-center text-[#D5C3A5] flex-shrink-0 mt-0.5">
                <Cookie className="w-4 h-4" />
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <span>Privacy & Storage Notice</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#849E7C]" />
                  </h4>
                  <button
                    type="button"
                    onClick={handleDecline}
                    className="text-[#9AA0A6] hover:text-white p-1 rounded-md transition-colors"
                    aria-label="Dismiss cookie notice"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-[#B5AEA8] leading-relaxed">
                  We use essential local storage to securely manage your login session and career roadmap. We do not use third-party advertising cookies or sell user data.
                </p>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <Link
                    href="/cookies"
                    className="text-[11px] text-[#D5C3A5] underline hover:text-white transition-colors"
                  >
                    Read Cookie Policy
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDecline}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#2A2420] text-[#B5AEA8] hover:text-white border border-[#3A332C] transition-all cursor-pointer"
                    >
                      Essential Only
                    </button>
                    <button
                      type="button"
                      onClick={handleAccept}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#D5C3A5] to-[#948170] text-[#1A1715] hover:shadow-md transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Accept</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
