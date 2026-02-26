'use client';

import { useTimerStore } from '@/stores/timerStore';
import { formatTime } from '@/lib/utils';

function getDuration(status: string, settings: { focusDuration: number; shortBreakDuration: number; longBreakDuration: number }) {
  switch (status) {
    case 'focus': return settings.focusDuration;
    case 'short_break': return settings.shortBreakDuration;
    case 'long_break': return settings.longBreakDuration;
    default: return settings.focusDuration;
  }
}

export default function TimerDisplay() {
  const remainingSeconds = useTimerStore((s) => s.remainingSeconds);
  const status = useTimerStore((s) => s.status);
  const settings = useTimerStore((s) => s.settings);
  const isRunning = useTimerStore((s) => s.isRunning);

  const totalDuration = getDuration(status, settings);
  const progress = status === 'idle' ? 0 : 1 - remainingSeconds / totalDuration;

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

  const strokeColor = {
    idle: '#B8A9C9',
    focus: '#FF6B6B',
    short_break: '#7ECEC1',
    long_break: '#7ECEC1',
    complete: '#FFB347',
  }[status];

  // SVG circle progress
  const size = 180;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - progress);

  return (
    <div className="text-center">
      <p className={`text-xs sm:text-sm font-semibold ${statusColor} mb-2 font-[family-name:var(--font-fredoka)]`}>
        {statusLabel}
      </p>
      <div className="relative inline-flex items-center justify-center">
        {/* Circular progress */}
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-cream-dark/30"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            style={{ transition: isRunning ? 'stroke-dashoffset 1s linear' : 'stroke-dashoffset 0.3s ease' }}
          />
        </svg>
        {/* Time text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="timer-display text-5xl sm:text-6xl font-bold text-[#3D3D3D] tracking-wider">
            {formatTime(remainingSeconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
