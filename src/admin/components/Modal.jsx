import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer = null,
  maxWidth = 'max-w-2xl',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative w-full ${maxWidth} bg-white border border-zinc-200/90 rounded-xl shadow-xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150`}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-start justify-between gap-4 bg-white sticky top-0 z-10">
          <div>
            {title && <h3 className="text-base font-semibold text-zinc-900 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs font-normal text-zinc-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 text-zinc-800 space-y-4 text-xs">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="p-3.5 sm:p-4 border-t border-zinc-100 bg-zinc-50/60 flex items-center justify-end gap-2.5 sticky bottom-0 z-10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
