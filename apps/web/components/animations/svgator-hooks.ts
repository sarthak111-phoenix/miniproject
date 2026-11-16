'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook to detect if user has requested reduced motion for accessibility
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reduced;
}

/**
 * Hero Animation #4: Mouse Parallax Hook
 * Returns normalized { x, y } offsets based on cursor movement
 */
export function useMouseParallax(strength: number = 15) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || typeof window === 'undefined') return;

    let frameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const { innerWidth, innerHeight } = window;
        const normalizedX = (e.clientX / innerWidth - 0.5) * 2;
        const normalizedY = (e.clientY / innerHeight - 0.5) * 2;
        setOffset({
          x: normalizedX * strength,
          y: normalizedY * strength,
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, [strength, reduced]);

  return reduced ? { x: 0, y: 0 } : offset;
}

/**
 * Card Animation #29: 3D Tilt on Cursor Hook
 * Adds interactive 3D perspective tilt to cards following mouse position
 */
export function use3DTilt(maxTilt: number = 8) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, isHovered: false });
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const middleX = rect.width / 2;
      const middleY = rect.height / 2;

      const rotateY = ((x - middleX) / middleX) * maxTilt;
      const rotateX = -((y - middleY) / middleY) * maxTilt;

      setTilt({ rotateX, rotateY, isHovered: true });
    },
    [maxTilt, reduced]
  );

  const onMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, isHovered: false });
  }, []);

  return { ref, tilt, onMouseMove, onMouseLeave, reduced };
}

/**
 * Button Microinteraction #11: Magnetic Hover Hook
 * Button moves smoothly towards cursor when hovered
 */
export function useMagnetic(distance: number = 18) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduced || !ref.current) return;
      const { clientX, clientY } = e;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const deltaX = (clientX - centerX) / (width / 2);
      const deltaY = (clientY - centerY) / (height / 2);

      setPosition({
        x: deltaX * distance,
        y: deltaY * distance,
      });
    },
    [distance, reduced]
  );

  const onMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return { ref, position, onMouseMove, onMouseLeave };
}
