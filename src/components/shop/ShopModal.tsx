'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
  furniture: '🪑 가구',
  electronics: '🎮 전자기기',
  decor: '🖼️ 장식',
  theme: '🎨 테마',
};

const CATEGORY_ORDER: ItemCategory[] = ['plant', 'pet', 'lighting', 'furniture', 'electronics', 'decor', 'theme'];

const RARITY_STYLES = {
  common: { border: 'border-mint/50', badge: 'bg-mint/20 text-mint-dark', label: '일반' },
  rare: { border: 'border-gold/60', badge: 'bg-gold/20 text-gold-dark', label: '레어' },
  legendary: { border: 'border-coral/60', badge: 'bg-coral/20 text-coral-dark', label: '전설' },
};

const ITEM_PREVIEW: Record<string, string> = {
  // 식물
  plant_01: '🌵', plant_02: '🪴', plant_03: '🌸',
  plant_04: '🌺', plant_05: '🌳', plant_06: '🐠', plant_07: '🌿',
  // 동물
  cat_01: '🐱', cat_02: '🐈‍⬛', cat_03: '🐈',
  pet_01: '🐶', pet_02: '🐹', pet_03: '🦜', pet_04: '🐟',
  // 조명
  light_01: '🔦', light_02: '✨', light_03: '💡',
  light_04: '🕯️', light_05: '🎄', light_06: '🪩',
  // 가구
  furniture_01: '📚', furniture_02: '🟣', furniture_03: '🖼️',
  furniture_04: '🛋️', furniture_05: '🛏️', furniture_06: '🪑',
  furniture_07: '🫖', furniture_08: '🪟', furniture_09: '📖', furniture_10: '💡',
  // 전자기기
  electronics_01: '🖥️', electronics_02: '💻', electronics_03: '🎮', electronics_04: '🔊',
  // 장식
  decor_01: '🕐', decor_02: '🪞', decor_03: '🏆', decor_04: '🖼️', decor_05: '🌍',
  // 테마
  theme_cozy: '🏠', theme_nature: '🌲', theme_space: '🌌',
};

interface ShopModalProps {
  onClose: () => void;
}

export default function ShopModal({ onClose }: ShopModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('plant');

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
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; color: string; delay: number }[]>([]);
  const confettiId = useRef(0);

  const handlePurchase = (itemId: string, price: number, category: string) => {
    if (ownedItemIds.includes(itemId)) return;
    if (!spendCoins(price)) return;

    playCoin();
    addOwnedItem(itemId);

    if (category === 'theme') {
      const t = itemId.replace('theme_', '') as RoomTheme;
      setTheme(t);
    }

    setJustBought(itemId);
    const colors = ['#FF6B6B', '#FFB347', '#7ECEC1', '#B8A9C9', '#FFD700', '#FF8A8A'];
    const particles = Array.from({ length: 12 }, () => ({
      id: confettiId.current++,
      x: Math.random() * 200 - 100,
      y: -(Math.random() * 120 + 40),
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.3,
    }));
    setConfetti(particles);
    setTimeout(() => { setJustBought(null); setConfetti([]); }, 1500);
  };

  const handleToggle = (itemId: string, category: string) => {
    if (category === 'theme') {
      const t = itemId.replace('theme_', '') as RoomTheme;
      setTheme(theme === t ? 'default' : t);
    } else {
      toggleItem(itemId);
    }
  };

  const categoryItems = SHOP_ITEMS.filter(i => i.category === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50" onClick={onClose}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="game-panel w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col sm:mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="game-panel-header flex items-center justify-between">
          <h2 className="text-lg font-bold font-[family-name:var(--font-fredoka)]">
            🛒 상점
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold">🪙 {coins}</span>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs hover:bg-white/30 transition-colors">
              ✕
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 px-4 pt-3 scrollbar-hide">
          {CATEGORY_ORDER.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-coral text-white shadow-sm scale-105'
                  : 'bg-cream-dark text-lavender-dark hover:bg-cream-dark/80'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="overflow-y-auto flex-1 px-4">
          <div className="grid grid-cols-3 gap-2">
            {categoryItems.map(item => {
              const owned = ownedItemIds.includes(item.id);
              const active = selectedCategory === 'theme'
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
                  {item.rarity !== 'common' && (
                    <span className={`absolute -top-1.5 -right-1.5 text-[7px] px-1.5 py-0.5 rounded-full font-bold ${rarity.badge}`}>
                      {rarity.label}
                    </span>
                  )}

                  <span className="text-2xl leading-none">{ITEM_PREVIEW[item.id] || '📦'}</span>
                  <span className="text-[10px] font-semibold leading-tight">{item.name}</span>
                  <span className="text-[8px] text-lavender-dark/70 leading-tight">{item.description}</span>

                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                    owned
                      ? active ? 'bg-mint/20 text-mint-dark' : 'bg-cream-dark text-lavender-dark'
                      : canAfford ? 'bg-gold/20 text-gold-dark' : 'bg-cream-dark text-lavender-dark/50'
                  }`}>
                    {owned ? (active ? '✅ 사용중' : '꺼짐') : `🪙 ${item.price}`}
                  </span>

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

        {/* Confetti */}
        {confetti.length > 0 && (
          <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
            {confetti.map(p => (
              <div
                key={p.id}
                className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full animate-confetti"
                style={{
                  backgroundColor: p.color,
                  '--confetti-x': `${p.x}px`,
                  '--confetti-y': `${p.y}px`,
                  animationDelay: `${p.delay}s`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}

        {/* Debug */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mx-4 mb-4 pt-3 border-t border-white/10">
            <button
              onClick={() => useTimerStore.getState().addCoins(10)}
              className="w-full py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 transition-colors"
            >
              🧪 테스트용 코인 +10
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
