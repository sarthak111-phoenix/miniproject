'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  Users,
  Flag,
  Calendar,
  X,
  Volume2,
} from 'lucide-react';
import { AdminApi } from '../../../lib/adminApi';
import { AdminConfirmModal } from '../../../components/admin/AdminConfirmModal';

interface Announcement {
  id: string;
  title: string;
  message: string;
  targetAudience: string;
  priority: string;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

export default function NotificationsAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: '',
    title: '',
  });

  // Create form state
  const [formTitle, setFormTitle] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formTarget, setFormTarget] = useState('all');
  const [formPriority, setFormPriority] = useState('normal');
  const [submitting, setSubmitting] = useState(false);

  async function loadAnnouncements() {
    setLoading(true);
    try {
      const data = await AdminApi.getAnnouncements();
      setAnnouncements(data.announcements || []);
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to load announcements.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!formTitle || !formMessage) return;
    setSubmitting(true);
    try {
      await AdminApi.createAnnouncement({
        title: formTitle,
        message: formMessage,
        targetAudience: formTarget,
        priority: formPriority,
        isActive: true,
      });
      setAlert({ type: 'success', message: `Announcement broadcasted to "${formTarget}" audience!` });
      setCreateModalOpen(false);
      setFormTitle('');
      setFormMessage('');
      loadAnnouncements();
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to publish announcement.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!confirmDelete.id) return;
    try {
      await AdminApi.deleteAnnouncement(confirmDelete.id);
      setAlert({ type: 'success', message: 'Announcement deleted.' });
      setConfirmDelete({ isOpen: false, id: '', title: '' });
      loadAnnouncements();
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete announcement.' });
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E5DFD5]/40 text-[#948170]">
              <Bell className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#948170]">Broadcast Network</span>
          </div>
          <h1 className="text-2xl font-serif font-medium text-[#1A1715] mt-1">Notifications & Announcements</h1>
          <p className="text-xs text-[#948170] mt-0.5">
            Broadcast emergency alerts, scheme deadline reminders, and portal notifications targeted by user role.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadAnnouncements()}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#1A1715] bg-white border border-[#E5DFD5] rounded-xl hover:bg-[#FAF7F2] transition shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#1A1715] rounded-xl hover:bg-[#2C2724] transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Broadcast
          </button>
        </div>
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

      {/* Grid of Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-[#948170]">
            Loading broadcast network...
          </div>
        ) : announcements.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-[#948170]">
            No announcements currently active.
          </div>
        ) : (
          announcements.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#D5C3A5] transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                      item.priority === 'urgent'
                        ? 'bg-rose-100 text-rose-800'
                        : item.priority === 'high'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.priority} priority
                  </span>
                  <span className="text-[11px] font-mono text-[#948170] uppercase">
                    Target: {item.targetAudience}
                  </span>
                </div>

                <h3 className="text-sm font-serif font-medium text-[#1A1715]">{item.title}</h3>
                <p className="text-xs text-[#6B5E55] leading-relaxed">{item.message}</p>
              </div>

              <div className="pt-3 border-t border-[#E5DFD5] flex items-center justify-between text-[11px] text-[#948170]">
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                <button
                  onClick={() => setConfirmDelete({ isOpen: true, id: item.id, title: item.title })}
                  className="p-1.5 rounded-lg text-[#948170] hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Remove Broadcast"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
              <h3 className="text-base font-serif font-medium text-[#1A1715]">Dispatch New Announcement</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 text-[#948170] hover:text-[#1A1715] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#4A3E36] mb-1">Broadcast Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. National Scholarship Portal 2026-27 Registrations Open"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#4A3E36] mb-1">Target Audience</label>
                  <select
                    value={formTarget}
                    onChange={(e) => setFormTarget(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                  >
                    <option value="all">All Citizens & Students</option>
                    <option value="student">Students Only</option>
                    <option value="citizen">Citizens Only</option>
                    <option value="farmer">Farmers Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A3E36] mb-1">Priority Level</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                  >
                    <option value="normal">Normal (Informational)</option>
                    <option value="high">High (Action Required)</option>
                    <option value="urgent">Urgent (Imminent Deadline)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3E36] mb-1">Notification Body</label>
                <textarea
                  rows={4}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Detailed guidance, links, and deadline particulars..."
                  className="w-full p-3 text-xs text-[#1A1715] bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E5DFD5]">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#6B5E55] bg-white border border-[#E5DFD5] rounded-xl hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#1A1715] rounded-xl hover:bg-[#2C2724] disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Dispatching...' : 'Dispatch Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Remove Broadcast Announcement"
        message={`Are you sure you want to delete "${confirmDelete.title}"? Users will no longer see this notification in their feed.`}
        confirmText="Delete Broadcast"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete({ isOpen: false, id: '', title: '' })}
      />
    </div>
  );
}

