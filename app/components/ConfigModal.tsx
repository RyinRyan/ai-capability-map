'use client';

import { AnimatePresence, motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ExternalLink, LucideIcon, MapPin, Plus, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Facility, Territory } from '../types';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  territory?: Territory | null;
  onSave: (territory: Omit<Territory, 'id'>) => Promise<void> | void;
  onDelete?: () => void;
  isSaving?: boolean;
}

const AVAILABLE_ICONS = ['Rocket', 'Brain', 'Puzzle', 'Star', 'Settings', 'Shield', 'Network', 'FlaskConical', 'ClipboardCheck', 'Palette', 'Box', 'Microscope', 'Infinity', 'Zap'];

const AVAILABLE_COLORS = ['#4fc3f7', '#ab47bc', '#ffd54f', '#69f0ae', '#ff7043', '#66bb6a', '#42a5f5', '#ec407a', '#ef5350', '#7e57c2'];

const emptyFacility = { name: '', status: 'online' as Facility['status'], link: '' };

function getInitialFormData(territory?: Territory | null): Omit<Territory, 'id'> {
  return {
    name: territory?.name || '',
    description: territory?.description || '',
    icon: territory?.icon || 'Rocket',
    color: territory?.color || '#4fc3f7',
    markers: territory?.markers || [],
    facilities: territory?.facilities || [],
  };
}

