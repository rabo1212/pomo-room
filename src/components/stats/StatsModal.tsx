'use client';

import { useMemo, useEffect } from 'react';
import { useStatsStore } from '@/stores/statsStore';

interface StatsModalProps {
  onClose: () => void;
}

function WeeklyChart({ data }: { data: { label: string; count: number }[] }) {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  const barWidth = 32;
  const chartH = 100;
  const gap = 8;
  const svgW = data.length * (barWidth + gap) - gap + 20;

  return (
    <svg viewBox={`0 0 ${svgW} ${chartH + 28}`} width="100%" height={chartH + 28}>
      {data.map((d, i) => {
        const x = 10 + i * (barWidth + gap);
        const barH = maxCount > 0 ? (d.count / maxCount) * chartH : 0;
        const y = chartH - barH;
        const isToday = i === data.length - 1;

        return (
          <g key={i}>
            {/* 바 배경 */}
            <rect x={x} y={0} width={barWidth} height={chartH} rx="6" fill="#F5EDE3" />
            {/* 바 */}
            {d.count > 0 && (
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx="6"
                fill={isToday ? '#FF6B6B' : '#7ECEC1'}
              />
            )}
            {/* 카운트 */}
            {d.count > 0 && (
              <text
                x={x + barWidth / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill={isToday ? '#FF6B6B' : '#7ECEC1'}
              >
                {d.count}
              </text>
            )}
            {/* 요일 라벨 */}
            <text
              x={x + barWidth / 2}
              y={chartH + 16}
              textAnchor="middle"
              fontSize="11"
              fill={isToday ? '#FF6B6B' : '#999'}
              fontWeight={isToday ? 'bold' : 'normal'}
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function dayLabel(dateStr: string): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[new Date(dateStr + 'T00:00:00').getDay()];
}

export default function StatsModal({ onClose }: StatsModalProps) {
  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const dailyRecords = useStatsStore((s) => s.dailyRecords);
  const recordPomodoro = useStatsStore((s) => s.recordPomodoro);

  const today = useMemo(() => dailyRecords[todayKey()] || { count: 0, minutes: 0 }, [dailyRecords]);

  const weekly = useMemo(() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const data = dailyRecords[key] || { count: 0, minutes: 0 };
      result.push({ day: key, label: dayLabel(key), count: data.count, minutes: data.minutes });
    }
    return result;
  }, [dailyRecords]);

  const streak = useMemo(() => {
    let s = 0;
    const d = new Date();
    if (!dailyRecords[todayKey()]) d.setDate(d.getDate() - 1);
    while (true) {
      const key = d.toISOString().slice(0, 10);
      if (dailyRecords[key]?.count > 0) { s++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return s;
  }, [dailyRecords]);

  const total = useMemo(() => {
    const entries = Object.values(dailyRecords);
    return {
      count: entries.reduce((sum, r) => sum + r.count, 0),
      minutes: entries.reduce((sum, r) => sum + r.minutes, 0),
    };
  }, [dailyRecords]);

  const weeklyTotal = weekly.reduce((sum, d) => sum + d.count, 0);
  const totalHours = Math.floor(total.minutes / 60);
  const totalMins = total.minutes % 60;

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="modal-content clay bg-cream w-full max-w-md max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-coral">
            📊 통계
          </h2>
          <button
            onClick={onClose}
            className="clay-button w-8 h-8 flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* 4-card grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* 오늘 */}
          <div className="clay p-3 text-center">
            <div className="text-2xl mb-1">🍅</div>
            <div className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-coral">
              {today.count}
            </div>
            <div className="text-[10px] text-lavender-dark">오늘 뽀모도로</div>
            <div className="text-[9px] text-lavender-dark/60 mt-0.5">
              {today.minutes}분 집중
            </div>
          </div>

          {/* 이번 주 */}
          <div className="clay p-3 text-center">
            <div className="text-2xl mb-1">📅</div>
            <div className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-mint-dark">
              {weeklyTotal}
            </div>
            <div className="text-[10px] text-lavender-dark">이번 주</div>
            <div className="text-[9px] text-lavender-dark/60 mt-0.5">
              최근 7일
            </div>
          </div>

          {/* 스트릭 */}
          <div className="clay p-3 text-center">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gold-dark">
              {streak}
            </div>
            <div className="text-[10px] text-lavender-dark">연속 일수</div>
            <div className="text-[9px] text-lavender-dark/60 mt-0.5">
              {streak > 0 ? '계속 가자!' : '오늘 시작해봐!'}
            </div>
          </div>

          {/* 총 누적 */}
          <div className="clay p-3 text-center">
            <div className="text-2xl mb-1">⏱️</div>
            <div className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-lavender-dark">
              {total.count}
            </div>
            <div className="text-[10px] text-lavender-dark">총 뽀모도로</div>
            <div className="text-[9px] text-lavender-dark/60 mt-0.5">
              {totalHours > 0 ? `${totalHours}시간 ${totalMins}분` : `${totalMins}분`}
            </div>
          </div>
        </div>

        {/* 빈 상태 or 주간 차트 */}
        {total.count === 0 ? (
          <div className="clay p-6 text-center">
            <div className="text-4xl mb-3">🚀</div>
            <p className="text-sm font-semibold text-lavender-dark">
              첫 뽀모도로를 시작해보세요!
            </p>
            <p className="text-xs text-lavender-dark/60 mt-1">
              집중 시간을 기록하면 여기에 통계가 나타나요
            </p>
          </div>
        ) : (
          <div className="clay p-4">
            <h3 className="text-sm font-bold text-lavender-dark mb-3">📈 주간 기록</h3>
            <WeeklyChart data={weekly} />
          </div>
        )}

        {/* 테스트 버튼 (개발용) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 pt-3 border-t border-cream-dark">
            <button
              onClick={() => recordPomodoro(25)}
              className="clay-button px-4 py-2 text-xs text-lavender-dark w-full"
            >
              🧪 테스트용 뽀모도로 기록 +1
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
