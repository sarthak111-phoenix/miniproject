'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
  Key,
  Users,
  X,
  Check,
} from 'lucide-react';
import { AdminApi } from '../../../lib/adminApi';
import { AdminConfirmModal } from '../../../components/admin/AdminConfirmModal';

interface RoleItem {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: string[];
  _count?: {
    users: number;
  };
}

const AVAILABLE_PERMISSIONS = [
  { id: 'users:read', label: 'View Citizens & Accounts' },
  { id: 'users:write', label: 'Modify & Suspend Accounts' },
  { id: 'scholarships:read', label: 'View Scholarships' },
  { id: 'scholarships:write', label: 'Publish & Delete Scholarships' },
  { id: 'schemes:read', label: 'View Government Schemes' },
  { id: 'schemes:write', label: 'Publish & Delete Schemes' },
  { id: 'cms:write', label: 'Manage Website Content & Banners' },
  { id: 'config:write', label: 'Update Site Configuration' },
  { id: 'ai:write', label: 'Administer AI Runtime & Guardrails' },
  { id: 'knowledge:write', label: 'Manage Vector Knowledge Base' },
  { id: 'documents:verify', label: 'Verify Citizen Documents' },
  { id: 'support:write', label: 'Resolve Support Tickets' },
  { id: 'broadcast:write', label: 'Dispatch Announcements' },
  { id: 'audit:read', label: 'Inspect Security Audit Trail' },
  { id: 'roles:manage', label: 'Manage Roles & RBAC' },
  { id: 'backup:manage', label: 'Trigger Database Backups' },
];

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: '',
    name: '',
  });

  // Form
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  async function loadRoles() {
    setLoading(true);
    try {
      const data = await AdminApi.getRoles();
      setRoles(data.roles || []);
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to load administrative roles.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRoles();
  }, []);

  function togglePermission(permId: string) {
    if (selectedPerms.includes(permId)) {
      setSelectedPerms(selectedPerms.filter((p) => p !== permId));
    } else {
      setSelectedPerms([...selectedPerms, permId]);
    }
  }

  async function handleCreateRole(e: React.FormEvent) {
    e.preventDefault();
    if (!formName) return;
    setSubmitting(true);
    try {
      await AdminApi.createRole({
        name: formName,
        description: formDesc,
        permissions: selectedPerms,
      });
      setAlert({ type: 'success', message: `Custom role "${formName}" created successfully!` });
      setCreateModalOpen(false);
      setFormName('');
      setFormDesc('');
      setSelectedPerms([]);
      loadRoles();
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to create role.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!confirmDelete.id) return;
    try {
      await AdminApi.deleteRole(confirmDelete.id);
      setAlert({ type: 'success', message: 'Role deleted.' });
      setConfirmDelete({ isOpen: false, id: '', name: '' });
      loadRoles();
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete role.' });
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E5DFD5]/40 text-[#948170]">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#948170]">Access Control</span>
          </div>
          <h1 className="text-2xl font-serif font-medium text-[#1A1715] mt-1">Admin Roles & Permissions</h1>
          <p className="text-xs text-[#948170] mt-0.5">
            Configure Role-Based Access Control (RBAC) policies and grant least-privilege administrative capabilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadRoles()}
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
            Create Custom Role
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

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-[#948170]">
            Loading RBAC policies...
          </div>
        ) : (
          roles.map((r) => (
            <div
              key={r.id}
              className="p-5 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#D5C3A5] transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#948170]" />
                    <h3 className="text-base font-serif font-medium text-[#1A1715]">{r.name}</h3>
                  </div>
                  {r.isSystem ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#FAF7F2] border border-[#E5DFD5] text-[#948170]">
                      System
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800">
                      Custom
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#6B5E55] leading-relaxed min-h-[36px]">{r.description}</p>

                <div>
                  <span className="text-[11px] font-mono text-[#948170] uppercase">
                    Assigned Permissions ({r.permissions?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1.5 max-h-24 overflow-y-auto">
                    {r.permissions?.includes('*') ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono">
                        * (Full Superadmin Access)
                      </span>
                    ) : (
                      r.permissions?.slice(0, 6).map((p) => (
                        <span key={p} className="px-1.5 py-0.5 rounded bg-[#FAF7F2] text-[#6B5E55] text-[10px] font-mono border border-[#E5DFD5]">
                          {p}
                        </span>
                      ))
                    )}
                    {r.permissions && r.permissions.length > 6 && !r.permissions.includes('*') && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] text-[#948170] font-mono">
                        +{r.permissions.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5DFD5] flex items-center justify-between text-xs text-[#948170]">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>{r._count?.users || 0} assigned</span>
                </div>

                {!r.isSystem && (
                  <button
                    onClick={() => setConfirmDelete({ isOpen: true, id: r.id, name: r.name })}
                    className="p-1.5 rounded-lg text-[#948170] hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Custom Role"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Role Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
              <h3 className="text-base font-serif font-medium text-[#1A1715]">Create Custom Admin Role</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 text-[#948170] hover:text-[#1A1715] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#4A3E36] mb-1">Role Title</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Scholarship Auditor"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3E36] mb-1">Description</label>
                <input
                  type="text"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Defines team responsibilities and operational remit..."
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3E36] mb-2">
                  Select Permitted Capabilities ({selectedPerms.length} selected)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-2 bg-[#FAF7F2] rounded-xl border border-[#E5DFD5]">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    const isChecked = selectedPerms.includes(perm.id);
                    return (
                      <button
                        key={perm.id}
                        type="button"
                        onClick={() => togglePermission(perm.id)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition border ${
                          isChecked
                            ? 'bg-white border-[#1A1715] text-[#1A1715] shadow-xs'
                            : 'bg-transparent border-transparent text-[#6B5E55] hover:bg-white/60'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                            isChecked ? 'bg-[#1A1715] border-[#1A1715] text-white' : 'border-[#948170]'
                          }`}
                        >
                          {isChecked && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className="truncate">{perm.label}</span>
                      </button>
                    );
                  })}
                </div>
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
                  className="px-4 py-2 text-xs font-medium text-white bg-[#1A1715] rounded-xl hover:bg-[#2C2724] disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Delete Administrative Role"
        message={`Are you sure you want to remove role "${confirmDelete.name}"? Users assigned to this role will lose their custom privileges.`}
        confirmText="Delete Role"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete({ isOpen: false, id: '', name: '' })}
      />
    </div>
  );
}

