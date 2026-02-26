'use client';

import { useEffect, useState, useCallback } from 'react';
import TimerDisplay from '@/components/timer/TimerDisplay';
import TimerControls from '@/components/timer/TimerControls';
import SessionIndicator from '@/components/timer/SessionIndicator';
import CoinDisplay from '@/components/timer/CoinDisplay';
import IsometricRoom from '@/components/room/IsometricRoom';
import ShopModal from '@/components/shop/ShopModal';
import StatsModal from '@/components/stats/StatsModal';
import TimerSettings from '@/components/timer/TimerSettings';
import LoginModal from '@/components/auth/LoginModal';
import SocialModal from '@/components/social/SocialModal';
import BottomNav from '@/components/layout/BottomNav';
import Toast from '@/components/ui/Toast';
import { useTimer } from '@/hooks/useTimer';
import { useAuth } from '@/hooks/useAuth';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useTimerStore } from '@/stores/timerStore';
import { mergeLocalDataToCloud } from '@/lib/supabase/sync';
import { showToast } from '@/components/ui/Toast';

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <div className="skeleton w-36 h-8" />
        <div className="flex gap-2">
          <div className="skeleton w-20 h-9 rounded-2xl" />
          <div className="skeleton w-10 h-10 rounded-2xl" />
        </div>
      </div>
      <div className="skeleton w-full max-w-md h-32 mb-4" />
      <div className="skeleton w-full max-w-lg h-64 mb-6" />
      <div className="flex gap-4 justify-center">
        <div className="skeleton w-20 h-20 rounded-full" />
      </div>
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
  const [activeTab, setActiveTab] = useState<'timer' | 'stats' | 'shop' | 'social'>('timer');
  const [synced, setSynced] = useState(false);

  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();

  useTimer();
  useDarkMode(); // 다크모드 초기화 (시스템 테마 감지)

  useEffect(() => {
    setMounted(true);
    // 서비스 워커 등록 (PWA)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  // 키보드 단축키
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // 모달이 열려있으면 무시 (ESC는 각 모달에서 처리)
      if (shopOpen || statsOpen || settingsOpen || loginOpen || socialOpen) return;
      // input/textarea에서는 무시
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

  // 로그인 시 데이터 동기화
  useEffect(() => {
    if (user && !synced) {
      setSynced(true);
      mergeLocalDataToCloud(user.id).then(() => {
        showToast('클라우드 동기화 완료! ☁️');
      }).catch(() => {
        // 동기화 실패 시 로컬 데이터로 계속 사용
      });
    }
    if (!user) {
      setSynced(false);
    }
  }, [user, synced]);

  const handleTabChange = (tab: 'timer' | 'stats' | 'shop' | 'social') => {
    setActiveTab(tab);
    setStatsOpen(tab === 'stats');
    setShopOpen(tab === 'shop');
    setSocialOpen(tab === 'social');
  };

  const handleLogin = useCallback(async () => {
    await signInWithGoogle();
  }, [signInWithGoogle]);

  const handleLogout = useCallback(async () => {
    await signOut();
    showToast('로그아웃 완료');
    setLoginOpen(false);
  }, [signOut]);

  if (!mounted) {
    return <LoadingSkeleton />;
  }

  return (
    <main className="min-h-screen bg-cream flex flex-col items-center px-3 sm:px-4 py-4 sm:py-6 pb-20 md:pb-6 relative">
      {/* Header */}
      <header className="w-full max-w-md flex items-center justify-between mb-3 sm:mb-4">
        <h1 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-fredoka)] text-coral">
          🍅 Pomo Room
        </h1>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <CoinDisplay />

          {/* 프로필 / 로그인 버튼 */}
          {!authLoading && (
            user ? (
              <button
                onClick={() => setLoginOpen(true)}
                className="clay-button w-10 h-10 flex items-center justify-center overflow-hidden rounded-full"
                title={user.user_metadata?.full_name || '프로필'}
              >
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-sm">👤</span>
                )}
              </button>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="clay-button w-10 h-10 flex items-center justify-center text-lg"
                title="로그인"
              >
                👤
              </button>
            )
          )}

          <button
            onClick={() => setSettingsOpen(true)}
            className="clay-button w-10 h-10 flex items-center justify-center text-lg"
            title="설정"
          >
            ⚙️
          </button>
          <button
            onClick={() => { setStatsOpen(true); setActiveTab('stats'); }}
            className="clay-button w-10 h-10 hidden md:flex items-center justify-center text-lg"
            title="통계"
          >
            📊
          </button>
          <button
            onClick={() => { setShopOpen(true); setActiveTab('shop'); }}
            className="clay-button w-10 h-10 hidden md:flex items-center justify-center text-lg"
            title="상점"
          >
            🛒
          </button>
          <button
            onClick={() => { setSocialOpen(true); setActiveTab('social'); }}
            className="clay-button w-10 h-10 hidden md:flex items-center justify-center text-lg"
            title="소셜"
          >
            👥
          </button>
        </div>
      </header>

      {/* Timer Display */}
      <div className="clay p-4 sm:p-6 w-full max-w-md mb-3 sm:mb-4">
        <TimerDisplay />
        <div className="mt-2 sm:mt-3">
          <SessionIndicator />
        </div>
      </div>

      {/* Isometric Room */}
      <div className="room-container w-full max-w-lg flex justify-center mb-4 sm:mb-6" style={{ minHeight: 280 }}>
        <IsometricRoom />
      </div>

      {/* Timer Controls */}
      <div className="w-full max-w-md">
        <TimerControls />
      </div>

      {/* Bottom Navigation (mobile only) */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Modals */}
      {shopOpen && <ShopModal onClose={() => { setShopOpen(false); setActiveTab('timer'); }} />}
      {statsOpen && <StatsModal onClose={() => { setStatsOpen(false); setActiveTab('timer'); }} />}
      {socialOpen && <SocialModal onClose={() => { setSocialOpen(false); setActiveTab('timer'); }} />}
      {settingsOpen && <TimerSettings onClose={() => setSettingsOpen(false)} />}

      {/* Login Modal */}
      {loginOpen && (
        user ? (
          // 로그인 상태 → 프로필 모달
          <div className="modal-backdrop fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setLoginOpen(false)}>
            <div className="modal-content clay bg-cream w-full max-w-xs p-6" onClick={(e) => e.stopPropagation()}>
              <div className="text-center mb-4">
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
              </div>
              <button
                onClick={handleLogout}
                className="clay-button w-full py-2.5 text-sm text-lavender-dark"
              >
                로그아웃
              </button>
              <button
                onClick={() => setLoginOpen(false)}
                className="w-full text-center text-xs text-lavender-dark/50 mt-3 py-2"
              >
                닫기
              </button>
            </div>
          </div>
        ) : (
          <LoginModal onClose={() => setLoginOpen(false)} onLogin={handleLogin} />
        )
      )}

      {/* Toast */}
      <Toast />
    </main>
  );
}
