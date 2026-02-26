'use client';

import { useTimerStore } from '@/stores/timerStore';
import { useRoomStore } from '@/stores/roomStore';
import { THEME_COLORS } from '@/lib/constants';
import { useEffect, useState, useRef, useCallback } from 'react';
import { RoomTheme } from '@/types';

/*
 * Isometric coordinate system:
 * Floor diamond: T(250,130) R(440,225) B(250,320) L(60,225)
 * iso(u, v): u=right axis (B→R), v=left axis (B→L)
 * Wall height: 155px
 */

function iso(u: number, v: number): [number, number] {
  return [
    250 + u * 190 - v * 190,
    320 - u * 95 - v * 95,
  ];
}

// SVG 좌표 → 아이소메트릭 (u, v) 역변환
function isoInverse(x: number, y: number): [number, number] {
  const u = ((x - 250) / 190 + (320 - y) / 95) / 2;
  const v = ((320 - y) / 95 - (x - 250) / 190) / 2;
  return [
    Math.max(0.05, Math.min(0.95, u)),
    Math.max(0.05, Math.min(0.95, v)),
  ];
}

const WALL_H = 155;

// 벽에 붙은 아이템 (드래그 불가)
const WALL_ITEMS = new Set(['light_02', 'light_03', 'furniture_01', 'furniture_03']);

function isFloorItem(id: string): boolean {
  return !WALL_ITEMS.has(id) && !id.startsWith('theme_');
}

// ===== 아이템별 SVG 렌더러 =====

