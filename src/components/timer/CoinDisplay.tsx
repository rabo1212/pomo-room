'use client';

import { useTimerStore } from '@/stores/timerStore';

export default function CoinDisplay() {
  const coins = useTimerStore((s) => s.coins);

  return (
    <div className="clay inline-flex items-center gap-2 px-4 py-2 text-sm font-bold">
      <span className="text-lg">🪙</span>
      <span className="text-gold-dark font-[family-name:var(--font-fredoka)]">{coins}</span>
    </div>
  );
}
