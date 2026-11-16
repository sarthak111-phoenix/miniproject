'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ShieldCheck, CheckCircle2, FileText, Landmark, Award } from 'lucide-react';
import { OrbitLoader, MagneticButton, RippleClickWrapper } from '../animations/SvgatorWrappers';
import { apiFetch } from '../../lib/api';

interface MySchemeDetailModalProps {
  slug: string | null;
  onClose: () => void;
  apiBase: string;
}

export function MySchemeDetailModal({ slug, onClose, apiBase }: MySchemeDetailModalProps) {
  const [scheme, setScheme] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch(`/schemes/myscheme/${encodeURIComponent(slug!)}`);
        if (res.ok) {
          const data = await res.json();
          setScheme(data.scheme);
        } else {
          setError('Scheme details not available from portal.');
        }
      } catch (err: any) {
        setError('Network error while retrieving scheme details.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, apiBase]);

  if (!slug) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl bg-white border border-[#E5DFD5] shadow-2xl text-[#1A1715]"
        >
          {/* Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#948170] via-[#D5C3A5] to-[#948170]" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#8E8780] hover:text-[#1A1715] p-1.5 rounded-full hover:bg-[#F5F2EC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <OrbitLoader size={48} />
              <p className="text-xs text-[#7E756C]">Connecting to myscheme.gov.in official record...</p>
            </div>
          ) : error || !scheme ? (
          <div className="py-12 text-center">
            <p className="text-sm font-semibold text-red-600">{error || 'Scheme not found.'}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 rounded-xl bg-[#F5F2EC] text-xs font-semibold text-[#1A1715]"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Badges & Ministry */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#6B5C4F] border border-[#D5C3A5]">
                  {scheme.level} Scheme
                </span>
                {scheme.shortTitle && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F5F2EC] text-[#1A1715] border border-[#E5DFD5]">
                    {scheme.shortTitle}
                  </span>
                )}
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Official myScheme Record</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1715] leading-snug">
                {scheme.name}
              </h2>

              <div className="flex items-center gap-1.5 text-xs text-[#7E756C]">
                <Landmark className="w-3.5 h-3.5 text-[#948170]" />
                <span>{scheme.ministry}</span>
              </div>
            </div>

            {/* Brief Description */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5] text-xs text-[#1A1715] leading-relaxed">
              {scheme.briefDescription}
            </div>

            {/* Benefits */}
            {scheme.benefits && scheme.benefits.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#948170] mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>Scheme Benefits & Financial Assistance</span>
                </h3>
                <ul className="space-y-1.5 pl-2">
                  {scheme.benefits.map((b: string, idx: number) => (
                    <li key={idx} className="text-xs text-[#5E544C] flex items-start gap-2">
                      <span className="text-[#948170] font-bold">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Eligibility Criteria */}
            {scheme.eligibilityCriteria && scheme.eligibilityCriteria.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#948170] mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Eligibility Conditions</span>
                </h3>
                <ul className="space-y-1.5 pl-2">
                  {scheme.eligibilityCriteria.map((crit: string, idx: number) => (
                    <li key={idx} className="text-xs text-[#5E544C] flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Documents */}
            {scheme.requiredDocuments && scheme.requiredDocuments.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#948170] mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>Required Documents</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {scheme.requiredDocuments.map((doc: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#E5DFD5] text-[11px] font-medium text-[#1A1715]"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-[#E5DFD5] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-[#7E756C]">
                Official Source: <span className="font-semibold text-[#1A1715]">{scheme.sourceVersion}</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F5F2EC] text-xs font-semibold text-[#7E756C] border border-[#E5DFD5] transition-colors"
                >
                  Close
                </button>
                <MagneticButton strength={0.15}>
                  <a
                    href={scheme.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-5 py-2 rounded-xl btn-luxury text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Apply on Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </MagneticButton>
              </div>
            </div>
          </div>
        )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
