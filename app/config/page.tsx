'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit2, Trash2, RotateCcw, Rocket, UserCircle, LogOut } from 'lucide-react';
import Starfield from '../components/Starfield';
import ConfigModal from '../components/ConfigModal';
import { useCapabilities } from '../hooks/useCapabilities';
import { Planet, Territory, GalaxyType } from '../types';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export default function ConfigPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const { 
    getPlanets, 
    addTerritory, 
    updateTerritory, 
    deleteTerritory, 
    resetToDefault,
    isLoaded 
  } = useCapabilities();
  
  const [currentGalaxy, setCurrentGalaxy] = useState<GalaxyType>('rd');
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        if (data.loggedIn) {
          setIsLoggedIn(true);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const planets = isLoaded ? getPlanets(currentGalaxy) : [];

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <main className="min-h-screen relative overflow-hidden" style={{ background: '#0d1b2a' }}>
        <Starfield />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-[#4fc3f7] text-xl">验证中...</div>
        </div>
      </main>
    );
  }

  // Redirect if not logged in
  if (!isLoggedIn) {
    return null;
  }

  const handleAddTerritory = (planet: Planet) => {
    setSelectedPlanet(planet);
    setSelectedTerritory(null);
    setIsModalOpen(true);
  };

  const handleEditTerritory = (planet: Planet, territory: Territory) => {
    setSelectedPlanet(planet);
    setSelectedTerritory(territory);
    setIsModalOpen(true);
  };

  const handleSaveTerritory = async (territoryData: Omit<Territory, 'id'>) => {
    if (!selectedPlanet) return;

    if (selectedTerritory) {
      // Update existing
      await updateTerritory(currentGalaxy, selectedPlanet.id, selectedTerritory.id, territoryData);
    } else {
      // Add new
      await addTerritory(currentGalaxy, selectedPlanet.id, territoryData);
    }
  };

  const handleDeleteTerritory = async () => {
    if (!selectedPlanet || !selectedTerritory) return;
    await deleteTerritory(currentGalaxy, selectedPlanet.id, selectedTerritory.id);
  };

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
            radial-gradient(ellipse 60% 40% at 80% 60%, rgba(171, 71, 188, 0.06) 0%, transparent 50%)
          `,
          animation: 'nebulaDrift 60s ease-in-out infinite'
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-white/60 hover:border-[#4fc3f7] hover:text-[#4fc3f7] hover:bg-[#4fc3f7]/10 transition-all"
            >
              <ArrowLeft size={20} />
              返回地图
            </Link>
            <h1 
              className="text-2xl font-bold"
              style={{ color: '#4fc3f7', fontFamily: 'var(--font-exo-2)' }}
            >
              能力地图配置管理
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (confirm('确定要重置为默认数据吗？所有自定义配置将丢失。')) {
                  resetToDefault();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
            >
              <RotateCcw size={18} />
              重置默认
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-white/60 hover:border-red-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
            >
              <LogOut size={18} />
              退出登录
            </button>
          </div>
        </header>

        {/* Galaxy Switcher */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setCurrentGalaxy('rd')}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all"
            style={{
              borderColor: currentGalaxy === 'rd' ? '#4fc3f7' : 'rgba(255,255,255,0.2)',
              color: currentGalaxy === 'rd' ? '#4fc3f7' : 'rgba(255,255,255,0.4)',
              background: currentGalaxy === 'rd' ? 'rgba(79, 195, 247, 0.1)' : 'transparent'
            }}
          >
            <Rocket size={20} />
            AI 辅助研发星域
          </button>
          <button
            onClick={() => setCurrentGalaxy('digital')}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all"
            style={{
              borderColor: currentGalaxy === 'digital' ? '#ab47bc' : 'rgba(255,255,255,0.2)',
              color: currentGalaxy === 'digital' ? '#ab47bc' : 'rgba(255,255,255,0.4)',
              background: currentGalaxy === 'digital' ? 'rgba(171, 71, 188, 0.1)' : 'transparent'
            }}
          >
            <UserCircle size={20} />
            AI 数字人星域
          </button>
        </div>

        {/* Planets List */}
        <div className="space-y-8">
          {planets.map((planet, pIndex) => {
            const IconComponent = (Icons[planet.icon as keyof typeof Icons] as LucideIcon) || Icons.Circle;
            
            return (
              <motion.div
                key={planet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: pIndex * 0.1 }}
                className="rounded-2xl p-6"
                style={{
                  background: 'rgba(27, 38, 59, 0.6)',
                  border: '1px solid rgba(79, 195, 247, 0.15)'
                }}
              >
                {/* Planet Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: planet.gradient }}
                  >
                    <IconComponent size={24} style={{ color: planet.iconColor }} />
                  </div>
                  <div className="flex-1">
                    <h2 
                      className="text-xl font-bold"
                      style={{ color: planet.color }}
                    >
                      {planet.name}
                    </h2>
                    <p className="text-sm text-white/50">{planet.description}</p>
                  </div>
                  <div className="text-sm text-white/40">
                    {planet.territories.length} 个能力国度
                  </div>
                </div>

                {/* Territories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {planet.territories.map((territory, tIndex) => {
                    const TIconComponent = (Icons[territory.icon as keyof typeof Icons] as LucideIcon) || Icons.Circle;
                    
                    return (
                      <div
                        key={territory.id}
                        className="p-4 rounded-xl group relative"
                        style={{
                          background: 'rgba(13, 27, 42, 0.5)',
                          border: '1px solid rgba(79, 195, 247, 0.1)'
                        }}
                      >
                        {/* Top accent */}
                        <div 
                          className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                          style={{ background: territory.color }}
                        />

                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: `${territory.color}20` }}
                          >
                            <TIconComponent size={20} style={{ color: territory.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 
                              className="font-semibold truncate"
                              style={{ color: territory.color }}
                            >
                              {territory.name}
                            </h3>
                            <p className="text-xs text-white/50 truncate">
                              {territory.description}
                            </p>
                          </div>
                        </div>

                        {/* Markers */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {territory.markers.slice(0, 3).map((marker, mIndex) => (
                            <span
                              key={mIndex}
                              className="px-2 py-0.5 rounded text-xs"
                              style={{ 
                                background: `${territory.color}15`, 
                                color: territory.color 
                              }}
                            >
                              {marker}
                            </span>
                          ))}
                          {territory.markers.length > 3 && (
                            <span className="px-2 py-0.5 rounded text-xs text-white/40">
                              +{territory.markers.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditTerritory(planet, territory)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
                          >
                            <Edit2 size={14} />
                            编辑
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`确定要删除 "${territory.name}" 吗？`)) {
                                deleteTerritory(currentGalaxy, planet.id, territory.id);
                              }
                            }}
                            className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Facility link indicator */}
                        {territory.facilities?.some(f => f.link) && (
                          <div 
                            className="absolute top-2 right-2 w-2 h-2 rounded-full"
                            style={{ background: territory.color }}
                            title={`${territory.facilities.filter(f => f.link).length} 个能力地标已配置链接`}
                          />
                        )}
                      </div>
                    );
                  })}

                  {/* Add New Button */}
                  <button
                    onClick={() => handleAddTerritory(planet)}
                    className="p-4 rounded-xl border-2 border-dashed border-white/20 hover:border-[#4fc3f7]/50 hover:bg-[#4fc3f7]/5 transition-all flex flex-col items-center justify-center gap-2 text-white/40 hover:text-[#4fc3f7]"
                    style={{ minHeight: '120px' }}
                  >
                    <Plus size={32} />
                    <span className="text-sm">新增能力国度</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Config Modal */}
      <ConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        territory={selectedTerritory}
        onSave={handleSaveTerritory}
        onDelete={selectedTerritory ? handleDeleteTerritory : undefined}
      />
    </main>
  );
}
