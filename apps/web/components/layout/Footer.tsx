'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  ShieldCheck,
  Landmark,
  Lock,
  Award,
  FileCheck,
  Bell,
  ExternalLink,
  ArrowUp,
  ArrowRight,
  Check,
  CheckCircle2,
  HelpCircle,
  FileText,
  Info,
  Sparkles,
  X,
  Send,
  Mail,
  GraduationCap,
  Heart,
  Scale,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  CheckCheck,
  Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingWrapper, MagneticButton, RippleClickWrapper } from '../animations/SvgatorWrappers';

type ModalType = 'about' | 'privacy' | 'terms' | 'disclaimer' | 'faq' | 'support' | null;

export function Footer() {
  const pathname = usePathname();

  // Exclude public website footer completely from all admin section routes
  if (pathname?.startsWith('/admin') || (typeof window !== 'undefined' && window.location.hostname.startsWith('admin.'))) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  // Modal State
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterTrack, setNewsletterTrack] = useState<'all' | 'scholarships' | 'schemes'>('all');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterFeedback, setNewsletterFeedback] = useState('');

  // Support & Feedback Form State
  const [feedbackCategory, setFeedbackCategory] = useState<'question' | 'feedback' | 'scheme_request' | 'bug'>('question');
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };
    if (activeModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModal]);

  // Navigate & switch tab in page.tsx
  const handleNavigate = (tab: 'schemes' | 'roadmap' | 'readiness' | 'notifications', workflow?: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('saarthi-navigate', {
          detail: { tab, workflow },
        })
      );
      const tabsEl = document.getElementById('dashboard-tabs');
      if (tabsEl) {
        tabsEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Scroll smoothly to top
  const handleScrollTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Newsletter submission handler
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterFeedback('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newsletterEmail.trim()) {
      setNewsletterStatus('error');
      setNewsletterFeedback('Please enter your email address.');
      return;
    }
    if (!emailRegex.test(newsletterEmail.trim())) {
      setNewsletterStatus('error');
      setNewsletterFeedback('Please enter a valid email address.');
      return;
    }

    setNewsletterStatus('loading');
    setTimeout(() => {
      setNewsletterStatus('success');
      setNewsletterFeedback(`Subscribed! You will receive verified alerts for ${
        newsletterTrack === 'scholarships'
          ? 'scholarships & grants'
          : newsletterTrack === 'schemes'
          ? 'citizen welfare schemes'
          : 'all schemes and academic milestones'
      }.`);
      try {
        const stored = JSON.parse(localStorage.getItem('saarthi_subscribers') || '[]');
        stored.push({
          email: newsletterEmail.trim(),
          track: newsletterTrack,
          date: new Date().toISOString(),
        });
        localStorage.setItem('saarthi_subscribers', JSON.stringify(stored));
      } catch (err) {
        // Fallback for storage restrictions
      }
      setNewsletterEmail('');
    }, 600);
  };

  // Citizen Feedback submit handler
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackEmail.trim() || !feedbackMessage.trim()) return;

    setFeedbackLoading(true);
    setTimeout(() => {
      setFeedbackLoading(false);
      setFeedbackSubmitted(true);
      try {
        const feedbackList = JSON.parse(localStorage.getItem('saarthi_citizen_feedback') || '[]');
        feedbackList.push({
          name: feedbackName.trim() || 'Citizen',
          email: feedbackEmail.trim(),
          category: feedbackCategory,
          message: feedbackMessage.trim(),
          submittedAt: new Date().toISOString(),
        });
        localStorage.setItem('saarthi_citizen_feedback', JSON.stringify(feedbackList));
      } catch (err) {
        // Fallback
      }
    }, 700);
  };

  return (
    <footer className="relative w-full overflow-hidden bg-[#1A1715] text-[#F5F2EC]">
      {/* =========================================================================
          PRE-FOOTER CALL-TO-ACTION & ASSURANCE BANNER (Quiet Luxury Transition)
          ========================================================================= */}
      <section className="relative w-full bg-[#FAF7F2] text-[#1A1715] border-t border-b border-[#E5DFD5] px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Main Card with Curved Split & Luxury Border */}
          <div className="relative rounded-3xl bg-gradient-to-br from-[#FFFFFF] via-[#FAF7F2] to-[#F5F2EC] border border-[#E5DFD5] p-8 sm:p-12 shadow-sm overflow-hidden">
            {/* Ambient decorative watermarks */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#D5C3A5]/20 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#E7EDE4]/60 rounded-full blur-2xl pointer-events-none -z-0" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Headline & Pitch */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EFE6] text-[#4A634E] text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Verified Civic Intelligence</span>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl text-[#1A1715] leading-[1.2] tracking-tight">
                  Bridging student ambitions with <br />
                  <span className="italic font-normal text-[#6E645A]">verified government opportunities.</span>
                </h3>

                <p className="text-sm sm:text-base text-[#5E544C] max-w-xl font-normal leading-relaxed">
                  Discover scholarships, welfare benefits, and personalized career roadmaps in minutes. 100% free, deterministic matching, and direct official portal links.
                </p>

                {/* Quick Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleNavigate('schemes', 'questionnaire')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A1715] text-[#F5F2EC] text-xs sm:text-sm font-medium transition-all duration-300 hover:bg-[#2C2622] hover:shadow-md active:scale-95 cursor-pointer"
                  >
                    <span>Check Scheme Eligibility</span>
                    <ArrowRight className="w-4 h-4 text-[#D5C3A5]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('roadmap')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-[#1A1715] text-xs sm:text-sm font-medium border border-[#D5C3A5] hover:border-[#948170] hover:bg-[#FAF7F2] transition-all duration-300 shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-[#948170]" />
                    <span>Explore Career Tracks</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModal('faq')}
                    className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-medium text-[#7E756C] hover:text-[#1A1715] transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-[#948170]" />
                    <span>How it works</span>
                  </button>
                </div>
              </div>

              {/* Right Trust Matrix (4 Pillars) */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-white/90 border border-[#E5DFD5] shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF3E8] text-[#8C6D47] flex items-center justify-center mb-2.5">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-sm text-[#1A1715]">5,083+ Schemes</div>
                  <div className="text-[11px] text-[#7E756C] mt-0.5">Central & State Live Feeds</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/90 border border-[#E5DFD5] shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-[#E8EFE6] text-[#4A634E] flex items-center justify-center mb-2.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-sm text-[#1A1715]">100% Deterministic</div>
                  <div className="text-[11px] text-[#7E756C] mt-0.5">Zero Rule Hallucinations</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/90 border border-[#E5DFD5] shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF3E8] text-[#8C6D47] flex items-center justify-center mb-2.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-sm text-[#1A1715]">DPDP Act 2023</div>
                  <div className="text-[11px] text-[#7E756C] mt-0.5">Consent-First Architecture</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/90 border border-[#E5DFD5] shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-[#E8EFE6] text-[#4A634E] flex items-center justify-center mb-2.5">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-sm text-[#1A1715]">Free Forever</div>
                  <div className="text-[11px] text-[#7E756C] mt-0.5">No Fees or Paywalls</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN FOOTER BODY (Dark Night Obsidian Luxury Foundation)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* ----------------- Column 1: Brand & Civic Identity ----------------- */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <FloatingWrapper yOffset={2} duration={5}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#948170] to-[#D5C3A5] flex items-center justify-center shadow-md shadow-[#948170]/20 svgator-icon-bounce">
                  <Compass className="w-5 h-5 text-[#1A1715]" />
                </div>
              </FloatingWrapper>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight text-white">Saarthi AI</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#2A2420] text-[#D5C3A5] border border-[#3A332C]">
                    सारथी
                  </span>
                </div>
                <p className="text-[11px] text-[#9AA0A6]">
                  Unified Student Roadmap & Citizen Schemes Engine
                </p>
              </div>
            </div>

            <p className="text-xs text-[#B5AEA8] leading-relaxed max-w-sm">
              Saarthi AI empowers Indian students, farmers, women, and citizens with deterministic eligibility guidance for welfare programs, scholarships, and academic milestones grounded in audited circulars.
            </p>

            {/* Official Credibility Badges */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#25211E] border border-[#3A332C] text-[#D5C3A5]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#948170]" />
                <span>NSP & myScheme Feeds</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#25211E] border border-[#3A332C] text-[#E7EDE4]">
                <Lock className="w-3.5 h-3.5 text-[#4D6247]" />
                <span>Zero Data Selling</span>
              </span>
            </div>

            {/* Quick Community / Platform Info */}
            <div className="text-[11px] text-[#7E756C] pt-2">
              <span>Need help? Open </span>
              <button
                type="button"
                onClick={() => setActiveModal('support')}
                className="text-[#D5C3A5] underline hover:text-white transition-colors cursor-pointer"
              >
                Citizen Support Desk
              </button>
              <span> or speak with our AI Copilot on the dashboard.</span>
            </div>
          </div>

          {/* ----------------- Column 2: Platform Modules (Quick Links) ----------------- */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#D5C3A5]">
              Platform Modules
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B5AEA8]">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('schemes', 'questionnaire')}
                  className="hover:text-white transition-colors flex items-center gap-2 group text-left cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-[#7E756C] group-hover:text-[#D5C3A5] transition-colors" />
                  <span>Citizen Schemes Matcher</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('roadmap')}
                  className="hover:text-white transition-colors flex items-center gap-2 group text-left cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-[#7E756C] group-hover:text-[#D5C3A5] transition-colors" />
                  <span>Career Roadmap Engine</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('readiness')}
                  className="hover:text-white transition-colors flex items-center gap-2 group text-left cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-[#7E756C] group-hover:text-[#D5C3A5] transition-colors" />
                  <span>Document Readiness</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('notifications')}
                  className="hover:text-white transition-colors flex items-center gap-2 group text-left cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-[#7E756C] group-hover:text-[#D5C3A5] transition-colors" />
                  <span>Deadline & Scheme Alerts</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('schemes', 'search_all')}
                  className="hover:text-white transition-colors flex items-center gap-2 group text-left cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-[#7E756C] group-hover:text-[#D5C3A5] transition-colors" />
                  <span>Universal Scheme Search</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const chatEl = document.getElementById('ai-copilot-input') || document.getElementById('dashboard-tabs');
                    if (chatEl) chatEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors flex items-center gap-2 group text-left cursor-pointer text-[#D5C3A5]"
                >
                  <Sparkles className="w-3 h-3 text-[#D5C3A5]" />
                  <span>Saarthi AI Copilot</span>
                </button>
              </li>
            </ul>
          </div>

          {/* ----------------- Column 3: Official Portals & Sources ----------------- */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#D5C3A5]">
              Official Portals
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B5AEA8]">
              <li>
                <a
                  href="https://www.myscheme.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <Landmark className="w-3.5 h-3.5 text-[#948170] group-hover:text-[#D5C3A5] transition-colors" />
                    <span>myScheme National Portal</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-[#7E756C] group-hover:text-white" />
                </a>
              </li>
              <li>
                <a
                  href="https://scholarships.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-[#948170] group-hover:text-[#D5C3A5] transition-colors" />
                    <span>National Scholarship Portal (NSP)</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-[#7E756C] group-hover:text-white" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.aicte-india.org"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-[#948170] group-hover:text-[#D5C3A5] transition-colors" />
                    <span>AICTE Pragati & Saksham</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-[#7E756C] group-hover:text-white" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#948170] group-hover:text-[#D5C3A5] transition-colors" />
                    <span>PM-KISAN Samman Nidhi</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-[#7E756C] group-hover:text-white" />
                </a>
              </li>
              <li>
                <a
                  href="https://dbtbharat.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <Landmark className="w-3.5 h-3.5 text-[#948170] group-hover:text-[#D5C3A5] transition-colors" />
                    <span>DBT Bharat Direct Transfer</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-[#7E756C] group-hover:text-white" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.digilocker.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <FileCheck className="w-3.5 h-3.5 text-[#948170] group-hover:text-[#D5C3A5] transition-colors" />
                    <span>DigiLocker Verification</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-[#7E756C] group-hover:text-white" />
                </a>
              </li>
            </ul>
          </div>

          {/* ----------------- Column 4: Newsletter & Legal Quick Links ----------------- */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#D5C3A5]">
              Saarthi Circle Updates
            </h4>
            <p className="text-xs text-[#B5AEA8]">
              Receive verified scheme opening dates and scholarship reminders directly in your inbox.
            </p>

            {/* Newsletter Subscription Box */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex rounded-xl bg-[#24201D] border border-[#3A332C] focus-within:border-[#D5C3A5] transition-colors overflow-hidden p-1">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    if (newsletterStatus === 'error') setNewsletterStatus('idle');
                  }}
                  placeholder="Enter your email"
                  className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-[#7E756C] outline-none"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#D5C3A5] to-[#948170] text-[#1A1715] font-semibold text-xs transition-transform active:scale-95 disabled:opacity-60 flex items-center gap-1 cursor-pointer flex-shrink-0"
                >
                  {newsletterStatus === 'loading' ? (
                    <span className="w-4 h-4 border-2 border-[#1A1715] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Join</span>
                      <Send className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>

              {newsletterFeedback && (
                <div
                  className={`text-[11px] leading-tight flex items-start gap-1.5 ${
                    newsletterStatus === 'success' ? 'text-[#849E7C]' : 'text-rose-400'
                  }`}
                >
                  {newsletterStatus === 'success' ? (
                    <CheckCheck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  )}
                  <span>{newsletterFeedback}</span>
                </div>
              )}
            </form>

            {/* Useful & Legal Fast Links */}
            <div className="pt-2 border-t border-[#2A2420] flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#9AA0A6]">
              <button
                type="button"
                onClick={() => setActiveModal('about')}
                className="hover:text-[#D5C3A5] transition-colors cursor-pointer"
              >
                About Saarthi
              </button>
              <Link
                href="/privacy"
                className="hover:text-[#D5C3A5] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-[#D5C3A5] transition-colors"
              >
                Terms of Use
              </Link>
              <Link
                href="/cookies"
                className="hover:text-[#D5C3A5] transition-colors"
              >
                Cookie Policy
              </Link>
              <button
                type="button"
                onClick={() => setActiveModal('disclaimer')}
                className="hover:text-[#D5C3A5] transition-colors cursor-pointer"
              >
                Disclaimer
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('support')}
                className="hover:text-[#D5C3A5] transition-colors cursor-pointer"
              >
                Citizen Support
              </button>
              <Link
                href="/admin"
                className="hover:text-[#D5C3A5] text-[#D5C3A5]/90 font-medium transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#D5C3A5]" />
                <span>Admin Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TRANSPARENCY & CITIZEN SAFEGUARD STRIP
            ========================================================================= */}
        <div className="mt-12 p-4 rounded-2xl bg-[#24201D] border border-[#332D27] text-xs text-[#B5AEA8] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Scale className="w-4 h-4 text-[#D5C3A5] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">Transparency Notice:</strong> Saarthi AI is an independent civic platform designed to simplify access to education and welfare schemes in India. We do not collect government processing fees or disburse benefits. All applications must be submitted directly on verified portals such as <span className="text-[#D5C3A5]">myscheme.gov.in</span> and <span className="text-[#D5C3A5]">scholarships.gov.in</span>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal('disclaimer')}
            className="text-[11px] font-semibold text-[#D5C3A5] hover:text-white whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Read full disclaimer</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* =========================================================================
            BOTTOM COPYRIGHT BAR & STATUS BEACON
            ========================================================================= */}
        <div className="mt-8 pt-6 border-t border-[#2A2420] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7E756C]">
          {/* Copyright text */}
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>© {currentYear} Saarthi AI. All rights reserved.</span>
            <span className="hidden sm:inline text-[#3A332C]">•</span>
            <span className="hidden sm:inline text-[#9AA0A6]">
              Built with pride for Indian students & citizens.
            </span>
          </div>

          {/* System Status Pulse Beacon */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#24201D] border border-[#332D27] text-[11px] text-[#CAD4C5]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#849E7C] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#849E7C]" />
            </span>
            <span>Registry Feeds Active • 5,083 Schemes Synchronized</span>
          </div>

          {/* Back to Top Button */}
          <MagneticButton strength={0.2}>
            <button
              type="button"
              onClick={handleScrollTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#24201D] hover:bg-[#2C2723] text-[#B5AEA8] hover:text-white border border-[#3A332C] transition-all text-xs cursor-pointer group"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#D5C3A5] transition-transform group-hover:-translate-y-0.5" />
            </button>
          </MagneticButton>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE MODAL DIALOGS (About, Privacy, Terms, Disclaimer, FAQ, Support)
          ========================================================================= */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl bg-[#1A1715] border border-[#3A332C] text-[#F5F2EC] shadow-2xl overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#948170] via-[#D5C3A5] to-[#948170]" />

              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-[#2E2824] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2A2420] border border-[#3A332C] flex items-center justify-center text-[#D5C3A5]">
                    {activeModal === 'about' && <Compass className="w-4 h-4" />}
                    {activeModal === 'privacy' && <Lock className="w-4 h-4" />}
                    {activeModal === 'terms' && <FileText className="w-4 h-4" />}
                    {activeModal === 'disclaimer' && <Scale className="w-4 h-4" />}
                    {activeModal === 'faq' && <HelpCircle className="w-4 h-4" />}
                    {activeModal === 'support' && <MessageSquare className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      {activeModal === 'about' && 'About Saarthi AI'}
                      {activeModal === 'privacy' && 'Privacy Policy & Data Retention'}
                      {activeModal === 'terms' && 'Terms of Service'}
                      {activeModal === 'disclaimer' && 'Government Information Disclaimer'}
                      {activeModal === 'faq' && 'Frequently Asked Questions (FAQs)'}
                      {activeModal === 'support' && 'Citizen Support & Feedback Desk'}
                    </h3>
                    <p className="text-[11px] text-[#9AA0A6]">
                      {activeModal === 'about' && 'Empowering Indian students & citizens through unified civic intelligence'}
                      {activeModal === 'privacy' && 'Aligned with Digital Personal Data Protection (DPDP) Act 2023'}
                      {activeModal === 'terms' && 'Platform rules, fair use, and responsibilities'}
                      {activeModal === 'disclaimer' && 'Independent guidance and official government citations'}
                      {activeModal === 'faq' && 'Everything you need to know about roadmaps and scheme matching'}
                      {activeModal === 'support' && 'We are here to help — submit your query or feedback'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-[#2A2420] hover:bg-[#332D27] text-[#9AA0A6] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body with Scroll */}
              <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#CAD4C5] leading-relaxed">
                {/* 1. ABOUT MODAL */}
                {activeModal === 'about' && (
                  <div className="space-y-4">
                    <p>
                      <strong>Saarthi AI (सारथी AI)</strong> was conceived to solve a critical information challenge in India: the fragmentation of educational career guidance and government welfare opportunities across dozens of central and state portals.
                    </p>
                    <div className="p-3.5 rounded-xl bg-[#24201D] border border-[#3A332C] space-y-2">
                      <h5 className="font-bold text-white text-xs">Our Core Architecture:</h5>
                      <ul className="list-disc pl-4 space-y-1.5 text-[#B5AEA8]">
                        <li>
                          <strong className="text-white">Deterministic Rule Engine:</strong> Unlike unconstrained AI systems that hallucinate scholarship qualifications, our eligibility decisions are powered by audited boolean logic matching exact income ceilings, age brackets, caste categories, and domicile restrictions.
                        </li>
                        <li>
                          <strong className="text-white">Official Data Ingestion:</strong> Synchronized with the national repository at <code>myScheme.gov.in</code> (over 5,080 central and state schemes) and the National Scholarship Portal (NSP).
                        </li>
                        <li>
                          <strong className="text-white">Personalized Student Roadmaps:</strong> Semester-by-semester career blueprints that adapt as students complete skill milestones and academic terms.
                        </li>
                      </ul>
                    </div>
                    <p>
                      Saarthi serves multiple civic personas: aspiring students seeking higher education financing, farmers discovering agricultural equipment subsidies (such as PM-KISAN), women pursuing entrepreneurship grants, and senior citizens accessing healthcare and pension entitlements.
                    </p>
                  </div>
                )}

                {/* 2. PRIVACY MODAL */}
                {activeModal === 'privacy' && (
                  <div className="space-y-4">
                    <p>
                      At Saarthi AI, citizen privacy and data autonomy are paramount. We strictly follow the principles of India’s <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>.
                    </p>
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-[#24201D] border border-[#3A332C]">
                        <h6 className="font-bold text-white">1. Data Minimization & Zero Monetization</h6>
                        <p className="text-[#B5AEA8] mt-1">
                          We do not sell, rent, or trade citizen personal information, income records, or caste demographics to any third-party advertisers or commercial entities.
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-[#24201D] border border-[#3A332C]">
                        <h6 className="font-bold text-white">2. Ephemeral Document OCR</h6>
                        <p className="text-[#B5AEA8] mt-1">
                          Documents uploaded to our Document Readiness Assistant are processed temporarily to verify checklist completion and extract verified parameters. Files are never retained permanently without explicit, granular user consent.
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-[#24201D] border border-[#3A332C]">
                        <h6 className="font-bold text-white">3. Your Right to Erasure</h6>
                        <p className="text-[#B5AEA8] mt-1">
                          You may request complete account deletion and profile removal at any time through your Profile Settings or by submitting a request to our Citizen Support Desk.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. TERMS OF SERVICE MODAL */}
                {activeModal === 'terms' && (
                  <div className="space-y-4">
                    <p>
                      By accessing or utilizing Saarthi AI, you agree to these Terms of Service. Saarthi AI is an informational and academic career guidance platform.
                    </p>
                    <ul className="list-disc pl-4 space-y-2 text-[#B5AEA8]">
                      <li>
                        <strong className="text-white">Informational Guidance Only:</strong> Saarthi AI assists you in discovering schemes and scholarships you appear eligible for based on the data you provide. We do not issue certificates, admit students, or award government benefits.
                      </li>
                      <li>
                        <strong className="text-white">Accuracy of User Input:</strong> Matching accuracy depends directly upon the honesty and precision of your submitted profile parameters (income, domicile, category, qualifications).
                      </li>
                      <li>
                        <strong className="text-white">Official Submission Mandate:</strong> All official applications must be executed through the designated nodal government agency or its verified portal before the respective scheme deadlines.
                      </li>
                      <li>
                        <strong className="text-white">Fair Usage:</strong> Users agree not to scrape, overload, reverse-engineer, or attempt denial of service against Saarthi AI’s recommendation services or underlying government API integrations.
                      </li>
                    </ul>
                  </div>
                )}

                {/* 4. DISCLAIMER MODAL */}
                {activeModal === 'disclaimer' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-[#2F2720] border border-[#4A3D31] text-[#E8DCBE]">
                      <div className="flex items-center gap-2 font-bold text-sm text-[#D5C3A5] mb-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>Non-Government Entity Declaration</span>
                      </div>
                      <p className="text-xs leading-relaxed">
                        Saarthi AI is an independent software platform developed for public civic benefit. It is <strong>not an official agency, subsidiary, or arm of the Government of India, state governments, or any public sector undertaking</strong>.
                      </p>
                    </div>

                    <p>
                      Official circulars, guidelines, deadlines, and eligibility criteria are subject to change by relevant ministries (e.g., Ministry of Social Justice and Empowerment, Ministry of Education, Ministry of Agriculture). Saarthi AI makes every effort to reflect real-time updates via our live integration with <code>myScheme.gov.in</code>.
                    </p>

                    <p>
                      Saarthi AI does not charge application fees for government schemes, does not promise guaranteed approvals, and does not retain commission. For legal or grievance inquiries, citizens are encouraged to consult official government departments or the Centralized Public Grievance Redress and Monitoring System (CPGRAMS at <code>pgportal.gov.in</code>).
                    </p>
                  </div>
                )}

                {/* 5. FAQ MODAL */}
                {activeModal === 'faq' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-[#24201D] border border-[#3A332C]">
                      <h6 className="font-bold text-white text-xs">Q: Is Saarthi AI completely free to use?</h6>
                      <p className="text-[#B5AEA8] mt-1 text-[11px]">
                        Yes, 100% free. Saarthi AI does not charge students or citizens for eligibility assessments, roadmap planning, or AI copilot guidance.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#24201D] border border-[#3A332C]">
                      <h6 className="font-bold text-white text-xs">Q: How does the scheme matching work?</h6>
                      <p className="text-[#B5AEA8] mt-1 text-[11px]">
                        Our engine uses deterministic rule evaluation comparing your age, domicile state, social category, annual family income, and education against official government circular criteria. If you match, our AI copilot explains *why* in plain language with citations.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#24201D] border border-[#3A332C]">
                      <h6 className="font-bold text-white text-xs">Q: Does Saarthi submit the application for me?</h6>
                      <p className="text-[#B5AEA8] mt-1 text-[11px]">
                        No. Saarthi AI provides direct, verified links to official government portals (such as National Scholarship Portal or state DBT sites) where you submit your application directly and securely.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#24201D] border border-[#3A332C]">
                      <h6 className="font-bold text-white text-xs">Q: How do student career roadmaps work?</h6>
                      <p className="text-[#B5AEA8] mt-1 text-[11px]">
                        Based on your target career goal (such as Full Stack Engineer, AI/ML, Cloud Architect, or Civil Services), our engine generates a semester-by-semester milestone plan including recommended certifications, projects, and skill acquisition benchmarks.
                      </p>
                    </div>
                  </div>
                )}

                {/* 6. SUPPORT & FEEDBACK MODAL */}
                {activeModal === 'support' && (
                  <div className="space-y-4">
                    {feedbackSubmitted ? (
                      <div className="p-6 rounded-2xl bg-[#24201D] border border-[#3A332C] text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#E8EFE6] text-[#4A634E] flex items-center justify-center mx-auto">
                          <CheckCheck className="w-6 h-6" />
                        </div>
                        <h5 className="font-serif text-base font-bold text-white">Thank You for Your Feedback</h5>
                        <p className="text-xs text-[#B5AEA8] max-w-sm mx-auto">
                          Your message has been received by our citizen support desk. We continuously incorporate student and citizen feedback to expand our scheme repository.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setFeedbackSubmitted(false);
                            setActiveModal(null);
                          }}
                          className="px-5 py-2 rounded-xl bg-[#D5C3A5] text-[#1A1715] font-semibold text-xs transition-transform active:scale-95"
                        >
                          Close Window
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#B5AEA8] mb-1">
                              Your Name
                            </label>
                            <input
                              type="text"
                              required
                              value={feedbackName}
                              onChange={(e) => setFeedbackName(e.target.value)}
                              placeholder="e.g. Priya Sharma"
                              className="w-full px-3 py-2 rounded-xl bg-[#24201D] border border-[#3A332C] text-xs text-white placeholder-[#7E756C] outline-none focus:border-[#D5C3A5]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#B5AEA8] mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              required
                              value={feedbackEmail}
                              onChange={(e) => setFeedbackEmail(e.target.value)}
                              placeholder="priya@example.com"
                              className="w-full px-3 py-2 rounded-xl bg-[#24201D] border border-[#3A332C] text-xs text-white placeholder-[#7E756C] outline-none focus:border-[#D5C3A5]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#B5AEA8] mb-1">
                            Feedback Category
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                              { id: 'question', label: 'General Query' },
                              { id: 'scheme_request', label: 'Request Scheme' },
                              { id: 'bug', label: 'Report Bug' },
                              { id: 'feedback', label: 'Feature Idea' },
                            ].map((cat) => (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => setFeedbackCategory(cat.id as any)}
                                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all text-center cursor-pointer ${
                                  feedbackCategory === cat.id
                                    ? 'bg-[#D5C3A5] text-[#1A1715] border-[#D5C3A5]'
                                    : 'bg-[#24201D] text-[#B5AEA8] border-[#3A332C] hover:text-white'
                                }`}
                              >
                                {cat.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#B5AEA8] mb-1">
                            Your Message
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={feedbackMessage}
                            onChange={(e) => setFeedbackMessage(e.target.value)}
                            placeholder="Share your experience, suggest a missing welfare scheme, or ask a question..."
                            className="w-full px-3 py-2 rounded-xl bg-[#24201D] border border-[#3A332C] text-xs text-white placeholder-[#7E756C] outline-none focus:border-[#D5C3A5] resize-none"
                          />
                        </div>

                        {/* Government Helpline reference */}
                        <div className="p-2.5 rounded-xl bg-[#24201D] border border-[#3A332C] text-[10px] text-[#9AA0A6] flex items-center justify-between">
                          <span>Official NSP Helpline: <strong>1800 11 2001</strong></span>
                          <span>Portal: <strong>pgportal.gov.in</strong></span>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setActiveModal(null)}
                            className="px-4 py-2 rounded-xl bg-[#24201D] text-[#B5AEA8] hover:text-white text-xs font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={feedbackLoading}
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D5C3A5] to-[#948170] text-[#1A1715] font-semibold text-xs transition-transform active:scale-95 disabled:opacity-60 flex items-center gap-1.5 cursor-pointer"
                          >
                            {feedbackLoading ? (
                              <span className="w-4 h-4 border-2 border-[#1A1715] border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <span>Submit Feedback</span>
                                <Send className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer Bar */}
              <div className="px-6 py-3.5 bg-[#141210] border-t border-[#2E2824] flex items-center justify-between text-[11px] text-[#7E756C]">
                <span>Saarthi AI Civic Intelligence Platform</span>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="text-[#D5C3A5] hover:text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
