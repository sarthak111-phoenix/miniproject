'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileText,
  Tag,
  Hash,
  X,
  Eye,
} from 'lucide-react';
import { AdminApi } from '../../../lib/adminApi';
import { AdminConfirmModal } from '../../../components/admin/AdminConfirmModal';

interface KnowledgeDoc {
  id: string;
  title: string;
  category: string;
  content: string;
  tokenCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function KnowledgeBasePage() {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewDoc, setViewDoc] = useState<KnowledgeDoc | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: '',
    title: '',
  });

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Scheme Guidelines');
  const [formContent, setFormContent] = useState('');
  const [formStatus, setFormStatus] = useState('published');
  const [submitting, setSubmitting] = useState(false);

  async function loadKnowledgeDocs() {
    setLoading(true);
    try {
      const data = await AdminApi.getKnowledgeDocs();
      setDocs(data.docs || []);
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to load knowledge base.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadKnowledgeDocs();
  }, []);

  async function handleCreateDoc(e: React.FormEvent) {
    e.preventDefault();
    if (!formTitle || !formContent) return;
    setSubmitting(true);
    try {
      const tokenEst = Math.round(formContent.split(/\s+/).length * 1.33);
      await AdminApi.createKnowledgeDoc({
        title: formTitle,
        category: formCategory,
        content: formContent,
        tokenCount: tokenEst,
        status: formStatus,
      });
      setAlert({ type: 'success', message: `Knowledge document "${formTitle}" added successfully!` });
      setCreateModalOpen(false);
      setFormTitle('');
      setFormContent('');
      loadKnowledgeDocs();
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to create knowledge document.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!confirmDelete.id) return;
    try {
      await AdminApi.deleteKnowledgeDoc(confirmDelete.id);
      setAlert({ type: 'success', message: 'Document deleted from knowledge base.' });
      setConfirmDelete({ isOpen: false, id: '', title: '' });
      loadKnowledgeDocs();
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete knowledge document.' });
    }
  }

  const filteredDocs = docs.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalTokens = docs.reduce((acc, curr) => acc + (curr.tokenCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E5DFD5]/40 text-[#948170]">
              <BookOpen className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#948170]">RAG Knowledge Base</span>
          </div>
          <h1 className="text-2xl font-serif font-medium text-[#1A1715] mt-1">AI Grounding Documents</h1>
          <p className="text-xs text-[#948170] mt-0.5">
            Curate verified government circulars, eligibility rulebooks, and scheme FAQs indexed into vector retrieval.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadKnowledgeDocs()}
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
            Add Knowledge Doc
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

      {/* Metrics Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
          <span className="text-xs text-[#948170]">Indexed Documents</span>
          <p className="text-xl font-serif font-medium text-[#1A1715] mt-1">{docs.length}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
          <span className="text-xs text-[#948170]">Total Corpus Tokens</span>
          <p className="text-xl font-serif font-medium text-[#1A1715] mt-1">{totalTokens.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
          <span className="text-xs text-[#948170]">Published to Vector DB</span>
          <p className="text-xl font-serif font-medium text-emerald-700 mt-1">
            {docs.filter((d) => d.status === 'published').length}
          </p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
          <span className="text-xs text-[#948170]">Under Review</span>
          <p className="text-xl font-serif font-medium text-amber-700 mt-1">
            {docs.filter((d) => d.status !== 'published').length}
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-[#948170] absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents or text..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
          >
            <option value="all">All Categories</option>
            <option value="Scheme Guidelines">Scheme Guidelines</option>
            <option value="Eligibility Criteria">Eligibility Criteria</option>
            <option value="Legal & DPDP Act">Legal & DPDP Act</option>
            <option value="FAQ & Assistance">FAQ & Assistance</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="review">Review</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E5DFD5] text-[#948170] font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Token Size</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD5]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#948170]">
                    Loading grounding corpus...
                  </td>
                </tr>
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#948170]">
                    No grounding documents match your criteria.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#FAF7F2]/50 transition">
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#1A1715] flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#948170] shrink-0" />
                        <span>{doc.title}</span>
                      </div>
                      <p className="text-[11px] text-[#948170] truncate max-w-md mt-0.5">{doc.content}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-[#E5DFD5]/50 text-[#6B5E55] text-[11px]">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#948170]">
                      {doc.tokenCount ? `~${doc.tokenCount.toLocaleString()} tokens` : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase ${
                          doc.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : doc.status === 'review'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#948170] font-mono text-[11px]">
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewDoc(doc)}
                          className="p-1.5 rounded-lg text-[#948170] hover:text-[#1A1715] hover:bg-[#FAF7F2] transition"
                          title="View Document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete({ isOpen: true, id: doc.id, title: doc.title })}
                          className="p-1.5 rounded-lg text-[#948170] hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Document"
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

      {/* Add Document Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
              <h3 className="text-base font-serif font-medium text-[#1A1715]">Add Knowledge Base Document</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 text-[#948170] hover:text-[#1A1715] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDoc} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#4A3E36] mb-1">Document Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Maharashtra Post-Matric Scholarship Rules 2026"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#4A3E36] mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                  >
                    <option value="Scheme Guidelines">Scheme Guidelines</option>
                    <option value="Eligibility Criteria">Eligibility Criteria</option>
                    <option value="Legal & DPDP Act">Legal & DPDP Act</option>
                    <option value="FAQ & Assistance">FAQ & Assistance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A3E36] mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                  >
                    <option value="published">Published</option>
                    <option value="review">Review</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3E36] mb-1">Full Document Text Content</label>
                <textarea
                  rows={8}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Paste official notification text, circular excerpts, or structured knowledge here..."
                  className="w-full p-3 font-mono text-xs text-[#1A1715] bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                  required
                />
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
                  {submitting ? 'Indexing...' : 'Save & Index'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Document Modal */}
      {viewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
              <div>
                <span className="text-[11px] font-mono text-[#948170] uppercase">{viewDoc.category}</span>
                <h3 className="text-lg font-serif font-medium text-[#1A1715] mt-0.5">{viewDoc.title}</h3>
              </div>
              <button onClick={() => setViewDoc(null)} className="p-1 text-[#948170] hover:text-[#1A1715] rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5DFD5] max-h-96 overflow-y-auto">
              <pre className="text-xs text-[#1A1715] font-sans whitespace-pre-wrap leading-relaxed">
                {viewDoc.content}
              </pre>
            </div>

            <div className="flex justify-between items-center text-xs text-[#948170]">
              <span>Estimated Tokens: {viewDoc.tokenCount?.toLocaleString()}</span>
              <button
                type="button"
                onClick={() => setViewDoc(null)}
                className="px-4 py-2 text-xs font-medium text-[#1A1715] bg-white border border-[#E5DFD5] rounded-xl hover:bg-[#FAF7F2]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <AdminConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Delete Knowledge Document"
        message={`Are you sure you want to remove "${confirmDelete.title}" from the AI knowledge base? Citations referencing this document may be affected.`}
        confirmText="Delete Document"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete({ isOpen: false, id: '', title: '' })}
      />
    </div>
  );
}

