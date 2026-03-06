'use client';

import TopBar from './TopBar';
import FloatingTimer from './FloatingTimer';
import QuestBanner from './QuestBanner';

interface GameHUDProps {
  onProfileClick: () => void;
  onSettingsClick: () => void;
}

export default function GameHUD({ onProfileClick, onSettingsClick }: GameHUDProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col">
      {/* Top bar */}
      <TopBar onProfileClick={onProfileClick} onSettingsClick={onSettingsClick} />

      {/* Quest banner */}
      <div className="mt-2">
        <QuestBanner />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Floating timer (center-bottom area, above action bar) */}
      <div className="flex justify-center mb-20 sm:mb-24">
        <FloatingTimer />
      </div>
    </div>
  );
}
