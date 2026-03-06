'use client';

import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStatsStore } from '@/stores/statsStore';
import { checkBadges } from '@/lib/badges';
import ShareCard from '@/components/share/ShareCard';
import { localDateKey } from '@/lib/utils';

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
            <rect x={x} y={0} width={barWidth} height={chartH} rx="6" fill="var(--color-cream-dark)" />
            {/* 바 */}
            {d.count > 0 && (
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx="6"
                fill={isToday ? 'var(--color-coral)' : 'var(--color-mint)'}
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
                fill={isToday ? 'var(--color-coral)' : 'var(--color-mint)'}
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
              fill={isToday ? 'var(--color-coral)' : 'var(--color-lavender-dark)'}
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

function dayLabel(dateStr: string): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[new Date(dateStr + 'T00:00:00').getDay()];
}

function BadgeSection({
  streak,
  totalPomodoros,
  totalMinutes,
}: {
  streak: number;
  totalPomodoros: number;
  totalMinutes: number;
}) {
  const badges = useMemo(
    () =>
      checkBadges({
        streak,
        totalPomodoros,
        totalMinutes,
        totalDays: 0, // 배지 체크에 사용하지 않음
      }),
    [streak, totalPomodoros, totalMinutes]
  );

  const earned = badges.filter((b) => b.earned);
  const unearned = badges.filter((b) => !b.earned);

  return (
    <div className="clay p-4 mt-3">
      <h3 className="text-sm font-bold text-lavender-dark mb-3">🏅 배지</h3>
      <div className="grid grid-cols-4 gap-2">
        {earned.map((b) => (
          <div key={b.id} className="text-center" title={b.description}>
            <div className="text-2xl">{b.icon}</div>
            <div className="text-[9px] text-lavender-dark font-semibold mt-0.5 leading-tight">
              {b.name}
            </div>
          </div>
        ))}
        {unearned.map((b) => (
          <div key={b.id} className="text-center opacity-25" title={b.description}>
            <div className="text-2xl grayscale">{b.icon}</div>
            <div className="text-[9px] text-lavender-dark mt-0.5 leading-tight">
              {b.name}
            </div>
          </div>
        ))}
      </div>
      {earned.length === 0 && (
        <p className="text-xs text-lavender-dark/50 text-center mt-2">
          뽀모도로를 완료하면 배지를 획득할 수 있어요!
        </p>
      )}
    </div>
  );
}

export default function StatsModal({ onClose }: StatsModalProps) {
  const [shareOpen, setShareOpen] = useState(false);

  // ESC 키로 닫기 (ShareCard가 열려있으면 ShareCard만 닫기)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (shareOpen) setShareOpen(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, shareOpen]);

  const dailyRecords = useStatsStore((s) => s.dailyRecords);
  const recordPomodoro = useStatsStore((s) => s.recordPomodoro);

  const today = useMemo(() => dailyRecords[localDateKey()] || { count: 0, minutes: 0 }, [dailyRecords]);

  const weekly = useMemo(() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = localDateKey(d);
      const data = dailyRecords[key] || { count: 0, minutes: 0 };
      result.push({ day: key, label: dayLabel(key), count: data.count, minutes: data.minutes });
    }
    return result;
  }, [dailyRecords]);

  const streak = useMemo(() => {
    let s = 0;
    const d = new Date();
    if (!dailyRecords[localDateKey()]) d.setDate(d.getDate() - 1);
    while (true) {
      const key = localDateKey(d);
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50" onClick={onClose}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="game-panel w-full max-w-md max-h-[85vh] overflow-y-auto sm:mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="game-panel-header flex items-center justify-between">
          <h2 className="text-lg font-bold font-[family-name:var(--font-fredoka)]">
            📊 통계
          </h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs hover:bg-white/30 transition-colors">
            ✕
          </button>
        </div>

        {/* 4-card grid */}
        <div className="grid grid-cols-2 gap-3 mb-5 px-4 pt-4">
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

        {/* 공유 카드 버튼 */}
        {today.count > 0 && (
          <button
            onClick={() => setShareOpen(true)}
            className="clay-button w-full py-3 text-sm font-bold text-coral mt-3"
          >
            📸 오늘의 기록 공유하기
          </button>
        )}

        {/* 배지 섹션 */}
        <BadgeSection streak={streak} totalPomodoros={total.count} totalMinutes={total.minutes} />

        {/* 공유 카드 모달 */}
        {shareOpen && <ShareCard onClose={() => setShareOpen(false)} />}

        {/* 테스트 버튼 (개발용) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mx-4 mb-4 pt-3 border-t border-white/10">
            <button
              onClick={() => recordPomodoro(25)}
              className="w-full py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 transition-colors"
            >
              🧪 테스트용 뽀모도로 기록 +1
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
