'use client';

import React, { useState, useEffect } from 'react';
import {
  Landmark,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Archive,
  RefreshCw,
  X,
  FileText,
} from 'lucide-react';
import { AdminApi } from '../../../lib/adminApi';
import { AdminConfirmModal } from '../../../components/admin/AdminConfirmModal';

export default function GovernmentSchemeManagementPage() {
  const [loading, setLoading] = useState(true);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentScheme, setCurrentScheme] = useState<any | null>(null);
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
    categoryType: 'Welfare',
    benefitAmount: 'Direct Benefit Transfer (DBT)',
    deadline: '',
    portalUrl: 'https://india.gov.in',
    level: 'Central',
    state: '',
    description: '',
    status: 'published',
    requiredDocuments: '["Aadhaar Card", "Bank Passbook", "Ration Card"]',
  });

  async function loadSchemes(page = pagination.page) {
    setLoading(true);
    try {
      const data = await AdminApi.getSchemes({
        isWelfareOnly: true,
        categoryType: categoryFilter !== 'all' ? categoryFilter : undefined,
        search,
        status: statusFilter,
        page,
        limit: 20,
      });
      setSchemes(data.schemes || []);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 });
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to load government schemes.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSchemes(1);
  }, [statusFilter, categoryFilter]);

  function handleOpenCreate() {
    setIsEditing(false);
    setFormData({
      id: '',
      name: '',
      provider: 'Ministry of Rural Development',
      categoryType: 'Welfare',
      benefitAmount: 'Financial Assistance & Subsidies',
      deadline: '',
      portalUrl: 'https://india.gov.in',
      level: 'Central',
      state: '',
      description: '',
      status: 'published',
      requiredDocuments: '["Aadhaar Card", "Bank Passbook", "Ration Card"]',
    });
    setEditModalOpen(true);
  }

  function handleOpenEdit(s: any) {
    setIsEditing(true);
    setCurrentScheme(s);
    setFormData({
      id: s.id,
      name: s.name,
      provider: s.provider || '',
      categoryType: s.categoryType || 'Welfare',
      benefitAmount: s.benefitAmount || '',
      deadline: s.deadline || '',
      portalUrl: s.portalUrl || '',
      level: s.level || 'Central',
      state: s.state || '',
      description: s.description || '',
      status: s.status || 'published',
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
        categoryType: formData.categoryType,
        benefitAmount: formData.benefitAmount,
        deadline: formData.deadline || null,
        portalUrl: formData.portalUrl,
        level: formData.level,
        state: formData.state || null,
        description: formData.description,
        status: formData.status,
        requiredDocuments: docs,
      };

      if (isEditing && currentScheme) {
        await AdminApi.updateScheme(currentScheme.id, payload);
        setAlert({ type: 'success', message: `Scheme "${formData.name}" updated successfully.` });
      } else {
        await AdminApi.createScheme(payload);
        setAlert({ type: 'success', message: `Scheme "${formData.name}" registered in database.` });
      }

      setEditModalOpen(false);
      loadSchemes();
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to save scheme.' });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    setActionLoading(true);
    try {
      await AdminApi.deleteScheme(deleteModal.id);
      setAlert({ type: 'success', message: `Scheme "${deleteModal.name}" deleted.` });
      setDeleteModal({ isOpen: false, id: '', name: '' });
      loadSchemes();
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete.' });
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-[#E5DFD5] rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#948170]" />
            <h1 className="text-xl font-bold text-[#1A1715]">Government Citizen Schemes</h1>
          </div>
          <p className="mt-1 text-xs text-[#7E756C]">
            Manage Central and State welfare programs, agricultural subsidies, and citizen entitlements connected to the deterministic matching engine.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadSchemes()}
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
            <span>Add Government Scheme</span>
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

      {/* Filters */}
      <div className="p-4 bg-white border border-[#E5DFD5] rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={(e) => { e.preventDefault(); loadSchemes(1); }} className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8E8780]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scheme name, ministry..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs text-[#1A1715] placeholder-[#8E8780] focus:outline-none focus:border-[#948170] focus:bg-white transition-colors"
          />
        </form>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-semibold text-[#1A1715] outline-none"
          >
            <option value="all">All Domains</option>
            <option value="Agriculture">Agriculture & Farming</option>
            <option value="Welfare">Citizen Welfare & DBT</option>
            <option value="Healthcare">Health & Medical Insurance</option>
            <option value="Housing">Housing & Urban Development</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-semibold text-[#1A1715] outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Schemes Table */}
      <div className="bg-white border border-[#E5DFD5] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E5DFD5] text-[11px] font-bold text-[#8E8780] uppercase tracking-wider">
                <th className="py-3.5 px-4">Scheme Title & Ministry</th>
                <th className="py-3.5 px-4">Domain</th>
                <th className="py-3.5 px-4">Level / Jurisdiction</th>
                <th className="py-3.5 px-4">Assistance Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD5]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#8E8780]">
                    Loading government schemes...
                  </td>
                </tr>
              ) : schemes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#8E8780]">
                    No government schemes match the selected filters.
                  </td>
                </tr>
              ) : (
                schemes.map((s) => (
                  <tr key={s.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-bold text-[#1A1715]">{s.name}</div>
                      <div className="text-[11px] text-[#8E8780]">{s.provider || 'Government of India'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF7F2] text-[#948170] border border-[#D5C3A5]">
                        {s.categoryType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-[#5E544C]">
                      {s.level} {s.state ? `(${s.state})` : '(All India)'}
                    </td>
                    <td className="py-3 px-4 text-[#1A1715] font-semibold">{s.benefitAmount}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          s.status === 'published'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={s.portalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-[#5E544C] hover:text-[#1A1715] hover:bg-[#F5F2EC] rounded-lg"
                          title="Open Government Portal"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 text-[#5E544C] hover:text-[#1A1715] hover:bg-[#F5F2EC] rounded-lg"
                          title="Edit Scheme"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

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
                          title="Delete Scheme"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
                {isEditing ? 'Edit Government Welfare Scheme' : 'Register New Government Scheme'}
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
                  <label className="block mb-1 font-semibold uppercase text-[#7E756C]">Scheme Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-medium text-[#1A1715] focus:outline-none focus:border-[#948170]"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[#7E756C]">Ministry / Implementing Agency</label>
                  <input
                    type="text"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    placeholder="Ministry of Agriculture and Farmers Welfare"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-medium text-[#1A1715] focus:outline-none focus:border-[#948170]"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[#7E756C]">Domain Category</label>
                  <select
                    value={formData.categoryType}
                    onChange={(e) => setFormData({ ...formData, categoryType: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-semibold text-[#1A1715] outline-none"
                  >
                    <option value="Welfare">Citizen Welfare & DBT</option>
                    <option value="Agriculture">Agriculture & Farmers</option>
                    <option value="Healthcare">Healthcare & Ayushman</option>
                    <option value="Housing">Housing & Infrastructure</option>
                    <option value="Women Empowerment">Women Empowerment</option>
                    <option value="Senior Citizen">Senior Citizen Welfare</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[#7E756C]">Benefit Assistance</label>
                  <input
                    type="text"
                    required
                    value={formData.benefitAmount}
                    onChange={(e) => setFormData({ ...formData, benefitAmount: e.target.value })}
                    placeholder="e.g. ₹6,000 / year via 3 direct installments"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-medium text-[#1A1715] focus:outline-none focus:border-[#948170]"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[#7E756C]">Jurisdiction</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-semibold text-[#1A1715] outline-none"
                  >
                    <option value="Central">Central (All India)</option>
                    <option value="State">State Specific</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[#7E756C]">Specific State (Optional)</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Uttar Pradesh, Maharashtra"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-medium text-[#1A1715] focus:outline-none focus:border-[#948170]"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[#7E756C]">Official Portal URL</label>
                  <input
                    type="url"
                    required
                    value={formData.portalUrl}
                    onChange={(e) => setFormData({ ...formData, portalUrl: e.target.value })}
                    placeholder="https://pmkisan.gov.in"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-medium text-[#1A1715] focus:outline-none focus:border-[#948170]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1 font-semibold uppercase text-[#7E756C]">Brief Summary</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe objective, eligibility thresholds, and benefits..."
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-medium text-[#1A1715] focus:outline-none focus:border-[#948170]"
                  />
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
                  <span>{isEditing ? 'Save Changes' : 'Register Scheme'}</span>
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
        title="Delete Scheme"
        message={`Are you sure you want to delete "${deleteModal.name}"? This scheme will be withdrawn from all citizen eligibility recommendations.`}
        confirmLabel="Delete Scheme"
        isDestructive={true}
        loading={actionLoading}
      />
    </div>
  );
}

