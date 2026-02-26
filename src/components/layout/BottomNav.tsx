'use client';

type Tab = 'timer' | 'stats' | 'shop' | 'social';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { key: Tab; icon: string; label: string }[] = [
  { key: 'timer', icon: '🍅', label: '타이머' },
  { key: 'stats', icon: '📊', label: '통계' },
  { key: 'shop', icon: '🛒', label: '상점' },
  { key: 'social', icon: '👥', label: '소셜' },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 md:hidden z-40">
      <div className="bg-white/95 dark:bg-[#2A2A3E]/95 backdrop-blur-sm border-t border-cream-dark">
        <div className="flex items-stretch justify-around max-w-md mx-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`flex-1 flex flex-col items-center justify-center py-2 pt-3 min-h-[56px] transition-colors ${
                  isActive
                    ? 'text-coral'
                    : 'text-lavender-dark/60'
                }`}
              >
                <span className="text-xl leading-none">{tab.icon}</span>
                <span className={`text-[10px] mt-1 font-semibold ${
                  isActive ? 'text-coral' : 'text-lavender-dark/50'
                }`}>
                  {tab.label}
                </span>
                {isActive && (
                  <div className="w-5 h-0.5 bg-coral rounded-full mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
