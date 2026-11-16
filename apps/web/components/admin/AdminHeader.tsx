'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  Shield,
  Activity,
  LogOut,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Plus,
} from 'lucide-react';
import { clearAdminSession } from '../../lib/adminApi';

interface AdminHeaderProps {
  onOpenMobile: () => void;
  onOpenSearch: () => void;
  onOpenQuickActions: () => void;
  adminUser: any | null;
  pendingCount?: number;
  systemHealth?: string;
}

export function AdminHeader({
  onOpenMobile,
  onOpenSearch,
  onOpenQuickActions,
  adminUser,
  pendingCount = 0,
  systemHealth = 'operational',
}: AdminHeaderProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  function handleLogout() {
    clearAdminSession();
    router.push('/admin/login');
  }

  const currentDateFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-white/80 backdrop-blur-md border-b border-[#E5DFD5]">
      {/* Left: Mobile Toggle & Page Info */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          className="p-2 -ml-2 text-[#7E756C] hover:text-[#1A1715] hover:bg-[#F5F2EC] rounded-xl md:hidden"
          title="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex flex-col">
          <div className="text-xs font-semibold text-[#8E8780]">{currentDateFormatted}</div>
          <div className="text-sm font-bold text-[#1A1715]">
            Welcome back, <span className="text-[#948170]">{adminUser?.profile?.fullName?.split(' ')[0] || 'Administrator'}</span>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar Trigger */}
      <div className="flex-1 max-w-md mx-4">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5] text-[#8E8780] hover:border-[#D5C3A5] hover:bg-white text-xs transition-all shadow-2xs group cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#8E8780] group-hover:text-[#1A1715] transition-colors" />
            <span className="truncate">Search users, schemes, scholarships, tickets...</span>
          </span>
          <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#8E8780] bg-white border border-[#E5DFD5] rounded-md shadow-2xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Quick Actions, Health, Alerts, Profile */}
      <div className="flex items-center gap-2.5">
        {/* Quick Actions Shortcut */}
        <button
          type="button"
          onClick={onOpenQuickActions}
          className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1A1715] text-[#F5F2EC] hover:bg-[#332D29] border border-[#D5C3A5] shadow-2xs transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#D5C3A5]" />
          <span>Quick Action</span>
        </button>

        {/* System Health Indicator */}
        <Link
          href="/admin/monitoring"
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
          title="System Health: Fully Operational"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Health</span>
        </Link>

        {/* Pending Tasks & Notification Drawer Trigger */}
        <Link
          href="/admin/support"
          className="relative p-2 text-[#7E756C] hover:text-[#1A1715] hover:bg-[#F5F2EC] rounded-xl transition-colors"
          title={`${pendingCount} pending task(s)`}
        >
          <Bell className="w-4 h-4" />
          {pendingCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold text-white bg-red-600 rounded-full ring-2 ring-white">
              {pendingCount}
            </span>
          )}
        </Link>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#F5F2EC] border border-transparent hover:border-[#E5DFD5] transition-all cursor-pointer"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#D5C3A5] text-[#948170] font-bold text-xs">
              <Shield className="w-4 h-4" />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8E8780]" />
          </button>

          {profileOpen && (
            <>
              <div onClick={() => setProfileOpen(false)} className="fixed inset-0 z-30" />
              <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-white border border-[#E5DFD5] shadow-xl z-40 text-[#1A1715] animate-fadeIn space-y-1">
                <div className="px-3 py-2 border-b border-[#E5DFD5]">
                  <div className="text-xs font-bold truncate">
                    {adminUser?.profile?.fullName || 'Administrator'}
                  </div>
                  <div className="text-[11px] text-[#8E8780] truncate">{adminUser?.email}</div>
                  <div className="mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF7F2] text-[#948170] border border-[#D5C3A5]">
                    {adminUser?.role === 'superadmin' ? 'Super Administrator' : 'Administrator'}
                  </div>
                </div>

                <Link
                  href="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#5E544C] hover:bg-[#FAF7F2] hover:text-[#1A1715] transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Admin Settings & 2FA</span>
                </Link>

                <Link
                  href="/admin/audit-logs"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#5E544C] hover:bg-[#FAF7F2] hover:text-[#1A1715] transition-colors"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>My Audit Logs</span>
                </Link>

                <div className="my-1 border-t border-[#E5DFD5]" />

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

