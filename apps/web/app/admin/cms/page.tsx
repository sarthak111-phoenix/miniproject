'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutTemplate,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Edit3,
  FileCode,
  Sparkles,
  Globe,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { AdminApi } from '../../../lib/adminApi';

interface CmsSection {
  id: string;
  sectionKey: string;
  title: string;
  content: any;
  status: string;
  version: number;
  updatedAt: string;
}

export default function WebsiteCmsPage() {
  const [sections, setSections] = useState<CmsSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string>('hero');
  const [editTitle, setEditTitle] = useState('');
  const [editStatus, setEditStatus] = useState('published');
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function loadCmsSections() {
    setLoading(true);
    try {
      const data = await AdminApi.getCmsSections();
      const list: CmsSection[] = data.sections || [];
      setSections(list);
      if (list.length > 0) {
        const current = list.find((s) => s.sectionKey === selectedKey) || list[0];
        setSelectedKey(current.sectionKey);
        setEditTitle(current.title);
        setEditStatus(current.status);
        setJsonText(JSON.stringify(current.content, null, 2));
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to load CMS content.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCmsSections();
  }, []);

  function handleSelectSection(sec: CmsSection) {
    setSelectedKey(sec.sectionKey);
    setEditTitle(sec.title);
    setEditStatus(sec.status);
    setJsonText(JSON.stringify(sec.content, null, 2));
    setJsonError(null);
    setPreviewMode(false);
    setAlert(null);
  }

  function handleJsonChange(val: string) {
    setJsonText(val);
    try {
      JSON.parse(val);
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message);
    }
  }

  async function handleSave(statusToSet?: string) {
    let parsedContent;
    try {
      parsedContent = JSON.parse(jsonText);
    } catch (err: any) {
      setJsonError('Invalid JSON format: ' + err.message);
      return;
    }

    setSaving(true);
    setAlert(null);
    try {
      const targetStatus = statusToSet || editStatus;
      await AdminApi.updateCmsSection(selectedKey, {
        title: editTitle,
        status: targetStatus,
        content: parsedContent,
      });
      setEditStatus(targetStatus);
      setAlert({
        type: 'success',
        message: `CMS section "${selectedKey}" successfully updated and set to ${targetStatus}!`,
      });
      // Refresh section list in background
      const data = await AdminApi.getCmsSections();
      setSections(data.sections || []);
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to save section changes.' });
    } finally {
      setSaving(false);
    }
  }

  const activeSection = sections.find((s) => s.sectionKey === selectedKey);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E5DFD5]/40 text-[#948170]">
              <LayoutTemplate className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#948170]">Content Management</span>
          </div>
          <h1 className="text-2xl font-serif font-medium text-[#1A1715] mt-1">Website CMS & Banners</h1>
          <p className="text-xs text-[#948170] mt-0.5">
            Dynamically curate and publish real-time copy, banners, and layout structures across the Saarthi AI portal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadCmsSections()}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#1A1715] bg-white border border-[#E5DFD5] rounded-xl hover:bg-[#FAF7F2] transition shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving || !!jsonError}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#1A1715] rounded-xl hover:bg-[#2C2724] transition shadow-xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Publishing...' : 'Publish Live'}
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

      {/* Main CMS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sections Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <div className="p-3 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#948170] px-2 py-1">
              Active Sections ({sections.length})
            </h3>
            <div className="mt-2 space-y-1">
              {sections.map((sec) => {
                const isSelected = sec.sectionKey === selectedKey;
                return (
                  <button
                    key={sec.sectionKey}
                    onClick={() => handleSelectSection(sec)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition ${
                      isSelected
                        ? 'bg-[#FAF7F2] border border-[#D5C3A5]/60 text-[#1A1715] shadow-xs'
                        : 'hover:bg-[#FAF7F2]/50 text-[#6B5E55] border border-transparent'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-[#1A1715] truncate">{sec.title}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase ${
                            sec.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sec.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-[#948170]">
                        <span>key: {sec.sectionKey}</span>
                        <span>•</span>
                        <span>v{sec.version}</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#1A1715]' : 'text-[#E5DFD5]'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section Editor & Live Preview */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5DFD5]">
              <div>
                <span className="text-[11px] font-mono text-[#948170] uppercase tracking-wider">
                  Section Key: <span className="font-semibold text-[#1A1715]">{selectedKey}</span>
                </span>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="mt-1 block text-lg font-serif font-medium text-[#1A1715] border-b border-transparent hover:border-[#E5DFD5] focus:border-[#1A1715] focus:outline-none bg-transparent"
                  placeholder="Section Title"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-xl border border-[#E5DFD5] p-0.5 bg-[#FAF7F2]">
                  <button
                    type="button"
                    onClick={() => setPreviewMode(false)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      !previewMode ? 'bg-white shadow-xs text-[#1A1715]' : 'text-[#948170] hover:text-[#1A1715]'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(true)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      previewMode ? 'bg-white shadow-xs text-[#1A1715]' : 'text-[#948170] hover:text-[#1A1715]'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>
                </div>

                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="px-3 py-1.5 text-xs font-medium bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Error badge if JSON syntax issue */}
            {jsonError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono">
                <strong>JSON Syntax Error:</strong> {jsonError}
              </div>
            )}

            {!previewMode ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#948170]">
                  <span className="font-mono">JSON Structured Payload (validated on edit)</span>
                  <span className="text-[11px]">Updated: {activeSection ? new Date(activeSection.updatedAt).toLocaleString() : 'N/A'}</span>
                </div>
                <textarea
                  rows={18}
                  value={jsonText}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  className="w-full p-4 font-mono text-xs text-[#1A1715] bg-[#FAF7F2]/60 border border-[#E5DFD5] rounded-xl focus:outline-none focus:border-[#1A1715] focus:ring-1 focus:ring-[#1A1715]"
                  spellCheck={false}
                />
              </div>
            ) : (
              <div className="p-5 bg-[#FAF7F2] rounded-xl border border-[#E5DFD5] space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#948170]">
                  <Sparkles className="w-3.5 h-3.5 text-[#D5C3A5]" />
                  <span>Rendered Visual Tree Simulation</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-[#E5DFD5] shadow-xs space-y-3">
                  <h4 className="text-base font-serif font-medium text-[#1A1715]">{editTitle}</h4>
                  <pre className="text-xs font-mono text-[#4A3E36] overflow-x-auto p-3 bg-[#FAF7F2] rounded-lg">
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(jsonText), null, 2);
                      } catch {
                        return 'Error rendering preview: Invalid JSON';
                      }
                    })()}
                  </pre>
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="pt-3 flex items-center justify-between">
              <span className="text-xs text-[#948170]">
                Changes take effect immediately on public endpoints once published.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSave('draft')}
                  disabled={saving || !!jsonError}
                  className="px-3.5 py-2 text-xs font-medium text-[#1A1715] bg-white border border-[#E5DFD5] rounded-xl hover:bg-[#FAF7F2] transition"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSave('published')}
                  disabled={saving || !!jsonError}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#1A1715] rounded-xl hover:bg-[#2C2724] transition shadow-xs disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Saving...' : 'Save & Publish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

