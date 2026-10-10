import React from 'react';
import Modal from './Modal';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone. Please confirm you wish to proceed.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDangerous = true,
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
      <div className="text-center py-2 space-y-3">
        <div
          className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center ${
            isDangerous
              ? 'bg-rose-50 text-rose-600'
              : 'bg-amber-50 text-amber-600'
          }`}
        >
          {isDangerous ? <Trash2 className="w-5 h-5 stroke-[1.75]" /> : <AlertTriangle className="w-5 h-5 stroke-[1.75]" />}
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">{description}</p>
        </div>

        <div className="pt-3 flex items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-medium text-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer ${
              isDangerous
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-zinc-900 hover:bg-black text-white'
            }`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
