'use client';

import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Check, ExternalLink, Hourglass, LucideIcon, RefreshCw } from 'lucide-react';
import { Facility, Territory } from '../types';

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
          label: '已上线',
        };
      case 'dev':
        return {
          dotColor: '#ffab40',
          bgClass: 'bg-[#ffab40]/10',
          textClass: 'text-[#ffab40]',
          icon: RefreshCw,
          label: '开发中',
        };
      default:
        return {
          dotColor: 'rgba(255,255,255,0.3)',
          bgClass: 'bg-white/5',
          textClass: 'text-white/55',
          icon: Hourglass,
          label: '待规划',
        };
    }
  };

  const config = getStatusConfig(facility.status);
  const StatusIcon = config.icon;

  return (
    <div
      className="facility-item flex items-center justify-between rounded-2xl border px-4 py-3 transition"
      style={{
        background: 'rgba(65, 90, 119, 0.22)',
        borderColor: facility.link ? `${color}32` : 'rgba(79, 195, 247, 0.12)',
      }}
    >
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: config.dotColor }} />
          <span className="truncate text-sm font-medium text-white/86">{facility.name}</span>
          {facility.link && <ExternalLink size={14} style={{ color, opacity: 0.82 }} />}
        </div>

        {facility.link ? (
          <a
            href={facility.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-full items-center gap-1 text-xs text-white/55 transition hover:text-white"
          >
            <span className="truncate">{facility.link}</span>
          </a>
        ) : (
          <span className="text-xs text-white/40">未配置外部链接</span>
        )}
      </div>

      <span className={`ml-3 inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${config.bgClass} ${config.textClass}`}>
        <StatusIcon size={12} className={facility.status === 'dev' ? 'animate-spin' : ''} />
        {config.label}
      </span>
    </div>
  );
}

export default function CapabilityCard({ territory, index }: CapabilityCardProps) {
  const IconComponent = (Icons[territory.icon as keyof typeof Icons] as LucideIcon) || Icons.Circle;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="territory-card relative overflow-hidden rounded-3xl border p-6"
      style={{
        background: 'rgba(27, 38, 59, 0.68)',
        borderColor: 'rgba(79, 195, 247, 0.15)',
      }}
    >
      <div className="absolute left-0 right-0 top-0 h-[3px]" style={{ background: territory.color }} />

      <div
        className="pulse-wave absolute inset-0 rounded-3xl opacity-0"
        style={{
          color: territory.color,
          animation: 'pulseWave 2s ease-out infinite',
          pointerEvents: 'none',
        }}
      />

      <div className="relative z-10 flex flex-col gap-5 md:flex-row">
        <div
          className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl"
          style={{ background: `${territory.color}20` }}
        >
          <IconComponent size={28} style={{ color: territory.color }} />
        </div>

        <div className="flex-1">
          <div className="mb-3">
            <div className="mb-2 text-xs tracking-[0.22em] text-white/42">能力领域</div>
            <h4
              className="text-lg font-bold"
              style={{
                color: territory.color,
                fontFamily: 'var(--font-exo-2)',
              }}
            >
              {territory.name}
            </h4>
          </div>

          <p className="mb-4 text-sm leading-6 text-white/68">{territory.description}</p>

          {territory.markers.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {territory.markers.map((marker, markerIndex) => (
                <span
                  key={`${territory.id}-${markerIndex}`}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    background: `${territory.color}15`,
                    color: territory.color,
                  }}
                >
                  <Icons.MapPin size={12} />
                  {marker}
                </span>
              ))}
            </div>
          )}

          {territory.facilities.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {territory.facilities.map((facility, facilityIndex) => (
                <LandmarkItem key={`${territory.id}-${facilityIndex}`} facility={facility} color={territory.color} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/12 px-4 py-5 text-sm text-white/45">
              当前还没有配置能力条目。
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
