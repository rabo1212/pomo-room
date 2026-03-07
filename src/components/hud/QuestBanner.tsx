'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTimerStore } from '@/stores/timerStore';
import { useStatsStore } from '@/stores/statsStore';
import { getConsistencyRatio } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const COMEBACK_MESSAGES = [
  '다시 돌아온 것만으로도 대단해요!',
  '완벽하지 않아도 괜찮아요, 꾸준함이 힘!',
  '오늘 한 번이면 충분해요!',
  '쉬었다 다시 시작하는 것도 실력이에요!',
];

export default function QuestBanner() {
  const status = useTimerStore((s) => s.status);
  const settings = useTimerStore((s) => s.settings);
  const dailyRecords = useStatsStore((s) => s.dailyRecords);
  const streak = useStatsStore((s) => s.getStreak());
  const consistency = useMemo(() => getConsistencyRatio(dailyRecords), [dailyRecords]);
  const [visible, setVisible] = useState(false);

  // Show comeback message when streak is 0 but they had activity before
  const isComeback = streak === 0 && consistency.activeDays > 0;
  const comebackMsg = useMemo(
    () => COMEBACK_MESSAGES[Math.floor(Math.random() * COMEBACK_MESSAGES.length)],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isComeback]
  );

  useEffect(() => {
    if (status === 'focus') {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [status]);

  const minutes = Math.floor(settings.focusDuration / 60);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none flex flex-col items-center gap-2 px-4"
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="game-hud px-4 py-2 flex items-center gap-2">
            <span className="text-sm">🎯</span>
            <span className="text-sm font-bold font-[family-name:var(--font-fredoka)]">
              QUEST: {minutes}분 집중하기!
            </span>
          </div>
          {isComeback && (
            <motion.div
              className="game-hud px-3 py-1.5"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-xs text-mint-dark font-semibold">
                💪 {comebackMsg}
              </span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
