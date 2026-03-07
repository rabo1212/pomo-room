/** 로컬 타임존 기준 YYYY-MM-DD 키 (UTC 기반 toISOString 대신 사용) */
export function localDateKey(date?: Date): string {
  const d = date ?? new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins}분`;
  return `${hours}시간 ${mins}분`;
}

export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

// Level system
const XP_PER_LEVEL = 5;
const LEVEL_TITLES = ['Newbie', 'Starter', 'Focused', 'Pro', 'Master', 'Legend'];

export interface PlayerLevel {
  level: number;
  currentXP: number;
  requiredXP: number;
  title: string;
  progress: number; // 0~1
}

export function getPlayerLevel(totalPomodoros: number): PlayerLevel {
  const level = Math.floor(totalPomodoros / XP_PER_LEVEL) + 1;
  const currentXP = totalPomodoros % XP_PER_LEVEL;
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
  return {
    level,
    currentXP,
    requiredXP: XP_PER_LEVEL,
    title,
    progress: currentXP / XP_PER_LEVEL,
  };
}

// Consistency ratio: active days out of last N days
export interface ConsistencyInfo {
  ratio: number;       // 0~1
  activeDays: number;
  totalDays: number;
  message: string;
}

export function getConsistencyRatio(
  dailyRecords: Record<string, { count: number; minutes: number }>,
  days = 30
): ConsistencyInfo {
  let activeDays = 0;
  const d = new Date();
  for (let i = 0; i < days; i++) {
    const key = localDateKey(d);
    if (dailyRecords[key]?.count > 0) activeDays++;
    d.setDate(d.getDate() - 1);
  }
  const ratio = days > 0 ? activeDays / days : 0;

  let message: string;
  if (ratio >= 0.9) message = '거의 매일! 대단해요!';
  else if (ratio >= 0.7) message = '꾸준히 잘하고 있어요!';
  else if (ratio >= 0.5) message = '절반 이상! 좋은 페이스예요';
  else if (ratio >= 0.3) message = '조금씩 늘려가봐요!';
  else if (activeDays > 0) message = '다시 시작한 것만으로도 멋져요!';
  else message = '오늘 첫 걸음을 떼어봐요!';

  return { ratio, activeDays, totalDays: days, message };
}

export function getWindowColors(timeOfDay: ReturnType<typeof getTimeOfDay>) {
  switch (timeOfDay) {
    case 'morning':
      return { bg: '#FFF5E1', glow: 'rgba(255, 200, 100, 0.3)' };
    case 'afternoon':
      return { bg: '#E8F4FD', glow: 'rgba(135, 206, 250, 0.3)' };
    case 'evening':
      return { bg: '#FFE0CC', glow: 'rgba(255, 140, 80, 0.3)' };
    case 'night':
      return { bg: '#2C3E6B', glow: 'rgba(100, 120, 200, 0.2)' };
  }
}
