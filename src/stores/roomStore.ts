'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RoomItem, RoomTheme } from '@/types';
import { syncRoomToCloud } from '@/lib/supabase/sync';
import { createClient } from '@/lib/supabase/client';

// 방 데이터 변경 시 DB 동기화 (debounced)
let syncTimeout: ReturnType<typeof setTimeout> | null = null;
function debouncedSync() {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) syncRoomToCloud(user.id).catch(() => {});
    });
  }, 2000); // 2초 후 동기화 (빈번한 드래그 방지)
}

// 바닥 아이템 기본 위치 (아이소메트릭 u, v 좌표)
export const DEFAULT_ITEM_POSITIONS: Record<string, [number, number]> = {
  plant_01: [0.78, 0.7],
  plant_02: [0.78, 0.7],
  plant_03: [0.78, 0.7],
  cat_01: [0.2, 0.18],
  cat_02: [0.2, 0.18],
  cat_03: [0.2, 0.18],
  light_01: [0.15, 0.55],
  furniture_02: [0.5, 0.45], // 러그
};

interface RoomState {
  theme: RoomTheme;
  items: RoomItem[];
  ownedItemIds: string[];
  activeItemIds: string[];
  itemPositions: Record<string, [number, number]>; // itemId → [u, v]

  setTheme: (theme: RoomTheme) => void;
  addItem: (item: RoomItem) => void;
  removeItem: (itemId: string) => void;
  addOwnedItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
  toggleItem: (itemId: string) => void;
  isItemActive: (itemId: string) => boolean;
  setItemPosition: (itemId: string, u: number, v: number) => void;
  getItemPosition: (itemId: string) => [number, number];
}

export const useRoomStore = create<RoomState>()(
  persist(
    (set, get) => ({
      theme: 'default',
      items: [],
      ownedItemIds: [],
      activeItemIds: [],
      itemPositions: {},

      setTheme: (theme) => { set({ theme }); debouncedSync(); },

      addItem: (item) =>
        set((state) => ({
          items: [...state.items.filter(i => i.item_id !== item.item_id), item],
        })),

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter(i => i.item_id !== itemId),
        })),

      addOwnedItem: (itemId) => {
        set((state) => ({
          ownedItemIds: state.ownedItemIds.includes(itemId)
            ? state.ownedItemIds
            : [...state.ownedItemIds, itemId],
          activeItemIds: state.activeItemIds.includes(itemId)
            ? state.activeItemIds
            : [...state.activeItemIds, itemId],
        }));
        debouncedSync();
      },

      hasItem: (itemId) => get().ownedItemIds.includes(itemId),

      toggleItem: (itemId) => {
        set((state) => ({
          activeItemIds: state.activeItemIds.includes(itemId)
            ? state.activeItemIds.filter(id => id !== itemId)
            : [...state.activeItemIds, itemId],
        }));
        debouncedSync();
      },

      isItemActive: (itemId) => get().activeItemIds.includes(itemId),

      setItemPosition: (itemId, u, v) => {
        set((state) => ({
          itemPositions: { ...state.itemPositions, [itemId]: [u, v] },
        }));
        debouncedSync();
      },

      getItemPosition: (itemId) => {
        const saved = get().itemPositions[itemId];
        if (saved) return saved;
        return DEFAULT_ITEM_POSITIONS[itemId] || [0.5, 0.5];
      },
    }),
    {
      name: 'pomo-room',
      onRehydrateStorage: () => (state) => {
        if (state && state.ownedItemIds.length > 0 && state.activeItemIds.length === 0) {
          state.activeItemIds = [...state.ownedItemIds];
        }
      },
    }
  )
);
