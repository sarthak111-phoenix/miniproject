'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface AdminConfirmModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmText?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  confirmVariant?: string;
  loading?: boolean;
}

export function AdminConfirmModal({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  title,
  message,
  confirmLabel,
  confirmText,
  cancelLabel = 'Cancel',
  isDestructive,
  confirmVariant,
  loading = false,
}: AdminConfirmModalProps) {
  if (!isOpen) return null;

  const handleClose = onClose || onCancel || (() => {});
  const buttonLabel = confirmText || confirmLabel || 'Confirm';
  const destructive = isDestructive ?? (confirmVariant === 'danger');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md p-6 bg-white border border-[#E5DFD5] rounded-2xl shadow-xl space-y-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-xl flex-shrink-0 ${
              destructive ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-[#FAF7F2] text-[#948170] border border-[#D5C3A5]'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-[#1A1715]">{title}</h3>
            <p className="mt-1 text-xs text-[#7E756C] leading-relaxed">{message}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="p-1 text-[#8E8780] hover:text-[#1A1715] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E5DFD5]">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-[#5E544C] hover:text-[#1A1715] bg-[#FAF7F2] hover:bg-[#F5F2EC] border border-[#E5DFD5] rounded-xl transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              destructive
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                : 'bg-[#1A1715] hover:bg-[#332D29] text-[#F5F2EC] border border-[#D5C3A5] shadow-xs'
            }`}
          >
            {loading ? (
              <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : null}
            <span>{buttonLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
