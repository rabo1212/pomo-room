'use client';

import { useState } from 'react';
import { PublicRoomData, RoomTheme } from '@/types';
import { THEME_COLORS } from '@/lib/constants';
import { DEFAULT_ITEM_POSITIONS } from '@/stores/roomStore';

// ===== 미니 아이소메트릭 좌표 (축소 버전) =====
function iso(u: number, v: number): [number, number] {
  return [
    125 + u * 95 - v * 95,
    160 - u * 47.5 - v * 47.5,
  ];
}

// ===== 미니 아이템 렌더러들 =====
function renderMiniPlant(itemId: string, pos: [number, number]) {
  const [px, py] = pos;
  if (itemId === 'plant_01') {
    return (
      <g>
        <rect x={px - 4} y={py - 3} width="8" height="4" rx="1" fill="#8B6F47" />
        <ellipse cx={px} cy={py - 10} rx="4" ry="7" fill="#6BBF78" />
        <circle cx={px + 1} cy={py - 16} r="1.5" fill="#FF6B6B" />
      </g>
    );
  }
  if (itemId === 'plant_02') {
    return (
      <g>
        <rect x={px - 5} y={py - 4} width="10" height="4" rx="1" fill="white" />
        <line x1={px} y1={py - 4} x2={px - 2} y2={py - 15} stroke="#4A9455" strokeWidth="1.5" />
        <ellipse cx={px - 5} cy={py - 15} rx="6" ry="3" fill="#5DAA68" transform={`rotate(-30 ${px - 5} ${py - 15})`} />
        <ellipse cx={px + 4} cy={py - 14} rx="5" ry="2.5" fill="#6BBF78" transform={`rotate(25 ${px + 4} ${py - 14})`} />
      </g>
    );
  }
  // plant_03 벚꽃
  return (
    <g>
      <rect x={px - 4} y={py - 3} width="8" height="4" rx="1" fill="#FF8A8A" />
      <line x1={px} y1={py - 3} x2={px} y2={py - 14} stroke="#8B6F47" strokeWidth="1.5" />
      {[-4, 0, 4].map((ox, i) => (
        <circle key={i} cx={px + ox} cy={py - 15 - Math.abs(ox)} r="2" fill={i % 2 === 0 ? '#FFB8C6' : '#FFC8D6'} />
      ))}
    </g>
  );
}

function renderMiniCat(itemId: string, pos: [number, number]) {
  const [cx, cy] = pos;
  const color = itemId === 'cat_02' ? '#444' : '#FFB347';
  return (
    <g>
      <ellipse cx={cx + 4} cy={cy} rx="6" ry="4" fill={color} />
      <circle cx={cx - 1} cy={cy - 3} r="3.5" fill={color} />
      <polygon points={`${cx - 4},${cy - 5} ${cx - 5},${cy - 9} ${cx - 1},${cy - 6}`} fill={color} />
      <polygon points={`${cx + 2},${cy - 5} ${cx + 3},${cy - 9} ${cx - 1},${cy - 6}`} fill={color} />
      <circle cx={cx - 2.5} cy={cy - 3} r="0.7" fill={itemId === 'cat_02' ? '#FFD700' : '#3D3D3D'} />
      <circle cx={cx + 0.5} cy={cy - 3} r="0.7" fill={itemId === 'cat_02' ? '#FFD700' : '#3D3D3D'} />
    </g>
  );
}

function renderMiniLight(itemId: string) {
  if (itemId === 'light_03') {
    return (
      <text x={240} y={62} textAnchor="middle" fontSize="7" fontWeight="bold" fill="#FF6B6B" opacity="0.8">
        FOCUS
      </text>
    );
  }
  return null;
}

