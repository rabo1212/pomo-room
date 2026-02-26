'use client';

import { createClient } from '@/lib/supabase/client';
import { useTimerStore } from '@/stores/timerStore';
import { useRoomStore } from '@/stores/roomStore';
import { useStatsStore } from '@/stores/statsStore';

function getSupabase() { return createClient(); }

// ============================
// Profile 동기화
// ============================

export async function fetchProfile(userId: string) {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  return data;
}

export async function updateProfileCoins(userId: string, coins: number) {
  const supabase = getSupabase();
  await supabase
    .from('profiles')
    .update({ coins })
    .eq('id', userId);
}

// ============================
// 뽀모도로 세션 기록
// ============================

export async function recordSession(userId: string, durationMinutes: number) {
  const supabase = getSupabase();
  await supabase.from('pomodoro_sessions').insert({
    user_id: userId,
    session_type: 'focus',
    duration_minutes: durationMinutes,
  });

  // daily_stats 업서트
  const today = new Date().toISOString().slice(0, 10);
  const { data: existing } = await supabase
    .from('daily_stats')
    .select('*')
    .eq('user_id', userId)
    .eq('day', today)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('daily_stats')
      .update({
        count: existing.count + 1,
        minutes: existing.minutes + durationMinutes,
      })
      .eq('id', existing.id);
  } else {
    await supabase.from('daily_stats').insert({
      user_id: userId,
      day: today,
      count: 1,
      minutes: durationMinutes,
    });
  }

  // profiles 통계 업데이트
  const { data: profile } = await supabase
    .from('profiles')
    .select('total_pomodoros, total_focus_minutes')
    .eq('id', userId)
    .maybeSingle();

  if (profile) {
    await supabase
      .from('profiles')
      .update({
        total_pomodoros: profile.total_pomodoros + 1,
        total_focus_minutes: profile.total_focus_minutes + durationMinutes,
        last_pomodoro_date: today,
      })
      .eq('id', userId);
  }
}

// ============================
// 방 데이터 동기화
// ============================

export async function syncRoomToCloud(userId: string) {
  const supabase = getSupabase();
  const roomState = useRoomStore.getState();

  const roomData = {
    user_id: userId,
    theme: roomState.theme,
    owned_item_ids: roomState.ownedItemIds,
    active_item_ids: roomState.activeItemIds,
    item_positions: roomState.itemPositions,
  };

  const { data: existing } = await supabase
    .from('user_rooms')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('user_rooms')
      .update(roomData)
      .eq('user_id', userId);
  } else {
    await supabase.from('user_rooms').insert(roomData);
  }
}

export async function syncRoomFromCloud(userId: string) {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('user_rooms')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (data) {
    const roomStore = useRoomStore.getState();
    // 클라우드 데이터가 있으면 로컬에 적용
    useRoomStore.setState({
      theme: data.theme as 'default' | 'cozy' | 'nature' | 'space',
      ownedItemIds: data.owned_item_ids || [],
      activeItemIds: data.active_item_ids || [],
      itemPositions: data.item_positions || {},
    });
  }
}

// ============================
// 첫 로그인 시 로컬 → 클라우드 머지
// ============================

export async function mergeLocalDataToCloud(userId: string) {
  const supabase = getSupabase();
  // 1. 코인 동기화
  const timerState = useTimerStore.getState();
  const { data: profile } = await supabase
    .from('profiles')
    .select('coins, total_pomodoros')
    .eq('id', userId)
    .maybeSingle();

  if (profile) {
    // 로컬 코인이 더 많으면 클라우드에 반영 (첫 로그인)
    if (timerState.coins > profile.coins) {
      await supabase
        .from('profiles')
        .update({ coins: timerState.coins })
        .eq('id', userId);
    } else {
      // 클라우드 코인이 더 많으면 로컬에 반영
      useTimerStore.setState({ coins: profile.coins });
    }
  }

  // 2. 방 데이터 동기화
  const { data: existingRoom } = await supabase
    .from('user_rooms')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (!existingRoom) {
    // 클라우드에 방이 없으면 로컬 데이터 업로드
    await syncRoomToCloud(userId);
  } else {
    // 클라우드에 방이 있으면 로컬에 적용
    await syncRoomFromCloud(userId);
  }

  // 3. 통계 동기화 (로컬 dailyRecords를 클라우드에 업로드)
  const statsState = useStatsStore.getState();
  const records = statsState.dailyRecords;

  for (const [day, record] of Object.entries(records)) {
    if (record.count === 0) continue;

    const { data: existing } = await supabase
      .from('daily_stats')
      .select('id, count, minutes')
      .eq('user_id', userId)
      .eq('day', day)
      .maybeSingle();

    if (!existing) {
      await supabase.from('daily_stats').insert({
        user_id: userId,
        day,
        count: record.count,
        minutes: record.minutes,
      });
    } else if (record.count > existing.count) {
      // 로컬이 더 많으면 업데이트
      await supabase
        .from('daily_stats')
        .update({ count: record.count, minutes: record.minutes })
        .eq('id', existing.id);
    }
  }
}
