'use client';

import { useEffect, useRef } from 'react';
import { useTimerStore } from '@/stores/timerStore';
import { useSound } from '@/hooks/useSound';
import { useNotification } from '@/hooks/useNotification';

interface GameActionBarProps {
  onStatsClick: () => void;
  onShopClick: () => void;
  onSocialClick: () => void;
  onSettingsClick: () => void;
}

export default function GameActionBar({ onStatsClick, onShopClick, onSocialClick, onSettingsClick }: GameActionBarProps) {
  const status = useTimerStore((s) => s.status);
  const isRunning = useTimerStore((s) => s.isRunning);
  const start = useTimerStore((s) => s.start);
  const pause = useTimerStore((s) => s.pause);
  const resume = useTimerStore((s) => s.resume);
  const skip = useTimerStore((s) => s.skip);
  const reset = useTimerStore((s) => s.reset);

  const { playStart, playComplete, playBreak } = useSound();
  const { requestPermission, notify } = useNotification();
  const prevStatusRef = useRef(status);

  // Sound + notification on status change (absorbed from TimerControls)
  useEffect(() => {
    const prev = prevStatusRef.current;
    prevStatusRef.current = status;
    if (prev === status) return;

    if (prev === 'focus' && (status === 'short_break' || status === 'long_break')) {
      playComplete();
      notify('뽀모도로 완료! 🍅', '잘했어요! 잠시 쉬세요.');
    } else if (prev === 'focus' && status === 'idle') {
      playComplete();
      notify('뽀모도로 완료! 🍅', '한 세트 완료! 코인 획득!');
    } else if ((prev === 'short_break' || prev === 'long_break') && status === 'idle') {
      playBreak();
      notify('휴식 끝!', '다시 집중할 준비 되셨나요?');
    }
  }, [status, playComplete, playBreak, notify]);

  const handleMainButton = () => {
    if (status === 'idle') {
      requestPermission();
      playStart();
      start();
    } else if (isRunning) {
      pause();
    } else {
      resume();
    }
  };

  const mainLabel = status === 'idle' ? '시작' : isRunning ? '일시정지' : '계속';
  const mainColor = status === 'idle'
    ? 'bg-coral hover:bg-coral-dark'
    : isRunning
      ? 'bg-gold hover:bg-gold-dark'
      : 'bg-mint hover:bg-mint-dark';

  return (
    <div className="game-action-bar fixed bottom-0 left-0 right-0 z-20 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-center gap-3">
        {/* Left side buttons */}
        <button
          onClick={onStatsClick}
          className="game-hud w-11 h-11 rounded-full flex items-center justify-center text-base transition-transform active:scale-90"
          aria-label="통계"
        >
          📊
        </button>

        <button
          onClick={onShopClick}
          className="game-hud w-11 h-11 rounded-full flex items-center justify-center text-base transition-transform active:scale-90"
          aria-label="상점"
        >
          🛒
        </button>

        {/* Reset (conditional) */}
        {status !== 'idle' && (
          <button
            onClick={reset}
            className="game-hud w-9 h-9 rounded-full flex items-center justify-center text-sm transition-transform active:scale-90"
            aria-label="초기화"
          >
            ↺
          </button>
        )}

        {/* Main play button */}
        <button
          onClick={handleMainButton}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-base font-bold font-[family-name:var(--font-fredoka)] shadow-lg transition-all active:scale-90 ${mainColor}`}
          aria-label={mainLabel}
        >
          {mainLabel}
        </button>

        {/* Skip (conditional) */}
        {status !== 'idle' && (
          <button
            onClick={skip}
            className="game-hud w-9 h-9 rounded-full flex items-center justify-center text-sm transition-transform active:scale-90"
            aria-label="건너뛰기"
          >
            ⏭
          </button>
        )}

        {/* Right side buttons */}
        <button
          onClick={onSocialClick}
          className="game-hud w-11 h-11 rounded-full flex items-center justify-center text-base transition-transform active:scale-90"
          aria-label="소셜"
        >
          👥
        </button>

        <button
          onClick={onSettingsClick}
          className="game-hud w-11 h-11 rounded-full flex items-center justify-center text-base transition-transform active:scale-90 md:hidden"
          aria-label="설정"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
}
