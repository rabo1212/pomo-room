'use client';

import { useTimerStore } from '@/stores/timerStore';
import { useRoomStore, DEFAULT_ITEM_POSITIONS } from '@/stores/roomStore';
import { THEME_COLORS } from '@/lib/constants';
import { memo, useEffect, useState, useRef, useCallback } from 'react';
import { RoomTheme } from '@/types';
import { iso, isoInverse, isFloorItem, WALL_ITEMS } from './renderers';
import { renderPlant } from './renderers/plants';
import { renderPet } from './renderers/pets';
import { renderLight } from './renderers/lighting';
import { renderFurniture } from './renderers/furniture';
import { renderElectronics } from './renderers/electronics';
import { renderDecor } from './renderers/decor';

const WALL_H = 155;

export default memo(function IsometricRoom() {
  const svgRef = useRef<SVGSVGElement>(null);
  const status = useTimerStore((s) => s.status);
  const activeItemIds = useRoomStore((s) => s.activeItemIds);
  const theme = useRoomStore((s) => s.theme) as RoomTheme;
  const itemPositions = useRoomStore((s) => s.itemPositions);
  const setItemPosition = useRoomStore((s) => s.setItemPosition);
  const [mounted, setMounted] = useState(false);

  const [dragging, setDragging] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<[number, number] | null>(null);
  const dragStartRef = useRef<{ itemId: string; startU: number; startV: number; startSvgX: number; startSvgY: number } | null>(null);

  useEffect(() => { setMounted(true); }, []);

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

  const getPos = useCallback((itemId: string): [number, number] => {
    const saved = itemPositions[itemId];
    if (saved) return saved;
    return DEFAULT_ITEM_POSITIONS[itemId] || [0.5, 0.5];
  }, [itemPositions]);

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

  const getDragOrStoredPos = (itemId: string): [number, number] => {
    if (dragging === itemId && dragPos) return dragPos;
    const [u, v] = getPos(itemId);
    return iso(u, v);
  };

  // 아이템 렌더 함수 — 카테고리별 렌더러 라우팅
  const renderItem = (itemId: string, pos: [number, number]) => {
    if (itemId.startsWith('plant_')) return renderPlant(itemId, pos);
    if (itemId.startsWith('cat_') || itemId.startsWith('pet_')) return renderPet(itemId, pos);
    if (itemId.startsWith('light_')) return renderLight(itemId, pos, WALL_H);
    if (itemId.startsWith('furniture_')) return renderFurniture(itemId, pos, WALL_H);
    if (itemId.startsWith('electronics_')) return renderElectronics(itemId, pos);
    if (itemId.startsWith('decor_')) return renderDecor(itemId, pos, WALL_H);
    return null;
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
        {isDragging && dragPos && (
          <circle cx={dragPos[0]} cy={dragPos[1]} r="20" fill="rgba(126,206,193,0.15)" stroke="#7ECEC1" strokeWidth="1" strokeDasharray="4 2" />
        )}
      </g>
    );
  };

  // 활성 아이템 분류
  const wallItems = activeItemIds.filter(id => WALL_ITEMS.has(id));
  const floorItems = activeItemIds.filter(id => isFloorItem(id));

  // 바닥 아이템 깊이 정렬 (u+v 큰 것 = 뒤, 작은 것 = 앞 → 먼저 렌더)
  const sortedFloorItems = [...floorItems].sort((a, b) => {
    const [au, av] = getPos(a);
    const [bu, bv] = getPos(b);
    return (au + av) - (bu + bv);
  });

  // 데스크/모니터/캐릭터의 깊이
  const deskDepth = 0.3 + 0.35; // desk u=0.3~0.65, v=0.35~0.6 → 가장 앞면 u=0.3, v=0.35

  return (
    <div className="room-container" style={{ width: 500, height: 400 }}>
      <svg
        ref={svgRef}
        viewBox="0 0 500 400"
        width="500"
        height="400"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="아이소메트릭 방. 아이템을 드래그하여 배치할 수 있습니다"
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
          <filter id="softShadow" x="-20%" y="-20%" width="150%" height="150%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="2" dy="3" />
            <feComponentTransfer><feFuncA type="linear" slope="0.1" /></feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="leftWallGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={tc.wallLeft[0]} />
            <stop offset="100%" stopColor={tc.wallLeft[1]} />
          </linearGradient>
          <linearGradient id="rightWallGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={tc.wallRight[0]} />
            <stop offset="100%" stopColor={tc.wallRight[1]} />
          </linearGradient>
          <linearGradient id="mirrorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#B0D8E8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="white" stopOpacity="0.1" />
          </linearGradient>
          {/* 바닥 타일 패턴 */}
          <pattern id="floorTile" width="38" height="19" patternUnits="userSpaceOnUse" patternTransform="skewY(-26.57) scale(1,0.5)">
            <rect width="38" height="19" fill="transparent" />
            <rect x="0" y="0" width="18" height="18" rx="1" fill="rgba(0,0,0,0.015)" />
            <rect x="19" y="0" width="18" height="18" rx="1" fill="rgba(255,255,255,0.02)" />
          </pattern>
          {/* 앰비언트 글로우 */}
          <radialGradient id="ambientGlow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#FFB347" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#FFB347" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ========== ROOM SHELL ========== */}
        {/* 왼쪽 벽 */}
        <polygon points={`60,225 60,${225 - WALL_H} 250,${130 - WALL_H} 250,130`} fill="url(#leftWallGrad)" />
        {/* 왼쪽 벽 패널 라인 */}
        {[0.25, 0.5, 0.75].map((t, i) => {
          const x = 60 + t * 190;
          const yTop = (225 - WALL_H) - t * 95;
          const yBot = 225 - t * 95;
          return <line key={`wl${i}`} x1={x} y1={yTop} x2={x} y2={yBot} stroke="rgba(0,0,0,0.03)" strokeWidth="0.5" />;
        })}
        <polygon points="60,225 60,218 250,123 250,130" fill={tc.baseboard[0]} />

        {/* 오른쪽 벽 */}
        <polygon points={`250,130 250,${130 - WALL_H} 440,${225 - WALL_H} 440,225`} fill="url(#rightWallGrad)" />
        {/* 오른쪽 벽 패널 라인 */}
        {[0.25, 0.5, 0.75].map((t, i) => {
          const x = 250 + t * 190;
          const yTop = (130 - WALL_H) + t * 95;
          const yBot = 130 + t * 95;
          return <line key={`wr${i}`} x1={x} y1={yTop} x2={x} y2={yBot} stroke="rgba(0,0,0,0.03)" strokeWidth="0.5" />;
        })}
        <polygon points="250,123 250,130 440,225 440,218" fill={tc.baseboard[1]} />

        {/* 바닥 */}
        <polygon points="250,130 440,225 250,320 60,225" fill={tc.floor} />
        {/* 바닥 타일 오버레이 */}
        <polygon points="250,130 440,225 250,320 60,225" fill="url(#floorTile)" opacity="0.5" />
        {/* 바닥 그레인 라인 */}
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

        {/* 우주 테마 별 */}
        {theme === 'space' && [
          [90, 90], [130, 60], [180, 45], [320, 50], [370, 75], [410, 100],
          [100, 140], [150, 100], [200, 55], [300, 30], [350, 55], [400, 130],
        ].map(([sx, sy], i) => (
          <circle key={`star${i}`} cx={sx} cy={sy} r={0.5 + (i % 3) * 0.3} fill="white" opacity={0.3 + (i % 4) * 0.15}>
            <animate attributeName="opacity" values={`${0.2 + (i % 3) * 0.1};${0.6 + (i % 2) * 0.2};${0.2 + (i % 3) * 0.1}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* 코너 라인 */}
        <line x1="250" y1={130 - WALL_H} x2="250" y2="130" stroke={tc.corner} strokeWidth="1.5" />
        <line x1="60" y1={225 - WALL_H} x2="60" y2="225" stroke={tc.corner} strokeWidth="1" />
        <line x1="440" y1={225 - WALL_H} x2="440" y2="225" stroke={tc.corner} strokeWidth="1" />

        {/* 앰비언트 글로우 */}
        <rect x="0" y="0" width="500" height="400" fill="url(#ambientGlow)" />

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

        {/* ========== PICTURE FRAME (고정 장식) ========== */}
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

        {/* ========== WALL ITEMS (드래그 불가) ========== */}
        {wallItems.map(itemId => (
          <g key={itemId}>{renderItem(itemId, [0, 0])}</g>
        ))}

        {/* ========== FLOOR ITEMS (깊이 정렬, 데스크 뒤) ========== */}
        {sortedFloorItems
          .filter(id => {
            const [u, v] = getPos(id);
            return (u + v) <= deskDepth;
          })
          .map(itemId => (
            <DraggableItem key={itemId} itemId={itemId}>
              {renderItem(itemId, getDragOrStoredPos(itemId))}
            </DraggableItem>
          ))
        }

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

        {/* ========== FLOOR ITEMS (데스크 앞) ========== */}
        {sortedFloorItems
          .filter(id => {
            const [u, v] = getPos(id);
            return (u + v) > deskDepth;
          })
          .map(itemId => (
            <DraggableItem key={itemId} itemId={itemId}>
              {renderItem(itemId, getDragOrStoredPos(itemId))}
            </DraggableItem>
          ))
        }

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
});
