'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { GlobalSearchModal } from '../../components/admin/GlobalSearchModal';
import { QuickActionModal } from '../../components/admin/QuickActionModal';
import { getAdminToken, getStoredAdminUser, AdminApi } from '../../lib/adminApi';
import { Shield } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [quickActionModalOpen, setQuickActionModalOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // If on login page, skip authentication check
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    const token = getAdminToken();
    const user = getStoredAdminUser();

    if (!token || !user || !['admin', 'superadmin'].includes(user.role)) {
      router.replace('/admin/login');
      return;
    }

    setAdminUser(user);
    setCheckingAuth(false);

    // Initial check for pending tasks
    AdminApi.getDashboardStats()
      .then((data) => {
        setPendingCount(data.pendingTasks?.length || 0);
      })
      .catch(() => {});
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F2EC] text-[#1A1715]">
        <div className="flex flex-col items-center gap-4 p-8 bg-white border border-[#E5DFD5] rounded-2xl shadow-xl max-w-sm w-full mx-4 text-center animate-fadeIn">
          <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#D5C3A5] flex items-center justify-center text-[#948170]">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-base font-bold text-[#1A1715]">Verifying Administrative Credentials</div>
            <div className="text-xs text-[#7E756C] mt-1">Connecting to Saarthi AI RBAC security layer...</div>
          </div>
          <div className="w-full bg-[#FAF7F2] h-1.5 rounded-full overflow-hidden border border-[#E5DFD5]">
            <div className="h-full bg-gradient-to-r from-[#948170] to-[#D5C3A5] w-2/3 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EC] text-[#1A1715] flex flex-col">
      {/* Sidebar Component */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        adminUser={adminUser}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <AdminHeader
          onOpenMobile={() => setMobileSidebarOpen(true)}
          onOpenSearch={() => setSearchModalOpen(true)}
          onOpenQuickActions={() => setQuickActionModalOpen(true)}
          adminUser={adminUser}
          pendingCount={pendingCount}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>

        {/* Quiet Luxury Admin Footer */}
        <footer className="py-4 px-6 md:px-8 border-t border-[#E5DFD5] text-xs text-[#948170] flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl w-full mx-auto">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Saarthi AI Administrative Console</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline font-mono text-[11px]">Authorized Staff Access Only</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>RBAC Guard Active</span>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      <QuickActionModal
        isOpen={quickActionModalOpen}
        onClose={() => setQuickActionModalOpen(false)}
      />
    </div>
  );
}

