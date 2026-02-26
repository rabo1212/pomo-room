// Timer types
export type TimerStatus = 'idle' | 'focus' | 'short_break' | 'long_break' | 'complete';

export interface TimerSettings {
  focusDuration: number; // seconds
  shortBreakDuration: number;
  longBreakDuration: number;
}

// Room types
export interface RoomItem {
  item_id: string;
  position: { x: number; y: number };
  variant: number;
}

export type RoomTheme = 'default' | 'cozy' | 'nature' | 'space';

export interface Room {
  id: string;
  user_id: string;
  theme: RoomTheme;
  items: RoomItem[];
  likes_count: number;
}

// Shop types
export type ItemCategory = 'plant' | 'pet' | 'lighting' | 'theme' | 'furniture';
export type ItemRarity = 'common' | 'rare' | 'legendary';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  price: number;
  rarity: ItemRarity;
  preview_data: Record<string, unknown> | null;
  sort_order: number;
}

// Profile types
export interface Profile {
  id: string;
  username: string | null;
  display_name: string;
  avatar_url: string;
  coins: number;
  total_pomodoros: number;
  total_focus_minutes: number;
  current_streak: number;
  longest_streak: number;
  last_pomodoro_date: string | null;
  is_room_public: boolean;
}

// Stats types
export interface DailyStat {
  day: string;
  count: number;
  minutes: number;
}

export interface PomodoroSession {
  id: string;
  user_id: string;
  session_type: 'focus' | 'short_break' | 'long_break';
  duration_minutes: number;
  completed_at: string;
}

// Social types
export interface RoomCardData {
  room: Room;
  profile: Profile;
  is_liked: boolean;
}

export interface PublicRoomData {
  profile: Profile & { likes_received: number };
  room: {
    theme: RoomTheme;
    active_item_ids: string[];
    item_positions: Record<string, [number, number]>;
  };
  is_liked: boolean;
  like_count: number;
}

export interface LeaderboardEntry {
  rank: number;
  profile: Pick<Profile, 'id' | 'display_name' | 'avatar_url' | 'total_pomodoros' | 'total_focus_minutes' | 'current_streak'>;
}
