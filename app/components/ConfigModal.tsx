'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, MapPin, ExternalLink } from 'lucide-react';
import { Territory, Facility } from '../types';
import * as Icons from 'lucide-react';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  territory?: Territory | null;
  onSave: (territory: Omit<Territory, 'id'>) => void;
  onDelete?: () => void;
}

const AVAILABLE_ICONS = [
  'Rocket', 'Brain', 'Puzzle', 'Star', 'Settings', 
  'Shield', 'Network', 'FlaskConical', 'ClipboardCheck',
  'Palette', 'Box', 'Microscope', 'Infinity', 'Zap'
];

const AVAILABLE_COLORS = [
  '#4fc3f7', '#ab47bc', '#ffd54f', '#69f0ae', '#ff7043',
  '#66bb6a', '#42a5f5', '#ec407a', '#ef5350', '#7e57c2'
];

export default function ConfigModal({ isOpen, onClose, territory, onSave, onDelete }: ConfigModalProps) {
  const [formData, setFormData] = useState<Omit<Territory, 'id'>>({
    name: '',
    description: '',
    icon: 'Rocket',
    color: '#4fc3f7',
    markers: [],
    facilities: []
  });

  const [newMarker, setNewMarker] = useState('');
  const [newFacility, setNewFacility] = useState({ name: '', status: 'online' as Facility['status'], link: '' });

  // Reset form data when territory prop changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: territory?.name || '',
        description: territory?.description || '',
        icon: territory?.icon || 'Rocket',
        color: territory?.color || '#4fc3f7',
        markers: territory?.markers || [],
        facilities: territory?.facilities || []
      });
    }
  }, [isOpen, territory]);

  const handleAddMarker = () => {
    if (newMarker.trim()) {
      setFormData(prev => ({
        ...prev,
        markers: [...prev.markers, newMarker.trim()]
      }));
      setNewMarker('');
    }
  };

  const handleRemoveMarker = (index: number) => {
    setFormData(prev => ({
      ...prev,
      markers: prev.markers.filter((_, i) => i !== index)
    }));
  };

  const handleAddFacility = () => {
    if (newFacility.name.trim()) {
      setFormData(prev => ({
        ...prev,
        facilities: [...prev.facilities, { name: newFacility.name, status: newFacility.status }]
      }));
      setNewFacility({ name: '', status: 'online', link: '' });
    }
  };

  const handleRemoveFacility = (index: number) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(13, 27, 42, 0.98), rgba(27, 38, 59, 0.95))',
              border: '1px solid rgba(79, 195, 247, 0.3)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: '#4fc3f7', fontFamily: 'var(--font-exo-2)' }}>
                {territory ? '编辑能力国度' : '新增能力国度'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-white/60" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm text-white/60 mb-2">名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-[#4fc3f7] focus:outline-none transition-colors"
                  placeholder="输入能力国度名称"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-white/60 mb-2">描述</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-[#4fc3f7] focus:outline-none transition-colors resize-none"
                  rows={2}
                  placeholder="输入描述"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm text-white/60 mb-2">图标</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_ICONS.map(iconName => {
                    const IconComponent = (Icons[iconName as keyof typeof Icons] as React.ComponentType<{ size: number; className?: string }>) || Icons.Circle;
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, icon: iconName }))}
                        className={`p-3 rounded-lg border transition-all ${
                          formData.icon === iconName 
                            ? 'border-[#4fc3f7] bg-[#4fc3f7]/20' 
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <IconComponent size={20} className="text-white" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm text-white/60 mb-2">颜色</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        formData.color === color 
                          ? 'border-white scale-110' 
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Markers */}
              <div>
                <label className="block text-sm text-white/60 mb-2">标签</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newMarker}
                    onChange={e => setNewMarker(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddMarker())}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-[#4fc3f7] focus:outline-none transition-colors"
                    placeholder="添加标签"
                  />
                  <button
                    type="button"
                    onClick={handleAddMarker}
                    className="px-4 py-2 rounded-lg bg-[#4fc3f7]/20 border border-[#4fc3f7]/50 text-[#4fc3f7] hover:bg-[#4fc3f7]/30 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.markers.map((marker, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-lg text-sm flex items-center gap-2"
                      style={{ background: `${formData.color}20`, color: formData.color }}
                    >
                      <MapPin size={12} />
                      {marker}
                      <button
                        type="button"
                        onClick={() => handleRemoveMarker(index)}
                        className="hover:opacity-70"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div>
                <label className="block text-sm text-white/60 mb-2">能力地标</label>
                <div className="space-y-2 mb-4">
                  <input
                    type="text"
                    value={newFacility.name}
                    onChange={e => setNewFacility(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-[#4fc3f7] focus:outline-none transition-colors"
                    placeholder="能力地标名称"
                  />
                  <input
                    type="url"
                    value={newFacility.link}
                    onChange={e => setNewFacility(prev => ({ ...prev, link: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-[#4fc3f7] focus:outline-none transition-colors"
                    placeholder="跳转链接 (https://...)"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newFacility.status}
                      onChange={e => setNewFacility(prev => ({ ...prev, status: e.target.value as Facility['status'] }))}
                      className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-[#4fc3f7] focus:outline-none transition-colors"
                    >
                      <option value="online">已上线</option>
                      <option value="dev">开发中</option>
                      <option value="plan">待规划</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddFacility}
                      className="px-4 py-2 rounded-lg bg-[#4fc3f7]/20 border border-[#4fc3f7]/50 text-[#4fc3f7] hover:bg-[#4fc3f7]/30 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {formData.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 rounded-lg bg-white/5"
                    >
                      {/* 第一行：名称和状态 */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{facility.name}</span>
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              background: facility.status === 'online' ? '#69f0ae20' : facility.status === 'dev' ? '#ffab4020' : '#ffffff10',
                              color: facility.status === 'online' ? '#69f0ae' : facility.status === 'dev' ? '#ffab40' : '#ffffff80'
                            }}
                          >
                            {facility.status === 'online' ? '已上线' : facility.status === 'dev' ? '开发中' : '待规划'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFacility(index)}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                          >
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        </div>
                      </div>
                      {/* 第二行：URL 显示和编辑 */}
                      <div className="flex items-center gap-2 text-sm">
                        <ExternalLink size={14} className={facility.link ? "text-[#4fc3f7]" : "text-white/30"} />
                        <input
                          type="text"
                          value={facility.link || ''}
                          onChange={e => {
                            const newLink = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              facilities: prev.facilities.map((f, i) => 
                                i === index ? { ...f, link: newLink || undefined } : f
                              )
                            }));
                          }}
                          className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white/70 text-xs focus:border-[#4fc3f7] focus:outline-none transition-colors"
                          placeholder="输入跳转链接 (https://...)"
                        />
                        {facility.link && (
                          <a
                            href={facility.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#4fc3f7] hover:text-[#4fc3f7]/80 transition-colors"
                            onClick={e => e.stopPropagation()}
                            title="打开链接"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                {territory && onDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      onDelete();
                      onClose();
                    }}
                    className="px-6 py-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    删除
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-lg border border-white/20 text-white/60 hover:border-white/40 hover:text-white transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-lg bg-[#4fc3f7]/20 border border-[#4fc3f7] text-[#4fc3f7] hover:bg-[#4fc3f7]/30 transition-colors"
                >
                  保存
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
