'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchUserRoom } from '@/lib/supabase/social';
import { PublicRoomData, RoomTheme } from '@/types';
import { THEME_COLORS } from '@/lib/constants';
import { DEFAULT_ITEM_POSITIONS } from '@/stores/roomStore';

// ===== 아이소메트릭 좌표 =====
function iso(u: number, v: number): [number, number] {
  return [250 + u * 190 - v * 190, 320 - u * 95 - v * 95];
}

// ===== 아이템 렌더러들 (RoomCard보다 큰 버전) =====
function renderPlant(itemId: string, pos: [number, number]) {
  const [px, py] = pos;
  if (itemId === 'plant_01') {
    return (
      <g key={itemId}>
        <rect x={px - 8} y={py - 6} width="16" height="8" rx="2" fill="#8B6F47" />
        <ellipse cx={px} cy={py - 20} rx="8" ry="14" fill="#6BBF78" />
        <circle cx={px + 2} cy={py - 32} r="3" fill="#FF6B6B" />
      </g>
    );
  }
  if (itemId === 'plant_02') {
    return (
      <g key={itemId}>
        <rect x={px - 10} y={py - 8} width="20" height="8" rx="2" fill="white" />
        <line x1={px} y1={py - 8} x2={px - 4} y2={py - 30} stroke="#4A9455" strokeWidth="3" />
        <ellipse cx={px - 10} cy={py - 30} rx="12" ry="6" fill="#5DAA68" transform={`rotate(-30 ${px - 10} ${py - 30})`} />
        <ellipse cx={px + 8} cy={py - 28} rx="10" ry="5" fill="#6BBF78" transform={`rotate(25 ${px + 8} ${py - 28})`} />
      </g>
    );
  }
  return (
    <g key={itemId}>
      <rect x={px - 8} y={py - 6} width="16" height="8" rx="2" fill="#FF8A8A" />
      <line x1={px} y1={py - 6} x2={px} y2={py - 28} stroke="#8B6F47" strokeWidth="3" />
      {[-8, 0, 8].map((ox, i) => (
        <circle key={i} cx={px + ox} cy={py - 30 - Math.abs(ox)} r="4" fill={i % 2 === 0 ? '#FFB8C6' : '#FFC8D6'} />
      ))}
    </g>
  );
}

function renderCat(itemId: string, pos: [number, number]) {
  const [cx, cy] = pos;
  const color = itemId === 'cat_02' ? '#444' : '#FFB347';
  return (
    <g key={itemId}>
      <ellipse cx={cx + 8} cy={cy} rx="12" ry="8" fill={color} />
      <circle cx={cx - 2} cy={cy - 6} r="7" fill={color} />
      <polygon points={`${cx - 8},${cy - 10} ${cx - 10},${cy - 18} ${cx - 2},${cy - 12}`} fill={color} />
      <polygon points={`${cx + 4},${cy - 10} ${cx + 6},${cy - 18} ${cx - 2},${cy - 12}`} fill={color} />
      <circle cx={cx - 5} cy={cy - 6} r="1.4" fill={itemId === 'cat_02' ? '#FFD700' : '#3D3D3D'} />
      <circle cx={cx + 1} cy={cy - 6} r="1.4" fill={itemId === 'cat_02' ? '#FFD700' : '#3D3D3D'} />
    </g>
  );
}

function renderLight(itemId: string) {
  if (itemId === 'light_03') {
    return (
      <text key={itemId} x={250} y={80} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#FF6B6B" opacity="0.8">
        FOCUS
      </text>
    );
  }
  return null;
}

