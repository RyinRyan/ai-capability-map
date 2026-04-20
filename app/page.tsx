'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, UserCircle, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Starfield from './components/Starfield';
import PlanetCard from './components/PlanetCard';
import ExplorePanel from './components/ExplorePanel';
import { useCapabilities } from './hooks/useCapabilities';
import { Planet, GalaxyType } from './types';

export default function Home() {
  const router = useRouter();
  const [currentGalaxy, setCurrentGalaxy] = useState<GalaxyType>('rd');
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [showExplorer, setShowExplorer] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  
  const { getPlanets, isLoaded } = useCapabilities();

  // Check login status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        if (data.loggedIn) {
          setIsLoggedIn(true);
          setUsername(data.username);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsLoggedIn(false);
      setUsername('');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleExplorePlanet = (planet: Planet) => {
    setSelectedPlanet(planet);
    setShowExplorer(true);
  };

  const handleCloseExplorer = () => {
    setShowExplorer(false);
    setTimeout(() => setSelectedPlanet(null), 300);
  };

  const planets = isLoaded ? getPlanets(currentGalaxy) : [];

  return (
    <main className="min-h-screen relative overflow-x-hidden" style={{ background: '#0d1b2a' }}>
      {/* Starfield Background */}
      <Starfield />

      {/* Nebula Layer */}
      <div 
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(79, 195, 247, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 60%, rgba(171, 71, 188, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse 40% 30% at 50% 80%, rgba(255, 213, 79, 0.04) 0%, transparent 50%)
          `,
          animation: 'nebulaDrift 60s ease-in-out infinite'
        }}
      />

      {/* Data Stream */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-2">
        {[0, 0.1, 0.2, 0.3, 0.4].map((delay, i) => (
          <div
            key={i}
            className="w-1 h-1 rounded-full"
            style={{
              background: '#4fc3f7',
              animation: `streamFlow 1.5s ease-in-out infinite`,
              animationDelay: `${delay}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="galaxy-map relative z-10 min-h-screen p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-12 relative">
          <div className="flex items-center gap-6">
            {/* Compass */}
            <div className="relative w-20 h-20">
              <div 
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: 'rgba(79, 195, 247, 0.3)' }}
              />
              <div 
                className="absolute rounded-full border-2"
                style={{ 
                  inset: '10px',
                  borderColor: 'rgba(171, 71, 188, 0.2)'
                }}
              />
              <div 
                className="absolute top-1/2 left-1/2 w-0.5 h-8 -translate-x-1/2 -translate-y-full origin-bottom"
                style={{ 
                  background: '#4fc3f7',
                  animation: 'compassPulse 2s ease-in-out infinite'
                }}
              />
              <div 
                className="absolute top-1/2 left-1/2 w-0.5 h-8 -translate-x-1/2 -translate-y-full origin-bottom rotate-90"
                style={{ 
                  background: '#ab47bc',
                  animation: 'compassPulse 2s ease-in-out infinite'
                }}
              />
            </div>

            {/* Title */}
            <div>
              <h1 
                className="text-3xl font-bold tracking-wide"
                style={{ 
                  color: '#4fc3f7',
                  fontFamily: 'var(--font-exo-2)'
                }}
              >
                AI R&D CAPABILITY MAP
              </h1>
              <p className="text-sm tracking-widest opacity-60">
                EXPLORATION TERMINAL v2.4
              </p>
            </div>
          </div>

          {/* Active Status & Config Link */}
          <div className="flex items-center gap-4">
            <div 
              className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2"
              style={{
                background: currentGalaxy === 'rd' 
                  ? 'rgba(79, 195, 247, 0.2)' 
                  : 'rgba(171, 71, 188, 0.2)',
                borderColor: currentGalaxy === 'rd' ? '#4fc3f7' : '#ab47bc',
                color: currentGalaxy === 'rd' ? '#4fc3f7' : '#ab47bc'
              }}
            >
              <span className="text-lg">🛰️</span>
              ACTIVE: {currentGalaxy === 'rd' ? 'R&D SECTOR' : 'DIGITAL ENTITY SECTOR'}
            </div>
                            
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/config"
                  className="w-8 h-8 rounded-lg border border-[#4fc3f7]/50 text-[#4fc3f7] hover:bg-[#4fc3f7]/10 transition-all flex items-center justify-center"
                  title="配置"
                >
                  <Settings size={16} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-lg border border-white/20 text-white/60 hover:border-red-400 hover:text-red-400 hover:bg-red-400/10 transition-all flex items-center justify-center"
                  title={`退出登录 (${username})`}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="w-8 h-8 rounded-lg border border-white/10 text-white/40 hover:border-white/30 hover:text-white/60 transition-all flex items-center justify-center"
                title="管理员登录"
              >
                <Settings size={16} />
              </Link>
            )}
          </div>
        </header>

        {/* Galaxy Switcher */}
        <div className="flex justify-center gap-8 mb-16">
          <button
            onClick={() => setCurrentGalaxy('rd')}
            className="gateway-btn px-8 py-4 rounded-full font-bold text-lg border-2 transition-all flex items-center gap-3"
            style={{
              borderColor: currentGalaxy === 'rd' ? '#4fc3f7' : 'rgba(255,255,255,0.2)',
              color: currentGalaxy === 'rd' ? '#4fc3f7' : 'rgba(255,255,255,0.4)',
              background: currentGalaxy === 'rd' ? 'rgba(79, 195, 247, 0.1)' : 'transparent'
            }}
          >
            <Rocket size={24} />
            AI 辅助研发星域
          </button>
          <button
            onClick={() => setCurrentGalaxy('digital')}
            className="gateway-btn px-8 py-4 rounded-full font-bold text-lg border-2 transition-all flex items-center gap-3"
            style={{
              borderColor: currentGalaxy === 'digital' ? '#ab47bc' : 'rgba(255,255,255,0.2)',
              color: currentGalaxy === 'digital' ? '#ab47bc' : 'rgba(255,255,255,0.4)',
              background: currentGalaxy === 'digital' ? 'rgba(171, 71, 188, 0.1)' : 'transparent'
            }}
          >
            <UserCircle size={24} />
            AI 数字人星域
          </button>
        </div>

        {/* Planets Grid */}
        <div className="relative max-w-6xl mx-auto">
          {/* Orbit Paths SVG */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
            <ellipse 
              cx="50%" 
              cy="50%" 
              rx="45%" 
              ry="35%" 
              className="orbit-path"
              style={{
                stroke: 'rgba(79, 195, 247, 0.3)',
                strokeWidth: 1,
                fill: 'none',
                strokeDasharray: '8 4',
                animation: 'orbitDash 20s linear infinite'
              }}
            />
            <ellipse 
              cx="50%" 
              cy="50%" 
              rx="35%" 
              ry="25%" 
              className="orbit-path"
              style={{
                stroke: 'rgba(79, 195, 247, 0.3)',
                strokeWidth: 1,
                fill: 'none',
                strokeDasharray: '8 4',
                animation: 'orbitDash 20s linear infinite reverse'
              }}
            />
            <ellipse 
              cx="50%" 
              cy="50%" 
              rx="25%" 
              ry="15%" 
              className="orbit-path"
              style={{
                stroke: 'rgba(79, 195, 247, 0.3)',
                strokeWidth: 1,
                fill: 'none',
                strokeDasharray: '8 4',
                animation: 'orbitDash 20s linear infinite'
              }}
            />
          </svg>

          {/* Planets */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentGalaxy}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-8 relative"
              style={{ zIndex: 10 }}
            >
              {planets.map((planet, index) => (
                <PlanetCard
                  key={planet.id}
                  planet={planet}
                  index={index}
                  currentGalaxy={currentGalaxy}
                  onClick={() => handleExplorePlanet(planet)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Explore Panel */}
      <ExplorePanel
        planet={selectedPlanet}
        isOpen={showExplorer}
        onClose={handleCloseExplorer}
      />
    </main>
  );
}
