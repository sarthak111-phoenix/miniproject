'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Eye,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  X,
  FileText,
} from 'lucide-react';
import { AdminApi } from '../../../lib/adminApi';

interface UserDoc {
  id: string;
  userId: string;
  documentType: string;
  status: string;
  filePath?: string;
  verifiedAt?: string;
  createdAt: string;
  user?: {
    email: string;
  };
}

export default function DocumentManagementPage() {
  const [docs, setDocs] = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState<UserDoc | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });

  async function loadDocuments(page = 1) {
    setLoading(true);
    try {
      const data = await AdminApi.getUserDocuments({
        page,
        limit: 15,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setDocs(data.documents || []);
      setPagination(data.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to load uploaded documents.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments(1);
  }, [statusFilter]);

  // Calculate DPDP 90-day retention countdown
  function getRetentionRemainingDays(createdAt: string): number {
    const created = new Date(createdAt).getTime();
    const ninetyDays = 90 * 24 * 60 * 60 * 1000;
    const purgeTime = created + ninetyDays;
    const diff = purgeTime - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E5DFD5]/40 text-[#948170]">
              <FileCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#948170]">Verification & Storage</span>
          </div>
          <h1 className="text-2xl font-serif font-medium text-[#1A1715] mt-1">Citizen Document Management</h1>
          <p className="text-xs text-[#948170] mt-0.5">
            Monitor OCR document verifications, view verification statuses, and audit DPDP 90-day data retention schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadDocuments(pagination.page)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#1A1715] bg-white border border-[#E5DFD5] rounded-xl hover:bg-[#FAF7F2] transition shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
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

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
          <span className="text-xs text-[#948170]">Total Documents</span>
          <p className="text-xl font-serif font-medium text-[#1A1715] mt-1">{pagination.total}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
          <span className="text-xs text-[#948170]">Verified & In Vault</span>
          <p className="text-xl font-serif font-medium text-emerald-700 mt-1">
            {docs.filter((d) => d.status === 'verified').length}
          </p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
          <span className="text-xs text-[#948170]">Awaiting Review</span>
          <p className="text-xl font-serif font-medium text-amber-700 mt-1">
            {docs.filter((d) => d.status === 'pending').length}
          </p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
          <span className="text-xs text-[#948170]">DPDP 90-Day Policy</span>
          <p className="text-xl font-serif font-medium text-[#1A1715] mt-1">Auto-Purge Active</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-[#948170]">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <span className="text-xs text-[#948170]">
          Showing {docs.length} of {pagination.total} records
        </span>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E5DFD5] text-[#948170] font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Document Type</th>
                <th className="py-3 px-4">Citizen / User</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Uploaded</th>
                <th className="py-3 px-4">DPDP Retention</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD5]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#948170]">
                    Loading verification pipeline...
                  </td>
                </tr>
              ) : docs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-xs mx-auto text-[#948170]">
                      <div className="p-3 bg-[#FAF7F2] rounded-full border border-[#E5DFD5] mb-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      </div>
                      <p className="text-xs font-medium text-[#1A1715]">No User Documents</p>
                      <p className="text-[11px] text-[#948170] mt-0.5">
                        No citizen documents currently reside in the 90-day DPDP storage pipeline.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                docs.map((doc) => {
                  const daysLeft = getRetentionRemainingDays(doc.createdAt);
                  return (
                    <tr key={doc.id} className="hover:bg-[#FAF7F2]/50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 font-medium text-[#1A1715]">
                          <FileText className="w-3.5 h-3.5 text-[#948170]" />
                          <span>{doc.documentType}</span>
                        </div>
                        <span className="font-mono text-[10px] text-[#948170]">{doc.id}</span>
                      </td>
                      <td className="py-3 px-4 text-[#1A1715]">
                        <div>{doc.user?.email || 'Registered User'}</div>
                        <div className="font-mono text-[10px] text-[#948170]">{doc.userId}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase ${
                            doc.status === 'verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : doc.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#948170] font-mono text-[11px]">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono">
                          <Clock className="w-3 h-3 text-[#948170]" />
                          <span className={daysLeft < 10 ? 'text-rose-600 font-semibold' : 'text-[#6B5E55]'}>
                            {daysLeft} days remaining
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="px-2.5 py-1 text-xs font-medium text-[#1A1715] bg-[#FAF7F2] border border-[#E5DFD5] rounded-lg hover:bg-white transition"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
              <h3 className="text-base font-serif font-medium text-[#1A1715]">Document Verification Details</h3>
              <button onClick={() => setSelectedDoc(null)} className="p-1 text-[#948170] hover:text-[#1A1715] rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#E5DFD5]">
                <span className="text-[#948170]">Document Type:</span>
                <span className="font-medium text-[#1A1715]">{selectedDoc.documentType}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5DFD5]">
                <span className="text-[#948170]">Document ID:</span>
                <span className="font-mono text-[#1A1715]">{selectedDoc.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5DFD5]">
                <span className="text-[#948170]">Citizen Email:</span>
                <span className="text-[#1A1715]">{selectedDoc.user?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5DFD5]">
                <span className="text-[#948170]">Current Status:</span>
                <span className="font-mono uppercase font-semibold text-emerald-800">{selectedDoc.status}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5DFD5]">
                <span className="text-[#948170]">Upload Timestamp:</span>
                <span className="font-mono text-[#1A1715]">{new Date(selectedDoc.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5DFD5]">
                <span className="text-[#948170]">DPDP Retention Window:</span>
                <span className="font-mono text-[#1A1715]">
                  {getRetentionRemainingDays(selectedDoc.createdAt)} days remaining before automated purge
                </span>
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DFD5] text-[11px] text-[#948170] space-y-1">
                <div className="flex items-center gap-1.5 text-[#1A1715] font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Privacy Guardrail Active</span>
                </div>
                <p>
                  Documents are stored in a sandboxed private directory. Raw file bytes are never exposed directly to public URLs.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E5DFD5]">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 text-xs font-medium text-[#1A1715] bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl hover:bg-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

