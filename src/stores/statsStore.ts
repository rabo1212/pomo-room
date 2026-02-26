'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DailyRecord {
  count: number;
  minutes: number;
}

interface StatsState {
  dailyRecords: Record<string, DailyRecord>; // "YYYY-MM-DD" → { count, minutes }

  recordPomodoro: (minutes: number) => void;
  getTodayStats: () => DailyRecord;
  getWeeklyStats: () => { day: string; label: string; count: number; minutes: number }[];
  getStreak: () => number;
  getTotalStats: () => { count: number; minutes: number; days: number };
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function dayLabel(dateStr: string): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[new Date(dateStr + 'T00:00:00').getDay()];
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      dailyRecords: {},

      recordPomodoro: (minutes) =>
        set((state) => {
          const key = todayKey();
          const prev = state.dailyRecords[key] || { count: 0, minutes: 0 };
          return {
            dailyRecords: {
              ...state.dailyRecords,
              [key]: { count: prev.count + 1, minutes: prev.minutes + minutes },
            },
          };
        }),

      getTodayStats: () => {
        return get().dailyRecords[todayKey()] || { count: 0, minutes: 0 };
      },

      getWeeklyStats: () => {
        const records = get().dailyRecords;
        const result = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = d.toISOString().slice(0, 10);
          const data = records[key] || { count: 0, minutes: 0 };
          result.push({ day: key, label: dayLabel(key), count: data.count, minutes: data.minutes });
        }
        return result;
      },

      getStreak: () => {
        const records = get().dailyRecords;
        let streak = 0;
        const d = new Date();

        // 오늘 기록이 있으면 오늘부터, 없으면 어제부터
        if (!records[todayKey()]) {
          d.setDate(d.getDate() - 1);
        }

        while (true) {
          const key = d.toISOString().slice(0, 10);
          if (records[key] && records[key].count > 0) {
            streak++;
            d.setDate(d.getDate() - 1);
          } else {
            break;
          }
        }
        return streak;
      },

      getTotalStats: () => {
        const records = get().dailyRecords;
        const entries = Object.values(records);
        return {
          count: entries.reduce((sum, r) => sum + r.count, 0),
          minutes: entries.reduce((sum, r) => sum + r.minutes, 0),
          days: entries.filter(r => r.count > 0).length,
        };
      },
    }),
    {
      name: 'pomo-stats',
    }
  )
);
