'use client';

import { useEffect, useState, useCallback } from 'react';
import { PublicRoomData, LeaderboardEntry } from '@/types';
import { fetchPublicRooms, toggleRoomLike, fetchLeaderboard, updateRoomPublic } from '@/lib/supabase/social';
import { useAuth } from '@/hooks/useAuth';
import { showToast } from '@/components/ui/Toast';
import RoomCard from './RoomCard';

type Tab = 'rooms' | 'leaderboard';
type LeaderboardType = 'pomodoros' | 'minutes';

interface SocialModalProps {
  onClose: () => void;
}

export default function SocialModal({ onClose }: SocialModalProps) {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('rooms');
  const [rooms, setRooms] = useState<PublicRoomData[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lbType, setLbType] = useState<LeaderboardType>('pomodoros');
  const [loading, setLoading] = useState(true);
  const [isRoomPublic, setIsRoomPublic] = useState(false);

  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // 데이터 로드
  const loadRooms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPublicRooms(user?.id);
      setRooms(data);
    } catch {
      showToast('방 목록을 불러오지 못했어요');
    }
    setLoading(false);
  }, [user?.id]);

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchLeaderboard(lbType);
      setLeaderboard(data);
    } catch {
      showToast('리더보드를 불러오지 못했어요');
    }
    setLoading(false);
  }, [lbType]);

  useEffect(() => {
    if (tab === 'rooms') loadRooms();
    else loadLeaderboard();
  }, [tab, loadRooms, loadLeaderboard]);

  // 내 방 공개 여부 로드
  useEffect(() => {
    if (!user) return;
    import('@/lib/supabase/client').then(({ createClient }) => {
      createClient()
        .from('profiles')
        .select('is_room_public')
        .eq('id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setIsRoomPublic(data.is_room_public);
        });
    });
  }, [user]);

  const handleLike = async (ownerId: string) => {
    if (!user) {
      showToast('로그인이 필요해요!');
      return;
    }
    try {
      await toggleRoomLike(user.id, ownerId);
    } catch {
      showToast('오류가 발생했어요');
    }
  };

  const handleTogglePublic = async () => {
    if (!user) {
      showToast('로그인이 필요해요!');
      return;
    }
    const newValue = !isRoomPublic;
    setIsRoomPublic(newValue);
    await updateRoomPublic(user.id, newValue);
    showToast(newValue ? '내 방이 공개되었어요! 🏠' : '내 방이 비공개로 변경됐어요');
  };

  return (
    <div
      className="modal-backdrop fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="modal-content clay bg-cream w-full max-w-lg max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 pb-3 border-b border-cream-dark/20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold font-[family-name:var(--font-fredoka)] text-coral">
              👥 소셜
            </h2>
            <button onClick={onClose} className="text-lavender-dark/50 text-xl leading-none">
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setTab('rooms')}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                tab === 'rooms'
                  ? 'bg-coral/10 text-coral'
                  : 'text-lavender-dark/50 hover:bg-cream-dark/20'
              }`}
            >
              🏠 방 구경
            </button>
            <button
              onClick={() => setTab('leaderboard')}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                tab === 'leaderboard'
                  ? 'bg-coral/10 text-coral'
                  : 'text-lavender-dark/50 hover:bg-cream-dark/20'
              }`}
            >
              🏆 리더보드
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'rooms' ? (
            <>
              {/* 내 방 공개 토글 */}
              {user && (
                <div className="flex items-center justify-between mb-4 p-3 bg-cream-dark/20 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-lavender-dark">내 방 공개하기</p>
                    <p className="text-[10px] text-lavender-dark/50">다른 사람들이 내 방을 구경할 수 있어요</p>
                  </div>
                  <button
                    onClick={handleTogglePublic}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      isRoomPublic ? 'bg-mint' : 'bg-cream-dark/40'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${
                      isRoomPublic ? 'left-6' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              )}

              {loading ? (
                <div className="text-center py-12 text-lavender-dark/50">
                  <div className="text-2xl mb-2 animate-bounce">🏠</div>
                  <p className="text-sm">방 불러오는 중...</p>
                </div>
              ) : rooms.length === 0 ? (
                <div className="text-center py-12 text-lavender-dark/50">
                  <div className="text-3xl mb-2">🏚️</div>
                  <p className="text-sm">아직 공개된 방이 없어요</p>
                  <p className="text-xs mt-1">첫 번째로 방을 공개해보세요!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rooms.map((room) => (
                    <RoomCard
                      key={room.profile.id}
                      data={room}
                      onLike={handleLike}
                      canLike={!!user && room.profile.id !== user.id}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* 리더보드 타입 토글 */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setLbType('pomodoros')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    lbType === 'pomodoros'
                      ? 'bg-gold/20 text-gold-dark'
                      : 'text-lavender-dark/50 hover:bg-cream-dark/20'
                  }`}
                >
                  🍅 뽀모도로 수
                </button>
                <button
                  onClick={() => setLbType('minutes')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    lbType === 'minutes'
                      ? 'bg-gold/20 text-gold-dark'
                      : 'text-lavender-dark/50 hover:bg-cream-dark/20'
                  }`}
                >
                  ⏱️ 집중 시간
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12 text-lavender-dark/50">
                  <div className="text-2xl mb-2 animate-bounce">🏆</div>
                  <p className="text-sm">순위 불러오는 중...</p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-12 text-lavender-dark/50">
                  <div className="text-3xl mb-2">🏆</div>
                  <p className="text-sm">아직 기록이 없어요</p>
                  <p className="text-xs mt-1">뽀모도로를 완료하고 순위에 올라보세요!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((entry) => {
                    const isMe = user?.id === entry.profile.id;
                    const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : '';
                    return (
                      <div
                        key={entry.profile.id}
                        className={`flex items-center gap-3 p-3 rounded-xl ${
                          isMe ? 'bg-coral/5 ring-1 ring-coral/20' : 'bg-cream-dark/15'
                        }`}
                      >
                        {/* Rank */}
                        <div className="w-8 text-center flex-shrink-0">
                          {medal ? (
                            <span className="text-lg">{medal}</span>
                          ) : (
                            <span className="text-sm font-bold text-lavender-dark/40">{entry.rank}</span>
                          )}
                        </div>

                        {/* Avatar */}
                        {entry.profile.avatar_url ? (
                          <img
                            src={entry.profile.avatar_url}
                            alt=""
                            className="w-8 h-8 rounded-full flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-lavender/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs">👤</span>
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${isMe ? 'text-coral' : 'text-lavender-dark'}`}>
                            {entry.profile.display_name}
                            {isMe && <span className="text-[10px] ml-1 opacity-50">(나)</span>}
                          </p>
                          <p className="text-[10px] text-lavender-dark/50">
                            🔥 {entry.profile.current_streak}일 연속
                          </p>
                        </div>

                        {/* Score */}
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-coral">
                            {lbType === 'pomodoros'
                              ? `${entry.profile.total_pomodoros}`
                              : `${Math.round(entry.profile.total_focus_minutes / 60)}h`
                            }
                          </p>
                          <p className="text-[10px] text-lavender-dark/40">
                            {lbType === 'pomodoros' ? '뽀모' : '시간'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