// ===== 미니 방 SVG =====
function MiniRoom({ theme, activeItemIds, itemPositions }: {
  theme: RoomTheme;
  activeItemIds: string[];
  itemPositions: Record<string, [number, number]>;
}) {
  const tc = THEME_COLORS[theme] || THEME_COLORS.default;
  const WALL_H = 77;

  const getPos = (itemId: string): [number, number] => {
    const saved = itemPositions[itemId];
    if (saved) return iso(saved[0], saved[1]);
    const defaults = DEFAULT_ITEM_POSITIONS[itemId];
    if (defaults) return iso(defaults[0], defaults[1]);
    return iso(0.5, 0.5);
  };

  const activePlant = activeItemIds.find(id => id.startsWith('plant_'));
  const activeCat = activeItemIds.find(id => id.startsWith('cat_'));
  const activeLight = activeItemIds.find(id => id.startsWith('light_'));
  const hasRug = activeItemIds.includes('furniture_02');

  return (
    <svg viewBox="0 0 250 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mlwg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={tc.wallLeft[0]} />
          <stop offset="100%" stopColor={tc.wallLeft[1]} />
        </linearGradient>
        <linearGradient id="mrwg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={tc.wallRight[0]} />
          <stop offset="100%" stopColor={tc.wallRight[1]} />
        </linearGradient>
      </defs>

      {/* Walls */}
      <polygon points={`30,112 30,${112 - WALL_H} 125,${65 - WALL_H} 125,65`} fill="url(#mlwg)" />
      <polygon points={`125,65 125,${65 - WALL_H} 220,${112 - WALL_H} 220,112`} fill="url(#mrwg)" />
      {/* Floor */}
      <polygon points="125,65 220,112 125,160 30,112" fill={tc.floor} />
      {/* Corner */}
      <line x1="125" y1={65 - WALL_H} x2="125" y2="65" stroke={tc.corner} strokeWidth="1" />

      {/* Rug */}
      {hasRug && <ellipse cx={getPos('furniture_02')[0]} cy={getPos('furniture_02')[1]} rx="30" ry="14" fill="#B8A9C9" opacity="0.3" />}

      {/* Mini desk */}
      {(() => {
        const dFL = iso(0.3, 0.35), dFR = iso(0.65, 0.35);
        const dBR = iso(0.65, 0.6), dBL = iso(0.3, 0.6);
        const dH = 9;
        return (
          <g>
            <polygon points={`${dFL[0]},${dFL[1] - dH} ${dFR[0]},${dFR[1] - dH} ${dBR[0]},${dBR[1] - dH} ${dBL[0]},${dBL[1] - dH}`} fill="#C4956A" />
            <polygon points={`${dFL[0]},${dFL[1] - dH} ${dFL[0]},${dFL[1]} ${dFR[0]},${dFR[1]} ${dFR[0]},${dFR[1] - dH}`} fill="#A67B50" />
            <polygon points={`${dFR[0]},${dFR[1] - dH} ${dFR[0]},${dFR[1]} ${dBR[0]},${dBR[1]} ${dBR[0]},${dBR[1] - dH}`} fill="#B8875E" />
          </g>
        );
      })()}

      {/* Neon sign */}
      {activeLight && renderMiniLight(activeLight)}

      {/* Plant */}
      {activePlant && renderMiniPlant(activePlant, getPos(activePlant))}

      {/* Cat */}
      {activeCat && renderMiniCat(activeCat, getPos(activeCat))}
    </svg>
  );
}

// ===== 방 카드 컴포넌트 =====
interface RoomCardProps {
  data: PublicRoomData;
  onLike: (ownerId: string) => void;
  canLike: boolean; // 로그인 여부
}

export default function RoomCard({ data, onLike, canLike }: RoomCardProps) {
  const [liked, setLiked] = useState(data.is_liked);
  const [likeCount, setLikeCount] = useState(data.like_count);
  const [animating, setAnimating] = useState(false);

  const handleLike = () => {
    if (!canLike) return;
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : Math.max(0, prev - 1));
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
    onLike(data.profile.id);
  };

  return (
    <div className="clay bg-cream p-3 sm:p-4">
      {/* 미니 방 */}
      <div className="w-full aspect-[5/4] bg-cream-dark/30 rounded-xl overflow-hidden mb-3">
        <MiniRoom
          theme={data.room.theme as RoomTheme}
          activeItemIds={data.room.active_item_ids}
          itemPositions={data.room.item_positions}
        />
      </div>

      {/* 프로필 + 좋아요 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          {data.profile.avatar_url ? (
            <img
              src={data.profile.avatar_url}
              alt=""
              className="w-7 h-7 rounded-full flex-shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-lavender/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs">👤</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold text-lavender-dark truncate">
              {data.profile.display_name}
            </p>
            <p className="text-[10px] text-lavender-dark/50">
              🍅 {data.profile.total_pomodoros}
            </p>
          </div>
        </div>

        <button
          onClick={handleLike}
          disabled={!canLike}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs transition-all ${
            liked
              ? 'bg-coral/10 text-coral'
              : canLike
              ? 'bg-cream-dark/30 text-lavender-dark/60 hover:bg-coral/5'
              : 'bg-cream-dark/20 text-lavender-dark/30 cursor-default'
          } ${animating ? 'scale-110' : ''}`}
        >
          <span className={`transition-transform ${animating ? 'scale-125' : ''}`}>
            {liked ? '❤️' : '🤍'}
          </span>
          <span>{likeCount}</span>
        </button>
      </div>
    </div>
  );
}
