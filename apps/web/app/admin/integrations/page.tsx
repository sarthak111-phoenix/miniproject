'use client';

import React, { useState, useEffect } from 'react';
import {
  Plug,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Zap,
  Globe,
  Mail,
  HardDrive,
  Cpu,
  Layers,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { AdminApi } from '../../../lib/adminApi';

interface Integration {
  id: string;
  name: string;
  key: string;
  category: string;
  status: string;
  config: any;
  lastTestedAt?: string;
  createdAt: string;
}

export default function IntegrationsManagementPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingKey, setTestingKey] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function loadIntegrations() {
    setLoading(true);
    try {
      const data = await AdminApi.getIntegrations();
      setIntegrations(data.integrations || []);
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to load integrations.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIntegrations();
  }, []);

  async function handleTest(key: string) {
    setTestingKey(key);
    setAlert(null);
    try {
      const res = await AdminApi.testIntegration(key);
      setAlert({
        type: 'success',
        message: `Integration "${key}" test succeeded: ${res.message || 'Connection healthy.'}`,
      });
      loadIntegrations();
    } catch (err: any) {
      setAlert({
        type: 'error',
        message: `Integration "${key}" test failed: ${err.message || 'Connection timeout.'}`,
      });
    } finally {
      setTestingKey(null);
    }
  }

  function getIcon(key: string) {
    switch (key) {
      case 'gemini_ai':
        return <Zap className="w-5 h-5 text-[#D5C3A5]" />;
      case 'myscheme_api':
        return <Globe className="w-5 h-5 text-blue-600" />;
      case 'smtp_mailer':
        return <Mail className="w-5 h-5 text-emerald-600" />;
      case 'storage_vault':
        return <HardDrive className="w-5 h-5 text-purple-600" />;
      case 'ocr_engine':
        return <Layers className="w-5 h-5 text-amber-600" />;
      default:
        return <Plug className="w-5 h-5 text-[#948170]" />;
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E5DFD5]/40 text-[#948170]">
              <Plug className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#948170]">Ecosystem Connectors</span>
          </div>
          <h1 className="text-2xl font-serif font-medium text-[#1A1715] mt-1">Integrations & External APIs</h1>
          <p className="text-xs text-[#948170] mt-0.5">
            Monitor API gateways, test external connections, and audit credentials for AI, mailers, and government registries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadIntegrations()}
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

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-[#948170]">
            Loading external integrations...
          </div>
        ) : integrations.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-[#948170]">
            No integrations configured.
          </div>
        ) : (
          integrations.map((item) => {
            const isTesting = testingKey === item.key;
            return (
              <div
                key={item.id}
                className="p-5 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#D5C3A5] transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
                        {getIcon(item.key)}
                      </div>
                      <div>
                        <h3 className="text-sm font-serif font-medium text-[#1A1715]">{item.name}</h3>
                        <span className="text-[11px] font-mono text-[#948170]">key: {item.key}</span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                        item.status === 'connected' || item.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DFD5] space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#948170] text-[11px]">
                      <span>Category:</span>
                      <span className="font-medium text-[#1A1715] capitalize">{item.category}</span>
                    </div>
                    <div className="flex justify-between text-[#948170] text-[11px]">
                      <span>Credential Status:</span>
                      <span className="font-mono text-emerald-800 font-semibold">Configured & Masked</span>
                    </div>
                    <div className="flex justify-between text-[#948170] text-[11px]">
                      <span>Last Verified:</span>
                      <span className="font-mono text-[#1A1715]">
                        {item.lastTestedAt ? new Date(item.lastTestedAt).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5DFD5] flex items-center justify-between">
                  <span className="text-[11px] text-[#948170]">Encrypted in Vault</span>
                  <button
                    onClick={() => handleTest(item.key)}
                    disabled={isTesting}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1A1715] bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl hover:bg-white hover:border-[#1A1715] transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                    {isTesting ? 'Testing...' : 'Test Connection'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

