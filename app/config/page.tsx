'use client';

import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ArrowLeft, Edit2, LogOut, LucideIcon, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';
import ConfigModal from '../components/ConfigModal';
import Starfield from '../components/Starfield';
import StatusNotice from '../components/StatusNotice';
import { useCapabilities } from '../hooks/useCapabilities';
import { GalaxyType, Planet, Territory } from '../types';

const GALAXY_LABELS: Record<GalaxyType, string> = {
  rd: 'AI 辅助研发星域',
  digital: 'AI 数字员工星域',
};

export default function ConfigPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentGalaxy, setCurrentGalaxy] = useState<GalaxyType>(() => {
    if (typeof window === 'undefined') {
      return 'rd';
    }

    const savedGalaxy = window.localStorage.getItem('preferred-galaxy');
    return savedGalaxy === 'digital' ? 'digital' : 'rd';
  });
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [confirmState, setConfirmState] = useState<{ type: 'delete'; territory?: Territory | null } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getPlanets, addTerritory, updateTerritory, deleteTerritory, isLoaded, isRefreshing, error } = useCapabilities();

  useEffect(() => {
    window.localStorage.setItem('preferred-galaxy', currentGalaxy);
  }, [currentGalaxy]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', { cache: 'no-store' });
        const data = await response.json();
        if (data.loggedIn) {
          setIsLoggedIn(true);
        } else {
          router.replace('/login');
        }
      } catch (authError) {
        console.error('Auth check error:', authError);
        router.replace('/login');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const planets = useMemo(() => (isLoaded ? getPlanets(currentGalaxy) : []), [currentGalaxy, getPlanets, isLoaded]);

  const summary = useMemo(
    () => ({
      planetCount: planets.length,
      territoryCount: planets.reduce((count, planet) => count + planet.territories.length, 0),
      facilityCount: planets.reduce(
        (count, planet) => count + planet.territories.reduce((territoryCount, territory) => territoryCount + territory.facilities.length, 0),
        0
      ),
    }),
    [planets]
  );

  const activeNotice = notice
    ? notice
    : error
      ? { kind: 'error' as const, message: error }
      : isRefreshing
        ? { kind: 'loading' as const, message: '正在同步配置数据...' }
        : { kind: 'info' as const, message: '移动端也会显示完整操作按钮，不再依赖 hover 才能编辑或删除。' };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (logoutError) {
      console.error('Logout error:', logoutError);
    }
  };

  const openCreateModal = (planet: Planet) => {
    setSelectedPlanet(planet);
    setSelectedTerritory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (planet: Planet, territory: Territory) => {
    setSelectedPlanet(planet);
    setSelectedTerritory(territory);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }
    setIsModalOpen(false);
    setSelectedPlanet(null);
    setSelectedTerritory(null);
  };

  const handleSaveTerritory = async (territoryData: Omit<Territory, 'id'>) => {
    if (!selectedPlanet) {
      return;
    }

    setIsSubmitting(true);
    const result = selectedTerritory
      ? await updateTerritory(selectedTerritory.id, territoryData)
      : await addTerritory(selectedPlanet.id, territoryData);
    setIsSubmitting(false);

    if (result.success) {
      setNotice({ kind: 'success', message: selectedTerritory ? '领域已更新。' : '新领域已创建。' });
      closeModal();
      return;
    }

    setNotice({ kind: 'error', message: result.message || '保存失败，请稍后重试。' });
  };

  const handleConfirmDelete = async () => {
    if (!confirmState?.territory) {
      return;
    }

    setIsSubmitting(true);
    const result = await deleteTerritory(confirmState.territory.id);
    setIsSubmitting(false);

    if (result.success) {
      setNotice({ kind: 'success', message: `已删除领域「${confirmState.territory.name}」。` });
      setConfirmState(null);
      if (selectedTerritory?.id === confirmState.territory.id) {
        closeModal();
      }
      return;
    }

    setNotice({ kind: 'error', message: result.message || '删除失败，请稍后重试。' });
  };

  if (isCheckingAuth) {
    return (
      <main className="relative min-h-screen overflow-hidden" style={{ background: '#0d1b2a' }}>
        <Starfield />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <StatusNotice kind="loading" message="正在验证登录状态..." />
        </div>
      </main>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden" style={{ background: '#0d1b2a' }}>
      <Starfield />

      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(79, 195, 247, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 60%, rgba(171, 71, 188, 0.06) 0%, transparent 50%)
          `,
          animation: 'nebulaDrift 60s ease-in-out infinite',
        }}
      />

      <div className="relative z-10 min-h-screen px-4 py-6 md:px-8 md:py-8">
        <header className="mb-8 flex flex-col gap-5 rounded-[32px] border border-white/10 bg-black/10 p-5 backdrop-blur-sm md:flex-row md:items-center md:justify-between md:p-7">
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/12 px-4 py-2 text-sm text-white/68 transition hover:border-[#4fc3f7] hover:bg-[#4fc3f7]/10 hover:text-[#4fc3f7]"
            >
              <ArrowLeft size={16} />
              返回地图
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#4fc3f7]" style={{ fontFamily: 'var(--font-exo-2)' }}>
                能力地图配置管理
              </h1>
              <p className="mt-2 text-sm leading-6 text-white/58">管理星球下的能力领域、标签和能力点；服务重启后不会再自动注入任何样例数据。</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/12 px-4 py-3 text-sm text-white/70 transition hover:border-red-400 hover:bg-red-400/10 hover:text-red-300"
            >
              <LogOut size={16} />
              退出登录
            </button>
          </div>
        </header>

        <div className="mb-6 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="flex flex-wrap gap-3">
            {(['rd', 'digital'] as GalaxyType[]).map((galaxy) => (
              <button
                key={galaxy}
                type="button"
                onClick={() => setCurrentGalaxy(galaxy)}
                className="rounded-2xl border-2 px-5 py-3 text-sm font-semibold transition"
                style={{
                  borderColor: currentGalaxy === galaxy ? (galaxy === 'rd' ? '#4fc3f7' : '#ab47bc') : 'rgba(255,255,255,0.16)',
                  background: currentGalaxy === galaxy ? (galaxy === 'rd' ? 'rgba(79, 195, 247, 0.1)' : 'rgba(171, 71, 188, 0.1)') : 'transparent',
                  color: currentGalaxy === galaxy ? '#ffffff' : 'rgba(255,255,255,0.46)',
                }}
              >
                {GALAXY_LABELS[galaxy]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 text-center">
              <div className="text-xs tracking-[0.2em] text-white/38">星球</div>
              <div className="mt-2 text-xl font-semibold text-white">{summary.planetCount}</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 text-center">
              <div className="text-xs tracking-[0.2em] text-white/38">领域</div>
              <div className="mt-2 text-xl font-semibold text-white">{summary.territoryCount}</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 text-center">
              <div className="text-xs tracking-[0.2em] text-white/38">能力点</div>
              <div className="mt-2 text-xl font-semibold text-white">{summary.facilityCount}</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <StatusNotice kind={activeNotice.kind} message={activeNotice.message} />
        </div>

        <div className="space-y-6">
          {planets.map((planet, planetIndex) => {
            const IconComponent = (Icons[planet.icon as keyof typeof Icons] as LucideIcon) || Icons.Circle;

            return (
              <motion.section
                key={planet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: planetIndex * 0.08 }}
                className="rounded-[32px] border p-5 md:p-6"
                style={{
                  background: 'rgba(27, 38, 59, 0.64)',
                  borderColor: 'rgba(79, 195, 247, 0.15)',
                }}
              >
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full" style={{ background: planet.gradient }}>
                      <IconComponent size={22} style={{ color: planet.iconColor }} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold" style={{ color: planet.color }}>
                        {planet.name}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-white/56">{planet.description}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openCreateModal(planet)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-[#4fc3f7]/35 bg-[#4fc3f7]/10 px-4 py-3 text-sm font-medium text-[#4fc3f7] transition hover:bg-[#4fc3f7]/18"
                  >
                    <Plus size={16} />
                    新增能力领域
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                  {planet.territories.map((territory) => {
                    const TIconComponent = (Icons[territory.icon as keyof typeof Icons] as LucideIcon) || Icons.Circle;

                    return (
                      <article
                        key={territory.id}
                        className="relative rounded-3xl border p-4"
                        style={{
                          background: 'rgba(13, 27, 42, 0.55)',
                          borderColor: 'rgba(79, 195, 247, 0.1)',
                        }}
                      >
                        <div className="absolute left-0 right-0 top-0 h-1 rounded-t-3xl" style={{ background: territory.color }} />

                        <div className="mb-4 flex items-start gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl" style={{ background: `${territory.color}20` }}>
                            <TIconComponent size={18} style={{ color: territory.color }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-semibold" style={{ color: territory.color }}>
                              {territory.name}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-sm text-white/50">{territory.description}</p>
                          </div>
                        </div>

                        <div className="mb-4 flex flex-wrap gap-2">
                          {territory.markers.slice(0, 4).map((marker, markerIndex) => (
                            <span
                              key={`${territory.id}-${markerIndex}`}
                              className="rounded-full px-2.5 py-1 text-xs"
                              style={{
                                background: `${territory.color}14`,
                                color: territory.color,
                              }}
                            >
                              {marker}
                            </span>
                          ))}
                          {territory.markers.length > 4 && <span className="rounded-full bg-white/6 px-2.5 py-1 text-xs text-white/45">+{territory.markers.length - 4}</span>}
                        </div>

                        <div className="mb-4 flex items-center justify-between text-xs text-white/45">
                          <span>{territory.facilities.length} 个能力点</span>
                          <span>{territory.facilities.filter((facility) => facility.link).length} 个带链接</span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(planet, territory)}
                            className="flex-1 inline-flex items-center justify-center gap-1 rounded-2xl border border-white/12 bg-white/5 px-3 py-2.5 text-sm text-white/78 transition hover:bg-white/10"
                          >
                            <Edit2 size={14} />
                            编辑
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmState({ type: 'delete', territory })}
                            className="inline-flex items-center justify-center rounded-2xl border border-red-500/28 bg-red-500/8 px-3 py-2.5 text-red-300 transition hover:bg-red-500/15"
                            aria-label={`删除 ${territory.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </article>
                    );
                  })}

                  {planet.territories.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-white/12 px-5 py-10 text-center text-sm text-white/44">
                      当前星球还没有领域，直接新增一个即可。
                    </div>
                  )}
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>

      <ConfigModal
        key={`${selectedPlanet?.id || 'new'}-${selectedTerritory?.id || 'draft'}-${isModalOpen ? 'open' : 'closed'}`}
        isOpen={isModalOpen}
        onClose={closeModal}
        territory={selectedTerritory}
        onSave={handleSaveTerritory}
        onDelete={selectedTerritory ? () => setConfirmState({ type: 'delete', territory: selectedTerritory }) : undefined}
        isSaving={isSubmitting}
      />

      <ConfirmDialog
        isOpen={confirmState?.type === 'delete'}
        title="确认删除能力领域"
        description={`删除后将移除该领域及其全部能力点。${confirmState?.territory ? `当前将删除「${confirmState.territory.name}」。` : ''}`}
        confirmLabel="删除"
        pending={isSubmitting}
        onClose={() => setConfirmState(null)}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
}
