'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  MoreVertical,
  Shield,
  UserX,
  UserCheck,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { AdminApi } from '../../../lib/adminApi';
import { AdminConfirmModal } from '../../../components/admin/AdminConfirmModal';

export default function UserManagementPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    userId: string;
    action: 'delete' | 'suspend' | 'activate';
    title: string;
    message: string;
  }>({
    isOpen: false,
    userId: '',
    action: 'delete',
    title: '',
    message: '',
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load Users
  async function loadUsers(page = pagination.page) {
    setLoading(true);
    try {
      const data = await AdminApi.getUsers({
        search,
        role: roleFilter,
        status: statusFilter,
        page,
        limit: 15,
      });
      setUsers(data.users || []);
      setPagination(data.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to load user directory.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers(1);
  }, [roleFilter, statusFilter]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    loadUsers(1);
  }

  async function handleExportCsv() {
    try {
      const token = localStorage.getItem('saarthi_admin_token') || localStorage.getItem('saarthi_token');
      const res = await fetch('http://localhost:4000/admin/users/export', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `saarthi_users_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setAlert({ type: 'success', message: 'User directory exported to CSV successfully.' });
    } catch (err: any) {
      setAlert({ type: 'error', message: 'Failed to export users CSV.' });
    }
  }

  async function handleConfirmAction() {
    setActionLoading(true);
    try {
      if (confirmModal.action === 'delete') {
        await AdminApi.deleteUser(confirmModal.userId);
        setAlert({ type: 'success', message: 'User account permanently removed.' });
      } else if (confirmModal.action === 'suspend') {
        await AdminApi.updateUserStatus(confirmModal.userId, 'suspended');
        setAlert({ type: 'success', message: 'User account has been suspended.' });
      } else if (confirmModal.action === 'activate') {
        await AdminApi.updateUserStatus(confirmModal.userId, 'active');
        setAlert({ type: 'success', message: 'User account restored to active status.' });
      }
      setConfirmModal({ ...confirmModal, isOpen: false });
      loadUsers();
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Operation failed.' });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUpdateRole(newRole: string) {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await AdminApi.updateUserRole(selectedUser.id, newRole);
      setAlert({ type: 'success', message: `User role updated to ${newRole}.` });
      setRoleModalOpen(false);
      loadUsers();
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to update role.' });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleViewDetails(user: any) {
    try {
      const full = await AdminApi.getUserById(user.id);
      setSelectedUser(full);
      setViewModalOpen(true);
    } catch (err: any) {
      setAlert({ type: 'error', message: 'Could not load complete profile details.' });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-[#E5DFD5] rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#948170]" />
            <h1 className="text-xl font-bold text-[#1A1715]">Citizen & Staff User Management</h1>
          </div>
          <p className="mt-1 text-xs text-[#7E756C]">
            Manage student registrations, citizen eligibility verifications, account statuses, and RBAC administrative roles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadUsers(pagination.page)}
            className="p-2.5 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] hover:bg-[#F5F2EC] text-[#5E544C] transition-colors"
            title="Refresh directory"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#1A1715] hover:bg-[#332D29] text-[#F5F2EC] border border-[#D5C3A5] shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#D5C3A5]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Alert Banner */}
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

      {/* Filters Bar */}
      <div className="p-4 bg-white border border-[#E5DFD5] rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8E8780]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email, name, phone..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs text-[#1A1715] placeholder-[#8E8780] focus:outline-none focus:border-[#948170] focus:bg-white transition-colors"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-semibold text-[#1A1715] outline-none"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="citizen">Citizen</option>
            <option value="farmer">Farmer</option>
            <option value="admin">Administrator</option>
            <option value="superadmin">Super Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs font-semibold text-[#1A1715] outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white border border-[#E5DFD5] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E5DFD5] text-[11px] font-bold text-[#8E8780] uppercase tracking-wider">
                <th className="py-3.5 px-4">Citizen / Staff</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Activity</th>
                <th className="py-3.5 px-4">Registered</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD5]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#8E8780]">
                    Loading user records from database...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#8E8780]">
                    No citizens or staff members match the selected criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isSuspended = u.status === 'suspended';
                  const isSuper = u.role === 'superadmin';

                  return (
                    <tr key={u.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#1A1715]">{u.fullName}</div>
                        <div className="text-[11px] text-[#8E8780]">{u.email}</div>
                      </td>
                      <td className="py-3 px-4 text-[#5E544C]">{u.phone || '—'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            isSuper
                              ? 'bg-purple-50 text-purple-800 border-purple-200'
                              : u.role === 'admin'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-[#FAF7F2] text-[#948170] border-[#D5C3A5]'
                          }`}
                        >
                          {u.adminRole || u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            u.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                          />
                          <span>{u.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-[#7E756C]">
                        {u.metrics.roadmaps} Roadmaps • {u.metrics.documents} Docs
                      </td>
                      <td className="py-3 px-4 text-[11px] text-[#8E8780]">
                        {new Date(u.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleViewDetails(u)}
                            className="p-1.5 text-[#5E544C] hover:text-[#1A1715] hover:bg-[#F5F2EC] rounded-lg transition-colors"
                            title="Inspect Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(u);
                              setRoleModalOpen(true);
                            }}
                            className="p-1.5 text-[#5E544C] hover:text-[#1A1715] hover:bg-[#F5F2EC] rounded-lg transition-colors"
                            title="Modify Role"
                          >
                            <Shield className="w-3.5 h-3.5" />
                          </button>

                          {isSuspended ? (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmModal({
                                  isOpen: true,
                                  userId: u.id,
                                  action: 'activate',
                                  title: 'Restore Account',
                                  message: `Are you sure you want to reactivate access for ${u.email}?`,
                                })
                              }
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Reactivate Account"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmModal({
                                  isOpen: true,
                                  userId: u.id,
                                  action: 'suspend',
                                  title: 'Suspend Account',
                                  message: `Are you sure you want to suspend access for ${u.email}?`,
                                })
                              }
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Suspend Account"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              setConfirmModal({
                                isOpen: true,
                                userId: u.id,
                                action: 'delete',
                                title: 'Permanently Delete User',
                                message: `Are you sure you want to permanently delete user ${u.email}? This action cannot be undone.`,
                              })
                            }
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
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

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5DFD5] bg-[#FAF7F2] text-xs text-[#7E756C]">
          <span>
            Showing page <strong className="text-[#1A1715]">{pagination.page}</strong> of{' '}
            <strong className="text-[#1A1715]">{pagination.totalPages || 1}</strong> ({pagination.total} citizens)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => loadUsers(pagination.page - 1)}
              className="p-1.5 rounded-lg border border-[#E5DFD5] bg-white text-[#5E544C] disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => loadUsers(pagination.page + 1)}
              className="p-1.5 rounded-lg border border-[#E5DFD5] bg-white text-[#5E544C] disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View User Profile Modal */}
      {viewModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg p-6 bg-white border border-[#E5DFD5] rounded-2xl shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
              <div>
                <h3 className="text-base font-bold text-[#1A1715]">{selectedUser.profile?.fullName || selectedUser.email}</h3>
                <p className="text-xs text-[#7E756C]">User ID: {selectedUser.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewModalOpen(false)}
                className="p-1.5 text-[#8E8780] hover:text-[#1A1715] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
                <span className="text-[#8E8780] block text-[10px] uppercase font-bold">Email Address</span>
                <span className="font-semibold text-[#1A1715]">{selectedUser.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
                <span className="text-[#8E8780] block text-[10px] uppercase font-bold">Phone</span>
                <span className="font-semibold text-[#1A1715]">{selectedUser.phone || 'Not Provided'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
                <span className="text-[#8E8780] block text-[10px] uppercase font-bold">Role</span>
                <span className="font-semibold text-[#1A1715] capitalize">{selectedUser.role}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
                <span className="text-[#8E8780] block text-[10px] uppercase font-bold">Account Status</span>
                <span className="font-semibold text-[#1A1715] capitalize">{selectedUser.status}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
                <span className="text-[#8E8780] block text-[10px] uppercase font-bold">Domicile State</span>
                <span className="font-semibold text-[#1A1715]">{selectedUser.profile?.state || 'Not Set'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
                <span className="text-[#8E8780] block text-[10px] uppercase font-bold">Social Category</span>
                <span className="font-semibold text-[#1A1715]">{selectedUser.profile?.category || 'General'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
                <span className="text-[#8E8780] block text-[10px] uppercase font-bold">Annual Family Income</span>
                <span className="font-semibold text-[#1A1715]">₹{(selectedUser.profile?.annualIncome || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
                <span className="text-[#8E8780] block text-[10px] uppercase font-bold">Education Level</span>
                <span className="font-semibold text-[#1A1715]">{selectedUser.profile?.educationLevel || 'N/A'}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewModalOpen(false)}
                className="px-4 py-2 bg-[#1A1715] text-[#F5F2EC] rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modify Role Modal */}
      {roleModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm p-6 bg-white border border-[#E5DFD5] rounded-2xl shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#1A1715]">Adjust User Role</h3>
            <p className="text-xs text-[#7E756C]">Assign citizen track or elevate to administrative privileges.</p>

            <div className="space-y-2">
              {[
                { id: 'student', label: 'Student', desc: 'Standard scholarship & academic roadmap access' },
                { id: 'citizen', label: 'Citizen', desc: 'Welfare schemes & entitlement matching' },
                { id: 'farmer', label: 'Farmer', desc: 'Agricultural subsidies & PM-KISAN tracking' },
                { id: 'admin', label: 'Administrator', desc: 'Staff portal access with assigned permissions' },
                { id: 'superadmin', label: 'Super Admin', desc: 'Full system & staff control' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleUpdateRole(r.id)}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-[#E5DFD5] hover:border-[#948170] hover:bg-[#FAF7F2] text-left transition-colors cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-[#1A1715]">{r.label}</div>
                    <div className="text-[10px] text-[#8E8780]">{r.desc}</div>
                  </div>
                  {selectedUser.role === r.id && <CheckCircle2 className="w-4 h-4 text-[#948170]" />}
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setRoleModalOpen(false)}
                className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#F5F2EC] border border-[#E5DFD5] text-[#1A1715] rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.action === 'delete' ? 'Delete Permanently' : 'Confirm'}
        isDestructive={confirmModal.action === 'delete'}
        loading={actionLoading}
      />
    </div>
  );
}

