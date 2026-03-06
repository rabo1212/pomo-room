'use client';

import { useTimerStore } from '@/stores/timerStore';
import { formatTime } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

function getDuration(status: string, settings: { focusDuration: number; shortBreakDuration: number; longBreakDuration: number }) {
  switch (status) {
    case 'focus': return settings.focusDuration;
    case 'short_break': return settings.shortBreakDuration;
    case 'long_break': return settings.longBreakDuration;
    default: return settings.focusDuration;
  }
}

const STATUS_COLORS: Record<string, string> = {
  idle: '#B8A9C9',
  focus: '#FF6B6B',
  short_break: '#7ECEC1',
  long_break: '#7ECEC1',
  complete: '#FFB347',
};

const STATUS_LABELS: Record<string, string> = {
  idle: '시작할 준비!',
  focus: '집중 중...',
  short_break: '짧은 휴식',
  long_break: '긴 휴식',
  complete: '완료!',
};

export default function FloatingTimer() {
  const remainingSeconds = useTimerStore((s) => s.remainingSeconds);
  const status = useTimerStore((s) => s.status);
  const settings = useTimerStore((s) => s.settings);
  const isRunning = useTimerStore((s) => s.isRunning);
  const currentSession = useTimerStore((s) => s.currentSession);

  const totalDuration = getDuration(status, settings);
  const progress = status === 'idle' ? 0 : 1 - remainingSeconds / totalDuration;
  const strokeColor = STATUS_COLORS[status] || '#B8A9C9';

  const size = status === 'idle' ? 100 : 130;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-2 pointer-events-auto">
      <motion.div
        className="game-hud p-3 flex flex-col items-center gap-1"
        animate={{
          scale: status === 'idle' ? 0.85 : 1,
          padding: status === 'idle' ? '8px' : '12px',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={isRunning && status === 'focus' ? { animation: 'pulse-ring 2s ease-out infinite' } : undefined}
      >
        {/* Status label */}
        <span className="text-xs font-semibold opacity-80 font-[family-name:var(--font-fredoka)]">
          {STATUS_LABELS[status]}
        </span>

        {/* Circular progress */}
        <div className="relative inline-flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={strokeWidth}
            />
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
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="timer-display text-2xl sm:text-3xl font-bold tracking-wider text-white">
              {formatTime(remainingSeconds)}
            </span>
          </div>
        </div>

        {/* Session hearts */}
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`text-xs transition-all ${i <= currentSession ? 'opacity-100 scale-110' : 'opacity-30'}`}
            >
              {i <= currentSession ? '❤️' : '🤍'}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
