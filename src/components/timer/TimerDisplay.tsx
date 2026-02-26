'use client';

import { useTimerStore } from '@/stores/timerStore';
import { formatTime } from '@/lib/utils';

export default function TimerDisplay() {
  const remainingSeconds = useTimerStore((s) => s.remainingSeconds);
  const status = useTimerStore((s) => s.status);

  const statusLabel = {
    idle: '시작할 준비!',
    focus: '집중 중...',
    short_break: '짧은 휴식',
    long_break: '긴 휴식',
    complete: '완료!',
  }[status];

  const statusColor = {
    idle: 'text-lavender-dark',
    focus: 'text-coral',
    short_break: 'text-mint-dark',
    long_break: 'text-mint',
    complete: 'text-gold',
  }[status];

  return (
    <div className="text-center">
      <p className={`text-xs sm:text-sm font-semibold ${statusColor} mb-1 font-[family-name:var(--font-fredoka)]`}>
        {statusLabel}
      </p>
      <div className="timer-display text-5xl sm:text-6xl font-bold text-[#3D3D3D] tracking-wider">
        {formatTime(remainingSeconds)}
      </div>
    </div>
  );
}
