'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TimerStatus, TimerSettings } from '@/types';
import { DEFAULT_TIMER, SESSIONS_PER_SET, COINS_PER_POMODORO } from '@/lib/constants';
import { useStatsStore } from '@/stores/statsStore';
import { recordSession, updateProfileCoins } from '@/lib/supabase/sync';
import { createClient } from '@/lib/supabase/client';

interface TimerState {
  // Settings
  settings: TimerSettings;

  // Runtime
  status: TimerStatus;
  isRunning: boolean;
  remainingSeconds: number;
  currentSession: number; // 1-4
  completedToday: number;
  endTime: number | null; // timestamp

  // Coins (local, synced to DB when online)
  coins: number;

  // Actions
  start: () => void;
  pause: () => void;
  resume: () => void;
  skip: () => void;
  reset: () => void;
  tick: () => void;
  setSettings: (settings: Partial<TimerSettings>) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
}

function getNextStatus(current: TimerStatus, session: number): { status: TimerStatus; nextSession: number } {
  if (current === 'focus') {
    if (session >= SESSIONS_PER_SET) {
      return { status: 'long_break', nextSession: session };
    }
    return { status: 'short_break', nextSession: session };
  }
  if (current === 'short_break') {
    return { status: 'idle', nextSession: session + 1 };
  }
  if (current === 'long_break') {
    return { status: 'idle', nextSession: 1 };
  }
  return { status: 'idle', nextSession: session };
}

function getDuration(status: TimerStatus, settings: TimerSettings): number {
  switch (status) {
    case 'focus': return settings.focusDuration;
    case 'short_break': return settings.shortBreakDuration;
    case 'long_break': return settings.longBreakDuration;
    default: return settings.focusDuration;
  }
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_TIMER,
      status: 'idle',
      isRunning: false,
      remainingSeconds: DEFAULT_TIMER.focusDuration,
      currentSession: 1,
      completedToday: 0,
      endTime: null,
      coins: 0,

      start: () => {
        const state = get();
        const duration = state.settings.focusDuration;
        set({
          status: 'focus',
          isRunning: true,
          remainingSeconds: duration,
          endTime: Date.now() + duration * 1000,
        });
      },

      pause: () => {
        set({
          isRunning: false,
          endTime: null,
        });
      },

      resume: () => {
        const state = get();
        set({
          isRunning: true,
          endTime: Date.now() + state.remainingSeconds * 1000,
        });
      },

      skip: () => {
        const state = get();
        const { status: nextStatus, nextSession } = getNextStatus(state.status, state.currentSession);

        if (nextStatus === 'idle') {
          set({
            status: 'idle',
            isRunning: false,
            remainingSeconds: state.settings.focusDuration,
            currentSession: nextSession,
            endTime: null,
          });
        } else {
          const duration = getDuration(nextStatus, state.settings);
          set({
            status: nextStatus,
            isRunning: true,
            remainingSeconds: duration,
            currentSession: nextSession,
            endTime: Date.now() + duration * 1000,
          });
        }
      },

      reset: () => {
        const state = get();
        set({
          status: 'idle',
          isRunning: false,
          remainingSeconds: state.settings.focusDuration,
          currentSession: 1,
          endTime: null,
        });
      },

      tick: () => {
        const state = get();
        if (!state.isRunning || !state.endTime) return;

        const remaining = Math.max(0, Math.ceil((state.endTime - Date.now()) / 1000));

        if (remaining <= 0) {
          // Timer completed
          const wasFocus = state.status === 'focus';
          const { status: nextStatus, nextSession } = getNextStatus(state.status, state.currentSession);

          // 포커스 완료 → 통계 기록 + DB 동기화
          if (wasFocus) {
            const focusMinutes = Math.round(state.settings.focusDuration / 60);
            useStatsStore.getState().recordPomodoro(focusMinutes);

            // Supabase DB에 비동기 기록 (로그인 시만)
            createClient().auth.getUser().then(({ data: { user } }) => {
              if (user) {
                const newCoins = state.coins + COINS_PER_POMODORO;
                recordSession(user.id, focusMinutes).catch(() => {});
                updateProfileCoins(user.id, newCoins).catch(() => {});
              }
            });
          }

          if (nextStatus === 'idle') {
            set({
              status: 'idle',
              isRunning: false,
              remainingSeconds: state.settings.focusDuration,
              currentSession: nextSession,
              endTime: null,
              completedToday: wasFocus ? state.completedToday + 1 : state.completedToday,
              coins: wasFocus ? state.coins + COINS_PER_POMODORO : state.coins,
            });
          } else {
            const duration = getDuration(nextStatus, state.settings);
            set({
              status: nextStatus,
              isRunning: true,
              remainingSeconds: duration,
              currentSession: nextSession,
              endTime: Date.now() + duration * 1000,
              completedToday: wasFocus ? state.completedToday + 1 : state.completedToday,
              coins: wasFocus ? state.coins + COINS_PER_POMODORO : state.coins,
            });
          }
          return;
        }

        set({ remainingSeconds: remaining });
      },

      setSettings: (newSettings) => {
        const state = get();
        const settings = { ...state.settings, ...newSettings };
        set({
          settings,
          remainingSeconds: state.status === 'idle' ? settings.focusDuration : state.remainingSeconds,
        });
      },

      addCoins: (amount) => {
        set((state) => ({ coins: state.coins + amount }));
      },

      spendCoins: (amount) => {
        const state = get();
        if (state.coins < amount) return false;
        set({ coins: state.coins - amount });
        return true;
      },
    }),
    {
      name: 'pomo-timer',
      partialize: (state) => ({
        settings: state.settings,
        coins: state.coins,
        completedToday: state.completedToday,
        currentSession: state.currentSession,
      }),
    }
  )
);
