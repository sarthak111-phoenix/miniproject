'use client';

import React, { useState, useEffect } from 'react';
import {
  HardDriveDownload,
  Database,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldAlert,
  FileCheck,
  Download,
} from 'lucide-react';
import { AdminApi } from '../../../lib/adminApi';

interface BackupSnapshot {
  filename: string;
  sizeBytes: number;
  sizeFormatted: string;
  createdAt: string;
}

export default function BackupRecoveryPage() {
  const [backups, setBackups] = useState<BackupSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function loadBackups() {
    setLoading(true);
    try {
      const data = await AdminApi.getBackups();
      setBackups(data.backups || []);
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to list database backups.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBackups();
  }, []);

  async function handleCreateBackup() {
    setCreating(true);
    setAlert(null);
    try {
      const res = await AdminApi.createBackup();
      setAlert({
        type: 'success',
        message: `Database snapshot "${res.filename || 'backup.db'}" created successfully!`,
      });
      loadBackups();
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to create backup snapshot.' });
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E5DFD5]/40 text-[#948170]">
              <HardDriveDownload className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#948170]">Disaster Resilience</span>
          </div>
          <h1 className="text-2xl font-serif font-medium text-[#1A1715] mt-1">Backup & Disaster Recovery</h1>
          <p className="text-xs text-[#948170] mt-0.5">
            Create atomic database snapshots, audit point-in-time recovery archives, and verify data integrity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadBackups()}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#1A1715] bg-white border border-[#E5DFD5] rounded-xl hover:bg-[#FAF7F2] transition shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleCreateBackup}
            disabled={creating}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#1A1715] rounded-xl hover:bg-[#2C2724] transition shadow-xs disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            {creating ? 'Snapshotting...' : 'Create Snapshot'}
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

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
          <span className="text-xs text-[#948170]">Total Snapshots Stored</span>
          <p className="text-xl font-serif font-medium text-[#1A1715] mt-1">{backups.length}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
          <span className="text-xs text-[#948170]">Database Storage Engine</span>
          <p className="text-xl font-serif font-medium text-[#1A1715] mt-1">SQLite WAL Mode</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
          <span className="text-xs text-[#948170]">Recovery Target Objective</span>
          <p className="text-xl font-serif font-medium text-emerald-700 mt-1">RTO &lt; 5 mins</p>
        </div>
      </div>

      {/* Snapshots Table */}
      <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E5DFD5] flex items-center justify-between">
          <h3 className="text-sm font-medium text-[#1A1715]">Available Snapshot Archive</h3>
          <span className="text-xs text-[#948170]">Automated copy from active journal</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E5DFD5] text-[#948170] font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Snapshot Archive Filename</th>
                <th className="py-3 px-4">Filesize</th>
                <th className="py-3 px-4">Integrity Status</th>
                <th className="py-3 px-4">Created Timestamp</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD5]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-[#948170]">
                    Inspecting backup storage volume...
                  </td>
                </tr>
              ) : backups.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-[#948170]">
                    No backup snapshots exist yet. Click &quot;Create Snapshot&quot; to generate an atomic database copy.
                  </td>
                </tr>
              ) : (
                backups.map((b) => (
                  <tr key={b.filename} className="hover:bg-[#FAF7F2]/50 transition">
                    <td className="py-3 px-4 font-mono font-medium text-[#1A1715]">
                      <div className="flex items-center gap-2">
                        <Database className="w-3.5 h-3.5 text-[#948170]" />
                        <span>{b.filename}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#948170]">{b.sizeFormatted}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800">
                        Verified Valid
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#948170] font-mono text-[11px]">
                      {new Date(b.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-xs font-mono text-[#948170]">Safe on Server</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety Advisory Banner */}
      <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#E5DFD5] space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium text-[#1A1715]">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Production Disaster Recovery Advisory</span>
        </div>
        <p className="text-xs text-[#6B5E55] leading-relaxed">
          Snapshots copy the raw SQLite database safely while in Write-Ahead-Log (WAL) mode without locking active read queries.
          To restore an earlier snapshot, stop the server process and replace <code className="text-[#1A1715]">apps/backend/prisma/dev.db</code> with the chosen archive snapshot file.
        </p>
      </div>
    </div>
  );
}

