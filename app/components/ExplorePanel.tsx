'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Planet } from '../types';
import { X } from 'lucide-react';
import TerritoryCard from './TerritoryCard';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface ExplorePanelProps {
  planet: Planet | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExplorePanel({ planet, isOpen, onClose }: ExplorePanelProps) {
  if (!planet) return null;

  const IconComponent = (Icons[planet.icon as keyof typeof Icons] as LucideIcon) || Icons.Circle;

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
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          {/* Panel Container */}
          <div 
            className="relative z-50 flex items-center justify-center p-6 h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="explore-panel w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl relative"
              style={{
                background: 'linear-gradient(135deg, rgba(13, 27, 42, 0.95), rgba(27, 38, 59, 0.9))',
                border: '1px solid rgba(79, 195, 247, 0.2)',
                backdropFilter: 'blur(20px)'
              }}
            >
              {/* Scan Sweep Effect */}
              <div className="scan-sweep absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                <div 
                  className="absolute top-0 left-0 w-1/2 h-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(79, 195, 247, 0.1), transparent)',
                    animation: 'scanSweep 4s ease-in-out infinite'
                  }}
                />
              </div>

              {/* Hologram Effect */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-3xl"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(79, 195, 247, 0.03) 2px, rgba(79, 195, 247, 0.03) 4px)'
                }}
              />

              {/* Header */}
              <div className="p-8 border-b border-[#4fc3f7]/20 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* Planet Icon */}
                    <div
                      className="planet-core rounded-full flex items-center justify-center relative overflow-hidden"
                      style={{
                        width: '60px',
                        height: '60px',
                        background: planet.gradient,
                        color: planet.color
                      }}
                    >
                      <IconComponent size={24} style={{ color: planet.iconColor }} />
                    </div>

                    {/* Title */}
                    <div>
                      <h2 
                        className="text-2xl font-bold"
                        style={{ 
                          color: planet.color,
                          fontFamily: "'Exo 2', sans-serif"
                        }}
                      >
                        {planet.name}
                      </h2>
                      <p className="text-sm opacity-50 tracking-widest">
                        EXPLORATION ZONE // {planet.id}
                      </p>
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-[#4fc3f7] hover:bg-[#4fc3f7]/10 transition-all"
                  >
                    <X size={20} className="text-white/60" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div 
                className="p-8 overflow-y-auto relative z-10"
                style={{ maxHeight: 'calc(90vh - 140px)' }}
              >
                <div className="space-y-6">
                  {planet.territories.map((territory, tIdx) => (
                    <TerritoryCard 
                      key={territory.id} 
                      territory={territory} 
                      index={tIdx}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
