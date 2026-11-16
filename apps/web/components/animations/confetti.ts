'use client';

import confetti from 'canvas-confetti';

/**
 * Trigger an elegant celebration burst in Quiet Luxury tones (champagne, taupe, gold)
 * when a citizen matches eligible government schemes.
 */
export function triggerLuxuryConfetti() {
  if (typeof window === 'undefined') return;

  // Check reduced motion
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const luxuryColors = ['#D5C3A5', '#948170', '#E8DCBE', '#B5AEA8', '#FAF7F2'];

  confetti({
    particleCount: 55,
    spread: 65,
    origin: { y: 0.65 },
    colors: luxuryColors,
    disableForReducedMotion: true,
    ticks: 200,
    gravity: 0.9,
    scalar: 0.9,
  });
}
