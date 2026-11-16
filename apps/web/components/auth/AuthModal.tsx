'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/context/AuthContext';
import { apiFetch } from '../../lib/api';
import { X, Lock, Mail, User as UserIcon, Phone, AlertCircle, CheckCircle2, ArrowRight, Shield } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, defaultMode = 'login', onSuccess }: AuthModalProps) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'student' | 'citizen' | 'farmer'>('student');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === 'signup' && !agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy to create an account.');
      return;
    }

    setLoading(true);

    if (mode === 'login') {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setError(res.error || 'Failed to log in');
      }
    } else {
      const res = await signup({ email, password, phone, role });
      setLoading(false);
      if (res.success) {
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setError(res.error || 'Failed to create account');
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md p-8 overflow-hidden rounded-2xl bg-white border border-[#E5DFD5] shadow-2xl text-[#1A1715]">
        {/* Subtle Luxury Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#948170] via-[#D5C3A5] to-[#948170]" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8E8780] hover:text-[#1A1715] transition-colors p-1.5 rounded-full hover:bg-[#F5F2EC]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#D5C3A5] mb-3 text-[#948170] shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1715]">
            {mode === 'login' ? 'Welcome Back' : 'Join Saarthi AI'}
          </h2>
          <p className="mt-1 text-sm text-[#7E756C]">
            {mode === 'login'
              ? 'Access your citizen schemes and career roadmap'
              : 'Unlock personalized schemes and AI citizen guidance'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex p-1 mb-6 rounded-xl bg-[#F5F2EC] border border-[#E5DFD5]">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-[#1A1715] shadow-sm font-semibold'
                : 'text-[#7E756C] hover:text-[#1A1715]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-white text-[#1A1715] shadow-sm font-semibold'
                : 'text-[#7E756C] hover:text-[#1A1715]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3 mb-4 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
            {error.includes('Rate limit') && (
              <div className="pt-1.5 border-t border-red-200/70 flex items-center justify-between">
                <span className="text-[11px] text-red-600">Dev environment detected</span>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await apiFetch('/auth/reset-limits', { method: 'POST' });
                      setError(null);
                    } catch (_) {}
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Reset Rate Limit (Dev)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#7E756C]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#8E8780]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-sm text-[#1A1715] placeholder-[#A0988F] focus:outline-none focus:border-[#948170] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#7E756C]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8E8780]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-sm text-[#1A1715] placeholder-[#A0988F] focus:outline-none focus:border-[#948170] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#7E756C]">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#8E8780]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-sm text-[#1A1715] placeholder-[#A0988F] focus:outline-none focus:border-[#948170] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#7E756C]">
                  Select Your Profile Track
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'student', label: 'Student', desc: 'Roadmap & Grants' },
                    { id: 'citizen', label: 'Citizen', desc: 'Welfare Schemes' },
                    { id: 'farmer', label: 'Farmer', desc: 'Agri Subsidies' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id as any)}
                      className={`p-2.5 text-center rounded-xl border transition-all ${
                        role === item.id
                          ? 'border-[#948170] bg-[#F5F2EC] text-[#1A1715] font-semibold ring-1 ring-[#948170]'
                          : 'border-[#E5DFD5] bg-white text-[#7E756C] hover:border-[#D5C3A5]'
                      }`}
                    >
                      <div className="text-xs">{item.label}</div>
                      <div className="text-[10px] text-[#8E8780]">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-[#5E544C]">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[#D5C3A5] text-[#948170] focus:ring-[#948170] accent-[#948170] cursor-pointer"
                  />
                  <span>
                    I agree to the{' '}
                    <a href="/terms" target="_blank" className="text-[#948170] underline font-medium hover:text-[#1A1715]">
                      Terms of Service
                    </a>{' '}
                    and consent to processing my eligibility data under the{' '}
                    <a href="/privacy" target="_blank" className="text-[#948170] underline font-medium hover:text-[#1A1715]">
                      Privacy Policy (DPDP Act 2023)
                    </a>.
                  </span>
                </label>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl btn-luxury font-semibold text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-[#1A1715] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Create My Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-6 pt-4 border-t border-[#E5DFD5] text-center space-y-2">
          <p className="text-xs text-[#7E756C]">Want to try immediately?</p>
          <button
            type="button"
            onClick={() => {
              setEmail('priya.sharma@example.com');
              setPassword('Password@123');
              setMode('login');
            }}
            className="text-xs font-medium text-[#948170] hover:text-[#1A1715] underline transition-colors block mx-auto"
          >
            Auto-fill Verified Student Demo (Priya Sharma)
          </button>

          <div className="pt-2">
            <Link
              href="/admin"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs text-[#7E756C] hover:text-[#1A1715] font-medium transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#948170]" />
              <span>Administrator Access &rarr; Open Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