function renderPlant(itemId: string, pos: [number, number]) {
  const [px, py] = pos;

  if (itemId === 'plant_01') {
    return (
      <g filter="url(#shadow)">
        <polygon points={`${px - 8},${py - 4} ${px - 6},${py + 6} ${px + 6},${py + 6} ${px + 8},${py - 4}`} fill="#A67B50" />
        <rect x={px - 9} y={py - 7} width="18" height="5" rx="2" fill="#8B6F47" />
        <ellipse cx={px} cy={py - 4} rx="7" ry="3" fill="#5C3318" />
        <ellipse cx={px} cy={py - 20} rx="7" ry="14" fill="#5DAA68" />
        <ellipse cx={px} cy={py - 20} rx="5" ry="12" fill="#6BBF78" />
        <line x1={px + 7} y1={py - 22} x2={px + 11} y2={py - 25} stroke="#4A9455" strokeWidth="1" />
        <line x1={px - 7} y1={py - 18} x2={px - 11} y2={py - 21} stroke="#4A9455" strokeWidth="1" />
        <line x1={px + 6} y1={py - 14} x2={px + 10} y2={py - 13} stroke="#4A9455" strokeWidth="1" />
        <circle cx={px + 2} cy={py - 33} r="3" fill="#FF6B6B" />
        <circle cx={px + 2} cy={py - 33} r="1.5" fill="#FFB347" />
      </g>
    );
  }

  if (itemId === 'plant_02') {
    return (
      <g filter="url(#shadow)">
        <polygon points={`${px - 9},${py - 6} ${px - 7},${py + 5} ${px + 7},${py + 5} ${px + 9},${py - 6}`} fill="white" />
        <rect x={px - 10} y={py - 9} width="20" height="5" rx="2" fill="#F0F0F0" />
        <ellipse cx={px} cy={py - 6} rx="8" ry="3" fill="#5C3318" />
        <line x1={px} y1={py - 8} x2={px - 3} y2={py - 30} stroke="#4A9455" strokeWidth="2.5" />
        <line x1={px} y1={py - 8} x2={px + 5} y2={py - 28} stroke="#4A9455" strokeWidth="2" />
        <ellipse cx={px - 10} cy={py - 30} rx="12" ry="6" fill="#5DAA68" transform={`rotate(-30 ${px - 10} ${py - 30})`} />
        <ellipse cx={px + 10} cy={py - 28} rx="11" ry="5.5" fill="#6BBF78" transform={`rotate(25 ${px + 10} ${py - 28})`} />
        <ellipse cx={px - 2} cy={py - 36} rx="9" ry="5" fill="#4A9455" transform={`rotate(-10 ${px - 2} ${py - 36})`} />
      </g>
    );
  }

  // plant_03: 벚꽃 나무
  return (
    <g filter="url(#shadow)">
      <polygon points={`${px - 8},${py - 4} ${px - 6},${py + 6} ${px + 6},${py + 6} ${px + 8},${py - 4}`} fill="#FFB0B0" />
      <rect x={px - 9} y={py - 7} width="18" height="5" rx="2" fill="#FF8A8A" />
      <ellipse cx={px} cy={py - 4} rx="7" ry="3" fill="#5C3318" />
      <line x1={px} y1={py - 6} x2={px} y2={py - 28} stroke="#8B6F47" strokeWidth="3" />
      <line x1={px} y1={py - 20} x2={px - 8} y2={py - 30} stroke="#8B6F47" strokeWidth="2" />
      <line x1={px} y1={py - 22} x2={px + 7} y2={py - 32} stroke="#8B6F47" strokeWidth="2" />
      {[-8, 0, 7, -4, 4].map((ox, i) => (
        <circle key={i} cx={px + ox} cy={py - 30 - i * 2.5 - Math.abs(ox)} r={3.5 - i * 0.2} fill={i % 2 === 0 ? '#FFB8C6' : '#FFC8D6'} opacity="0.85" />
      ))}
      <circle cx={px + 12} cy={py - 15} r="1.5" fill="#FFD0D8" opacity="0.5">
        <animate attributeName="cy" values={`${py - 20};${py};${py - 20}`} dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0;0.5" dur="4s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

function renderCat(itemId: string, pos: [number, number]) {
  const [cx, cy] = pos;
  const colors = itemId === 'cat_02'
    ? { body: '#444', head: '#444', ear: '#555', earInner: '#886666', eye: '#FFD700', paw: '#555', tail: '#444', nose: '#888' }
    : itemId === 'cat_03'
    ? { body: '#FFB347', head: '#F5F5F5', ear: '#F5F5F5', earInner: '#FFD5D5', eye: '#3D3D3D', paw: '#444', tail: '#FFB347', nose: '#FFB0B0' }
    : { body: '#FFB347', head: '#FFB347', ear: '#FFB347', earInner: '#FFD5D5', eye: '#3D3D3D', paw: '#FFC875', tail: '#FFB347', nose: '#FFB0B0' };

  return (
    <g>
      <ellipse cx={cx + 8} cy={cy + 10} rx="16" ry="5" fill="rgba(0,0,0,0.06)" />
      <ellipse cx={cx + 8} cy={cy} rx="13" ry="8" fill={colors.body} />
      {itemId === 'cat_03' && (
        <>
          <ellipse cx={cx + 3} cy={cy - 2} rx="5" ry="4" fill="#444" opacity="0.7" />
          <ellipse cx={cx + 14} cy={cy + 1} rx="4" ry="3" fill="#FFB347" opacity="0.7" />
        </>
      )}
      <circle cx={cx - 4} cy={cy - 5} r="7" fill={colors.head} />
      {itemId === 'cat_03' && <circle cx={cx - 7} cy={cy - 6} r="3.5" fill="#FFB347" opacity="0.7" />}
      <polygon points={`${cx - 9},${cy - 10} ${cx - 11},${cy - 18} ${cx - 4},${cy - 13}`} fill={colors.ear} />
      <polygon points={`${cx + 1},${cy - 10} ${cx + 3},${cy - 18} ${cx - 4},${cy - 13}`} fill={colors.ear} />
      <polygon points={`${cx - 8},${cy - 11} ${cx - 10},${cy - 16} ${cx - 5},${cy - 12}`} fill={colors.earInner} />
      <polygon points={`${cx},${cy - 11} ${cx + 2},${cy - 16} ${cx - 3},${cy - 12}`} fill={colors.earInner} />
      <ellipse cx={cx - 7} cy={cy - 5} rx="1.3" ry="1.6" fill={colors.eye}>
        <animate attributeName="ry" values="1.6;0.2;1.6" keyTimes="0;0.025;0.05" dur="5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx={cx - 1} cy={cy - 5} rx="1.3" ry="1.6" fill={colors.eye}>
        <animate attributeName="ry" values="1.6;0.2;1.6" keyTimes="0;0.025;0.05" dur="5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx={cx - 4} cy={cy - 2} rx="1" ry="0.6" fill={colors.nose} />
      <path d={`M${cx + 21},${cy - 2} C${cx + 26},${cy - 8} ${cx + 28},${cy - 14} ${cx + 25},${cy - 17}`} fill="none" stroke={colors.tail} strokeWidth="2.5" strokeLinecap="round">
        <animate attributeName="d" values={`M${cx + 21},${cy - 2} C${cx + 26},${cy - 8} ${cx + 28},${cy - 14} ${cx + 25},${cy - 17};M${cx + 21},${cy - 2} C${cx + 27},${cy - 6} ${cx + 30},${cy - 11} ${cx + 28},${cy - 14};M${cx + 21},${cy - 2} C${cx + 26},${cy - 8} ${cx + 28},${cy - 14} ${cx + 25},${cy - 17}`} dur="3s" repeatCount="indefinite" />
      </path>
      <ellipse cx={cx} cy={cy + 6} rx="3" ry="2" fill={colors.paw} />
      <ellipse cx={cx + 8} cy={cy + 6} rx="3" ry="2" fill={colors.paw} />
    </g>
  );
}

function renderLight(itemId: string, pos: [number, number], wallH: number) {
  if (itemId === 'light_01') {
    const [lx, ly] = pos;
    return (
      <g key="light" filter="url(#shadow)">
        <line x1={lx} y1={ly} x2={lx} y2={ly - 50} stroke="#FFB347" strokeWidth="2.5" />
        <ellipse cx={lx} cy={ly} rx="7" ry="3" fill="#E89A2E" />
        <polygon points={`${lx - 10},${ly - 58} ${lx + 10},${ly - 62} ${lx + 8},${ly - 48} ${lx - 8},${ly - 44}`} fill="#FFB347" opacity="0.85" />
        <ellipse cx={lx} cy={ly - 8} rx="18" ry="8" fill="#FFB347" opacity="0.06" />
      </g>
    );
  }

  if (itemId === 'light_02') {
    const bulbs: [number, number, string][] = [];
    for (let i = 0; i < 7; i++) {
      const t = 0.1 + i * 0.12;
      const x = 60 + t * 190;
      const yTop = (225 - wallH) - t * 95;
      const yBot = 225 - t * 95;
      const by = yTop + (yBot - yTop) * 0.12;
      const colors = ['#FF6B6B', '#FFB347', '#7ECEC1', '#B8A9C9', '#FF8A8A', '#FFD700', '#7FB3D8'];
      bulbs.push([x, by, colors[i]]);
    }
    return (
      <g key="light">
        <path d={`M${bulbs[0][0]},${bulbs[0][1]} ${bulbs.map(([x, y]) => `L${x},${y}`).join(' ')}`} fill="none" stroke="#666" strokeWidth="0.8" opacity="0.5" />
        {bulbs.map(([x, y, color], i) => (
          <g key={i}>
            <circle cx={x} cy={y + 4} r="3" fill={color} opacity="0.8">
              <animate attributeName="opacity" values="0.6;1;0.6" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={x} cy={y + 4} r="5" fill={color} opacity="0.1">
              <animate attributeName="r" values="5;8;5" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </g>
    );
  }

  // light_03: 네온 사인
  const t = 0.6;
  const nx = 250 + t * 190;
  const nyCeil = (130 - wallH) + t * 95;
  const nyFloor = 130 + t * 95;
  const ny = nyCeil + (nyFloor - nyCeil) * 0.18;
  return (
    <g key="light">
      <ellipse cx={nx} cy={ny + 8} rx="28" ry="14" fill="#FF6B6B" opacity="0.06">
        <animate attributeName="opacity" values="0.04;0.1;0.04" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <text x={nx} y={ny + 10} textAnchor="middle" fontSize="13" fontFamily="sans-serif" fontWeight="bold" fill="#FF6B6B" opacity="0.9">
        FOCUS
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
      </text>
    </g>
  );
}

function renderPoster(wallH: number) {
  const t1 = 0.55, t2 = 0.72;
  const x1 = 250 + t1 * 190, x2 = 250 + t2 * 190;
  const yCeil1 = (130 - wallH) + t1 * 95, yCeil2 = (130 - wallH) + t2 * 95;
  const yFloor1 = 130 + t1 * 95, yFloor2 = 130 + t2 * 95;
  const fT1 = yCeil1 + (yFloor1 - yCeil1) * 0.15;
  const fB1 = yCeil1 + (yFloor1 - yCeil1) * 0.55;
  const fT2 = yCeil2 + (yFloor2 - yCeil2) * 0.15;
  const fB2 = yCeil2 + (yFloor2 - yCeil2) * 0.55;
  const cx = (x1 + x2) / 2, cy = (fT1 + fT2 + fB1 + fB2) / 4;

  return (
    <g key="poster" filter="url(#shadow)">
      <polygon points={`${x1},${fT1} ${x2},${fT2} ${x2},${fB2} ${x1},${fB1}`} fill="#FFF5E8" />
      <polygon points={`${x1},${fT1} ${x2},${fT2} ${x2},${fB2} ${x1},${fB1}`} fill="none" stroke="#E8DDD0" strokeWidth="1.5" />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14">⭐</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="5.5" fill="#FF6B6B" fontWeight="bold">힘내!</text>
    </g>
  );
}

// ===== 러그 렌더러 =====
function renderRug(pos: [number, number]) {
  return <ellipse cx={pos[0]} cy={pos[1]} rx="62" ry="28" fill="#B8A9C9" opacity="0.3" />;
}

export default function IsometricRoom() {
  const svgRef = useRef<SVGSVGElement>(null);
  const status = useTimerStore((s) => s.status);
  const activeItemIds = useRoomStore((s) => s.activeItemIds);
  const theme = useRoomStore((s) => s.theme) as RoomTheme;
  const itemPositions = useRoomStore((s) => s.itemPositions);
  const setItemPosition = useRoomStore((s) => s.setItemPosition);
  const [mounted, setMounted] = useState(false);

  // 드래그 상태
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<[number, number] | null>(null);
  const dragStartRef = useRef<{ itemId: string; startU: number; startV: number; startSvgX: number; startSvgY: number } | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // SVG 좌표 변환
  const getSvgPoint = useCallback((clientX: number, clientY: number): [number, number] => {
    const svg = svgRef.current;
    if (!svg) return [0, 0];
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return [0, 0];
    const svgP = pt.matrixTransform(ctm.inverse());
    return [svgP.x, svgP.y];
  }, []);

  // 아이템 위치 가져오기
  const getPos = useCallback((itemId: string): [number, number] => {
    const saved = itemPositions[itemId];
    if (saved) return saved;
    const defaults: Record<string, [number, number]> = {
      plant_01: [0.78, 0.7], plant_02: [0.78, 0.7], plant_03: [0.78, 0.7],
      cat_01: [0.2, 0.18], cat_02: [0.2, 0.18], cat_03: [0.2, 0.18],
      light_01: [0.15, 0.55], furniture_02: [0.5, 0.45],
    };
    return defaults[itemId] || [0.5, 0.5];
  }, [itemPositions]);

  // 드래그 시작
  const handleDragStart = useCallback((itemId: string, e: React.MouseEvent | React.TouchEvent) => {
    if (!isFloorItem(itemId)) return;
    e.preventDefault();
    e.stopPropagation();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const [svgX, svgY] = getSvgPoint(clientX, clientY);
    const [u, v] = getPos(itemId);

    dragStartRef.current = { itemId, startU: u, startV: v, startSvgX: svgX, startSvgY: svgY };
    setDragging(itemId);
    setDragPos(iso(u, v));
  }, [getSvgPoint, getPos]);

  // 드래그 중
  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging || !dragStartRef.current) return;
    e.preventDefault();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const [svgX, svgY] = getSvgPoint(clientX, clientY);

    const dx = svgX - dragStartRef.current.startSvgX;
    const dy = svgY - dragStartRef.current.startSvgY;
    const [origX, origY] = iso(dragStartRef.current.startU, dragStartRef.current.startV);
    setDragPos([origX + dx, origY + dy]);
  }, [dragging, getSvgPoint]);

  // 드래그 끝
  const handleDragEnd = useCallback(() => {
    if (!dragging || !dragPos || !dragStartRef.current) {
      setDragging(null);
      setDragPos(null);
      dragStartRef.current = null;
      return;
    }

    const [u, v] = isoInverse(dragPos[0], dragPos[1]);
    setItemPosition(dragging, u, v);
    setDragging(null);
    setDragPos(null);
    dragStartRef.current = null;
  }, [dragging, dragPos, setItemPosition]);

  // 아이템별 활성 ID
  const activePlant = activeItemIds.find(id => id.startsWith('plant_'));
  const activeCat = activeItemIds.find(id => id.startsWith('cat_'));
  const activeLight = activeItemIds.find(id => id.startsWith('light_'));
  const hasBookshelf = activeItemIds.includes('furniture_01');
  const hasRug = activeItemIds.includes('furniture_02');
  const hasPoster = activeItemIds.includes('furniture_03');

  const tc = THEME_COLORS[theme] || THEME_COLORS.default;

  const hour = new Date().getHours();
  const isNight = hour >= 21 || hour < 6;
  const isEvening = hour >= 17 && hour < 21;
  const windowFill = isNight ? '#2C3E6B' : isEvening ? '#FFD0A0' : '#AED8F0';

  const bubbleText = status === 'idle' ? '💤 zzZ...'
    : status === 'focus' ? '🔥 집중!'
    : (status === 'short_break' || status === 'long_break') ? '☕ 쉬는중~'
    : '🎉 완료!';

  if (!mounted) return <div style={{ width: 500, height: 400 }} />;

  const deskFL = iso(0.3, 0.35);
  const deskFR = iso(0.65, 0.35);
  const deskBR = iso(0.65, 0.6);
  const deskBL = iso(0.3, 0.6);
  const deskH = 18;
  const charFeet = iso(0.42, 0.22);

  // 드래그 중인 아이템의 화면 좌표
  const getDragOrStoredPos = (itemId: string): [number, number] => {
    if (dragging === itemId && dragPos) return dragPos;
    const [u, v] = getPos(itemId);
    return iso(u, v);
  };

  // 드래그 가능 아이템 래퍼
  const DraggableItem = ({ itemId, children }: { itemId: string; children: React.ReactNode }) => {
    const isDragging = dragging === itemId;
    return (
      <g
        onMouseDown={(e) => handleDragStart(itemId, e)}
        onTouchStart={(e) => handleDragStart(itemId, e)}
        style={{ cursor: isFloorItem(itemId) ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        opacity={isDragging ? 0.7 : 1}
      >
        {children}
        {/* 드래그 중 힌트 원 */}
        {isDragging && dragPos && (
          <circle cx={dragPos[0]} cy={dragPos[1]} r="20" fill="rgba(126,206,193,0.15)" stroke="#7ECEC1" strokeWidth="1" strokeDasharray="4 2" />
        )}
      </g>
    );
  };

  return (
    <div className="room-container" style={{ width: 500, height: 400 }}>
      <svg
        ref={svgRef}
        viewBox="0 0 500 400"
        width="500"
        height="400"
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <defs>
          <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="1" dy="2" stdDeviation="2.5" floodOpacity="0.12" />
          </filter>
          <linearGradient id="leftWallGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={tc.wallLeft[0]} />
            <stop offset="100%" stopColor={tc.wallLeft[1]} />
          </linearGradient>
          <linearGradient id="rightWallGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={tc.wallRight[0]} />
            <stop offset="100%" stopColor={tc.wallRight[1]} />
          </linearGradient>
        </defs>

        {/* ========== ROOM SHELL ========== */}
        <polygon points={`60,225 60,${225 - WALL_H} 250,${130 - WALL_H} 250,130`} fill="url(#leftWallGrad)" />
        <polygon points="60,225 60,218 250,123 250,130" fill={tc.baseboard[0]} />
        <polygon points={`250,130 250,${130 - WALL_H} 440,${225 - WALL_H} 440,225`} fill="url(#rightWallGrad)" />
        <polygon points="250,123 250,130 440,225 440,218" fill={tc.baseboard[1]} />
        <polygon points="250,130 440,225 250,320 60,225" fill={tc.floor} />

        {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((t, i) => {
          const [x1, y1] = iso(t, 0);
          const [x2, y2] = iso(t, 1);
          return <line key={`fg${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={tc.floorGrain} strokeWidth="0.6" opacity="0.35" />;
        })}
        {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
          const [x1, y1] = iso(0, t);
          const [x2, y2] = iso(1, t);
          return <line key={`fg2${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={tc.floorGrain} strokeWidth="0.4" opacity="0.2" />;
        })}

        {theme === 'space' && [
          [90, 90], [130, 60], [180, 45], [320, 50], [370, 75], [410, 100],
          [100, 140], [150, 100], [200, 55], [300, 30], [350, 55], [400, 130],
        ].map(([sx, sy], i) => (
          <circle key={`star${i}`} cx={sx} cy={sy} r={0.5 + (i % 3) * 0.3} fill="white" opacity={0.3 + (i % 4) * 0.15}>
            <animate attributeName="opacity" values={`${0.2 + (i % 3) * 0.1};${0.6 + (i % 2) * 0.2};${0.2 + (i % 3) * 0.1}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}

        <line x1="250" y1={130 - WALL_H} x2="250" y2="130" stroke={tc.corner} strokeWidth="1.5" />
        <line x1="60" y1={225 - WALL_H} x2="60" y2="225" stroke={tc.corner} strokeWidth="1" />
        <line x1="440" y1={225 - WALL_H} x2="440" y2="225" stroke={tc.corner} strokeWidth="1" />

        {/* ========== WINDOW ========== */}
        {(() => {
          const t1 = 0.22, t2 = 0.62;
          const wx1 = 60 + t1 * 190, wx2 = 60 + t2 * 190;
          const wBot1 = 225 - t1 * 95, wBot2 = 225 - t2 * 95;
          const wTop1 = (225 - WALL_H) - t1 * 95, wTop2 = (225 - WALL_H) - t2 * 95;
          const winTop1 = wTop1 + (wBot1 - wTop1) * 0.22;
          const winBot1 = wTop1 + (wBot1 - wTop1) * 0.72;
          const winTop2 = wTop2 + (wBot2 - wTop2) * 0.22;
          const winBot2 = wTop2 + (wBot2 - wTop2) * 0.72;
          return (
            <g>
              <polygon points={`${wx1},${winTop1} ${wx2},${winTop2} ${wx2},${winBot2} ${wx1},${winBot1}`} fill={windowFill} stroke="#A08060" strokeWidth="3" />
              <line x1={(wx1 + wx2) / 2} y1={(winTop1 + winTop2) / 2} x2={(wx1 + wx2) / 2} y2={(winBot1 + winBot2) / 2} stroke="#A08060" strokeWidth="2" />
              <line x1={wx1} y1={(winTop1 + winBot1) / 2} x2={wx2} y2={(winTop2 + winBot2) / 2} stroke="#A08060" strokeWidth="2" />
              <polygon points={`${wx1 + 2},${winTop1 + 2} ${wx1 + 16},${winTop1 + (winTop2 - winTop1) * 0.18 + 2} ${wx1 + 16},${winBot1 + (winBot2 - winBot1) * 0.18 - 2} ${wx1 + 2},${winBot1 - 2}`} fill="white" opacity="0.4" />
              <polygon points={`${wx1 - 3},${winBot1} ${wx1 - 3},${winBot1 + 5} ${wx2 + 3},${winBot2 + 5} ${wx2 + 3},${winBot2}`} fill="#8B7050" />
              {isNight ? (
                <>
                  <circle cx={wx2 - 15} cy={winTop2 + 12} r="4" fill="#E8E8E8" opacity="0.7" />
                  <circle cx={wx1 + 20} cy={winTop1 + 10} r="1" fill="white" opacity="0.5" />
                </>
              ) : (
                <circle cx={wx2 - 18} cy={winTop2 + 14} r="5" fill={isEvening ? '#FF8C42' : '#FFD700'} opacity="0.5" />
              )}
            </g>
          );
        })()}

        {/* ========== PICTURE FRAME ========== */}
        {(() => {
          const t1 = 0.25, t2 = 0.45;
          const x1 = 250 + t1 * 190, x2 = 250 + t2 * 190;
          const yCeil1 = (130 - WALL_H) + t1 * 95, yCeil2 = (130 - WALL_H) + t2 * 95;
          const yFloor1 = 130 + t1 * 95, yFloor2 = 130 + t2 * 95;
          const fT1 = yCeil1 + (yFloor1 - yCeil1) * 0.22, fB1 = yCeil1 + (yFloor1 - yCeil1) * 0.52;
          const fT2 = yCeil2 + (yFloor2 - yCeil2) * 0.22, fB2 = yCeil2 + (yFloor2 - yCeil2) * 0.52;
          const cx = (x1 + x2) / 2, cy = (fT1 + fT2 + fB1 + fB2) / 4;
          return (
            <g filter="url(#shadow)">
              <polygon points={`${x1},${fT1} ${x2},${fT2} ${x2},${fB2} ${x1},${fB1}`} fill="#C4956A" />
              <polygon points={`${x1 + 3},${fT1 + 2.5} ${x2 - 3},${fT2 + 2.5} ${x2 - 3},${fB2 - 2.5} ${x1 + 3},${fB1 - 2.5}`} fill="#FFE8D0" />
              <circle cx={cx - 3} cy={cy - 3} r="5" fill="#FF6B6B" opacity="0.3" />
              <circle cx={cx + 5} cy={cy + 2} r="4" fill="#7ECEC1" opacity="0.3" />
            </g>
          );
        })()}

        {/* ========== POSTER ========== */}
        {hasPoster && renderPoster(WALL_H)}

        {/* ========== WALL LIGHTS ========== */}
        {activeLight && WALL_ITEMS.has(activeLight) && renderLight(activeLight, [0, 0], WALL_H)}

        {/* ========== RUG (draggable) ========== */}
        {hasRug && (
          <DraggableItem itemId="furniture_02">
            {renderRug(getDragOrStoredPos('furniture_02'))}
          </DraggableItem>
        )}

        {/* ========== DESK ========== */}
        <g filter="url(#shadow)">
          <polygon points={`${deskFL[0]},${deskFL[1] - deskH} ${deskFR[0]},${deskFR[1] - deskH} ${deskBR[0]},${deskBR[1] - deskH} ${deskBL[0]},${deskBL[1] - deskH}`} fill="#C4956A" />
          <polygon points={`${deskFL[0]},${deskFL[1] - deskH} ${deskFL[0]},${deskFL[1]} ${deskFR[0]},${deskFR[1]} ${deskFR[0]},${deskFR[1] - deskH}`} fill="#A67B50" />
          <polygon points={`${deskFR[0]},${deskFR[1] - deskH} ${deskFR[0]},${deskFR[1]} ${deskBR[0]},${deskBR[1]} ${deskBR[0]},${deskBR[1] - deskH}`} fill="#B8875E" />
          <line x1={deskFL[0] + 5} y1={deskFL[1]} x2={deskFL[0] + 5} y2={deskFL[1] + 14} stroke="#8B6F47" strokeWidth="3.5" strokeLinecap="round" />
          <line x1={deskFR[0] - 5} y1={deskFR[1]} x2={deskFR[0] - 5} y2={deskFR[1] + 14} stroke="#8B6F47" strokeWidth="3.5" strokeLinecap="round" />
          <line x1={deskBR[0] - 3} y1={deskBR[1]} x2={deskBR[0] - 3} y2={deskBR[1] + 14} stroke="#8B6F47" strokeWidth="3.5" strokeLinecap="round" />
          <line x1={deskBL[0] + 3} y1={deskBL[1]} x2={deskBL[0] + 3} y2={deskBL[1] + 14} stroke="#8B6F47" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        </g>

        {/* ========== MONITOR ========== */}
        {(() => {
          const monBase = iso(0.52, 0.52);
          const monX = monBase[0], monBaseY = monBase[1] - deskH;
          const monW = 35, monH = 28;
          return (
            <g filter="url(#shadow)">
              <polygon points={`${monX - monW / 2},${monBaseY - monH} ${monX + monW / 2 + 8},${monBaseY - monH - 4} ${monX + monW / 2 + 8},${monBaseY - 2} ${monX - monW / 2},${monBaseY + 2}`} fill="#333" />
              <polygon points={`${monX - monW / 2 + 2},${monBaseY - monH + 2} ${monX + monW / 2 + 6},${monBaseY - monH - 2} ${monX + monW / 2 + 6},${monBaseY - 4} ${monX - monW / 2 + 2},${monBaseY}`} fill="#1a2744" />
              <line x1={monX - 12} y1={monBaseY - monH + 8} x2={monX + 12} y2={monBaseY - monH + 5} stroke="#7ECEC1" strokeWidth="1.5" opacity="0.5" />
              <line x1={monX - 12} y1={monBaseY - monH + 14} x2={monX + 6} y2={monBaseY - monH + 11} stroke="#FF6B6B" strokeWidth="1.5" opacity="0.4" />
              <line x1={monX - 12} y1={monBaseY - monH + 20} x2={monX + 10} y2={monBaseY - monH + 17} stroke="#B8A9C9" strokeWidth="1.5" opacity="0.4" />
              {status === 'focus' && (
                <polygon points={`${monX - monW / 2 + 2},${monBaseY - monH + 2} ${monX + monW / 2 + 6},${monBaseY - monH - 2} ${monX + monW / 2 + 6},${monBaseY - 4} ${monX - monW / 2 + 2},${monBaseY}`} fill="rgba(100,180,255,0.06)">
                  <animate attributeName="opacity" values="0.03;0.12;0.03" dur="2s" repeatCount="indefinite" />
                </polygon>
              )}
              <line x1={monX + 4} y1={monBaseY + 2} x2={monX + 4} y2={monBaseY + 8} stroke="#444" strokeWidth="3" />
              <ellipse cx={monX + 4} cy={monBaseY + 9} rx="10" ry="3" fill="#444" />
            </g>
          );
        })()}

        {/* Coffee mug */}
        {(() => {
          const mugPos = iso(0.35, 0.42);
          const mx = mugPos[0], my = mugPos[1] - deskH;
          return (
            <g>
              <ellipse cx={mx} cy={my - 8} rx="5" ry="2.5" fill="white" />
              <rect x={mx - 5} y={my - 8} width="10" height="9" rx="1.5" fill="white" stroke="#EEE" strokeWidth="0.5" />
              <ellipse cx={mx} cy={my + 1} rx="5" ry="2.5" fill="#F0F0F0" />
              <path d={`M${mx + 5},${my - 5} C${mx + 9},${my - 5} ${mx + 9},${my} ${mx + 5},${my}`} fill="none" stroke="#DDD" strokeWidth="1" />
              <path d={`M${mx - 1},${my - 11} C${mx - 2},${my - 15} ${mx},${my - 17} ${mx - 1},${my - 21}`} fill="none" stroke="#CCC" strokeWidth="0.8" opacity="0.4">
                <animate attributeName="d" values={`M${mx - 1},${my - 11} C${mx - 2},${my - 15} ${mx},${my - 17} ${mx - 1},${my - 21};M${mx - 1},${my - 11} C${mx},${my - 14} ${mx - 2},${my - 16} ${mx},${my - 20};M${mx - 1},${my - 11} C${mx - 2},${my - 15} ${mx},${my - 17} ${mx - 1},${my - 21}`} dur="3s" repeatCount="indefinite" />
              </path>
            </g>
          );
        })()}

        {/* ========== BOOKSHELF ========== */}
        {hasBookshelf && (() => {
          const bx = 365, by = 140;
          return (
            <g filter="url(#shadow)">
              <rect x={bx} y={by} width="35" height="68" rx="1" fill="#C4956A" />
              <polygon points={`${bx + 35},${by} ${bx + 55},${by - 10} ${bx + 55},${by + 58} ${bx + 35},${by + 68}`} fill="#A67B50" />
              <polygon points={`${bx},${by} ${bx + 35},${by} ${bx + 55},${by - 10} ${bx + 20},${by - 10}`} fill="#D4A574" />
              <line x1={bx + 1} y1={by + 33} x2={bx + 34} y2={by + 33} stroke="#A67B50" strokeWidth="1.5" />
              <rect x={bx + 3} y={by + 5} width="5" height="24" rx="1" fill="#FF6B6B" />
              <rect x={bx + 9} y={by + 7} width="5" height="22" rx="1" fill="#7ECEC1" />
              <rect x={bx + 15} y={by + 4} width="4" height="25" rx="1" fill="#B8A9C9" />
              <rect x={bx + 20} y={by + 8} width="5" height="21" rx="1" fill="#FFB347" />
              <rect x={bx + 26} y={by + 6} width="5" height="23" rx="1" fill="#7FB3D8" />
              <rect x={bx + 3} y={by + 38} width="5" height="24" rx="1" fill="#9A87B3" />
              <rect x={bx + 9} y={by + 40} width="5" height="22" rx="1" fill="#E85555" />
              <rect x={bx + 15} y={by + 37} width="5" height="25" rx="1" fill="#5BB8A8" />
              <rect x={bx + 21} y={by + 39} width="5" height="23" rx="1" fill="#FFC875" />
              <rect x={bx + 27} y={by + 41} width="5" height="21" rx="1" fill="#D0C4DD" />
            </g>
          );
        })()}

        {/* ========== FLOOR LAMP (draggable) ========== */}
        {activeLight === 'light_01' && (
          <DraggableItem itemId="light_01">
            {renderLight('light_01', getDragOrStoredPos('light_01'), WALL_H)}
          </DraggableItem>
        )}

        {/* ========== PLANT (draggable) ========== */}
        {activePlant && (
          <DraggableItem itemId={activePlant}>
            {renderPlant(activePlant, getDragOrStoredPos(activePlant))}
          </DraggableItem>
        )}

        {/* ========== CAT (draggable) ========== */}
        {activeCat && (
          <DraggableItem itemId={activeCat}>
            {renderCat(activeCat, getDragOrStoredPos(activeCat))}
          </DraggableItem>
        )}

        {/* ========== CHARACTER ========== */}
        <g>
          {status === 'idle' && (
            <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="3s" repeatCount="indefinite" />
          )}
          {status === 'focus' && (
            <animateTransform attributeName="transform" type="translate" values="0,0;0,-1;0,0;0,-1;0,0" dur="0.8s" repeatCount="indefinite" />
          )}
          {(status === 'short_break' || status === 'long_break') && (
            <animateTransform attributeName="transform" type="translate" values="0,0;0,-4;0,0" dur="3s" repeatCount="indefinite" />
          )}
          {status === 'complete' && (
            <animateTransform attributeName="transform" type="translate" values="0,0;0,-14;0,-6;0,0" dur="1s" repeatCount="indefinite" />
          )}

          <ellipse cx={charFeet[0]} cy={charFeet[1] + 2} rx="14" ry="5" fill="rgba(0,0,0,0.08)" />
          <rect x={charFeet[0] - 28} y={charFeet[1] - 88} width="56" height="18" rx="9" fill="white" filter="url(#shadow)" />
          <polygon points={`${charFeet[0] - 3},${charFeet[1] - 70} ${charFeet[0]},${charFeet[1] - 66} ${charFeet[0] + 3},${charFeet[1] - 70}`} fill="white" />
          <text x={charFeet[0]} y={charFeet[1] - 76} textAnchor="middle" fontSize="9.5" fontFamily="sans-serif">{bubbleText}</text>

          <rect x={charFeet[0] - 9} y={charFeet[1] - 16} width="8" height="14" rx="3" fill="#6B8FAD" />
          <rect x={charFeet[0] + 1} y={charFeet[1] - 16} width="8" height="14" rx="3" fill="#5E7F9C" />
          <rect x={charFeet[0] - 10} y={charFeet[1] - 3} width="10" height="5" rx="2.5" fill="#FF6B6B" />
          <rect x={charFeet[0] + 1} y={charFeet[1] - 3} width="10" height="5" rx="2.5" fill="#E85555" />

          <rect x={charFeet[0] - 12} y={charFeet[1] - 42} width="24" height="28" rx="5" fill={
            status === 'focus' ? '#7ECEC1' :
            status === 'short_break' || status === 'long_break' ? '#FFB347' :
            status === 'complete' ? '#FF8A8A' : '#B8A9C9'
          } />

          {status === 'focus' ? (
            <>
              <rect x={charFeet[0] - 18} y={charFeet[1] - 38} width="7" height="20" rx="3.5" fill="#FFD5C2" transform={`rotate(15 ${charFeet[0] - 14} ${charFeet[1] - 38})`} />
              <rect x={charFeet[0] + 11} y={charFeet[1] - 38} width="7" height="20" rx="3.5" fill="#FFD5C2" transform={`rotate(-15 ${charFeet[0] + 14} ${charFeet[1] - 38})`} />
            </>
          ) : status === 'complete' ? (
            <>
              <rect x={charFeet[0] - 19} y={charFeet[1] - 52} width="7" height="20" rx="3.5" fill="#FFD5C2" transform={`rotate(35 ${charFeet[0] - 16} ${charFeet[1] - 32})`} />
              <rect x={charFeet[0] + 12} y={charFeet[1] - 52} width="7" height="20" rx="3.5" fill="#FFD5C2" transform={`rotate(-35 ${charFeet[0] + 16} ${charFeet[1] - 32})`} />
            </>
          ) : (
            <>
              <rect x={charFeet[0] - 17} y={charFeet[1] - 38} width="7" height="20" rx="3.5" fill="#FFD5C2" />
              <rect x={charFeet[0] + 10} y={charFeet[1] - 38} width="7" height="20" rx="3.5" fill="#FFD5C2" />
            </>
          )}

          <g>
            <ellipse cx={charFeet[0]} cy={charFeet[1] - 56} rx="14" ry="13" fill="#8B6F47" />
            <ellipse cx={charFeet[0]} cy={charFeet[1] - 53} rx="13" ry="12" fill="#FFD5C2" />
            <ellipse cx={charFeet[0]} cy={charFeet[1] - 63} rx="13" ry="7" fill="#8B6F47" />
            <ellipse cx={charFeet[0] - 5} cy={charFeet[1] - 58} rx="4" ry="5" fill="#8B6F47" transform={`rotate(-8 ${charFeet[0] - 5} ${charFeet[1] - 58})`} />

            {status === 'idle' ? (
              <>
                <line x1={charFeet[0] - 7} y1={charFeet[1] - 52} x2={charFeet[0] - 2} y2={charFeet[1] - 52} stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" />
                <line x1={charFeet[0] + 2} y1={charFeet[1] - 52} x2={charFeet[0] + 7} y2={charFeet[1] - 52} stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" />
              </>
            ) : (status === 'short_break' || status === 'long_break' || status === 'complete') ? (
              <>
                <path d={`M${charFeet[0] - 7},${charFeet[1] - 51} Q${charFeet[0] - 4.5},${charFeet[1] - 54} ${charFeet[0] - 2},${charFeet[1] - 51}`} fill="none" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" />
                <path d={`M${charFeet[0] + 2},${charFeet[1] - 51} Q${charFeet[0] + 4.5},${charFeet[1] - 54} ${charFeet[0] + 7},${charFeet[1] - 51}`} fill="none" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx={charFeet[0] - 4.5} cy={charFeet[1] - 52} r="2.5" fill="#3D3D3D" />
                <circle cx={charFeet[0] + 4.5} cy={charFeet[1] - 52} r="2.5" fill="#3D3D3D" />
                <circle cx={charFeet[0] - 3.8} cy={charFeet[1] - 52.5} r="0.8" fill="white" />
                <circle cx={charFeet[0] + 5.2} cy={charFeet[1] - 52.5} r="0.8" fill="white" />
              </>
            )}

            {status === 'idle' ? (
              <ellipse cx={charFeet[0]} cy={charFeet[1] - 46} rx="2.5" ry="2" fill="#FF9999">
                <animate attributeName="ry" values="2;3;2" dur="4s" repeatCount="indefinite" />
              </ellipse>
            ) : (status === 'short_break' || status === 'long_break' || status === 'complete') ? (
              <path d={`M${charFeet[0] - 4},${charFeet[1] - 47} Q${charFeet[0]},${charFeet[1] - 43} ${charFeet[0] + 4},${charFeet[1] - 47}`} fill="none" stroke="#CC8888" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <line x1={charFeet[0] - 3} y1={charFeet[1] - 46} x2={charFeet[0] + 3} y2={charFeet[1] - 46} stroke="#CC8888" strokeWidth="1.5" strokeLinecap="round" />
            )}

            <ellipse cx={charFeet[0] - 9} cy={charFeet[1] - 49} rx="3" ry="1.5" fill="#FFB0B0" opacity="0.35" />
            <ellipse cx={charFeet[0] + 9} cy={charFeet[1] - 49} rx="3" ry="1.5" fill="#FFB0B0" opacity="0.35" />
          </g>

          {status === 'complete' && (
            <>
              <text x={charFeet[0] - 18} y={charFeet[1] - 80} fontSize="12" opacity="0.8">
                ⭐<animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
              </text>
              <text x={charFeet[0] + 14} y={charFeet[1] - 75} fontSize="10" opacity="0.8">
                💖<animate attributeName="opacity" values="0;1;0" dur="1.2s" repeatCount="indefinite" begin="0.3s" />
              </text>
              <text x={charFeet[0] + 5} y={charFeet[1] - 92} fontSize="11" opacity="0.8">
                🎉<animate attributeName="opacity" values="0;1;0" dur="1.4s" repeatCount="indefinite" begin="0.6s" />
              </text>
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
