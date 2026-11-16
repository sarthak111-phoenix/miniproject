'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Users,
  GraduationCap,
  Landmark,
  HelpCircle,
  Bell,
  BookOpen,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { AdminApi } from '../../lib/adminApi';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>({
    users: [],
    scholarships: [],
    schemes: [],
    tickets: [],
    announcements: [],
    knowledgeDocs: [],
  });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ users: [], scholarships: [], schemes: [], tickets: [], announcements: [], knowledgeDocs: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await AdminApi.globalSearch(query);
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  function handleNavigate(url: string) {
    onClose();
    router.push(url);
  }

  const hasAnyResults =
    results.users.length > 0 ||
    results.scholarships.length > 0 ||
    results.schemes.length > 0 ||
    results.tickets.length > 0 ||
    results.announcements.length > 0 ||
    results.knowledgeDocs.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-[#E5DFD5] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E5DFD5] bg-[#FAF7F2]">
          <Search className="w-5 h-5 text-[#8E8780]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users, scholarships, government schemes, support tickets..."
            className="flex-1 bg-transparent text-sm font-medium text-[#1A1715] placeholder-[#8E8780] outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 animate-spin text-[#948170]" />}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#8E8780] hover:text-[#1A1715] hover:bg-[#F5F2EC] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!query.trim() && (
            <div className="py-12 text-center text-xs text-[#8E8780] space-y-2">
              <p>Type to search across the entire Saarthi AI database.</p>
              <div className="flex items-center justify-center gap-2 text-[11px] text-[#948170]">
                <span>Try:</span>
                <button type="button" onClick={() => setQuery('Priya')} className="underline hover:text-[#1A1715]">Priya</button>
                <span>•</span>
                <button type="button" onClick={() => setQuery('Pragati')} className="underline hover:text-[#1A1715]">Pragati</button>
                <span>•</span>
                <button type="button" onClick={() => setQuery('Kisan')} className="underline hover:text-[#1A1715]">Kisan</button>
                <span>•</span>
                <button type="button" onClick={() => setQuery('Ticket')} className="underline hover:text-[#1A1715]">Ticket</button>
              </div>
            </div>
          )}

          {query.trim() && !loading && !hasAnyResults && (
            <div className="py-12 text-center text-xs text-[#8E8780]">
              No matching records found for <span className="font-semibold text-[#1A1715]">"{query}"</span>.
            </div>
          )}

          {/* Scholarships */}
          {results.scholarships.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8E8780] uppercase tracking-wider px-2">
                <GraduationCap className="w-3.5 h-3.5 text-[#948170]" />
                <span>Scholarships ({results.scholarships.length})</span>
              </div>
              {results.scholarships.map((s: any) => (
                <button
                  key={s.id}
                  onClick={() => handleNavigate(s.link)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF7F2] text-left transition-colors border border-transparent hover:border-[#E5DFD5] group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#1A1715] group-hover:text-[#948170] transition-colors">{s.title}</div>
                    <div className="text-[11px] text-[#8E8780]">{s.subtitle}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8E8780] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          )}

          {/* Government Schemes */}
          {results.schemes.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8E8780] uppercase tracking-wider px-2">
                <Landmark className="w-3.5 h-3.5 text-[#948170]" />
                <span>Government Schemes ({results.schemes.length})</span>
              </div>
              {results.schemes.map((s: any) => (
                <button
                  key={s.id}
                  onClick={() => handleNavigate(s.link)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF7F2] text-left transition-colors border border-transparent hover:border-[#E5DFD5] group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#1A1715] group-hover:text-[#948170] transition-colors">{s.title}</div>
                    <div className="text-[11px] text-[#8E8780]">{s.subtitle}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8E8780] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          )}

          {/* Users */}
          {results.users.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8E8780] uppercase tracking-wider px-2">
                <Users className="w-3.5 h-3.5 text-[#948170]" />
                <span>Users ({results.users.length})</span>
              </div>
              {results.users.map((u: any) => (
                <button
                  key={u.id}
                  onClick={() => handleNavigate(u.link)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF7F2] text-left transition-colors border border-transparent hover:border-[#E5DFD5] group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#1A1715] group-hover:text-[#948170] transition-colors">{u.title}</div>
                    <div className="text-[11px] text-[#8E8780] capitalize">Role: {u.subtitle}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8E8780] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          )}

          {/* Support Tickets */}
          {results.tickets.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8E8780] uppercase tracking-wider px-2">
                <HelpCircle className="w-3.5 h-3.5 text-[#948170]" />
                <span>Support Tickets ({results.tickets.length})</span>
              </div>
              {results.tickets.map((t: any) => (
                <button
                  key={t.id}
                  onClick={() => handleNavigate(t.link)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF7F2] text-left transition-colors border border-transparent hover:border-[#E5DFD5] group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#1A1715] group-hover:text-[#948170] transition-colors">{t.title}</div>
                    <div className="text-[11px] text-[#8E8780]">{t.subtitle}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8E8780] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          )}

          {/* Knowledge Docs */}
          {results.knowledgeDocs.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8E8780] uppercase tracking-wider px-2">
                <BookOpen className="w-3.5 h-3.5 text-[#948170]" />
                <span>AI Knowledge Documents ({results.knowledgeDocs.length})</span>
              </div>
              {results.knowledgeDocs.map((k: any) => (
                <button
                  key={k.id}
                  onClick={() => handleNavigate(k.link)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF7F2] text-left transition-colors border border-transparent hover:border-[#E5DFD5] group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#1A1715] group-hover:text-[#948170] transition-colors">{k.title}</div>
                    <div className="text-[11px] text-[#8E8780]">{k.subtitle}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8E8780] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#E5DFD5] bg-[#FAF7F2] text-[11px] text-[#8E8780]">
          <span>Navigation Shortcuts: Esc to close, Enter to jump</span>
          <span className="font-semibold text-[#948170]">Saarthi AI Omnisearch</span>
        </div>
      </div>
    </div>
  );
}

