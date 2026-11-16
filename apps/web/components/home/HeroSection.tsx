'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  Compass,
  Landmark,
  FileCheck,
  ArrowRight,
  Heart,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Check,
  Bell,
  Smartphone,
  ExternalLink,
  GraduationCap,
  Users,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroSectionProps {
  onExploreEligibility: () => void;
  onBrowseRoadmaps: () => void;
  onSelectTab: (tab: 'schemes' | 'roadmap' | 'readiness' | 'notifications') => void;
  onSelectCareerTrack: (goal: string) => void;
  onOpenSchemeDetail?: (schemeSlugOrId: string) => void;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
  isAuthenticated?: boolean;
  profileName?: string;
  profileDetails?: string;
}

export function HeroSection({
  onExploreEligibility,
  onBrowseRoadmaps,
  onSelectTab,
  onSelectCareerTrack,
  onOpenSchemeDetail,
  onOpenAuth,
  onOpenProfile,
  isAuthenticated = false,
  profileName,
  profileDetails,
}: HeroSectionProps) {
  // Saved favorites state
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [favoriteToast, setFavoriteToast] = useState<string | null>(null);

  // Newsletter / Circle alert state
  const [newsletterInput, setNewsletterInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  const toggleFavorite = (id: string, name: string) => {
    setFavorites((prev) => {
      const nextState = !prev[id];
      setFavoriteToast(nextState ? `Saved "${name}" to favorites` : `Removed "${name}" from favorites`);
      setTimeout(() => setFavoriteToast(null), 3000);
      return { ...prev, [id]: nextState };
    });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterInput.trim()) return;
    setSubscribeLoading(true);
    setTimeout(() => {
      setSubscribeLoading(false);
      setIsSubscribed(true);
      setNewsletterInput('');
    }, 600);
  };

  // 5 Curated Showcase Cards (matching "Shop Our Favorites" from reference image)
  const showcaseOpportunities = [
    {
      id: 'psgs-deg',
      title: 'AICTE Pragati Scholarship',
      category: 'Technical Education',
      tag: 'Girls in Tech • ₹50,000/yr',
      benefit: '₹50,000 / Year',
      image: '/images/card_scholarship.jpg',
      type: 'scheme',
      slug: 'psgs-deg',
      actionLabel: 'Check Eligibility',
      badge: 'Applications Open',
    },
    {
      id: 'track-full-stack',
      title: 'Full Stack Engineer Track',
      category: 'Software & Web',
      tag: '8 Semesters • 14 Milestones',
      benefit: '94% Industry Fit',
      image: '/images/card_tech.jpg',
      type: 'roadmap',
      goalName: 'Full Stack Engineer',
      actionLabel: isAuthenticated ? 'View Roadmap' : 'Sign In to View',
      badge: 'Most Popular',
    },
    {
      id: 'pm-kisan',
      title: 'PM-KISAN Samman Nidhi',
      category: 'Agriculture & Farming',
      tag: 'Direct DBT Transfer',
      benefit: '₹6,000 / Year',
      image: '/images/card_farmer.jpg',
      type: 'scheme',
      slug: 'pm-kisan',
      actionLabel: 'Check Eligibility',
      badge: 'Central Sector',
    },
    {
      id: 'scheme-nos-abroad',
      title: 'National Overseas Scholarship',
      category: 'Higher Studies Abroad',
      tag: 'Masters & Ph.D. Grants',
      benefit: '100% Tuition Grant',
      image: '/images/card_overseas.jpg',
      type: 'scheme',
      slug: 'psgs-deg',
      actionLabel: 'Check Eligibility',
      badge: 'Ministry Verified',
    },
    {
      id: 'post-st',
      title: 'Post-Matric Higher Ed Grant',
      category: 'College & University',
      tag: 'SC / ST / OBC / EWS',
      benefit: 'Complete Fee Waiver',
      image: '/images/card_diploma.jpg',
      type: 'scheme',
      slug: 'post-st',
      actionLabel: 'Check Eligibility',
      badge: 'NSP Verified',
    },
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {favoriteToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-full bg-[#1A1715] text-[#F5F2EC] text-xs font-medium shadow-xl flex items-center gap-2 border border-[#D5C3A5]/30"
          >
            <CheckCircle2 className="w-4 h-4 text-[#D5C3A5]" />
            <span>{favoriteToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          HERO MAIN SECTION (Asymmetric curved split inspired by reference image)
          ========================================================================= */}
      <section className="relative pt-8 pb-16 sm:pt-12 sm:pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background Organic Curved Shape - flowing from bottom-left up to the right */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
          {/* Base off-white tone */}
          <div className="absolute inset-0 bg-[#F5F2EC]" />

          {/* Organic curved sweeping sage-cream shape behind right side */}
          <svg
            className="absolute right-0 top-0 h-full w-[65%] lg:w-[58%] text-[#E7EDE4]/80"
            viewBox="0 0 800 700"
            fill="currentColor"
            preserveAspectRatio="none"
          >
            <path d="M220,0 C120,180 80,320 0,480 C-40,560 60,650 140,700 L800,700 L800,0 Z" />
          </svg>

          {/* Secondary softer warm taupe wave */}
          <svg
            className="absolute left-0 bottom-0 w-[45%] h-[40%] text-[#EDE8DF]/50"
            viewBox="0 0 600 400"
            fill="currentColor"
            preserveAspectRatio="none"
          >
            <path d="M0,200 C150,220 280,310 400,400 L0,400 Z" />
          </svg>

          {/* Subtle decorative leaf watermark in top right */}
          <div className="absolute top-12 right-12 opacity-15 text-[#948170]">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
        </div>

        {/* Hero Content Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Typography, Copy, CTAs, Trust Markers */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Subtle decorative leaf accent */}
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#E8EFE6] text-[#4A634E]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.8-.1 2.6-.4C11.5 19.8 9 16.2 9 12c0-3.9 2.2-7.3 5.4-9.1-.8-.6-1.6-.9-2.4-.9z" />
                </svg>
              </span>
              <span className="text-xs uppercase tracking-widest font-semibold text-[#6E645A]">
                {isAuthenticated && profileName ? `Welcome back, ${profileName}` : 'Unified Civic & Education Platform'}
              </span>
            </div>

            {/* Editorial Serif Display Headline matching "Better choices. Beautiful living." */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1715] leading-[1.12] tracking-tight">
              Better pathways. <br />
              <span className="italic font-normal">Empowered futures.</span>
            </h1>

            {/* Supporting Description */}
            <p className="mt-4 sm:mt-5 text-base sm:text-lg text-[#5E544C] max-w-xl font-normal leading-relaxed">
              {profileDetails || 'Curated academic roadmaps & 100% deterministic government scheme matching for every student and citizen.'}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {/* Primary Dark Pill Button matching "Shop the Collection ->" */}
              <button
                type="button"
                onClick={onExploreEligibility}
                className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#1A1715] text-[#F5F2EC] text-sm font-medium transition-all duration-300 hover:bg-[#2C2622] hover:shadow-lg hover:shadow-[#1A1715]/15 active:scale-95"
              >
                <span>Check My Eligibility</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              {/* Secondary Outline Pill Button */}
              <button
                type="button"
                onClick={onBrowseRoadmaps}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/70 hover:bg-white text-[#1A1715] text-sm font-medium border border-[#D5C3A5] transition-all duration-300 hover:border-[#948170] shadow-2xs active:scale-95"
              >
                <Compass className="w-4 h-4 text-[#948170]" />
                <span>Explore Career Tracks</span>
              </button>

              {isAuthenticated && onOpenProfile && (
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-full bg-[#FAF7F2] hover:bg-white text-[#5E544C] hover:text-[#1A1715] text-xs font-semibold border border-[#E5DFD5] transition-all"
                >
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {/* 3 Line-Icon Trust Markers matching "Eco-Friendly | Cruelty-Free | Premium Quality" */}
            <div className="mt-10 pt-8 border-t border-[#E5DFD5]/80 flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-medium text-[#5E544C]">
              {/* Marker 1 */}
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 flex items-center justify-center text-[#4A634E]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6" />
                  </svg>
                </span>
                <span>100% Deterministic</span>
              </div>

              {/* Marker 2 */}
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 flex items-center justify-center text-[#8C6D47]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 21h18" />
                    <path d="M3 10h18" />
                    <path d="M5 6l7-3 7 3" />
                    <path d="M4 10v11" />
                    <path d="M20 10v11" />
                    <path d="M8 14v4" />
                    <path d="M12 14v4" />
                    <path d="M16 14v4" />
                  </svg>
                </span>
                <span>Official Direct Portals</span>
              </div>

              {/* Marker 3 */}
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 flex items-center justify-center text-[#4A634E]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                </span>
                <span>Auditable Rules</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Container & Floating Stamp Badge */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            {/* Visual Frame */}
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-md xl:max-w-lg">
              {/* Floating Circular Stamp / Seal (matching "THOUGHTFUL BY NATURE" from reference image) */}
              <motion.div
                className="absolute -top-4 -right-2 sm:-top-6 sm:-right-4 z-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#8A5A36] text-[#F5F2EC] flex items-center justify-center shadow-lg border-2 border-[#D5C3A5]/40 select-none">
                  {/* Circular Text SVG */}
                  <svg className="w-full h-full p-1" viewBox="0 0 100 100">
                    <path
                      id="stampCircle"
                      d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      fill="none"
                    />
                    <text className="text-[7.5px] uppercase tracking-[0.2em] fill-[#F5F2EC] font-bold">
                      <textPath href="#stampCircle">
                        • VERIFIED BY RULES • OFFICIAL NATIONAL SCHEMES
                      </textPath>
                    </text>
                  </svg>

                  {/* Center Emblem */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#724827] flex items-center justify-center shadow-inner">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5F2EC" strokeWidth="2">
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                        <path d="M2 21c0-3 1.85-5.36 5.08-6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Main Arched Visual Container */}
              <div className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden bg-[#FAF7F2] border border-[#E5DFD5] shadow-2xl shadow-[#948170]/15">
                {/* Visual Image */}
                <div className="relative aspect-3/4 w-full overflow-hidden">
                  <Image
                    src="/images/hero_scene.jpg"
                    alt="Saarthi AI Student & Citizen Guide on stone pedestal with roadmap tablet and vase"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 520px"
                    className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  />

                  {/* Subtle Gradient Vignette at base of photo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1715]/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Overlaid Live Verification Card (Interactive floating widget) */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5DFD5] shadow-lg">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4A634E] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4A634E]" />
                      </span>
                      <span className="text-[11px] font-semibold text-[#1A1715]">
                        Pragati Scholarship & Tech Track
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E8EFE6] text-[#4A634E]">
                      100% Match
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-[#5E544C] flex items-center justify-between">
                    <span>Benefit: <strong>₹50,000 / Year</strong></span>
                    <span className="text-[11px] text-[#4A634E] font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 4/4 Docs Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Micro-Badge */}
              <div className="absolute -bottom-3 -left-3 sm:-left-6 px-3.5 py-2 rounded-xl bg-white border border-[#E5DFD5] shadow-md flex items-center gap-2 text-xs font-semibold text-[#1A1715]">
                <Sparkles className="w-3.5 h-3.5 text-[#8A5A36]" />
                <span>5,000+ Verified Schemes Synced</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VALUE PROPS FLOATING CARD (4-Column bar matching reference image)
          ========================================================================= */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 z-20">
        <div className="rounded-3xl bg-white border border-[#E5DFD5] shadow-xl shadow-[#948170]/8 p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-[#E5DFD5]">
            {/* Prop 1: Deterministic Engine */}
            <div className="flex flex-col items-center text-center px-4">
              <div className="w-12 h-12 rounded-full bg-[#E8EFE6] text-[#4A634E] flex items-center justify-center mb-3 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-[#1A1715]">Deterministic Rules</h3>
              <p className="mt-1 text-xs text-[#7E756C] leading-snug">
                100% auditable eligibility with zero LLM guessing
              </p>
            </div>

            {/* Prop 2: Personalized Roadmaps */}
            <div className="flex flex-col items-center text-center px-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF3E8] text-[#8C6D47] flex items-center justify-center mb-3 shadow-xs">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-[#1A1715]">Semester Roadmaps</h3>
              <p className="mt-1 text-xs text-[#7E756C] leading-snug">
                Step-by-step milestones to land your target career
              </p>
            </div>

            {/* Prop 3: Official Portals */}
            <div className="flex flex-col items-center text-center px-4">
              <div className="w-12 h-12 rounded-full bg-[#E8EFE6] text-[#4A634E] flex items-center justify-center mb-3 shadow-xs">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-[#1A1715]">Direct Govt Links</h3>
              <p className="mt-1 text-xs text-[#7E756C] leading-snug">
                Apply directly on verified official portals safely
              </p>
            </div>

            {/* Prop 4: Document AI */}
            <div className="flex flex-col items-center text-center px-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF3E8] text-[#8C6D47] flex items-center justify-center mb-3 shadow-xs">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-[#1A1715]">Document AI Readiness</h3>
              <p className="mt-1 text-xs text-[#7E756C] leading-snug">
                Pre-check required paperwork before deadlines
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CURATED SHOWCASE SECTION (Matching "Shop Our Favorites" from reference)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1715] tracking-tight">
              Explore Featured Pathways
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#7E756C]">
              Handpicked opportunities based on national eligibility criteria.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectTab('schemes')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#1A1715] hover:text-[#8A5A36] transition-colors group"
          >
            <span>View all 5,000+ opportunities</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* 5 Product / Pathway Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {showcaseOpportunities.map((item) => {
            const isFav = !!favorites[item.id];
            return (
              <div
                key={item.id}
                className="group flex flex-col rounded-2xl bg-white border border-[#E5DFD5] hover:border-[#D5C3A5] p-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Card Visual / Photography */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF7F2] mb-3">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Heart / Favorite Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id, item.title);
                    }}
                    aria-label={`Save ${item.title}`}
                    className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isFav
                        ? 'bg-red-50 text-red-600 shadow-xs'
                        : 'bg-white/80 backdrop-blur-xs text-[#5E544C] hover:bg-white hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  {/* Badge */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-[#1A1715]/75 backdrop-blur-xs text-[10px] text-white font-medium">
                    {item.badge}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-[#8E8780] font-medium block mb-0.5">
                      {item.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#1A1715] leading-snug line-clamp-1">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-[#5E544C] block mt-0.5">
                      {item.tag}
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#F0EBE3] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1A1715]">
                      {item.benefit}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        if (item.type === 'roadmap' && item.goalName) {
                          onSelectCareerTrack(item.goalName);
                        } else if (onOpenSchemeDetail) {
                          onOpenSchemeDetail(item.id);
                        } else {
                          onSelectTab('schemes');
                        }
                      }}
                      className="text-[11px] font-semibold text-[#8A5A36] hover:text-[#1A1715] transition-colors"
                    >
                      {item.actionLabel} →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          COMMUNITY / ALERT BANNER (Matching "Join the Verdora Circle" green card)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="rounded-[32px] sm:rounded-[40px] bg-[#1C281F] border border-[#2D3F32] shadow-2xl text-white p-8 sm:p-12 relative overflow-hidden">
          {/* Subtle botanical line-art background motif */}
          <div className="absolute right-6 bottom-4 opacity-10 text-white pointer-events-none">
            <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
            {/* Left: Headline, Description & Input Form */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <h3 className="font-serif text-2xl sm:text-3xl text-white tracking-tight">
                Join the Saarthi Circle
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#CAD4C5] leading-relaxed max-w-md">
                Get exclusive alerts for newly opened central schemes, state scholarship deadlines, and personalized roadmap guidance.
              </p>

              {/* Input Form matching reference image */}
              <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row items-stretch gap-2.5">
                {isSubscribed ? (
                  <div className="w-full px-4 py-3 rounded-full bg-[#293B2D] border border-[#3E5643] text-xs text-[#E7EDE4] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A3B899]" />
                    <span>You are subscribed to verified deadline alerts!</span>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      value={newsletterInput}
                      onChange={(e) => setNewsletterInput(e.target.value)}
                      placeholder="Enter your email or phone"
                      className="flex-1 px-4 py-3 rounded-full bg-white text-[#1A1715] placeholder:text-[#8E8780] text-xs font-normal focus:outline-hidden focus:ring-2 focus:ring-[#D5C3A5]"
                      required
                    />
                    <button
                      type="submit"
                      disabled={subscribeLoading}
                      className="px-6 py-3 rounded-full bg-[#8A5A36] hover:bg-[#9E6940] text-white text-xs font-semibold whitespace-nowrap transition-colors shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      {subscribeLoading ? 'Subscribing...' : 'Join Now'}
                    </button>
                  </>
                )}
              </form>
            </div>

            {/* Middle: Floating Mobile App Mockup */}
            <div className="lg:col-span-3 flex justify-center">
              <div className="relative w-44 sm:w-48 rounded-[28px] p-2 bg-[#121A14] border-2 border-[#334638] shadow-2xl">
                {/* Phone screen preview */}
                <div className="rounded-[22px] bg-[#FAF7F2] text-[#1A1715] p-3.5 flex flex-col items-center text-center">
                  <div className="w-12 h-1 rounded-full bg-[#E5DFD5] mb-2.5" />
                  <span className="font-bold text-xs tracking-tight text-[#1A1715]">saarthi</span>
                  <span className="text-[9px] text-[#7E756C] mt-0.5">Welcome to Saarthi Circle</span>

                  {/* 3 mini status indicators */}
                  <div className="mt-3 w-full grid grid-cols-3 gap-1 pt-2 border-t border-[#E5DFD5] text-[9px] text-[#5E544C]">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-[#E8EFE6] text-[#4A634E] flex items-center justify-center font-bold text-[8px] mb-0.5">✓</div>
                      <span>Matched</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-[#FAF3E8] text-[#8C6D47] flex items-center justify-center font-bold text-[8px] mb-0.5">₹</div>
                      <span>DBT Ready</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-[#E8EFE6] text-[#4A634E] flex items-center justify-center font-bold text-[8px] mb-0.5">★</div>
                      <span>Tracked</span>
                    </div>
                  </div>

                  <div className="mt-3 w-full p-1.5 rounded-lg bg-[#E8EFE6] text-[#4A634E] text-[9px] font-semibold">
                    100% Eligible: Pragati
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Editorial Quote Block */}
            <div className="lg:col-span-4 pl-0 lg:pl-4 border-t lg:border-t-0 lg:border-l border-[#2E4233] pt-6 lg:pt-0">
              <div className="text-3xl font-serif text-[#D5C3A5] leading-none mb-2">“</div>
              <blockquote className="font-serif italic text-sm sm:text-base text-white/95 leading-relaxed">
                Applying with clarity makes every step of education and welfare more meaningful.
              </blockquote>
              <div className="mt-4 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#2E4233] flex items-center justify-center text-[11px] font-bold text-[#D5C3A5]">
                  PS
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Priya Sharma</div>
                  <div className="text-[10px] text-[#CAD4C5]">B.Tech CSE, Pragati Beneficiary</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOTTOM ASSURANCE STRIP (Matching "Good for you. Good for the planet.")
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#E5DFD5]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Serif Statement with Leaf Art */}
          <div className="flex items-center gap-3">
            <h4 className="font-serif text-lg sm:text-xl text-[#1A1715] leading-tight">
              Good for students. <br />
              <span className="italic font-normal">Good for every citizen.</span>
            </h4>
            <div className="w-8 h-8 rounded-full bg-[#E8EFE6] text-[#4A634E] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.8-.1 2.6-.4C11.5 19.8 9 16.2 9 12c0-3.9 2.2-7.3 5.4-9.1-.8-.6-1.6-.9-2.4-.9z" />
              </svg>
            </div>
          </div>

          {/* Right 3 Trust Pillars */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-xs text-[#5E544C]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FAF3E8] text-[#8C6D47] flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-[#1A1715] block">100% Free Forever</span>
                <span className="text-[10px] text-[#7E756C]">No paywalls or hidden fees</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#E8EFE6] text-[#4A634E] flex items-center justify-center">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-[#1A1715] block">Official Portals</span>
                <span className="text-[10px] text-[#7E756C]">Direct links to government sources</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FAF3E8] text-[#8C6D47] flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-[#1A1715] block">Privacy First</span>
                <span className="text-[10px] text-[#7E756C]">No personal data selling</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
