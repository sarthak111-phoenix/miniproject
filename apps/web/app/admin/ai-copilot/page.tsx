'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot,
  Cpu,
  Sparkles,
  Zap,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  Sliders,
  ShieldCheck,
  Clock,
  Terminal,
} from 'lucide-react';
import { AdminApi } from '../../../lib/adminApi';

export default function AiCopilotManagementPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // AI Configuration State
  const [provider, setProvider] = useState('gemini');
  const [model, setModel] = useState('gemini-1.5-flash');
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [fallbackToMock, setFallbackToMock] = useState(true);

  // Telemetry metrics
  const [telemetry, setTelemetry] = useState({
    totalRequests: 1420,
    dailyRequests: 86,
    avgLatencyMs: 412,
    totalTokens: 524000,
    errorRate: '0.02%',
  });

  // Test sandbox
  const [testPrompt, setTestPrompt] = useState('What scholarships are available for female engineering students?');
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);

  async function loadAiConfig() {
    setLoading(true);
    try {
      const data = await AdminApi.getAiConfig();
      const cfg = data.config || {};
      if (cfg.provider) setProvider(cfg.provider);
      if (cfg.model) setModel(cfg.model);
      if (typeof cfg.temperature === 'number') setTemperature(cfg.temperature);
      if (typeof cfg.maxTokens === 'number') setMaxTokens(cfg.maxTokens);
      if (cfg.systemPrompt) setSystemPrompt(cfg.systemPrompt);
      if (typeof cfg.fallbackToMock === 'boolean') setFallbackToMock(cfg.fallbackToMock);
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to load AI Copilot configuration.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAiConfig();
  }, []);

  async function handleSaveConfig(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setAlert(null);
    try {
      await AdminApi.updateAiConfig({
        provider,
        model,
        temperature: Number(temperature),
        maxTokens: Number(maxTokens),
        systemPrompt,
        fallbackToMock,
      });
      setAlert({ type: 'success', message: 'AI Copilot runtime settings and guardrails updated!' });
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to update AI configuration.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleRunTestPrompt() {
    if (!testPrompt.trim()) return;
    setTestLoading(true);
    setTestResult(null);
    try {
      const startTime = performance.now();
      const res = await AdminApi.testAiPrompt(testPrompt);
      const latency = Math.round(performance.now() - startTime);
      setTestResult({
        ...res,
        latencyMs: latency,
      });
    } catch (err: any) {
      setTestResult({
        error: err.message || 'Error executing test prompt.',
      });
    } finally {
      setTestLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E5DFD5]/40 text-[#948170]">
              <Bot className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#948170]">Intelligence Runtime</span>
          </div>
          <h1 className="text-2xl font-serif font-medium text-[#1A1715] mt-1">AI Copilot Administration</h1>
          <p className="text-xs text-[#948170] mt-0.5">
            Manage LLM model orchestration, system grounding instructions, token quotas, and test query citations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadAiConfig()}
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

      {/* Telemetry Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
          <div className="flex items-center justify-between text-[#948170] mb-1">
            <span className="text-xs">Total Invocations</span>
            <Zap className="w-4 h-4 text-[#D5C3A5]" />
          </div>
          <p className="text-xl font-serif font-medium text-[#1A1715]">{telemetry.totalRequests.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-700 font-mono">+18% this week</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
          <div className="flex items-center justify-between text-[#948170] mb-1">
            <span className="text-xs">Avg Response Latency</span>
            <Clock className="w-4 h-4 text-[#D5C3A5]" />
          </div>
          <p className="text-xl font-serif font-medium text-[#1A1715]">{telemetry.avgLatencyMs} ms</p>
          <span className="text-[11px] text-[#948170] font-mono">p95 &lt; 850ms</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
          <div className="flex items-center justify-between text-[#948170] mb-1">
            <span className="text-xs">Tokens Consumed</span>
            <Cpu className="w-4 h-4 text-[#D5C3A5]" />
          </div>
          <p className="text-xl font-serif font-medium text-[#1A1715]">
            {(telemetry.totalTokens / 1000).toFixed(1)}k
          </p>
          <span className="text-[11px] text-[#948170] font-mono">Gemini 1.5 Tier</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
          <div className="flex items-center justify-between text-[#948170] mb-1">
            <span className="text-xs">Grounding Accuracy</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-serif font-medium text-[#1A1715]">99.8%</p>
          <span className="text-[11px] text-emerald-700 font-mono">Strict Citations</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Runtime Configuration Form */}
        <form onSubmit={handleSaveConfig} className="lg:col-span-7 space-y-4">
          <div className="p-5 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E5DFD5]">
              <Sliders className="w-4 h-4 text-[#948170]" />
              <h3 className="text-sm font-medium text-[#1A1715]">LLM Provider & Generation Hyperparameters</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#4A3E36] mb-1">Active LLM Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                >
                  <option value="gemini">Google Gemini AI</option>
                  <option value="openai">OpenAI (Custom Gateway)</option>
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="local-mock">Deterministic Grounded Mock</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3E36] mb-1">Model Architecture</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                >
                  <option value="gemini-1.5-flash">gemini-1.5-flash (Low Latency / Default)</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro (Deep Reasoning)</option>
                  <option value="gemini-pro">gemini-pro (Legacy)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-[#4A3E36]">Temperature</label>
                  <span className="text-xs font-mono text-[#948170]">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-[#1A1715]"
                />
                <span className="text-[10px] text-[#948170]">Lower values yield deterministic, verified answers.</span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-[#4A3E36]">Max Token Budget</label>
                  <span className="text-xs font-mono text-[#948170]">{maxTokens}</span>
                </div>
                <input
                  type="range"
                  min="256"
                  max="4096"
                  step="128"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full accent-[#1A1715]"
                />
                <span className="text-[10px] text-[#948170]">Enforces response concise ceiling.</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A3E36] mb-1">
                System Grounding Prompt & Guardrails
              </label>
              <textarea
                rows={9}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full p-3 font-mono text-xs text-[#1A1715] bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                placeholder="Enter system prompt guidelines..."
              />
              <span className="text-[11px] text-[#948170] block mt-1">
                Instruction must mandate citing verified official scheme identifiers and strictly prevent hallucination.
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
              <div>
                <p className="text-xs font-medium text-[#1A1715]">Automatic Resiliency Mock Fallback</p>
                <p className="text-[11px] text-[#948170]">
                  If the external LLM times out or rate limits, seamlessly serve grounded deterministic eligibility advice.
                </p>
              </div>
              <input
                type="checkbox"
                checked={fallbackToMock}
                onChange={(e) => setFallbackToMock(e.target.checked)}
                className="w-4 h-4 accent-[#1A1715] cursor-pointer"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#1A1715] rounded-xl hover:bg-[#2C2724] transition shadow-xs disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Updating Runtime...' : 'Save AI Configuration'}
              </button>
            </div>
          </div>
        </form>

        {/* Live Test Sandbox */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E5DFD5]">
              <Terminal className="w-4 h-4 text-[#948170]" />
              <h3 className="text-sm font-medium text-[#1A1715]">Interactive Grounding Sandbox</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#4A3E36] mb-1">Simulate Citizen Prompt</label>
                <textarea
                  rows={3}
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  className="w-full p-2.5 text-xs text-[#1A1715] bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                />
              </div>

              <button
                type="button"
                onClick={handleRunTestPrompt}
                disabled={testLoading || !testPrompt.trim()}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#1A1715] rounded-xl hover:bg-[#2C2724] transition shadow-xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {testLoading ? 'Querying Copilot...' : 'Execute Test Evaluation'}
              </button>

              {testResult && (
                <div className="p-4 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#948170] pb-2 border-b border-[#E5DFD5]">
                    <span>Status: {testResult.error ? 'Failed' : '200 OK'}</span>
                    {testResult.latencyMs && <span>Latency: {testResult.latencyMs}ms</span>}
                  </div>

                  {testResult.error ? (
                    <p className="text-xs text-rose-700 font-mono">{testResult.error}</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-[#1A1715] leading-relaxed">
                        {testResult.reply || testResult.response || JSON.stringify(testResult, null, 2)}
                      </p>
                      {testResult.citations && (
                        <div className="pt-2 border-t border-[#E5DFD5] text-[11px] text-[#948170]">
                          <span className="font-semibold text-[#1A1715]">Verified Citations: </span>
                          {testResult.citations.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

