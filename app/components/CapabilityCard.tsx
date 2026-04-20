'use client';

import { motion } from 'framer-motion';
import { Territory, Facility } from '../types';
import * as Icons from 'lucide-react';
import { LucideIcon, Check, RefreshCw, Hourglass, ExternalLink } from 'lucide-react';

interface CapabilityCardProps {
  territory: Territory;
  index: number;
}

function LandmarkItem({ facility, color }: { facility: Facility; color: string }) {
  const getStatusConfig = (status: Facility['status']) => {
    switch (status) {
      case 'online':
        return {
          dotColor: '#69f0ae',
          bgClass: 'bg-[#69f0ae]/10',
          textClass: 'text-[#69f0ae]',
          icon: Check,
          label: '已上线'
        };
      case 'dev':
        return {
          dotColor: '#ffab40',
          bgClass: 'bg-[#ffab40]/10',
          textClass: 'text-[#ffab40]',
          icon: RefreshCw,
          label: '开发中'
        };
      case 'plan':
      default:
        return {
          dotColor: 'rgba(255,255,255,0.3)',
          bgClass: 'bg-white/5',
          textClass: 'text-white/50',
          icon: Hourglass,
          label: '待规划'
        };
    }
  };

  const config = getStatusConfig(facility.status);
  const StatusIcon = config.icon;
  const hasLink = !!facility.link;

  const handleClick = () => {
    if (facility.link) {
      window.open(facility.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`facility-item flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${hasLink ? 'cursor-pointer hover:bg-[#4fc3f7]/10 hover:border-[#4fc3f7]/30' : ''}`}
      style={{
        background: 'rgba(65, 90, 119, 0.3)',
        border: hasLink ? `1px solid ${color}30` : '1px solid rgba(79, 195, 247, 0.1)'
      }}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-2 h-2 rounded-full"
          style={{ background: config.dotColor }}
        />
        <span className="text-sm">{facility.name}</span>
        {hasLink && (
          <ExternalLink size={14} style={{ color: color, opacity: 0.8 }} />
        )}
      </div>
      <span 
        className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${config.bgClass} ${config.textClass}`}
      >
        <StatusIcon size={12} className={facility.status === 'dev' ? 'animate-spin' : ''} />
        {config.label}
      </span>
    </div>
  );
}

export default function CapabilityCard({ territory, index }: CapabilityCardProps) {
  const IconComponent = (Icons[territory.icon as keyof typeof Icons] as LucideIcon) || Icons.Circle;

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    const className = "territory-card p-6 rounded-2xl relative overflow-hidden group block";
    const style = {
      background: 'rgba(27, 38, 59, 0.6)',
      border: '1px solid rgba(79, 195, 247, 0.15)',
      transition: 'all 0.3s ease',
      textDecoration: 'none'
    };
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={className}
        style={style}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <CardWrapper>
      {/* Top border accent */}
      <div 
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: territory.color }}
      />

      {/* Pulse wave effect */}
      <div 
        className="pulse-wave absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
        style={{ 
          color: territory.color,
          animation: 'pulseWave 2s ease-out infinite',
          pointerEvents: 'none'
        }}
      />

      <div className="flex gap-6 relative z-10">
        {/* Icon */}
        <div className="relative">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center"
            style={{ background: `${territory.color}20` }}
          >
            <IconComponent size={28} style={{ color: territory.color }} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-50 tracking-wider">能力国度</span>
              <h4 
                className="font-bold text-lg"
                style={{ 
                  color: territory.color,
                  fontFamily: 'var(--font-exo-2)'
                }}
              >
                {territory.name}
              </h4>
            </div>


          </div>

          {/* Description */}
          <p className="text-sm opacity-70 mb-4">{territory.description}</p>

          {/* Markers */}
          <div className="flex flex-wrap gap-2 mb-5">
            {territory.markers.map((marker, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1"
                style={{ 
                  background: `${territory.color}15`, 
                  color: territory.color 
                }}
              >
                <Icons.MapPin size={12} />
                {marker}
              </span>
            ))}
          </div>

          {/* Facilities */}
          {territory.facilities && territory.facilities.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {territory.facilities.map((facility, idx) => (
                <LandmarkItem key={idx} facility={facility} color={territory.color} />
              ))}
            </div>
          )}


        </div>
      </div>
    </CardWrapper>
  );
}