export default function ConfigModal({ isOpen, onClose, territory, onSave, onDelete, isSaving = false }: ConfigModalProps) {
  const [formData, setFormData] = useState<Omit<Territory, 'id'>>(() => getInitialFormData(territory));
  const [newMarker, setNewMarker] = useState('');
  const [newFacility, setNewFacility] = useState(emptyFacility);
  const [error, setError] = useState('');

  const summary = useMemo(
    () => ({
      markerCount: formData.markers.length,
      facilityCount: formData.facilities.length,
      linkedFacilityCount: formData.facilities.filter((item) => item.link).length,
    }),
    [formData.facilities, formData.markers.length]
  );

  const addMarker = () => {
    const marker = newMarker.trim();
    if (!marker) {
      return;
    }

    if (formData.markers.includes(marker)) {
      setError('标签已存在，请勿重复添加。');
      return;
    }

    setFormData((prev) => ({ ...prev, markers: [...prev.markers, marker] }));
    setNewMarker('');
    setError('');
  };

  const addFacility = () => {
    const name = newFacility.name.trim();
    const link = newFacility.link.trim();

    if (!name) {
      setError('请先填写能力点名称。');
      return;
    }

    if (link) {
      try {
        new URL(link);
      } catch {
        setError('链接格式不正确，请输入完整 URL。');
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      facilities: [
        ...prev.facilities,
        {
          name,
          status: newFacility.status,
          link: link || undefined,
        },
      ],
    }));
    setNewFacility(emptyFacility);
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError('请填写领域名称。');
      return;
    }

    await onSave({
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      markers: formData.markers.map((item) => item.trim()).filter(Boolean),
      facilities: formData.facilities.map((item) => ({
        ...item,
        name: item.name.trim(),
        link: item.link?.trim() || undefined,
      })),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.82)' }}
          onClick={isSaving ? undefined : onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="w-full max-w-5xl overflow-hidden rounded-[32px] border"
            style={{
              background: 'linear-gradient(135deg, rgba(13, 27, 42, 0.98), rgba(27, 38, 59, 0.96))',
              borderColor: 'rgba(79, 195, 247, 0.25)',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex max-h-[92vh] flex-col overflow-hidden">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5 md:px-8">
                <div>
                  <h2 className="text-xl font-bold text-[#4fc3f7]" style={{ fontFamily: 'var(--font-exo-2)' }}>
                    {territory ? '编辑能力领域' : '新增能力领域'}
                  </h2>
                  <p className="mt-2 text-sm text-white/55">优先补充清晰名称、简短描述与可操作能力点，用户浏览会更顺。</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="rounded-2xl p-2 text-white/55 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="关闭配置弹窗"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid flex-1 grid-cols-1 overflow-y-auto md:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-6 px-6 py-6 md:px-8">
                  <section className="grid gap-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm text-white/65">领域名称</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-[#4fc3f7] focus:outline-none"
                        placeholder="例如：设计交付平台"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm text-white/65">描述</label>
                      <textarea
                        value={formData.description}
                        onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                        className="min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-[#4fc3f7] focus:outline-none"
                        placeholder="简要说明这个领域主要解决什么问题。"
                      />
                    </div>
                  </section>

                  <section>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-sm text-white/65">图标</label>
                      <span className="text-xs text-white/40">用于卡片识别</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_ICONS.map((iconName) => {
                        const IconComponent = (Icons[iconName as keyof typeof Icons] as LucideIcon) || Icons.Circle;
                        const isActive = formData.icon === iconName;
                        return (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, icon: iconName }))}
                            className="rounded-2xl border p-3 transition"
                            style={{
                              borderColor: isActive ? '#4fc3f7' : 'rgba(255,255,255,0.1)',
                              background: isActive ? 'rgba(79, 195, 247, 0.18)' : 'rgba(255,255,255,0.02)',
                            }}
                          >
                            <IconComponent size={18} className="text-white" />
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-sm text-white/65">主题色</label>
                      <span className="text-xs text-white/40">用于领域强调</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {AVAILABLE_COLORS.map((color) => {
                        const isActive = formData.color === color;
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, color }))}
                            className="h-10 w-10 rounded-2xl border-2 transition"
                            style={{
                              background: color,
                              borderColor: isActive ? '#ffffff' : 'transparent',
                              transform: isActive ? 'scale(1.08)' : 'scale(1)',
                            }}
                            aria-label={`选择颜色 ${color}`}
                          />
                        );
                      })}
                    </div>
                  </section>

                  <section>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-sm text-white/65">标签</label>
                      <span className="text-xs text-white/40">用于快速理解能力范围</span>
                    </div>
                    <div className="mb-3 flex gap-2">
                      <input
                        type="text"
                        value={newMarker}
                        onChange={(event) => setNewMarker(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            addMarker();
                          }
                        }}
                        className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-[#4fc3f7] focus:outline-none"
                        placeholder="例如：多角色协作"
                      />
                      <button
                        type="button"
                        onClick={addMarker}
                        className="rounded-2xl border border-[#4fc3f7]/40 bg-[#4fc3f7]/12 px-4 text-[#4fc3f7] transition hover:bg-[#4fc3f7]/20"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="flex min-h-12 flex-wrap gap-2">
                      {formData.markers.map((marker, index) => (
                        <span
                          key={`${marker}-${index}`}
                          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm"
                          style={{ background: `${formData.color}20`, color: formData.color }}
                        >
                          <MapPin size={12} />
                          {marker}
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, markers: prev.markers.filter((_, markerIndex) => markerIndex !== index) }))}
                            className="opacity-75 transition hover:opacity-100"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="border-t border-white/10 bg-black/10 px-6 py-6 md:border-l md:border-t-0 md:px-8">
                  <div className="mb-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="mb-3 text-xs tracking-[0.22em] text-white/40">摘要</div>
                    <div className="space-y-2 text-sm text-white/70">
                      <div className="flex items-center justify-between">
                        <span>标签数</span>
                        <span>{summary.markerCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>能力点数</span>
                        <span>{summary.facilityCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>已配置链接</span>
                        <span>{summary.linkedFacilityCount}</span>
                      </div>
                    </div>
                  </div>

                  <section className="mb-5">
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-sm text-white/65">能力点</label>
                      <span className="text-xs text-white/40">支持名称、状态和链接</span>
                    </div>
                    <div className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                      <input
                        type="text"
                        value={newFacility.name}
                        onChange={(event) => setNewFacility((prev) => ({ ...prev, name: event.target.value }))}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-[#4fc3f7] focus:outline-none"
                        placeholder="例如：智能配色建议"
                      />
                      <input
                        type="url"
                        value={newFacility.link}
                        onChange={(event) => setNewFacility((prev) => ({ ...prev, link: event.target.value }))}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-[#4fc3f7] focus:outline-none"
                        placeholder="可选：跳转链接（https://...）"
                      />
                      <div className="flex gap-2">
                        <select
                          value={newFacility.status}
                          onChange={(event) => setNewFacility((prev) => ({ ...prev, status: event.target.value as Facility['status'] }))}
                          className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-[#4fc3f7] focus:outline-none"
                          style={{ colorScheme: 'dark' }}
                        >
                          <option value="online" style={{ backgroundColor: '#102033', color: '#f8fafc' }}>已上线</option>
                          <option value="dev" style={{ backgroundColor: '#102033', color: '#f8fafc' }}>开发中</option>
                          <option value="plan" style={{ backgroundColor: '#102033', color: '#f8fafc' }}>待规划</option>
                        </select>
                        <button
                          type="button"
                          onClick={addFacility}
                          className="rounded-2xl border border-[#4fc3f7]/40 bg-[#4fc3f7]/12 px-4 text-[#4fc3f7] transition hover:bg-[#4fc3f7]/20"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </section>

                  <div className="mb-5 space-y-3">
                    {formData.facilities.length > 0 ? (
                      formData.facilities.map((facility, index) => (
                        <div key={`${facility.name}-${index}`} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <input
                              type="text"
                              value={facility.name}
                              onChange={(event) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  facilities: prev.facilities.map((item, facilityIndex) =>
                                    facilityIndex === index ? { ...item, name: event.target.value } : item
                                  ),
                                }))
                              }
                              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition focus:border-[#4fc3f7] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  facilities: prev.facilities.filter((_, facilityIndex) => facilityIndex !== index),
                                }))
                              }
                              className="rounded-xl p-2 text-red-400 transition hover:bg-red-500/10"
                              aria-label={`删除 ${facility.name}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="mb-3 grid gap-3 md:grid-cols-[0.8fr_1.2fr]">
                            <select
                              value={facility.status}
                              onChange={(event) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  facilities: prev.facilities.map((item, facilityIndex) =>
                                    facilityIndex === index ? { ...item, status: event.target.value as Facility['status'] } : item
                                  ),
                                }))
                              }
                              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition focus:border-[#4fc3f7] focus:outline-none"
                              style={{ colorScheme: 'dark' }}
                            >
                              <option value="online" style={{ backgroundColor: '#102033', color: '#f8fafc' }}>已上线</option>
                              <option value="dev" style={{ backgroundColor: '#102033', color: '#f8fafc' }}>开发中</option>
                              <option value="plan" style={{ backgroundColor: '#102033', color: '#f8fafc' }}>待规划</option>
                            </select>
                            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
                              <ExternalLink size={14} className="text-white/45" />
                              <input
                                type="url"
                                value={facility.link || ''}
                                onChange={(event) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    facilities: prev.facilities.map((item, facilityIndex) =>
                                      facilityIndex === index ? { ...item, link: event.target.value || undefined } : item
                                    ),
                                  }))
                                }
                                className="w-full bg-transparent py-2 text-sm text-white/80 outline-none"
                                placeholder="可选：配置跳转链接"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-3xl border border-dashed border-white/12 px-4 py-8 text-center text-sm text-white/42">
                        还没有能力点，先添加 1 个更符合用户浏览习惯。
                      </div>
                    )}
                  </div>

                  {error && <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    {territory && onDelete && (
                      <button
                        type="button"
                        onClick={onDelete}
                        className="rounded-2xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/16"
                      >
                        删除领域
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSaving}
                      className="flex-1 rounded-2xl border border-white/12 px-4 py-3 text-sm font-medium text-white/72 transition hover:border-white/28 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-55"
                      style={{ background: 'linear-gradient(135deg, #4fc3f7, #0d47a1)' }}
                    >
                      {isSaving ? '保存中...' : '保存变更'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
