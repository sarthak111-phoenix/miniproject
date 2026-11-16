'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from './svgator-hooks';

interface KineticTextProps {
  text: string;
  className?: string;
  delay?: number;
  highlightWord?: string;
}

/**
 * Text Animation #7: Kinetic Text Reveal
 * Text Animation #9: Gradient Sweep
 * Text Animation #10: Fake 3D Layered Motion
 * Reveals existing text word-by-word with staggered spring entrance and gradient highlight
 */
export function KineticText({ text, className = '', delay = 0, highlightWord }: KineticTextProps) {
  const reduced = useReducedMotion();
  const words = text.split(' ');

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 12,
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        damping: 18,
        stiffness: 120,
      },
    },
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, idx) => {
        const isHighlight = highlightWord && word.toLowerCase().includes(highlightWord.toLowerCase());

        return (
          <motion.span
            key={idx}
            variants={wordVariants}
            className={`inline-block mr-[0.26em] ${
              isHighlight ? 'svgator-gradient-sweep font-black' : ''
            }`}
          >
            {word}
          </motion.span>
        );
      })}
    </motion.span>
  );
}
