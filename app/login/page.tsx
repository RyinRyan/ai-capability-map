'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, ShieldCheck, User, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Starfield from '../components/Starfield';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState('');
  const [loggedInPassword, setLoggedInPassword] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', { cache: 'no-store' });
        const data = await response.json();
        if (data.loggedIn) {
          router.replace('/config');
        }
      } catch {
        // ignore
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || '登录失败，请检查账号与密码。');
        return;
      }

      if (data.isFirstLogin) {
        setLoggedInUsername(username.trim());
        setLoggedInPassword(password);
        setShowChangePassword(true);
        return;
      }

      router.push('/config');
    } catch {
      setError('网络异常，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setChangePasswordError('');

    if (newPassword.length < 6) {
      setChangePasswordError('新密码至少需要 6 位。');
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangePasswordError('两次输入的新密码不一致。');
      return;
    }

    setChangePasswordLoading(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loggedInUsername,
          oldPassword: loggedInPassword,
          newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setChangePasswordError(data.error || '修改密码失败，请稍后重试。');
        return;
      }

      router.push('/config');
    } catch {
      setChangePasswordError('网络异常，请稍后重试。');
    } finally {
      setChangePasswordLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: '#0d1b2a' }}>
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

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4fc3f7]/18 text-[#4fc3f7]">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-3xl font-bold text-[#4fc3f7]" style={{ fontFamily: 'var(--font-exo-2)' }}>
              管理员登录
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/62">
              登录后可维护星球、能力领域与能力点。首次登录会强制要求你修改默认密码，避免继续使用初始凭据。
            </p>

            <div className="mt-8 space-y-4 rounded-3xl border border-white/10 bg-black/10 p-5">
              <div className="text-xs tracking-[0.22em] text-white/40">使用建议</div>
              <div className="text-sm leading-6 text-white/62">如果只是查看地图，请直接返回首页浏览。配置页只建议管理员进入。</div>
              <div className="text-sm leading-6 text-white/62">密码修改后不会回显，建议使用长度更高且容易区分的管理密码。</div>
            </div>
          </section>

          <section
            className="relative overflow-hidden rounded-[32px] border p-8"
            style={{
              background: 'linear-gradient(135deg, rgba(13, 27, 42, 0.95), rgba(27, 38, 59, 0.92))',
              borderColor: 'rgba(79, 195, 247, 0.28)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(79, 195, 247, 0.03) 2px, rgba(79, 195, 247, 0.03) 4px)',
              }}
            />

            <div className="relative z-10">
              <div className="mb-8 text-center">
                <div
                  className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #4fc3f7, #0d47a1)',
                    boxShadow: '0 0 30px rgba(79, 195, 247, 0.45)',
                  }}
                >
                  <User size={34} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#4fc3f7]" style={{ fontFamily: 'var(--font-exo-2)' }}>
                  进入配置控制台
                </h2>
                <p className="mt-2 text-sm text-white/50">输入管理员账号后即可进入地图配置管理。</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm text-white/62">用户名</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/38" />
                    <input
                      type="text"
                      autoFocus
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white transition focus:border-[#4fc3f7] focus:outline-none"
                      placeholder="请输入管理员用户名"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/62">密码</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/38" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-12 text-white transition focus:border-[#4fc3f7] focus:outline-none"
                      placeholder="请输入密码"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/42 transition hover:text-white/72"
                      aria-label={showPassword ? '隐藏密码' : '显示密码'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-55"
                  style={{ background: 'linear-gradient(135deg, #4fc3f7, #0d47a1)' }}
                >
                  {loading ? (
                    <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      登录并进入配置
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <Link href="/" className="text-sm text-white/42 transition hover:text-[#4fc3f7]">
                    返回能力地图首页
                  </Link>
                </div>
              </form>
            </div>
          </section>
        </motion.div>
      </div>

      <AnimatePresence>
        {showChangePassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.82)' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className="w-full max-w-md rounded-[32px] border p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(13, 27, 42, 0.98), rgba(27, 38, 59, 0.96))',
                borderColor: 'rgba(79, 195, 247, 0.25)',
              }}
            >
              <div className="mb-6 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-amber-300" style={{ fontFamily: 'var(--font-exo-2)' }}>
                      首次登录需要修改密码
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/56">为了避免继续使用默认密码，请先完成密码更新，再进入配置页。</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="rounded-xl p-2 text-white/45 transition hover:bg-white/8 hover:text-white/70"
                  aria-label="关闭修改密码弹窗"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-white/62">新密码</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/38" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white transition focus:border-[#4fc3f7] focus:outline-none"
                      placeholder="至少 6 位"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/62">确认新密码</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/38" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white transition focus:border-[#4fc3f7] focus:outline-none"
                      placeholder="再次输入新密码"
                      required
                    />
                  </div>
                </div>

                {changePasswordError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                  >
                    {changePasswordError}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={changePasswordLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-55"
                  style={{ background: 'linear-gradient(135deg, #ffab40, #d84315)' }}
                >
                  {changePasswordLoading ? (
                    <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      修改密码并进入
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
