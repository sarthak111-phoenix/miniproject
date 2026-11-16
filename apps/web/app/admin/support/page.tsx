'use client';

import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  MessageSquare,
  User,
  Tag,
  X,
  Save,
  CheckSquare,
} from 'lucide-react';
import { AdminApi } from '../../../lib/adminApi';

interface SupportTicket {
  id: string;
  userId?: string;
  name?: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  priority: string;
  status: string;
  internalNote?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [savingTicket, setSavingTicket] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Edit ticket state
  const [editStatus, setEditStatus] = useState('open');
  const [editPriority, setEditPriority] = useState('normal');
  const [internalNote, setInternalNote] = useState('');
  const [resolution, setResolution] = useState('');

  async function loadTickets() {
    setLoading(true);
    try {
      const data = await AdminApi.getSupportTickets({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
      });
      setTickets(data.tickets || []);
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to load support tickets.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, [statusFilter, priorityFilter]);

  function handleOpenTicket(t: SupportTicket) {
    setSelectedTicket(t);
    setEditStatus(t.status);
    setEditPriority(t.priority);
    setInternalNote(t.internalNote || '');
    setResolution(t.resolution || '');
  }

  async function handleUpdateTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTicket) return;
    setSavingTicket(true);
    try {
      await AdminApi.updateSupportTicket(selectedTicket.id, {
        status: editStatus,
        priority: editPriority,
        internalNote,
        resolution,
      });
      setAlert({ type: 'success', message: `Ticket #${selectedTicket.id} updated successfully!` });
      setSelectedTicket(null);
      loadTickets();
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to update ticket.' });
    } finally {
      setSavingTicket(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E5DFD5]/40 text-[#948170]">
              <LifeBuoy className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#948170]">Citizen Assistance</span>
          </div>
          <h1 className="text-2xl font-serif font-medium text-[#1A1715] mt-1">Feedback & Support Desk</h1>
          <p className="text-xs text-[#948170] mt-0.5">
            Resolve citizen inquiries, document verification appeals, and eligibility assistance tickets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadTickets()}
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
          <span className="text-xs text-[#948170]">Total Inquiries</span>
          <p className="text-xl font-serif font-medium text-[#1A1715] mt-1">{tickets.length}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
          <span className="text-xs text-[#948170]">Open / Pending</span>
          <p className="text-xl font-serif font-medium text-amber-700 mt-1">
            {tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length}
          </p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
          <span className="text-xs text-[#948170]">Urgent Priority</span>
          <p className="text-xl font-serif font-medium text-rose-700 mt-1">
            {tickets.filter((t) => t.priority === 'urgent').length}
          </p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
          <span className="text-xs text-[#948170]">Resolved</span>
          <p className="text-xl font-serif font-medium text-emerald-700 mt-1">
            {tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-[#948170]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none"
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-[#948170]">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none"
            >
              <option value="all">All</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-[#948170]">Total tickets: {tickets.length}</span>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E5DFD5] text-[#948170] font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Citizen</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD5]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#948170]">
                    Loading support desk...
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-xs mx-auto text-[#948170]">
                      <div className="p-3 bg-[#FAF7F2] rounded-full border border-[#E5DFD5] mb-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <p className="text-xs font-medium text-[#1A1715]">Support Queue Empty</p>
                      <p className="text-[11px] text-[#948170] mt-0.5">
                        No citizen support tickets match the current filters or require administrative action.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-[#FAF7F2]/50 transition">
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#1A1715]">{t.subject}</div>
                      <div className="font-mono text-[10px] text-[#948170]">{t.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[#1A1715]">{t.name || 'Citizen'}</div>
                      <div className="text-[11px] text-[#948170]">{t.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-[#E5DFD5]/50 text-[#6B5E55] text-[11px]">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase ${
                          t.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : t.priority === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase ${
                          t.status === 'resolved' || t.status === 'closed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#948170] font-mono text-[11px]">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenTicket(t)}
                        className="px-2.5 py-1 text-xs font-medium text-[#1A1715] bg-[#FAF7F2] border border-[#E5DFD5] rounded-lg hover:bg-white transition"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details & Resolution Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
              <div>
                <span className="text-[11px] font-mono text-[#948170] uppercase">Ticket #{selectedTicket.id}</span>
                <h3 className="text-base font-serif font-medium text-[#1A1715] mt-0.5">{selectedTicket.subject}</h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 text-[#948170] hover:text-[#1A1715] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E5DFD5] space-y-2 text-xs">
              <div className="flex justify-between text-[#948170]">
                <span>Citizen: {selectedTicket.name || 'Anonymous'} ({selectedTicket.email})</span>
                <span>{new Date(selectedTicket.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-[#1A1715] leading-relaxed whitespace-pre-wrap">{selectedTicket.message}</p>
            </div>

            <form onSubmit={handleUpdateTicket} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#4A3E36] mb-1">Update Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A3E36] mb-1">Priority Level</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3E36] mb-1">
                  Internal Administrative Notes (Staff Only)
                </label>
                <textarea
                  rows={2}
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Record investigation findings or internal cross-department escalations..."
                  className="w-full p-2.5 text-xs text-[#1A1715] bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3E36] mb-1">
                  Official Citizen Resolution Notice
                </label>
                <textarea
                  rows={3}
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Explain steps taken or resolution guidance dispatched to the citizen..."
                  className="w-full p-2.5 text-xs text-[#1A1715] bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E5DFD5]">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 text-xs font-medium text-[#6B5E55] bg-white border border-[#E5DFD5] rounded-xl hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingTicket}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#1A1715] rounded-xl hover:bg-[#2C2724] disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {savingTicket ? 'Saving...' : 'Update & Save Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

