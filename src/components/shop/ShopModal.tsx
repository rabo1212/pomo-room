'use client';

import { useState, useEffect } from 'react';
import { SHOP_ITEMS } from '@/lib/constants';
import { useTimerStore } from '@/stores/timerStore';
import { useRoomStore } from '@/stores/roomStore';
import { useSound } from '@/hooks/useSound';
import { showToast } from '@/components/ui/Toast';
import { ItemCategory, RoomTheme } from '@/types';

const CATEGORY_LABELS: Record<ItemCategory, string> = {
  plant: '🌱 식물',
  pet: '🐱 동물',
  lighting: '💡 조명',
  theme: '🎨 테마',
  furniture: '🪑 가구',
};

const RARITY_STYLES = {
  common: { border: 'border-mint/50', badge: 'bg-mint/20 text-mint-dark', label: '일반' },
  rare: { border: 'border-gold/60', badge: 'bg-gold/20 text-gold-dark', label: '레어' },
  legendary: { border: 'border-coral/60', badge: 'bg-coral/20 text-coral-dark', label: '전설' },
};

// 아이템별 미리보기 이모지 (아이템 고유)
const ITEM_PREVIEW: Record<string, string> = {
  plant_01: '🌵',
  plant_02: '🪴',
  plant_03: '🌸',
  cat_01: '🐱',
  cat_02: '🐈‍⬛',
  cat_03: '🐈',
  light_01: '🔦',
  light_02: '✨',
  light_03: '💡',
  theme_cozy: '🏠',
  theme_nature: '🌲',
  theme_space: '🌌',
  furniture_01: '📚',
  furniture_02: '🟣',
  furniture_03: '🖼️',
};

interface ShopModalProps {
  onClose: () => void;
}

export default function ShopModal({ onClose }: ShopModalProps) {
  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);
  const coins = useTimerStore((s) => s.coins);
  const spendCoins = useTimerStore((s) => s.spendCoins);
  const ownedItemIds = useRoomStore((s) => s.ownedItemIds);
  const activeItemIds = useRoomStore((s) => s.activeItemIds);
  const addOwnedItem = useRoomStore((s) => s.addOwnedItem);
  const toggleItem = useRoomStore((s) => s.toggleItem);
  const setTheme = useRoomStore((s) => s.setTheme);
  const theme = useRoomStore((s) => s.theme);
  const { playCoin } = useSound();
  const [justBought, setJustBought] = useState<string | null>(null);

  const handlePurchase = (itemId: string, price: number, category: string) => {
    if (ownedItemIds.includes(itemId)) return;
    if (!spendCoins(price)) return;

    playCoin();
    addOwnedItem(itemId);

    if (category === 'theme') {
      const t = itemId.replace('theme_', '') as RoomTheme;
      setTheme(t);
    }

    // 구매 피드백
    setJustBought(itemId);
    setTimeout(() => setJustBought(null), 1200);
  };

  const handleToggle = (itemId: string, category: string) => {
    if (category === 'theme') {
      const t = itemId.replace('theme_', '') as RoomTheme;
      setTheme(theme === t ? 'default' : t);
    } else {
      toggleItem(itemId);
    }
  };

  const categories = [...new Set(SHOP_ITEMS.map(i => i.category))] as ItemCategory[];

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="modal-content clay bg-cream w-full max-w-md max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-coral">
            🛒 상점
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gold-dark">🪙 {coins}</span>
            <button
              onClick={onClose}
              className="clay-button w-8 h-8 flex items-center justify-center text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Items by category */}
        {categories.map(category => (
          <div key={category} className="mb-5">
            <h3 className="text-sm font-bold text-lavender-dark mb-2">
              {CATEGORY_LABELS[category]}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {SHOP_ITEMS.filter(i => i.category === category).map(item => {
                const owned = ownedItemIds.includes(item.id);
                const active = category === 'theme'
                  ? theme === item.id.replace('theme_', '')
                  : activeItemIds.includes(item.id);
                const canAfford = coins >= item.price;
                const rarity = RARITY_STYLES[item.rarity];
                const wasBought = justBought === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (owned) {
                        handleToggle(item.id, item.category);
                      } else if (canAfford) {
                        handlePurchase(item.id, item.price, item.category);
                      } else {
                        showToast(`코인이 부족해요! (필요 ${item.price} | 보유 ${coins}) 🪙`);
                      }
                    }}
                    className={`clay p-2.5 flex flex-col items-center gap-1 text-center transition-all border-2 relative ${
                      wasBought
                        ? 'border-mint scale-105 bg-mint/10'
                        : owned
                          ? active ? 'border-mint/40 bg-mint/5' : 'border-cream-dark opacity-60'
                          : canAfford
                            ? `${rarity.border} hover:scale-105 cursor-pointer`
                            : 'opacity-40 border-cream-dark cursor-not-allowed'
                    }`}
                  >
                    {/* 희귀도 뱃지 */}
                    {item.rarity !== 'common' && (
                      <span className={`absolute -top-1.5 -right-1.5 text-[7px] px-1.5 py-0.5 rounded-full font-bold ${rarity.badge}`}>
                        {rarity.label}
                      </span>
                    )}

                    {/* 미리보기 */}
                    <span className="text-2xl leading-none">{ITEM_PREVIEW[item.id] || '📦'}</span>

                    {/* 이름 */}
                    <span className="text-[10px] font-semibold leading-tight">{item.name}</span>

                    {/* 설명 */}
                    <span className="text-[8px] text-lavender-dark/70 leading-tight">{item.description}</span>

                    {/* 상태 표시 */}
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      owned
                        ? active ? 'bg-mint/20 text-mint-dark' : 'bg-cream-dark text-lavender-dark'
                        : canAfford ? 'bg-gold/20 text-gold-dark' : 'bg-cream-dark text-lavender-dark/50'
                    }`}>
                      {owned ? (active ? '✅ 사용중' : '꺼짐') : `🪙 ${item.price}`}
                    </span>

                    {/* 구매 완료 이펙트 */}
                    {wasBought && (
                      <span className="absolute inset-0 flex items-center justify-center text-2xl animate-bounce pointer-events-none">
                        🎉
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* 디버그: 코인 추가 (개발용) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 pt-3 border-t border-cream-dark">
            <button
              onClick={() => useTimerStore.getState().addCoins(10)}
              className="clay-button px-4 py-2 text-xs text-lavender-dark w-full"
            >
              🧪 테스트용 코인 +10
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
