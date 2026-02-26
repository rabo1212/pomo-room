'use client';

import { useEffect, useRef } from 'react';
import { useTimerStore } from '@/stores/timerStore';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useTimer() {
  const tick = useTimerStore((s) => s.tick);
  const isRunning = useTimerStore((s) => s.isRunning);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dateRef = useRef(todayKey());

  // 타이머 틱
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 200);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, tick]);

  // 자정 초기화 체크 (1분마다)
  useEffect(() => {
    const checkDate = () => {
      const now = todayKey();
      if (dateRef.current !== now) {
        dateRef.current = now;
        useTimerStore.setState({ completedToday: 0 });
      }
    };

    const dateInterval = setInterval(checkDate, 60_000);
    return () => clearInterval(dateInterval);
  }, []);
}
