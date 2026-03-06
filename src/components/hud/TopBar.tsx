'use client';

import { useTimerStore } from '@/stores/timerStore';
import { useStatsStore } from '@/stores/statsStore';
import { useAuth } from '@/hooks/useAuth';
import { getPlayerLevel } from '@/lib/utils';

interface TopBarProps {
  onProfileClick: () => void;
  onSettingsClick: () => void;
}

export default function TopBar({ onProfileClick, onSettingsClick }: TopBarProps) {
  const coins = useTimerStore((s) => s.coins);
  const { user } = useAuth();
  const totalStats = useStatsStore((s) => s.getTotalStats());
  const streak = useStatsStore((s) => s.getStreak());
  const level = getPlayerLevel(totalStats.count);

  return (
    <div className="flex items-start justify-between w-full px-3 pt-3 pointer-events-auto">
      {/* Left: Level + XP */}
      <div className="game-hud px-3 py-2 flex flex-col gap-1 min-w-[130px]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gold">Lv.{level.level}</span>
          <span className="text-xs opacity-70">{level.title}</span>
        </div>
        {/* XP bar */}
        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-mint transition-all duration-500"
            style={{ width: `${level.progress * 100}%` }}
          />
        </div>
        <span className="text-[10px] opacity-50">
          {level.currentXP}/{level.requiredXP} XP
        </span>
      </div>

      {/* Right: Coins + Streak + Profile + Settings */}
      <div className="flex items-center gap-1.5">
        {/* Streak */}
        {streak > 0 && (
          <div className="game-hud-pill flex items-center gap-1">
            <span className="text-xs">🔥</span>
            <span>{streak}</span>
          </div>
        )}

        {/* Coins */}
        <div className="game-hud-pill flex items-center gap-1">
          <span className="text-xs">🪙</span>
          <span>{coins}</span>
        </div>

        {/* Profile */}
        <button
          onClick={onProfileClick}
          className="game-hud w-9 h-9 flex items-center justify-center rounded-full overflow-hidden"
        >
          {user?.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm">👤</span>
          )}
        </button>

        {/* Settings */}
        <button
          onClick={onSettingsClick}
          className="game-hud w-9 h-9 flex items-center justify-center rounded-full text-sm"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
}
