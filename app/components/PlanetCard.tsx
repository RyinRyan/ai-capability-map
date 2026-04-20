'use client';

import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { GalaxyType, Planet } from '../types';

interface PlanetCardProps {
  planet: Planet;
  index: number;
  currentGalaxy: GalaxyType;
  onClick: () => void;
}

export default function PlanetCard({ planet, index, currentGalaxy, onClick }: PlanetCardProps) {
  const IconComponent = (Icons[planet.icon as keyof typeof Icons] as LucideIcon) || Icons.Circle;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      className="planet group flex w-full flex-col items-center rounded-[32px] border px-5 py-7 text-center transition focus:outline-none focus:ring-2 focus:ring-[#4fc3f7] focus:ring-offset-0"
      style={{
        background: 'linear-gradient(180deg, rgba(17, 27, 44, 0.82), rgba(14, 22, 36, 0.82))',
        borderColor: 'rgba(148, 163, 184, 0.16)',
      }}
      onClick={onClick}
      aria-label={`查看 ${planet.name} 的能力详情`}
    >
      <div className="relative mb-5">
        <div
          className="planet-core rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-400"
          style={{
            width: `${planet.size}px`,
            height: `${planet.size}px`,
            background: planet.gradient,
            color: planet.color,
            boxShadow: currentGalaxy === 'rd' ? '0 0 22px rgba(79, 195, 247, 0.35)' : '0 0 22px rgba(171, 71, 188, 0.35)',
          }}
        >
          <IconComponent size={planet.size * 0.25} style={{ color: planet.iconColor }} />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.12), transparent)',
              animation: 'planetRotate 20s linear infinite',
            }}
          />
        </div>

        <div
          className="planet-ring absolute border-2 border-dashed rounded-full opacity-40"
          style={{
            width: `${planet.size * 1.38}px`,
            height: `${planet.size * 1.38}px`,
            top: `${-planet.size * 0.19}px`,
            left: `${-planet.size * 0.19}px`,
            borderColor: planet.color,
            animation: 'ringRotate 30s linear infinite',
          }}
        />

        <div
          className="absolute -right-1 -top-1 rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
          style={{ background: planet.color, color: planet.textColor }}
        >
          {planet.statusCount}
        </div>
      </div>

      <h3
        className="mb-2 text-lg font-bold"
        style={{
          color: planet.color,
          fontFamily: 'var(--font-exo-2)',
        }}
      >
        {planet.name}
      </h3>

      <p className="mb-4 max-w-[210px] text-sm leading-6 text-white/62">{planet.description}</p>

      <div className="inline-flex items-center gap-1 text-sm font-medium text-white/55 transition group-hover:text-white/90">
        查看详情
        <ChevronRight size={16} />
      </div>
    </motion.button>
  );
}
