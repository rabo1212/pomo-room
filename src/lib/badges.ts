/**
 * 스트릭 배지 시스템
 * 연속 일수, 총 뽀모도로 수 등에 따라 배지 부여
 */

export interface Badge {
  id: string;
  icon: string;
  name: string;
  description: string;
  earned: boolean;
}

interface StatsForBadges {
  streak: number;
  totalPomodoros: number;
  totalMinutes: number;
  totalDays: number;
}

const BADGE_DEFS: {
  id: string;
  icon: string;
  name: string;
  description: string;
  check: (s: StatsForBadges) => boolean;
}[] = [
  // 스트릭 배지
  {
    id: 'streak-3',
    icon: '🔥',
    name: '3일 연속',
    description: '3일 연속 뽀모도로 달성',
    check: (s) => s.streak >= 3,
  },
  {
    id: 'streak-7',
    icon: '💪',
    name: '7일 연속',
    description: '1주일 연속 뽀모도로 달성',
    check: (s) => s.streak >= 7,
  },
  {
    id: 'streak-30',
    icon: '👑',
    name: '30일 연속',
    description: '30일 연속! 전설이에요',
    check: (s) => s.streak >= 30,
  },
  // 총 뽀모도로 수
  {
    id: 'pomo-10',
    icon: '🍅',
    name: '첫 열 개',
    description: '총 10개 뽀모도로 완료',
    check: (s) => s.totalPomodoros >= 10,
  },
  {
    id: 'pomo-50',
    icon: '🌟',
    name: '반백 달성',
    description: '총 50개 뽀모도로 완료',
    check: (s) => s.totalPomodoros >= 50,
  },
  {
    id: 'pomo-100',
    icon: '💎',
    name: '센추리',
    description: '총 100개 뽀모도로 완료',
    check: (s) => s.totalPomodoros >= 100,
  },
  // 총 집중 시간
  {
    id: 'hours-10',
    icon: '⏰',
    name: '10시간',
    description: '총 10시간 집중 달성',
    check: (s) => s.totalMinutes >= 600,
  },
  {
    id: 'hours-50',
    icon: '🏆',
    name: '50시간',
    description: '총 50시간 집중 달성',
    check: (s) => s.totalMinutes >= 3000,
  },
];

export function checkBadges(stats: StatsForBadges): Badge[] {
  return BADGE_DEFS.map((def) => ({
    id: def.id,
    icon: def.icon,
    name: def.name,
    description: def.description,
    earned: def.check(stats),
  }));
}
