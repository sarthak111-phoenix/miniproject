'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion, use3DTilt, useMagnetic } from './svgator-hooks';

/**
 * 1. Floating SVG Animation Wrapper
 * Continuous subtle vertical float with gentle rotation
 */
export function FloatingWrapper({
  children,
  className = '',
  duration = 4.5,
  yOffset = 8,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  yOffset?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      animate={{
        y: [-yOffset, yOffset, -yOffset],
        rotate: [-0.6, 0.6, -0.6],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * 2 & 3. Organic Morphing Gradient Blob Motion
 * Smooth SVG path morphing and rotation in Quiet Luxury warm tones
 */
export function OrganicBlobMotion({
  className = '',
  size = 380,
  color = 'rgba(213, 195, 165, 0.12)',
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div
      className={`absolute pointer-events-none -z-10 blur-3xl opacity-60 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div
        className="w-full h-full svgator-blob-morph"
        style={{
          background: `radial-gradient(circle, ${color} 0%, rgba(148, 129, 112, 0.04) 70%, transparent 100%)`,
        }}
      />
    </div>
  );
}

/**
 * 5 & 23. Scroll Reveal Component
 * Directions: 'up' | 'down' | 'left' | 'right' | 'zoom' | 'rotate'
 */
export function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.55,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'zoom' | 'rotate';
  delay?: number;
  duration?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  const offsets = {
    up: { y: 24, x: 0, scale: 1, rotate: 0 },
    down: { y: -24, x: 0, scale: 1, rotate: 0 },
    left: { x: 30, y: 0, scale: 1, rotate: 0 },
    right: { x: -30, y: 0, scale: 1, rotate: 0 },
    zoom: { scale: 0.94, x: 0, y: 0, rotate: 0 },
    rotate: { rotate: -3, scale: 0.96, x: 0, y: 15 },
  }[direction];

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        x: offsets.x,
        y: offsets.y,
        scale: offsets.scale,
        rotate: offsets.rotate,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
      }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * 11 & 13. Magnetic Button Wrapper
 * Moves slightly toward mouse on hover and morphs smoothly
 */
export function MagneticButton({
  children,
  className = '',
  distance = 14,
  strength,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  strength?: number;
}) {
  const actualDistance = strength ? Math.round(strength * 60) : distance;
  const { ref, position, onMouseMove, onMouseLeave } = useMagnetic(actualDistance);
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref as any}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 220, damping: 14, mass: 0.2 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * 12. Ripple Click Effect Container
 * Generates expanding SVG rings on user click
 */
export function RippleClickWrapper({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const reduced = useReducedMotion();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 700);
  };

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={handleClick}>
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="svgator-ripple"
          style={{
            left: r.x - 20,
            top: r.y - 20,
            width: 40,
            height: 40,
          }}
        />
      ))}
    </div>
  );
}

/**
 * 27, 28 & 29. GlassCard with 3D Tilt, Floating Hover Lift, and Glass Reflection
 */
export function GlassCard({
  children,
  className = '',
  onClick,
  tilt = true,
  floating = true,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tilt?: boolean;
  floating?: boolean;
}) {
  const { ref, tilt: tiltState, onMouseMove, onMouseLeave, reduced } = use3DTilt(tilt ? 5 : 0);

  if (reduced) {
    return (
      <div className={`card-container ${className}`} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX: tilt ? tiltState.rotateX : 0,
        rotateY: tilt ? tiltState.rotateY : 0,
        y: floating && tiltState.isHovered ? -4 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className={`card-container svgator-glass-card ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * 20. Morphing Blob Loader
 */
export function MorphingBlobLoader({ size = 48 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center mx-auto" style={{ width: size, height: size }}>
      <div className="w-full h-full svgator-blob-morph bg-gradient-to-br from-[#948170] to-[#D5C3A5] opacity-75 shadow-md" />
      <div className="absolute w-2/3 h-2/3 bg-white rounded-full flex items-center justify-center">
        <span className="w-2 h-2 rounded-full bg-[#948170] animate-ping" />
      </div>
    </div>
  );
}

/**
 * 21. Orbit Loader
 */
export function OrbitLoader({ size = 36 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center mx-auto" style={{ width: size, height: size }}>
      <div className="w-full h-full rounded-full border-2 border-[#E5DFD5] border-t-[#948170] svgator-orbit" />
      <div className="absolute w-2 h-2 rounded-full bg-[#D5C3A5] -top-1" />
      <div className="absolute w-1.5 h-1.5 rounded-full bg-[#948170]" />
    </div>
  );
}

/**
 * 22. Liquid Fill Progress Loader
 */
export function LiquidFillLoader({ progress = 0, height = 10 }: { progress: number; height?: number }) {
  return (
    <div
      className="relative w-full bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E5DFD5]"
      style={{ height }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-[#948170] via-[#D5C3A5] to-[#948170] rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}

/**
 * 15. Morphing Success State Checkmark
 */
export function AnimatedCheckmark({ size = 24 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-emerald-600 inline-block"
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', damping: 12, stiffness: 200 }}
    >
      <motion.path
        d="M20 6L9 17L4 12"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />
    </motion.svg>
  );
}

/**
 * Extra: Animated Counter Number
 */
export function CounterNumber({
  value = 0,
  duration = 1,
  suffix = '',
}: {
  value: number;
  duration?: number;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }

    let start = 0;
    const stepTime = Math.abs(Math.floor((duration * 1000) / (value || 1)));
    const timer = setInterval(() => {
      start += 1;
      setDisplay((prev) => {
        if (prev < value) return prev + 1;
        clearInterval(timer);
        return value;
      });
    }, Math.max(stepTime, 20));

    return () => clearInterval(timer);
  }, [value, duration, reduced]);

  return <span>{display}{suffix}</span>;
}
