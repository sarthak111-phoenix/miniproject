'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from './svgator-hooks';

/**
 * Scroll Animation #24: Sticky Scroll Progress Indicator
 * Renders a subtle, non-intrusive animated progress bar at the very top of viewport
 */
export function ScrollProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || typeof window === 'undefined') return;
    if (pathname?.startsWith('/admin')) return;

    const updateScrollProgress = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setProgress(Number((currentScroll / scrollHeight).toFixed(4)) * 100);
      }
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, [reduced, pathname]);

  if (reduced || pathname?.startsWith('/admin')) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[3px] pointer-events-none bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#D5C3A5] via-[#948170] to-[#D5C3A5] transition-all duration-150 ease-out shadow-[0_0_8px_rgba(213,195,165,0.6)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
