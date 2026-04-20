'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Rocket, Settings, Sparkles, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import ExplorePanel from './components/ExplorePanel';
import PlanetCard from './components/PlanetCard';
import Starfield from './components/Starfield';
import StatusNotice from './components/StatusNotice';
import { useCapabilities } from './hooks/useCapabilities';
import { GalaxyType, Planet } from './types';

const GALAXY_COPY: Record<GalaxyType, { label: string; title: string; hint: string; accent: string }> = {
  rd: {
    label: '研发星域',
    title: 'AI 辅助研发能力地图',
    hint: '先浏览星球，再进入能力详情面板；点击任一星球即可查看完整领域与能力点。',
    accent: '#4fc3f7',
  },
  digital: {
    label: '数字员工星域',
    title: 'AI 数字员工能力地图',
    hint: '适合按场景快速扫读，优先查看已上线能力，再决定是否继续深入。',
    accent: '#ab47bc',
  },
};

export default function Home() {
  const [currentGalaxy, setCurrentGalaxy] = useState<GalaxyType>(() => {
    if (typeof window === 'undefined') {
      return 'rd';
    }

    const savedGalaxy = window.localStorage.getItem('preferred-galaxy');
    return savedGalaxy === 'digital' ? 'digital' : 'rd';
  });
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [showExplorer, setShowExplorer] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const { getPlanets, isLoaded, isRefreshing, error } = useCapabilities();

  useEffect(() => {
    window.localStorage.setItem('preferred-galaxy', currentGalaxy);
  }, [currentGalaxy]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', { cache: 'no-store' });
        const data = await response.json();
        setIsLoggedIn(Boolean(data.loggedIn));
        setUsername(data.username || '');
      } catch (authError) {
        console.error('Auth check error:', authError);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsLoggedIn(false);
      setUsername('');
    } catch (logoutError) {
      console.error('Logout error:', logoutError);
    }
  };

  const planets = useMemo(() => (isLoaded ? getPlanets(currentGalaxy) : []), [currentGalaxy, getPlanets, isLoaded]);
  const summary = useMemo(() => {
    const territoryCount = planets.reduce((count, planet) => count + planet.territories.length, 0);
    return {
      planetCount: planets.length,
      territoryCount,
      facilityCount: planets.reduce(
        (count, planet) => count + planet.territories.reduce((territoryCount, territory) => territoryCount + territory.facilities.length, 0),
        0
      ),
    };
  }, [planets]);

  const copy = GALAXY_COPY[currentGalaxy];

  return (
    <main className="min-h-screen relative overflow-x-hidden" style={{ background: '#0d1b2a' }}>
      <Starfield />

      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(79, 195, 247, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 60%, rgba(171, 71, 188, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse 42% 30% at 50% 82%, rgba(255, 213, 79, 0.05) 0%, transparent 50%)
          `,
          animation: 'nebulaDrift 60s ease-in-out infinite',
        }}
      />

      <div className="fixed right-5 top-1/2 z-[100] hidden -translate-y-1/2 flex-col gap-2 lg:flex">
        {[0, 0.1, 0.2, 0.3, 0.4].map((delay, index) => (
          <div
            key={index}
            className="h-1 w-1 rounded-full"
            style={{
              background: '#4fc3f7',
              animation: 'streamFlow 1.5s ease-in-out infinite',
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen px-4 py-6 md:px-8 md:py-8">
        <header className="mb-10 flex flex-col gap-6 rounded-[32px] border border-white/10 bg-black/10 p-5 backdrop-blur-sm md:flex-row md:items-center md:justify-between md:p-7">
          <div className="flex items-start gap-5">
            <div className="relative hidden h-20 w-20 md:block">
              <div className="absolute inset-0 rounded-full border-2 border-[#4fc3f7]/30" />
              <div className="absolute inset-[10px] rounded-full border-2 border-[#ab47bc]/20" />
              <div className="absolute left-1/2 top-1/2 h-8 w-0.5 -translate-x-1/2 -translate-y-full origin-bottom bg-[#4fc3f7]" style={{ animation: 'compassPulse 2s ease-in-out infinite' }} />
              <div className="absolute left-1/2 top-1/2 h-8 w-0.5 -translate-x-1/2 -translate-y-full origin-bottom rotate-90 bg-[#ab47bc]" style={{ animation: 'compassPulse 2s ease-in-out infinite' }} />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-[0.24em] text-white/55">
                <Sparkles size={14} />
                CAPABILITY MAP
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#4fc3f7] md:text-3xl" style={{ fontFamily: 'var(--font-exo-2)' }}>
                  {copy.title}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-white/62">{copy.hint}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className="rounded-2xl border px-4 py-3 text-sm font-medium"
              style={{
                background: currentGalaxy === 'rd' ? 'rgba(79, 195, 247, 0.18)' : 'rgba(171, 71, 188, 0.18)',
                borderColor: currentGalaxy === 'rd' ? '#4fc3f7' : '#ab47bc',
                color: currentGalaxy === 'rd' ? '#4fc3f7' : '#d8b4fe',
              }}
            >
              当前星域：{copy.label}
            </div>

            {isCheckingAuth ? (
              <div className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/45">正在检查登录状态...</div>
            ) : isLoggedIn ? (
              <>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/72">管理员：{username}</div>
                <Link
                  href="/config"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#4fc3f7]/40 text-[#4fc3f7] transition hover:bg-[#4fc3f7]/10"
                  title="进入配置页"
                >
                  <Settings size={18} />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/16 text-white/65 transition hover:border-red-400 hover:bg-red-400/10 hover:text-red-300"
                  title="退出登录"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/12 px-4 py-3 text-sm text-white/68 transition hover:border-white/28 hover:text-white"
              >
                <Settings size={16} />
                管理员登录
              </Link>
            )}
          </div>
        </header>

        <div className="mb-8 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setCurrentGalaxy('rd')}
              className="gateway-btn inline-flex items-center gap-3 rounded-full border-2 px-6 py-3 text-base font-semibold transition"
              style={{
                borderColor: currentGalaxy === 'rd' ? '#4fc3f7' : 'rgba(255,255,255,0.2)',
                color: currentGalaxy === 'rd' ? '#4fc3f7' : 'rgba(255,255,255,0.46)',
                background: currentGalaxy === 'rd' ? 'rgba(79, 195, 247, 0.1)' : 'transparent',
              }}
            >
              <Rocket size={20} />
              AI 辅助研发星域
            </button>
            <button
              type="button"
              onClick={() => setCurrentGalaxy('digital')}
              className="gateway-btn inline-flex items-center gap-3 rounded-full border-2 px-6 py-3 text-base font-semibold transition"
              style={{
                borderColor: currentGalaxy === 'digital' ? '#ab47bc' : 'rgba(255,255,255,0.2)',
                color: currentGalaxy === 'digital' ? '#d8b4fe' : 'rgba(255,255,255,0.46)',
                background: currentGalaxy === 'digital' ? 'rgba(171, 71, 188, 0.1)' : 'transparent',
              }}
            >
              <UserCircle size={20} />
              AI 数字员工星域
            </button>
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

        <div className="mb-8">
          {!isLoaded || isRefreshing ? (
            <StatusNotice kind="loading" message="正在载入能力地图数据..." />
          ) : error ? (
            <StatusNotice kind="error" message={error} />
          ) : (
            <StatusNotice kind="info" message={`当前展示 ${copy.label}，建议优先点击最感兴趣的星球查看完整能力细节。`} />
          )}
        </div>

        <div className="relative mx-auto max-w-7xl">
          <svg className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" style={{ zIndex: 0 }}>
            <ellipse cx="50%" cy="50%" rx="45%" ry="35%" style={{ stroke: 'rgba(79, 195, 247, 0.24)', strokeWidth: 1, fill: 'none', strokeDasharray: '8 4', animation: 'orbitDash 20s linear infinite' }} />
            <ellipse cx="50%" cy="50%" rx="35%" ry="25%" style={{ stroke: 'rgba(79, 195, 247, 0.18)', strokeWidth: 1, fill: 'none', strokeDasharray: '8 4', animation: 'orbitDash 20s linear infinite reverse' }} />
            <ellipse cx="50%" cy="50%" rx="25%" ry="15%" style={{ stroke: 'rgba(79, 195, 247, 0.14)', strokeWidth: 1, fill: 'none', strokeDasharray: '8 4', animation: 'orbitDash 20s linear infinite' }} />
          </svg>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentGalaxy}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35 }}
              className="relative z-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              {planets.map((planet, index) => (
                <PlanetCard
                  key={planet.id}
                  planet={planet}
                  index={index}
                  currentGalaxy={currentGalaxy}
                  onClick={() => {
                    setSelectedPlanet(planet);
                    setShowExplorer(true);
                  }}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {isLoaded && planets.length === 0 && (
            <div className="rounded-[32px] border border-dashed border-white/14 bg-white/[0.03] px-6 py-16 text-center text-white/48">
              当前星域还没有可展示的星球数据。
            </div>
          )}
        </div>
      </div>

      <ExplorePanel
        planet={selectedPlanet}
        isOpen={showExplorer}
        onClose={() => {
          setShowExplorer(false);
          window.setTimeout(() => setSelectedPlanet(null), 200);
        }}
      />
    </main>
  );
}
