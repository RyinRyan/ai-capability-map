'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Starfield from '../components/Starfield';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // First login password change modal
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState('');
  const [loggedInPassword, setLoggedInPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.isFirstLogin) {
          // Show change password modal
          setLoggedInUsername(username);
          setLoggedInPassword(password);
          setShowChangePassword(true);
        } else {
          router.push('/config');
        }
      } else {
        setError(data.error || '登录失败');
      }
    } catch (err) {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError('');

    if (newPassword.length < 4) {
      setChangePasswordError('密码长度至少4位');
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangePasswordError('两次输入的密码不一致');
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
          newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Password changed successfully, redirect to config
        router.push('/config');
      } else {
        setChangePasswordError(data.error || '修改密码失败');
      }
    } catch (err) {
      setChangePasswordError('网络错误，请重试');
    } finally {
      setChangePasswordLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: '#0d1b2a' }}>
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
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Login Card */}
          <div 
            className="rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(13, 27, 42, 0.95), rgba(27, 38, 59, 0.9))',
              border: '1px solid rgba(79, 195, 247, 0.3)',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* Hologram Effect */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(79, 195, 247, 0.03) 2px, rgba(79, 195, 247, 0.03) 4px)'
              }}
            />

            {/* Header */}
            <div className="text-center mb-8 relative z-10">
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #4fc3f7, #0d47a1)',
                  boxShadow: '0 0 30px rgba(79, 195, 247, 0.5)'
                }}
              >
                <User size={36} className="text-white" />
              </div>
              <h1 
                className="text-2xl font-bold mb-2"
                style={{ 
                  color: '#4fc3f7',
                  fontFamily: 'var(--font-exo-2)'
                }}
              >
                管理员登录
              </h1>
              <p className="text-sm text-white/50">
                请输入管理员账号以访问配置功能
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Username */}
              <div>
                <label className="block text-sm text-white/60 mb-2">用户名</label>
                <div className="relative">
                  <User 
                    size={18} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" 
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#4fc3f7] focus:outline-none transition-colors"
                    placeholder="请输入用户名"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-white/60 mb-2">密码</label>
                <div className="relative">
                  <Lock 
                    size={18} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" 
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#4fc3f7] focus:outline-none transition-colors"
                    placeholder="请输入密码"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #4fc3f7, #0d47a1)',
                  color: 'white'
                }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    登录
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* Back Link */}
              <div className="text-center">
                <Link
                  href="/"
                  className="text-sm text-white/40 hover:text-[#4fc3f7] transition-colors"
                >
                  返回能力地图
                </Link>
              </div>

            </form>
          </div>
        </motion.div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showChangePassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl p-6 relative"
              style={{
                background: 'linear-gradient(135deg, rgba(13, 27, 42, 0.98), rgba(27, 38, 59, 0.95))',
                border: '1px solid rgba(79, 195, 247, 0.3)'
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255, 171, 64, 0.2)' }}
                >
                  <AlertCircle size={20} style={{ color: '#ffab40' }} />
                </div>
                <div>
                  <h2 
                    className="text-xl font-bold"
                    style={{ color: '#ffab40', fontFamily: 'var(--font-exo-2)' }}
                  >
                    首次登录
                  </h2>
                  <p className="text-sm text-white/50">
                    请修改默认密码以确保安全
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                {/* New Password */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">新密码</label>
                  <div className="relative">
                    <Lock 
                      size={18} 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" 
                    />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#4fc3f7] focus:outline-none transition-colors"
                      placeholder="请输入新密码"
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">确认密码</label>
                  <div className="relative">
                    <Lock 
                      size={18} 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" 
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#4fc3f7] focus:outline-none transition-colors"
                      placeholder="请再次输入新密码"
                      required
                    />
                  </div>
                </div>

                {/* Error Message */}
                {changePasswordError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center"
                  >
                    {changePasswordError}
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={changePasswordLoading}
                  className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #ffab40, #d84315)',
                    color: 'white'
                  }}
                >
                  {changePasswordLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
