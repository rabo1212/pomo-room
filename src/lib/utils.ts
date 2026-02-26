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
