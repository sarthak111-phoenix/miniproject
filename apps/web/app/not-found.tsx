import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="w-full min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#F5F2EC] text-[#1A1715]">
      <div className="max-w-lg w-full text-center space-y-6 p-8 sm:p-10 rounded-3xl bg-white border border-[#E5DFD5] shadow-sm relative overflow-hidden">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#948170] via-[#D5C3A5] to-[#948170]" />

        <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] border border-[#D5C3A5] flex items-center justify-center mx-auto text-[#948170] shadow-sm">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#FAF7F2] text-[#948170] border border-[#D5C3A5]">
            Error 404 • Page Not Found
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1A1715] tracking-tight pt-1">
            Path Uncharted
          </h1>
          <p className="text-xs sm:text-sm text-[#7E756C] max-w-sm mx-auto leading-relaxed">
            The civic scheme or roadmap view you are searching for does not exist or has been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1A1715] text-[#F5F2EC] text-xs font-semibold hover:bg-[#2C2622] transition-colors shadow-sm"
          >
            <Home className="w-4 h-4 text-[#D5C3A5]" />
            <span>Go to Dashboard</span>
          </Link>
          <Link
            href="/privacy"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#FAF7F2] text-[#1A1715] text-xs font-semibold border border-[#E5DFD5] hover:bg-white transition-colors"
          >
            <span>Privacy Notice</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
