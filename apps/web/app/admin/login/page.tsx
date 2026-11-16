'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Shield, AlertCircle, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { apiFetch, safeParseJson } from '../../../lib/api';
import { setAdminSession } from '../../../lib/adminApi';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const { data, text } = await safeParseJson(res);

      if (!res.ok) {
        const message = data?.message || data?.error || text || 'Authentication failed.';
        setError(message);
        setLoading(false);
        return;
      }

      if (!data?.user || !['admin', 'superadmin'].includes(data.user.role)) {
        setError('Access denied. This portal is strictly restricted to authorized Saarthi AI administrators.');
        setLoading(false);
        return;
      }

      // Persist administrative session
      setAdminSession(data.token, data.user);
      router.push('/admin');
    } catch (err: any) {
      setError('Could not connect to authentication server. Please verify backend is running on port 4000.');
      setLoading(false);
    }
  }

  function handleAutoFillSuperAdmin() {
    setEmail('admin@saarthi.ai');
    setPassword('Admin@Saarthi2026!');
    setError(null);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F5F2EC] text-[#1A1715] select-none">
      {/* Return link */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7E756C] hover:text-[#1A1715] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Citizen Portal</span>
        </Link>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#948170] uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>Restricted Area</span>
        </div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md p-8 overflow-hidden rounded-2xl bg-white border border-[#E5DFD5] shadow-2xl text-[#1A1715]">
        {/* Luxury Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#948170] via-[#D5C3A5] to-[#948170]" />

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#D5C3A5] mb-3 text-[#948170] shadow-sm">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1715]">
            Saarthi AI <span className="text-[#948170]">Admin Portal</span>
          </h1>
          <p className="mt-1.5 text-xs text-[#7E756C] leading-relaxed">
            Enter authorized staff credentials to manage citizen schemes, scholarships, AI governance, and system operations.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3 mb-5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600 mt-0.5" />
            <span className="flex-1 leading-normal">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#7E756C]">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#8E8780]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@saarthi.ai"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-sm text-[#1A1715] placeholder-[#A0988F] focus:outline-none focus:border-[#948170] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#7E756C]">
                Security Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8E8780]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-sm text-[#1A1715] placeholder-[#A0988F] focus:outline-none focus:border-[#948170] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#1A1715] hover:bg-[#332D29] text-[#F5F2EC] font-semibold text-sm flex items-center justify-center gap-2 border border-[#D5C3A5] shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-[#D5C3A5] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Authenticate & Access Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#D5C3A5]" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-6 pt-4 border-t border-[#E5DFD5] text-center space-y-2">
          <p className="text-[11px] text-[#7E756C]">Development & Evaluation Environment</p>
          <button
            type="button"
            onClick={handleAutoFillSuperAdmin}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#948170] hover:text-[#1A1715] underline transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Auto-fill Provisioned Super Admin (admin@saarthi.ai)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

