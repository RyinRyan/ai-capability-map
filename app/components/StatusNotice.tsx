'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, LoaderCircle } from 'lucide-react';

interface StatusNoticeProps {
  kind: 'success' | 'error' | 'info' | 'loading';
  message: string;
}

const noticeConfig = {
  success: {
    icon: CheckCircle2,
    color: '#69f0ae',
    bg: 'rgba(105, 240, 174, 0.12)',
    border: 'rgba(105, 240, 174, 0.28)',
  },
  error: {
    icon: AlertCircle,
    color: '#ef5350',
    bg: 'rgba(239, 83, 80, 0.12)',
    border: 'rgba(239, 83, 80, 0.28)',
  },
  info: {
    icon: Info,
    color: '#4fc3f7',
    bg: 'rgba(79, 195, 247, 0.12)',
    border: 'rgba(79, 195, 247, 0.28)',
  },
  loading: {
    icon: LoaderCircle,
    color: '#ffd54f',
    bg: 'rgba(255, 213, 79, 0.12)',
    border: 'rgba(255, 213, 79, 0.28)',
  },
} as const;

export default function StatusNotice({ kind, message }: StatusNoticeProps) {
  const config = noticeConfig[kind];
  const Icon = config.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${kind}-${message}`}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm"
        style={{ background: config.bg, borderColor: config.border }}
      >
        <Icon
          size={18}
          className={kind === 'loading' ? 'mt-0.5 animate-spin' : 'mt-0.5'}
          style={{ color: config.color }}
        />
        <span className="leading-6 text-white/82">{message}</span>
      </motion.div>
    </AnimatePresence>
  );
}
