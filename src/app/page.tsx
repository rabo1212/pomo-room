'use client';

import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import GameHUD from '@/components/hud/GameHUD';
import GameActionBar from '@/components/hud/GameActionBar';
import ShopModal from '@/components/shop/ShopModal';
import StatsModal from '@/components/stats/StatsModal';
import TimerSettings from '@/components/timer/TimerSettings';
import LoginModal from '@/components/auth/LoginModal';
import SocialModal from '@/components/social/SocialModal';
import Toast from '@/components/ui/Toast';
import OnboardingGuide from '@/components/onboarding/OnboardingGuide';
import { useTimer } from '@/hooks/useTimer';
import { useAuth } from '@/hooks/useAuth';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useTimerStore } from '@/stores/timerStore';
import { mergeLocalDataToCloud } from '@/lib/supabase/sync';
import { showToast } from '@/components/ui/Toast';

const Room3D = lazy(() => import('@/components/room3d/Room3D'));

function RoomSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-cream">
      <div className="skeleton w-48 h-48 rounded-2xl" />
    </div>
  );
}

export default function Home() {
  const [shopOpen, setShopOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [synced, setSynced] = useState(false);

  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();

  useTimer();
  useDarkMode();

  useEffect(() => {
    setMounted(true);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (shopOpen || statsOpen || settingsOpen || loginOpen || socialOpen) return;
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

      const { status, isRunning, start, pause, resume, skip, reset } = useTimerStore.getState();

      if (e.code === 'Space') {
        e.preventDefault();
        if (status === 'idle') start();
        else if (isRunning) pause();
        else resume();
      } else if (e.code === 'KeyS' && !e.metaKey && !e.ctrlKey) {
        if (status !== 'idle') skip();
      } else if (e.code === 'KeyR' && !e.metaKey && !e.ctrlKey) {
        reset();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shopOpen, statsOpen, settingsOpen, loginOpen, socialOpen]);

  // Cloud sync on login
  useEffect(() => {
    if (user && !synced) {
      setSynced(true);
      mergeLocalDataToCloud(user.id).then(() => {
        showToast('클라우드 동기화 완료! ☁️');
      }).catch(() => {});
    }
    if (!user) setSynced(false);
  }, [user, synced]);

  const handleLogin = useCallback(async () => {
    await signInWithGoogle();
  }, [signInWithGoogle]);

  const handleLogout = useCallback(async () => {
    await signOut();
    showToast('로그아웃 완료');
    setLoginOpen(false);
  }, [signOut]);

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-cream flex items-center justify-center">
        <div className="skeleton w-48 h-48 rounded-2xl" />
      </div>
    );
  }

  return (
    <main className="h-screen w-screen overflow-hidden relative bg-cream dark:bg-[#1E1E2E]">
      {/* 3D Room fills entire screen */}
      <div className="w-full h-full">
        <Suspense fallback={<RoomSkeleton />}>
          <Room3D />
        </Suspense>
      </div>

      {/* Game HUD overlay */}
      <GameHUD
        onProfileClick={() => setLoginOpen(true)}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      {/* Bottom action bar */}
      <GameActionBar
        onStatsClick={() => setStatsOpen(true)}
        onShopClick={() => setShopOpen(true)}
        onSocialClick={() => setSocialOpen(true)}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      {/* Modals */}
      <AnimatePresence>
        {shopOpen && <ShopModal onClose={() => setShopOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {statsOpen && <StatsModal onClose={() => setStatsOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {socialOpen && <SocialModal onClose={() => setSocialOpen(false)} />}
      </AnimatePresence>
      {settingsOpen && <TimerSettings onClose={() => setSettingsOpen(false)} />}

      {/* Login / Profile Modal */}
      {loginOpen && (
        user ? (
          <div className="modal-backdrop fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setLoginOpen(false)}>
            <div className="game-panel w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
              <div className="game-panel-header">
                <span>프로필</span>
                <button onClick={() => setLoginOpen(false)} className="text-white/80 hover:text-white">✕</button>
              </div>
              <div className="p-5 text-center">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt=""
                    className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-cream-dark"
                  />
                )}
                <h3 className="text-lg font-bold font-[family-name:var(--font-fredoka)] text-coral">
                  {user.user_metadata?.full_name || '유저'}
                </h3>
                <p className="text-xs text-lavender-dark/60 mt-1">{user.email}</p>
                <p className="text-xs text-mint-dark mt-2">☁️ 클라우드 동기화 활성</p>
                <button
                  onClick={handleLogout}
                  className="clay-button w-full py-2.5 text-sm text-lavender-dark mt-4"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        ) : (
          <LoginModal onClose={() => setLoginOpen(false)} onLogin={handleLogin} />
        )
      )}

      <Toast />
      <OnboardingGuide />
    </main>
  );
}
