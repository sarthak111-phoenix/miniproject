'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Landmark,
  FileEdit,
  Sliders,
  Bot,
  BookOpen,
  FileText,
  Bell,
  HelpCircle,
  BarChart3,
  ShieldCheck,
  Activity,
  Boxes,
  DatabaseBackup,
  UserCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { clearAdminSession } from '../../lib/adminApi';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  adminUser: any | null;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const ADMIN_NAV_SECTIONS = [
  {
    category: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    category: 'PLATFORM MANAGEMENT',
    items: [
      { label: 'User Management', href: '/admin/users', icon: Users },
      { label: 'Scholarships', href: '/admin/scholarships', icon: GraduationCap },
      { label: 'Government Schemes', href: '/admin/schemes', icon: Landmark },
      { label: 'Website CMS', href: '/admin/cms', icon: FileEdit },
      { label: 'Website Config', href: '/admin/config', icon: Sliders },
    ],
  },
  {
    category: 'AI & DOCUMENTS',
    items: [
      { label: 'AI Copilot', href: '/admin/ai-copilot', icon: Bot },
      { label: 'AI Knowledge Base', href: '/admin/knowledge-base', icon: BookOpen },
      { label: 'User Documents', href: '/admin/documents', icon: FileText },
    ],
  },
  {
    category: 'COMMUNICATION',
    items: [
      { label: 'Announcements', href: '/admin/notifications', icon: Bell },
      { label: 'Support & Tickets', href: '/admin/support', icon: HelpCircle },
    ],
  },
  {
    category: 'ANALYTICS',
    items: [
      { label: 'Reports & Analytics', href: '/admin/analytics', icon: BarChart3 },
      { label: 'Activity & Audit Logs', href: '/admin/audit-logs', icon: ShieldCheck },
    ],
  },
  {
    category: 'SYSTEM',
    items: [
      { label: 'System Monitoring', href: '/admin/monitoring', icon: Activity },
      { label: 'Integrations', href: '/admin/integrations', icon: Boxes },
      { label: 'Backup & Recovery', href: '/admin/backup', icon: DatabaseBackup },
      { label: 'Roles & Permissions', href: '/admin/roles', icon: UserCheck },
      { label: 'Admin Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

export function AdminSidebar({
  collapsed,
  onToggleCollapse,
  adminUser,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearAdminSession();
    router.push('/admin/login');
  }

  const isRoleSuper = adminUser?.role === 'superadmin';

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-[#E5DFD5] transition-all duration-300 select-none ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#E5DFD5] bg-[#FAF7F2]">
          <Link href="/admin" className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#1A1715] text-[#D5C3A5] font-serif font-bold text-lg shadow-xs flex-shrink-0">
              S
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-serif font-bold text-base tracking-tight text-[#1A1715] leading-tight">
                  Saarthi <span className="text-[#948170]">Admin</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8E8780]">
                  Control Portal
                </span>
              </div>
            )}
          </Link>

          {/* Collapse Button (Desktop Only) */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-[#8E8780] hover:text-[#1A1715] hover:bg-[#F5F2EC] transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {ADMIN_NAV_SECTIONS.map((section) => (
            <div key={section.category} className="space-y-1">
              {!collapsed ? (
                <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-[#8E8780] uppercase">
                  {section.category}
                </div>
              ) : (
                <div className="w-full my-2 border-t border-[#E5DFD5]" />
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#1A1715] text-[#F5F2EC] shadow-xs'
                        : 'text-[#5E544C] hover:bg-[#FAF7F2] hover:text-[#1A1715]'
                    } ${collapsed ? 'justify-center px-0' : ''}`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#D5C3A5]' : 'text-[#8E8780]'}`} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer: User Profile & Public Site Link */}
        <div className="p-3 border-t border-[#E5DFD5] bg-[#FAF7F2] space-y-2">
          {/* Quick link to public website */}
          <Link
            href="/"
            target="_blank"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#7E756C] hover:text-[#1A1715] hover:bg-[#F5F2EC] transition-colors ${
              collapsed ? 'justify-center px-0' : ''
            }`}
            title="Open Public Saarthi AI Website"
          >
            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            {!collapsed && <span>View Public Site</span>}
          </Link>

          {/* Admin Identity Pill */}
          <div className={`flex items-center gap-2.5 p-2 rounded-xl bg-white border border-[#E5DFD5] ${collapsed ? 'justify-center' : ''}`}>
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#D5C3A5] text-[#948170] flex-shrink-0">
              <Shield className="w-4 h-4" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-[#1A1715] truncate">
                  {adminUser?.profile?.fullName || adminUser?.email?.split('@')[0] || 'Administrator'}
                </div>
                <div className="text-[10px] font-semibold text-[#948170] truncate uppercase tracking-wider">
                  {isRoleSuper ? 'Super Admin' : 'Admin Staff'}
                </div>
              </div>
            )}

            {!collapsed && (
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 text-[#8E8780] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Log Out of Admin Portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

