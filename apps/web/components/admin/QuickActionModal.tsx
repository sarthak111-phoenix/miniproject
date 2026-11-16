'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  GraduationCap,
  Landmark,
  Bell,
  BookOpen,
  Users,
  DatabaseBackup,
  BarChart3,
  Sliders,
  ArrowRight,
} from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickActionModal({ isOpen, onClose }: QuickActionModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const actions = [
    {
      title: 'Add Scholarship',
      desc: 'Create an NSP or State merit scholarship listing with deadline and criteria.',
      icon: GraduationCap,
      href: '/admin/scholarships',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      title: 'Add Government Scheme',
      desc: 'Register a Central or State citizen welfare subsidy scheme.',
      icon: Landmark,
      href: '/admin/schemes',
      color: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      title: 'Broadcast Announcement',
      desc: 'Publish high-priority alert or deadline reminder to citizen inboxes.',
      icon: Bell,
      href: '/admin/notifications',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      title: 'Upload AI Knowledge Document',
      desc: 'Index an official gazette, curriculum syllabus, or rulebook into AI Copilot RAG.',
      icon: BookOpen,
      href: '/admin/knowledge-base',
      color: 'bg-purple-50 text-purple-800 border-purple-200',
    },
    {
      title: 'Manage Users & Roles',
      desc: 'Search citizen profiles, inspect eligibility verifications, or adjust staff roles.',
      icon: Users,
      href: '/admin/users',
      color: 'bg-[#FAF7F2] text-[#948170] border-[#D5C3A5]',
    },
    {
      title: 'Create System Backup',
      desc: 'Trigger an immediate verified snapshot of the SQLite core database.',
      icon: DatabaseBackup,
      href: '/admin/backup',
      color: 'bg-stone-50 text-stone-800 border-stone-200',
    },
    {
      title: 'Generate Reports & CSVs',
      desc: 'Export citizen enrollment, scheme engagements, and AI usage metrics.',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    },
    {
      title: 'Configure Feature Toggles',
      desc: 'Adjust public website feature flags, AI daily quotas, and maintenance mode.',
      icon: Sliders,
      href: '/admin/config',
      color: 'bg-orange-50 text-orange-800 border-orange-200',
    },
  ];

  function handleSelect(href: string) {
    onClose();
    router.push(href);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl p-6 bg-white border border-[#E5DFD5] rounded-2xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
          <div>
            <h3 className="text-base font-bold text-[#1A1715]">Administrative Quick Actions</h3>
            <p className="text-xs text-[#7E756C]">Select an operational shortcut to navigate directly to its workflow.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8E8780] hover:text-[#1A1715] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.title}
                type="button"
                onClick={() => handleSelect(act.href)}
                className="flex items-start gap-3 p-3 text-left rounded-xl border border-[#E5DFD5] hover:border-[#D5C3A5] bg-white hover:bg-[#FAF7F2] transition-all group cursor-pointer shadow-2xs"
              >
                <div className={`p-2 rounded-lg border flex-shrink-0 ${act.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#1A1715] group-hover:text-[#948170] transition-colors truncate">
                    {act.title}
                  </div>
                  <div className="text-[11px] text-[#8E8780] line-clamp-2 mt-0.5">{act.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

