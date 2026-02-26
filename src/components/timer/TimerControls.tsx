'use client';

import { useTimerStore } from '@/stores/timerStore';
import { useSound } from '@/hooks/useSound';
import { useNotification } from '@/hooks/useNotification';
import { useEffect, useRef } from 'react';

export default function TimerControls() {
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

  // Request notification permission on first interaction
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Play sounds and send notifications on status change
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
      playStart();
      start();
    } else if (isRunning) {
      pause();
    } else {
      resume();
    }
  };

  const mainButtonLabel = status === 'idle' ? '시작' : isRunning ? '일시정지' : '계속';
  const mainButtonColor = status === 'idle'
    ? 'bg-coral text-white hover:bg-coral-dark'
    : isRunning
      ? 'bg-gold text-white hover:bg-gold-dark'
      : 'bg-mint text-white hover:bg-mint-dark';

  return (
    <div className="flex items-center gap-3 sm:gap-4 justify-center">
      {/* Reset button */}
      {status !== 'idle' && (
        <button
          onClick={reset}
          className="clay-button w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-lavender-dark text-base sm:text-lg"
          title="초기화"
        >
          ↺
        </button>
      )}

      {/* Main button */}
      <button
        onClick={handleMainButton}
        className={`clay-button w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold font-[family-name:var(--font-fredoka)] ${mainButtonColor}`}
      >
        {mainButtonLabel}
      </button>

      {/* Skip button */}
      {status !== 'idle' && (
        <button
          onClick={skip}
          className="clay-button w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-lavender-dark text-base sm:text-lg"
          title="건너뛰기"
        >
          ⏭
        </button>
      )}
    </div>
  );
}
