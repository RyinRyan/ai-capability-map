'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'primary';
  pending?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = '确认',
  cancelLabel = '取消',
  tone = 'danger',
  pending = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const accentColor = tone === 'danger' ? '#ef5350' : '#4fc3f7';
  const accentBg = tone === 'danger' ? 'rgba(239, 83, 80, 0.16)' : 'rgba(79, 195, 247, 0.16)';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          style={{ background: 'rgba(3, 8, 18, 0.78)' }}
          onClick={pending ? undefined : onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md rounded-3xl border p-6 shadow-2xl"
            style={{
              background: 'linear-gradient(180deg, rgba(17, 27, 44, 0.98), rgba(12, 19, 32, 0.98))',
              borderColor: 'rgba(148, 163, 184, 0.2)',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start gap-4">
              <div
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl"
                style={{ background: accentBg, color: accentColor }}
              >
                <AlertTriangle size={20} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="text-sm leading-6 text-white/65">{description}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={pending}
                className="flex-1 rounded-2xl border border-white/12 px-4 py-3 text-sm font-medium text-white/72 transition hover:border-white/28 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={pending}
                className="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${tone === 'danger' ? '#b71c1c' : '#0d47a1'})`,
                }}
              >
                {pending ? '处理中...' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
