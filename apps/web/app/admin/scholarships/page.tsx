'use client';

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Star,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Archive,
  RefreshCw,
  X,
  Calendar,
} from 'lucide-react';
import { AdminApi } from '../../../lib/adminApi';
import { AdminConfirmModal } from '../../../components/admin/AdminConfirmModal';

export default function ScholarshipManagementPage() {
  const [loading, setLoading] = useState(true);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentScholarship, setCurrentScholarship] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: '',
    name: '',
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    provider: '',
    benefitAmount: '',
    deadline: '',
    portalUrl: '',
    level: 'Central',
    state: '',
    description: '',
    status: 'published',
    isFeatured: false,
    requiredDocuments: '["Income Certificate", "Marksheet", "Aadhaar Card"]',
  });

  async function loadScholarships(page = pagination.page) {
    setLoading(true);
    try {
      const data = await AdminApi.getSchemes({
        isScholarshipOnly: true,
        search,
        status: statusFilter,
        page,
        limit: 20,
      });
      setScholarships(data.schemes || []);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 });
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to load scholarships.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadScholarships(1);
  }, [statusFilter]);

  function handleOpenCreate() {
    setIsEditing(false);
    setFormData({
      id: '',
      name: '',
      provider: '',
      benefitAmount: '₹50,000 / year',
      deadline: '2026-12-31',
      portalUrl: 'https://scholarships.gov.in',
      level: 'Central',
      state: '',
      description: '',
      status: 'published',
      isFeatured: false,
      requiredDocuments: '["Income Certificate", "Marksheet", "Aadhaar Card"]',
    });
    setEditModalOpen(true);
  }

  function handleOpenEdit(s: any) {
    setIsEditing(true);
    setCurrentScholarship(s);
    setFormData({
      id: s.id,
      name: s.name,
      provider: s.provider || '',
      benefitAmount: s.benefitAmount || '',
      deadline: s.deadline || '',
      portalUrl: s.portalUrl || '',
      level: s.level || 'Central',
      state: s.state || '',
      description: s.description || '',
      status: s.status || 'published',
      isFeatured: !!s.isFeatured,
      requiredDocuments: JSON.stringify(s.requiredDocuments || []),
    });
    setEditModalOpen(true);
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setActionLoading(true);

    try {
      let docs = [];
      try {
        docs = JSON.parse(formData.requiredDocuments);
      } catch {
        docs = formData.requiredDocuments.split(',').map((x) => x.trim());
      }

      const payload = {
        name: formData.name,
        provider: formData.provider,
        categoryType: 'Scholarship',
        benefitAmount: formData.benefitAmount,
        deadline: formData.deadline || null,
        portalUrl: formData.portalUrl,
        level: formData.level,
        state: formData.state || null,
        description: formData.description,
        status: formData.status,
        isFeatured: formData.isFeatured,
        requiredDocuments: docs,
      };

      if (isEditing && currentScholarship) {
        await AdminApi.updateScheme(currentScholarship.id, payload);
        setAlert({ type: 'success', message: `Scholarship "${formData.name}" updated successfully.` });
      } else {
        await AdminApi.createScheme(payload);
        setAlert({ type: 'success', message: `Scholarship "${formData.name}" published to database.` });
      }

      setEditModalOpen(false);
      loadScholarships();
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to save scholarship.' });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    setActionLoading(true);
    try {
      await AdminApi.deleteScheme(deleteModal.id);
      setAlert({ type: 'success', message: `Scholarship "${deleteModal.name}" deleted.` });
      setDeleteModal({ isOpen: false, id: '', name: '' });
      loadScholarships();
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete.' });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleToggleFeatured(s: any) {
    try {
      await AdminApi.updateScheme(s.id, { isFeatured: !s.isFeatured });
      setScholarships(
        scholarships.map((x) => (x.id === s.id ? { ...x, isFeatured: !s.isFeatured } : x))
      );
      setAlert({ type: 'success', message: `Featured status updated for "${s.name}".` });
    } catch (err: any) {
      setAlert({ type: 'error', message: 'Failed to update featured flag.' });
    }
  }

  async function handleToggleStatus(s: any, newStatus: string) {
    try {
      await AdminApi.updateScheme(s.id, { status: newStatus });
      setScholarships(
        scholarships.map((x) => (x.id === s.id ? { ...x, status: newStatus } : x))
      );
      setAlert({ type: 'success', message: `Status updated to ${newStatus} for "${s.name}".` });
    } catch (err: any) {
      setAlert({ type: 'error', message: 'Failed to change status.' });
    }
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-[#E5DFD5] rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#948170]" />
            <h1 className="text-xl font-bold text-[#1A1715]">Scholarship Program Management</h1>
          </div>
          <p className="mt-1 text-xs text-[#7E756C]">
            Create and maintain NSP, AICTE, and State student scholarship catalogs with eligibility limits and portal deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadScholarships()}
            className="p-2.5 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] hover:bg-[#F5F2EC] text-[#5E544C] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#1A1715] hover:bg-[#332D29] text-[#F5F2EC] border border-[#D5C3A5] shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D5C3A5]" />
            <span>Create Scholarship</span>
          </button>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center justify-between border ${
            alert.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {alert.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{alert.message}</span>
          </div>
          <button type="button" onClick={() => setAlert(null)} className="p-1 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-4 bg-white border border-[#E5DFD5] rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={(e) => { e.preventDefault(); loadScholarships(1); }} className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8E8780]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scholarship name, provider..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs text-[#1A1715] placeholder-[#8E8780] focus:outline-none focus:border-[#948170] focus:bg-white transition-colors"
          />
        </form>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-semibold text-[#1A1715] outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Scholarships Table */}
      <div className="bg-white border border-[#E5DFD5] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E5DFD5] text-[11px] font-bold text-[#8E8780] uppercase tracking-wider">
                <th className="py-3.5 px-4">Scholarship Title & Provider</th>
                <th className="py-3.5 px-4">Level / State</th>
                <th className="py-3.5 px-4">Annual Benefit</th>
                <th className="py-3.5 px-4">Deadline</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD5]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#8E8780]">
                    Loading scholarships...
                  </td>
                </tr>
              ) : scholarships.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#8E8780]">
                    No scholarship records found.
                  </td>
                </tr>
              ) : (
                scholarships.map((s) => {
                  const isExpired = s.deadline && new Date(s.deadline).getTime() < Date.now();

                  return (
                    <tr key={s.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-[#1A1715] truncate">{s.name}</div>
                        <div className="text-[11px] text-[#8E8780] truncate">{s.provider || 'National Portal'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF7F2] text-[#5E544C] border border-[#E5DFD5]">
                          {s.level} {s.state ? `• ${s.state}` : ''}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#1A1715]">{s.benefitAmount}</td>
                      <td className="py-3 px-4">
                        <div className={`flex items-center gap-1 ${isExpired ? 'text-red-600 font-semibold' : 'text-[#5E544C]'}`}>
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{s.deadline || 'Open All Year'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            s.status === 'published'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : s.status === 'draft'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-stone-50 text-stone-700 border-stone-200'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(s)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            s.isFeatured
                              ? 'bg-amber-50 text-amber-500 border-amber-200'
                              : 'bg-[#FAF7F2] text-[#8E8780] border-[#E5DFD5] hover:text-amber-500'
                          }`}
                          title={s.isFeatured ? 'Featured on Citizen Homepage' : 'Mark as Featured'}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <a
                            href={s.portalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-[#5E544C] hover:text-[#1A1715] hover:bg-[#F5F2EC] rounded-lg"
                            title="Visit Official Portal"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 text-[#5E544C] hover:text-[#1A1715] hover:bg-[#F5F2EC] rounded-lg"
                            title="Edit Scholarship"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {s.status === 'published' ? (
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(s, 'archived')}
                              className="p-1.5 text-stone-600 hover:bg-stone-50 rounded-lg"
                              title="Archive Listing"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(s, 'published')}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                              title="Publish Listing"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                id: s.id,
                                name: s.name,
                              })
                            }
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete Scholarship"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl p-6 bg-white border border-[#E5DFD5] rounded-2xl shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
              <h3 className="text-base font-bold text-[#1A1715]">
                {isEditing ? 'Edit Scholarship Program' : 'Create New Scholarship Listing'}
              </h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 text-[#8E8780] hover:text-[#1A1715] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block mb-1 font-semibold uppercase text-[#7E756C]">Scholarship Title</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. AICTE Pragati Scholarship for Girls"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-medium text-[#1A1715] focus:outline-none focus:border-[#948170]"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[#7E756C]">Provider / Ministry</label>
                  <input
                    type="text"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    placeholder="e.g. AICTE / Ministry of Education"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-medium text-[#1A1715] focus:outline-none focus:border-[#948170]"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[#7E756C]">Benefit Amount</label>
                  <input
                    type="text"
                    required
                    value={formData.benefitAmount}
                    onChange={(e) => setFormData({ ...formData, benefitAmount: e.target.value })}
                    placeholder="e.g. ₹50,000 / year"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-medium text-[#1A1715] focus:outline-none focus:border-[#948170]"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[#7E756C]">Application Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-medium text-[#1A1715] focus:outline-none focus:border-[#948170]"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[#7E756C]">Classification Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-semibold text-[#1A1715] outline-none"
                  >
                    <option value="Central">Central (National)</option>
                    <option value="State">State Specific</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[#7E756C]">Applicable State (Optional)</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Maharashtra, Uttar Pradesh..."
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-medium text-[#1A1715] focus:outline-none focus:border-[#948170]"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[#7E756C]">Official Application Portal URL</label>
                  <input
                    type="url"
                    required
                    value={formData.portalUrl}
                    onChange={(e) => setFormData({ ...formData, portalUrl: e.target.value })}
                    placeholder="https://scholarships.gov.in"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-medium text-[#1A1715] focus:outline-none focus:border-[#948170]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1 font-semibold uppercase text-[#7E756C]">Summary & Eligibility Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Key qualifications, income ceiling, affirmative quotas..."
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-medium text-[#1A1715] focus:outline-none focus:border-[#948170]"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[#7E756C]">Publication Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-semibold text-[#1A1715] outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isFeaturedCheck"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#948170] accent-[#948170]"
                  />
                  <label htmlFor="isFeaturedCheck" className="font-semibold text-[#1A1715] cursor-pointer">
                    Feature on Citizen Homepage
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5DFD5] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#F5F2EC] border border-[#E5DFD5] text-[#1A1715] rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-[#1A1715] hover:bg-[#332D29] text-[#F5F2EC] border border-[#D5C3A5] rounded-xl font-semibold flex items-center gap-2 cursor-pointer"
                >
                  {actionLoading ? <span className="w-3.5 h-3.5 border-2 border-[#D5C3A5] border-t-transparent rounded-full animate-spin" /> : null}
                  <span>{isEditing ? 'Save Changes' : 'Create Scholarship'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: '', name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Scholarship"
        message={`Are you sure you want to permanently remove "${deleteModal.name}"? This will withdraw it from the public citizen eligibility engine.`}
        confirmLabel="Delete Permanently"
        isDestructive={true}
        loading={actionLoading}
      />
    </div>
  );
}

