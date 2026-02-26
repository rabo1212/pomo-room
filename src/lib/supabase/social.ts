'use client';

import { createClient } from '@/lib/supabase/client';
import { PublicRoomData, LeaderboardEntry } from '@/types';

const supabase = createClient();

// ============================
// 공개 방 목록
// ============================

export async function fetchPublicRooms(currentUserId?: string): Promise<PublicRoomData[]> {
  // 공개 방이 있는 유저 프로필 + 방 데이터 조회
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, total_pomodoros, total_focus_minutes, current_streak, longest_streak, last_pomodoro_date, is_room_public, likes_received, username, coins')
    .eq('is_room_public', true)
    .order('likes_received', { ascending: false })
    .limit(20);

  if (!profiles || profiles.length === 0) return [];

  const userIds = profiles.map(p => p.id);

  // 방 데이터 조회
  const { data: rooms } = await supabase
    .from('user_rooms')
    .select('user_id, theme, active_item_ids, item_positions')
    .in('user_id', userIds);

  // 현재 유저의 좋아요 목록
  let likedOwnerIds: string[] = [];
  if (currentUserId) {
    const { data: likes } = await supabase
      .from('room_likes')
      .select('room_owner_id')
      .eq('user_id', currentUserId);
    likedOwnerIds = (likes || []).map(l => l.room_owner_id);
  }

  const roomMap = new Map((rooms || []).map(r => [r.user_id, r]));

  return profiles
    .filter(p => roomMap.has(p.id)) // 방이 있는 유저만
    .map(p => {
      const room = roomMap.get(p.id)!;
      return {
        profile: p as PublicRoomData['profile'],
        room: {
          theme: room.theme,
          active_item_ids: room.active_item_ids || [],
          item_positions: room.item_positions || {},
        },
        is_liked: likedOwnerIds.includes(p.id),
        like_count: p.likes_received || 0,
      };
    });
}

// ============================
// 좋아요 토글
// ============================

export async function toggleRoomLike(userId: string, roomOwnerId: string): Promise<boolean> {
  // 이미 좋아요했는지 확인
  const { data: existing } = await supabase
    .from('room_likes')
    .select('id')
    .eq('user_id', userId)
    .eq('room_owner_id', roomOwnerId)
    .single();

  if (existing) {
    // 좋아요 취소
    await supabase
      .from('room_likes')
      .delete()
      .eq('id', existing.id);
    return false;
  } else {
    // 좋아요 추가
    await supabase
      .from('room_likes')
      .insert({ user_id: userId, room_owner_id: roomOwnerId });
    return true;
  }
}

// ============================
// 리더보드
// ============================

export async function fetchLeaderboard(type: 'pomodoros' | 'minutes' = 'pomodoros'): Promise<LeaderboardEntry[]> {
  const orderField = type === 'pomodoros' ? 'total_pomodoros' : 'total_focus_minutes';

  const { data } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, total_pomodoros, total_focus_minutes, current_streak')
    .gt(orderField, 0)
    .order(orderField, { ascending: false })
    .limit(20);

  if (!data) return [];

  return data.map((p, i) => ({
    rank: i + 1,
    profile: p,
  }));
}

// ============================
// 방 공개 토글
// ============================

export async function updateRoomPublic(userId: string, isPublic: boolean) {
  await supabase
    .from('profiles')
    .update({ is_room_public: isPublic })
    .eq('id', userId);
}
