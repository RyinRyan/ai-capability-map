'use client';

import { AnimatePresence, motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { LucideIcon, X } from 'lucide-react';
import { useEffect } from 'react';
import { Planet } from '../types';
import CapabilityCard from './CapabilityCard';

interface ExplorePanelProps {
  planet: Planet | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExplorePanel({ planet, isOpen, onClose }: ExplorePanelProps) {
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!planet) {
    return null;
  }

  const IconComponent = (Icons[planet.icon as keyof typeof Icons] as LucideIcon) || Icons.Circle;
  const territoryCount = planet.territories.length;
  const facilityCount = planet.territories.reduce((count, territory) => count + territory.facilities.length, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          <div className="relative z-50 flex h-full items-center justify-center p-4 md:p-6" onClick={(event) => event.stopPropagation()}>
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 12 }}
              transition={{ duration: 0.24 }}
              className="explore-panel relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border"
              style={{
                background: 'linear-gradient(135deg, rgba(13, 27, 42, 0.97), rgba(27, 38, 59, 0.95))',
                borderColor: 'rgba(79, 195, 247, 0.2)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="scan-sweep absolute inset-0 overflow-hidden rounded-[32px] pointer-events-none">
                <div
                  className="absolute left-0 top-0 h-full w-1/2"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(79, 195, 247, 0.1), transparent)',
                    animation: 'scanSweep 4s ease-in-out infinite',
                  }}
                />
              </div>

              <div
                className="absolute inset-0 rounded-[32px] pointer-events-none"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(79, 195, 247, 0.03) 2px, rgba(79, 195, 247, 0.03) 4px)',
                }}
              />

              <div className="relative z-10 border-b border-white/10 p-6 md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-5">
                    <div
                      className="planet-core relative flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-full"
                      style={{ background: planet.gradient, color: planet.color }}
                    >
                      <IconComponent size={24} style={{ color: planet.iconColor }} />
                    </div>

                    <div>
                      <div className="mb-2 text-xs tracking-[0.24em] text-white/42">能力星球</div>
                      <h2
                        className="text-2xl font-bold"
                        style={{
                          color: planet.color,
                          fontFamily: 'var(--font-exo-2)',
                        }}
                      >
                        {planet.name}
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">{planet.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                      <span className="mr-4">{territoryCount} 个领域</span>
                      <span>{facilityCount} 个能力点</span>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition hover:border-[#4fc3f7] hover:bg-[#4fc3f7]/10"
                      aria-label="关闭详情面板"
                    >
                      <X size={20} className="text-white/60" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative z-10 overflow-y-auto p-6 md:p-8" style={{ maxHeight: 'calc(92vh - 152px)' }}>
                {planet.territories.length > 0 ? (
                  <div className="space-y-5">
                    {planet.territories.map((territory, territoryIndex) => (
                      <CapabilityCard key={territory.id} territory={territory} index={territoryIndex} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-white/14 bg-white/4 px-6 py-12 text-center text-white/48">
                    当前星球还没有配置能力领域。
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
