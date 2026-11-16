'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  QrCode,
  Smartphone,
  Eye,
  EyeOff,
  User,
} from 'lucide-react';
import { AdminApi, getStoredAdminUser } from '../../../lib/adminApi';

export default function AdminSettingsPage() {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [twoFactorActive, setTwoFactorActive] = useState(false);
  const [togglingTwoFactor, setTogglingTwoFactor] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const user = getStoredAdminUser();
    if (user) {
      setAdminUser(user);
      if (user.twoFactorEnabled) {
        setTwoFactorActive(true);
      }
    }
  }, []);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;

    if (newPassword !== confirmPassword) {
      setAlert({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassword.length < 8) {
      setAlert({ type: 'error', message: 'New password must be at least 8 characters long.' });
      return;
    }

    setChangingPassword(true);
    setAlert(null);
    try {
      await AdminApi.updatePassword(oldPassword, newPassword);
      setAlert({ type: 'success', message: 'Administrative password updated successfully!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to update password.' });
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleToggleTwoFactor() {
    setTogglingTwoFactor(true);
    setAlert(null);
    try {
      const nextState = !twoFactorActive;
      await AdminApi.toggleTwoFactor(nextState);
      setTwoFactorActive(nextState);
      setAlert({
        type: 'success',
        message: nextState
          ? 'Two-Factor Authentication (2FA) is now enforced for your administrator account.'
          : 'Two-Factor Authentication (2FA) has been disabled.',
      });
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to update 2FA configuration.' });
    } finally {
      setTogglingTwoFactor(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div>
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#E5DFD5]/40 text-[#948170]">
            <Settings className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono uppercase tracking-widest text-[#948170]">Security Credentials</span>
        </div>
        <h1 className="text-2xl font-serif font-medium text-[#1A1715] mt-1">Admin Security Settings</h1>
        <p className="text-xs text-[#948170] mt-0.5">
          Manage your administrator credentials, password rotation policies, and multi-factor authentication.
        </p>
      </div>

      {alert && (
        <div
          className={`flex items-center gap-3 p-3.5 rounded-xl text-xs font-sans border ${
            alert.type === 'success'
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
              : 'bg-rose-50/70 border-rose-200 text-rose-800'
          }`}
        >
          {alert.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Admin Profile Overview */}
      <div className="p-5 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1A1715] text-[#D5C3A5] flex items-center justify-center font-serif text-lg font-semibold">
            {adminUser?.email?.slice(0, 2).toUpperCase() || 'AD'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-serif font-medium text-[#1A1715]">
                {adminUser?.email || 'admin@saarthi.ai'}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 font-semibold">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-[#948170] mt-0.5">
              Authorized via Server-Side Provisioning. Full administrative authorization.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#948170]">
          <span>Role ID: superadmin</span>
          <span>•</span>
          <span>Status: Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change Password Form */}
        <form onSubmit={handleChangePassword} className="p-5 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#948170]" />
              <h3 className="text-sm font-medium text-[#1A1715]">Rotate Master Password</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="text-xs text-[#948170] hover:text-[#1A1715] flex items-center gap-1"
            >
              {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPasswords ? 'Hide' : 'Show'}</span>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#4A3E36] mb-1">Current Password</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A3E36] mb-1">New Secure Password</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters with symbol & number"
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A3E36] mb-1">Confirm New Password</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={changingPassword || !oldPassword || !newPassword}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#1A1715] rounded-xl hover:bg-[#2C2724] transition shadow-xs disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {changingPassword ? 'Rotating...' : 'Update Password'}
            </button>
          </div>
        </form>

        {/* Two-Factor Authentication (2FA) */}
        <div className="p-5 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-medium text-[#1A1715]">Two-Factor Authentication (2FA)</h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                  twoFactorActive
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {twoFactorActive ? 'Active' : 'Disabled'}
              </span>
            </div>

            <p className="text-xs text-[#6B5E55] leading-relaxed">
              Require a time-based one-time password (TOTP) from an authenticator app (Google Authenticator, Microsoft Authenticator, or 1Password) in addition to your password on login.
            </p>

            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5DFD5] space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-xl border border-[#E5DFD5]">
                  <QrCode className="w-6 h-6 text-[#1A1715]" />
                </div>
                <div className="text-xs">
                  <p className="font-medium text-[#1A1715]">TOTP Secret Seed</p>
                  <p className="font-mono text-[#948170] text-[11px]">SAAR-THI2-026A-DMIN-AUTH</p>
                </div>
              </div>
              <p className="text-[11px] text-[#948170]">
                Scan with your authenticator mobile application to pair your physical device.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5DFD5] flex items-center justify-between">
            <span className="text-xs text-[#948170]">
              {twoFactorActive ? '2FA protection active' : '2FA currently optional'}
            </span>
            <button
              type="button"
              onClick={handleToggleTwoFactor}
              disabled={togglingTwoFactor}
              className={`px-4 py-2 text-xs font-medium rounded-xl transition shadow-xs ${
                twoFactorActive
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  : 'bg-[#1A1715] text-white hover:bg-[#2C2724]'
              }`}
            >
              {togglingTwoFactor
                ? 'Updating...'
                : twoFactorActive
                ? 'Disable 2FA'
                : 'Enforce 2FA Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

