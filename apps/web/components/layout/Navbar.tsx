'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/context/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import { ProfileOnboardingModal } from '../auth/ProfileOnboardingModal';
import {
  Compass,
  Bell,
  User as UserIcon,
  LogOut,
  Sparkles,
  ShieldCheck,
  Shield,
  Edit3,
  ChevronDown,
} from 'lucide-react';
import { FloatingWrapper, MagneticButton, RippleClickWrapper } from '../animations/SvgatorWrappers';

export function Navbar({ unreadCount = 0 }: { unreadCount?: number }) {
  const { user, profile, isAuthenticated, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Derive initials
  const displayName = profile?.fullName || user?.email?.split('@')[0] || 'Citizen';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const roleDisplay = isAdmin
    ? 'Administrator'
    : user?.role === 'student'
    ? `Student • ${profile?.currentCourse ? profile.currentCourse.split(' ')[0] : 'Academic'}`
    : user?.role === 'farmer'
    ? 'Farmer Track'
    : 'Citizen Track';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#E5DFD5] bg-[#F5F2EC]/95 backdrop-blur-md shadow-xs transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <FloatingWrapper yOffset={3} duration={4}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#948170] to-[#D5C3A5] flex items-center justify-center shadow-md shadow-[#948170]/20 svgator-icon-bounce cursor-pointer">
                <Compass className="w-5 h-5 text-white" />
              </div>
            </FloatingWrapper>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-[#1A1715]">Saarthi AI</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#EAE3D9] text-[#6B5C4F] border border-[#D5C3A5]/60">
                  Citizen Portal
                </span>
              </div>
              <p className="text-[11px] text-[#7E756C]">
                Unified Roadmap & Citizen Schemes Discovery
              </p>
            </div>
          </div>

          {/* Right Side: Auth & User Profile */}
          <div className="flex items-center gap-3">
            {/* Notification Bell with SVGator Pulse Animation */}
            <div className="relative p-2 rounded-xl text-[#7E756C] hover:text-[#1A1715] hover:bg-[#FAF7F2] transition-colors cursor-pointer svgator-icon-bounce">
              <Bell className="w-5 h-5 svgator-bell-pulse" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#948170] ring-2 ring-white animate-ping" />
              )}
            </div>

            {/* Quick Admin Portal Link */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-[#7E756C] hover:text-[#1A1715] bg-white/70 hover:bg-white border border-[#E5DFD5] shadow-xs transition-all"
              title="Open Saarthi AI Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 text-[#948170]" />
              <span className="hidden sm:inline">Admin</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5DFD5] hover:border-[#D5C3A5] shadow-xs transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#D5C3A5] flex items-center justify-center text-[#948170] font-bold text-xs shadow-inner group-hover:scale-105 transition-transform">
                    {initials}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-semibold text-[#1A1715] leading-tight flex items-center gap-1.5">
                      <span>{displayName}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#948170]" />
                    </div>
                    <div className="text-[10px] text-[#7E756C]">{roleDisplay}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8E8780] transition-transform duration-200 group-hover:translate-y-0.5" />
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 p-2 rounded-xl bg-white border border-[#E5DFD5] shadow-xl z-50 text-xs animate-fadeIn"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-[#E5DFD5] mb-1">
                      <div className="font-semibold text-[#1A1715]">{displayName}</div>
                      <div className="text-[#8E8780] text-[11px] truncate">{user?.email}</div>
                      {profile?.targetCareerGoal && (
                        <div className="mt-1 text-[10px] font-medium text-[#948170] truncate flex items-center gap-1">
                          <span>🎯 {profile.targetCareerGoal}</span>
                        </div>
                      )}
                    </div>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FAF7F2] text-[#1A1715] font-semibold border border-[#D5C3A5]/60 hover:bg-[#F5F2EC] transition-colors text-left mb-1"
                      >
                        <Shield className="w-4 h-4 text-[#948170]" />
                        <span>Admin Dashboard &rarr;</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        setProfileModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#1A1715] hover:bg-[#FAF7F2] hover:text-[#948170] transition-colors text-left"
                    >
                      <Edit3 className="w-4 h-4 text-[#948170]" />
                      <span>Edit My Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left mt-1 border-t border-[#E5DFD5] pt-2"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <MagneticButton strength={0.15}>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setAuthModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold text-[#5E544C] hover:text-[#1A1715] transition-colors"
                  >
                    Sign In
                  </button>
                </MagneticButton>
                <MagneticButton strength={0.2}>
                  <RippleClickWrapper>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signup');
                        setAuthModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl btn-luxury text-xs font-semibold shadow-sm active:scale-95 transition-transform"
                    >
                      Get Started
                    </button>
                  </RippleClickWrapper>
                </MagneticButton>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
        onSuccess={() => {
          if (!profile) {
            setProfileModalOpen(true);
          }
        }}
      />

      {/* Progressive Profile Onboarding Wizard */}
      <ProfileOnboardingModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
}
