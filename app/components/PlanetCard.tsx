'use client';

import { motion } from 'framer-motion';
import { Planet, GalaxyType } from '../types';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface PlanetCardProps {
  planet: Planet;
  index: number;
  currentGalaxy: GalaxyType;
  onClick: () => void;
}

export default function PlanetCard({ planet, index, currentGalaxy, onClick }: PlanetCardProps) {
  const IconComponent = (Icons[planet.icon as keyof typeof Icons] as LucideIcon) || Icons.Circle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="planet flex flex-col items-center cursor-pointer"
      onClick={onClick}
    >
      <div className="relative mb-4">
        {/* Planet Core */}
        <div
          className="planet-core rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-400"
          style={{
            width: `${planet.size}px`,
            height: `${planet.size}px`,
            background: planet.gradient,
            color: planet.color,
            boxShadow: currentGalaxy === 'rd' 
              ? '0 0 20px #4fc3f7' 
              : '0 0 20px #ab47bc'
          }}
        >
          <IconComponent 
            size={planet.size * 0.25} 
            style={{ color: planet.iconColor }}
          />
          {/* Rotating gradient overlay */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.1), transparent)',
              animation: 'planetRotate 20s linear infinite'
            }}
          />
        </div>

        {/* Planet Ring */}
        <div
          className="planet-ring absolute border-2 border-dashed rounded-full opacity-40"
          style={{
            width: `${planet.size * 1.4}px`,
            height: `${planet.size * 1.4}px`,
            top: `${-planet.size * 0.2}px`,
            left: `${-planet.size * 0.2}px`,
            borderColor: planet.color,
            animation: 'ringRotate 30s linear infinite'
          }}
        />

        {/* Status Badge */}
        <div
          className="sector-badge absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
          style={{ 
            background: planet.color, 
            color: planet.textColor 
          }}
        >
          {planet.statusCount}
        </div>
      </div>

      {/* Planet Name */}
      <h3 
        className="font-bold text-lg text-center mb-1"
        style={{ 
          color: planet.color,
          fontFamily: 'var(--font-exo-2)'
        }}
      >
        {planet.name}
      </h3>

      {/* Planet Description */}
      <p className="text-sm text-center opacity-60 max-w-[150px]">
        {planet.description}
      </p>
    </motion.div>
  );
}