// ===== 방 뷰어 =====
function RoomViewer({ data }: { data: PublicRoomData }) {
  const tc = THEME_COLORS[data.room.theme as RoomTheme] || THEME_COLORS.default;
  const WALL_H = 155;

  const getPos = (itemId: string): [number, number] => {
    const saved = data.room.item_positions[itemId];
    if (saved) return iso(saved[0], saved[1]);
    const defaults = DEFAULT_ITEM_POSITIONS[itemId];
    if (defaults) return iso(defaults[0], defaults[1]);
    return iso(0.5, 0.5);
  };

  const activePlant = data.room.active_item_ids.find(id => id.startsWith('plant_'));
  const activeCat = data.room.active_item_ids.find(id => id.startsWith('cat_'));
  const activeLight = data.room.active_item_ids.find(id => id.startsWith('light_'));
  const hasRug = data.room.active_item_ids.includes('furniture_02');

  // 책상 꼭짓점
  const dFL = iso(0.2, 0.25), dFR = iso(0.65, 0.25);
  const dBR = iso(0.65, 0.55), dBL = iso(0.2, 0.55);
  const dH = 18;

  return (
    <svg viewBox="0 0 500 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lwg" x1="0%" y1="0%" x2="100%"><stop offset="0%" stopColor={tc.wallLeft[0]} /><stop offset="100%" stopColor={tc.wallLeft[1]} /></linearGradient>
        <linearGradient id="rwg" x1="0%" y1="0%" x2="100%"><stop offset="0%" stopColor={tc.wallRight[0]} /><stop offset="100%" stopColor={tc.wallRight[1]} /></linearGradient>
      </defs>
      <polygon points={`60,225 60,${225 - WALL_H} 250,${130 - WALL_H} 250,130`} fill="url(#lwg)" />
      <polygon points={`250,130 250,${130 - WALL_H} 440,${225 - WALL_H} 440,225`} fill="url(#rwg)" />
      <polygon points="250,130 440,225 250,320 60,225" fill={tc.floor} />
      <line x1="250" y1={130 - WALL_H} x2="250" y2="130" stroke={tc.corner} strokeWidth="1.5" />

      {hasRug && <ellipse cx={getPos('furniture_02')[0]} cy={getPos('furniture_02')[1]} rx="60" ry="28" fill="#B8A9C9" opacity="0.3" />}

      <g>
        <polygon points={`${dFL[0]},${dFL[1] - dH} ${dFR[0]},${dFR[1] - dH} ${dBR[0]},${dBR[1] - dH} ${dBL[0]},${dBL[1] - dH}`} fill="#C4956A" />
        <polygon points={`${dFL[0]},${dFL[1] - dH} ${dFL[0]},${dFL[1]} ${dFR[0]},${dFR[1]} ${dFR[0]},${dFR[1] - dH}`} fill="#A67B50" />
        <polygon points={`${dFR[0]},${dFR[1] - dH} ${dFR[0]},${dFR[1]} ${dBR[0]},${dBR[1]} ${dBR[0]},${dBR[1] - dH}`} fill="#B8875E" />
      </g>

      {activeLight && renderLight(activeLight)}
      {activePlant && renderPlant(activePlant, getPos(activePlant))}
      {activeCat && renderCat(activeCat, getPos(activeCat))}
    </svg>
  );
}

export default function RoomPage() {
  const params = useParams();
  const userId = params.userId as string;
  const [data, setData] = useState<PublicRoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchUserRoom(userId)
      .then((d) => {
        if (d) setData(d);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">🍅</div>
          <p className="text-sm text-lavender-dark">로딩 중...</p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="clay bg-cream max-w-sm w-full p-6 text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h2 className="text-lg font-bold font-[family-name:var(--font-fredoka)] text-coral mb-2">
            방을 찾을 수 없어요
          </h2>
          <p className="text-sm text-lavender-dark mb-4">
            비공개 방이거나 존재하지 않는 링크예요.
          </p>
          <a
            href="/"
            className="clay-button inline-block px-6 py-3 text-sm font-bold bg-coral text-white"
          >
            Pomo Room으로 가기
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream flex flex-col items-center px-4 py-6">
      <h1 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-coral mb-4">
        🍅 Pomo Room
      </h1>

      {/* 프로필 */}
      <div className="clay bg-cream w-full max-w-md p-4 mb-4 flex items-center gap-3">
        {data.profile.avatar_url ? (
          <img src={data.profile.avatar_url} alt="" className="w-12 h-12 rounded-full" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-lavender/30 flex items-center justify-center">
            <span className="text-xl">👤</span>
          </div>
        )}
        <div>
          <h2 className="text-lg font-bold text-lavender-dark">{data.profile.display_name}</h2>
          <p className="text-xs text-lavender-dark/60">
            🍅 {data.profile.total_pomodoros} 뽀모도로 &middot; ❤️ {data.like_count}
          </p>
        </div>
      </div>

      {/* 방 */}
      <div className="w-full max-w-lg">
        <RoomViewer data={data} />
      </div>

      {/* CTA */}
      <div className="mt-6">
        <a
          href="/"
          className="clay-button inline-block px-8 py-3 text-sm font-bold bg-coral text-white"
        >
          나도 시작하기!
        </a>
      </div>
    </main>
  );
}
