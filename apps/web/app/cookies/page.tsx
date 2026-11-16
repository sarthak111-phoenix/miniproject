import React from 'react';
import Link from 'next/link';
import { Cookie, ArrowLeft, ShieldCheck, Database, CheckCircle2, Lock } from 'lucide-react';

export const metadata = {
  title: 'Cookie & Local Storage Policy — Saarthi AI',
  description: 'How Saarthi AI uses client-side local storage and essential session cookies for authentication, preferences, and security.',
};

export default function CookiesPage() {
  return (
    <main className="w-full min-h-screen bg-[#F5F2EC] text-[#1A1715] px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#7E756C] hover:text-[#1A1715] transition-colors p-2 rounded-xl bg-white/80 border border-[#E5DFD5] shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#948170]" />
            <span>Back to Dashboard</span>
          </Link>
          <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#E8EFE6] text-[#4A634E] border border-[#CCD8C8]">
            Transparency Notice
          </span>
        </div>

        {/* Header Hero Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#948170] via-[#D5C3A5] to-[#948170]" />
          <div className="flex items-center gap-3 mb-3 text-[#948170]">
            <Cookie className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#7E756C]">Storage & Privacy</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1715]">
            Cookie & Local Storage Policy
          </h1>
          <p className="mt-2 text-sm text-[#5E544C] leading-relaxed max-w-2xl">
            Saarthi AI uses strictly necessary browser storage mechanisms to maintain your login session and save your roadmap progress. We do not use third-party advertising cookies or cross-site tracking pixels.
          </p>
        </div>

        {/* Section 1: Storage Breakdown */}
        <section className="p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#1A1715] font-serif text-xl font-bold">
            <Database className="w-5 h-5 text-[#948170]" />
            <h2>1. What Technologies We Use</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5E544C] leading-relaxed">
            Rather than intrusive third-party tracking cookies, Saarthi AI relies primarily on browser <strong>HTML5 LocalStorage</strong> and encrypted JWT authentication tokens:
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DFD5] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1A1715]">saarthi_token</span>
                <span className="px-2 py-0.5 rounded-full bg-[#E8EFE6] text-[#4A634E] font-semibold text-[10px]">Strictly Essential</span>
              </div>
              <p className="text-xs text-[#5E544C]">
                Stores your cryptographic JWT authentication bearer token so your session remains active while you navigate between the scheme matcher and roadmap tabs.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DFD5] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1A1715]">saarthi_cookie_consent</span>
                <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#948170] border border-[#D5C3A5] font-semibold text-[10px]">Preferences</span>
              </div>
              <p className="text-xs text-[#5E544C]">
                Remembers whether you have acknowledged our privacy and storage notice to prevent the consent banner from repeatedly interrupting your experience.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DFD5] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1A1715]">saarthi_subscribers & saarthi_citizen_feedback</span>
                <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#948170] border border-[#D5C3A5] font-semibold text-[10px]">Functional</span>
              </div>
              <p className="text-xs text-[#5E544C]">
                Caches recent newsletter subscriptions and citizen inquiry submissions locally on your browser.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Zero Third-Party Advertising Trackers */}
        <section className="p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#1A1715] font-serif text-xl font-bold">
            <Lock className="w-5 h-5 text-[#948170]" />
            <h2>2. Zero Third-Party Commercial Tracking</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5E544C] leading-relaxed">
            Saarthi AI is built as a non-commercial civic engine. We guarantee:
          </p>
          <ul className="text-xs sm:text-sm text-[#5E544C] space-y-2 list-disc pl-5 leading-relaxed">
            <li>No Google AdSense or advertising network beacons.</li>
            <li>No Meta / Facebook Pixels or social media cross-site surveillance.</li>
            <li>No data brokering or sale of student demographic profiles.</li>
          </ul>
        </section>

        {/* Section 3: Managing Browser Storage */}
        <section className="p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#1A1715] font-serif text-xl font-bold">
            <ShieldCheck className="w-5 h-5 text-[#948170]" />
            <h2>3. How to Clear or Manage Stored Data</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5E544C] leading-relaxed">
            You can clear all locally stored data at any time through your browser settings:
          </p>
          <p className="text-xs text-[#5E544C] bg-[#FAF7F2] p-4 rounded-2xl border border-[#E5DFD5]">
            In Chrome/Edge/Firefox: Press <strong>Ctrl + Shift + Delete</strong> (or <strong>Cmd + Shift + Delete</strong> on Mac), select &quot;Cookies and other site data&quot;, and click &quot;Clear data&quot;. You can also log out from the dashboard to instantly delete your local session token.
          </p>
        </section>

        {/* Return Button */}
        <div className="pt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A1715] text-[#F5F2EC] text-xs font-semibold hover:bg-[#2C2622] transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#D5C3A5]" />
            <span>Return to Saarthi Dashboard</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
