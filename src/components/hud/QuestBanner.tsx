'use client';

import { useEffect, useState } from 'react';
import { useTimerStore } from '@/stores/timerStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuestBanner() {
  const status = useTimerStore((s) => s.status);
  const settings = useTimerStore((s) => s.settings);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status === 'focus') {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
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
          className="pointer-events-none flex justify-center px-4"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
