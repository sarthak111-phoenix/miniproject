'use client';

import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  User,
  Shield,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AdminApi } from '../../../lib/adminApi';

interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  module: string;
  targetId?: string;
  details?: any;
  ipAddress?: string;
  status: string;
  createdAt: string;
  admin?: {
    email: string;
    role: string;
  };
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [moduleFilter, setModuleFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function loadLogs(page = pagination.page) {
    setLoading(true);
    try {
      const data = await AdminApi.getAuditLogs({
        page,
        limit: 20,
        module: moduleFilter !== 'all' ? moduleFilter : undefined,
        action: actionFilter !== 'all' ? actionFilter : undefined,
        search: search || undefined,
      });
      setLogs(data.logs || []);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 });
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to load audit logs.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs(1);
  }, [moduleFilter, actionFilter]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    loadLogs(1);
  }

  function handleExportCsv() {
    if (!logs.length) return;
    const headers = ['Log ID', 'Admin Email', 'Action', 'Module', 'Target ID', 'IP Address', 'Status', 'Timestamp'];
    const rows = logs.map((l) => [
      l.id,
      l.admin?.email || l.adminId,
      l.action,
      l.module,
      l.targetId || 'N/A',
      l.ipAddress || '127.0.0.1',
      l.status,
      new Date(l.createdAt).toISOString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `saarthi_security_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E5DFD5]/40 text-[#948170]">
              <History className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#948170]">Security Governance</span>
          </div>
          <h1 className="text-2xl font-serif font-medium text-[#1A1715] mt-1">Activity & Security Audit Trail</h1>
          <p className="text-xs text-[#948170] mt-0.5">
            Immutable, timestamped record of administrative interventions, permission updates, and data mutations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadLogs()}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#1A1715] bg-white border border-[#E5DFD5] rounded-xl hover:bg-[#FAF7F2] transition shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleExportCsv}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-[#1A1715] rounded-xl hover:bg-[#2C2724] transition shadow-xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export Audit CSV
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

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-[#948170] absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action or target ID..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
          >
            <option value="all">All Modules</option>
            <option value="auth">auth</option>
            <option value="users">users</option>
            <option value="scholarships">scholarships</option>
            <option value="schemes">schemes</option>
            <option value="cms">cms</option>
            <option value="ai">ai</option>
            <option value="config">config</option>
            <option value="roles">roles</option>
            <option value="backups">backups</option>
          </select>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
          >
            <option value="all">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="LOGIN">LOGIN</option>
            <option value="BACKUP_CREATE">BACKUP_CREATE</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E5DFD5] text-[#948170] font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Administrator</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Target & Metadata</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD5]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#948170]">
                    Loading security audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#948170]">
                    No audit records recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAF7F2]/50 transition font-mono text-[11px]">
                    <td className="py-3 px-4 text-[#948170]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-[#1A1715] font-sans">
                      <div className="font-medium">{log.admin?.email || 'Super Admin'}</div>
                      <div className="text-[10px] text-[#948170] font-mono">{log.adminId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-1.5 py-0.5 rounded bg-[#FAF7F2] border border-[#E5DFD5] text-[#1A1715] font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#6B5E55]">{log.module}</td>
                    <td className="py-3 px-4 text-[#948170]">
                      {log.targetId && <div>target: {log.targetId}</div>}
                      {log.details && (
                        <div className="truncate max-w-xs text-[10px]">
                          {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#948170]">{log.ipAddress || '127.0.0.1'}</td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                          log.status === 'success'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#E5DFD5] flex items-center justify-between text-xs text-[#948170]">
          <span>
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} audit events)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadLogs(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 bg-white border border-[#E5DFD5] rounded-lg disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => loadLogs(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1.5 bg-white border border-[#E5DFD5] rounded-lg disabled:opacity-40"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

