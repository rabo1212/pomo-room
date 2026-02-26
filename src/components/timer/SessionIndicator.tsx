'use client';

import { useTimerStore } from '@/stores/timerStore';
import { SESSIONS_PER_SET } from '@/lib/constants';

export default function SessionIndicator() {
  const currentSession = useTimerStore((s) => s.currentSession);
  const completedToday = useTimerStore((s) => s.completedToday);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Session dots */}
      <div className="flex gap-2">
        {Array.from({ length: SESSIONS_PER_SET }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i < currentSession - 1
                ? 'bg-coral scale-100'
                : i === currentSession - 1
                  ? 'bg-coral-light scale-110 animate-pulse'
                  : 'bg-cream-dark'
            }`}
          />
        ))}
      </div>
      {/* Today's count */}
      <p className="text-xs text-lavender-dark font-semibold">
        오늘 🍅 {completedToday}개 완료
      </p>
    </div>
  );
}
