'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client exceptions
    console.error('Unhandled UI Error:', error);
  }, [error]);

  return (
    <main className="w-full min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#F5F2EC] text-[#1A1715]">
      <div className="max-w-lg w-full text-center space-y-6 p-8 sm:p-10 rounded-3xl bg-white border border-[#E5DFD5] shadow-sm relative overflow-hidden">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-400 via-[#948170] to-[#D5C3A5]" />

        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600 shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
            System Notice • Temporary Issue
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1715] tracking-tight pt-1">
            Something Went Wrong
          </h1>
          <p className="text-xs sm:text-sm text-[#7E756C] max-w-sm mx-auto leading-relaxed">
            We encountered an unexpected error while loading this civic view. Your stored profile and roadmap data are safe.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1A1715] text-[#F5F2EC] text-xs font-semibold hover:bg-[#2C2622] transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-[#D5C3A5]" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#FAF7F2] text-[#1A1715] text-xs font-semibold border border-[#E5DFD5] hover:bg-white transition-colors"
          >
            <Home className="w-4 h-4 text-[#948170]" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
