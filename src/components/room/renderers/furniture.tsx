// 가구 렌더러 — 10종
import { iso } from './index';

const WALL_H = 155;

export function renderFurniture(itemId: string, pos: [number, number], wallH: number = WALL_H) {
  switch (itemId) {
    case 'furniture_01': return renderBookshelf();
    case 'furniture_02': return renderRug(pos);
    case 'furniture_03': return renderPoster(wallH);
    case 'furniture_04': return renderSofa(pos);
    case 'furniture_05': return renderSideTable(pos);
    case 'furniture_06': return renderBed(pos);
    case 'furniture_07': return renderChair(pos);
    case 'furniture_08': return renderCurtain(wallH);
    case 'furniture_09': return renderLargeBookcase(wallH);
    case 'furniture_10': return renderDeskLamp(pos);
    default: return null;
  }
}

function renderBookshelf() {
  const bx = 365, by = 140;
  return (
    <g>
      {/* 본체 — 3면 */}
      <rect x={bx} y={by} width="35" height="68" rx="1" fill="#C4956A" />
      <polygon points={`${bx + 35},${by} ${bx + 55},${by - 10} ${bx + 55},${by + 58} ${bx + 35},${by + 68}`} fill="#A67B50" />
      <polygon points={`${bx},${by} ${bx + 35},${by} ${bx + 55},${by - 10} ${bx + 20},${by - 10}`} fill="#D4A574" />
      {/* 선반 */}
      <line x1={bx + 1} y1={by + 33} x2={bx + 34} y2={by + 33} stroke="#A67B50" strokeWidth="1.5" />
      {/* 책 — 상단 */}
      <rect x={bx + 3} y={by + 5} width="5" height="24" rx="1" fill="#FF6B6B" />
      <rect x={bx + 9} y={by + 7} width="5" height="22" rx="1" fill="#7ECEC1" />
      <rect x={bx + 15} y={by + 4} width="4" height="25" rx="1" fill="#B8A9C9" />
      <rect x={bx + 20} y={by + 8} width="5" height="21" rx="1" fill="#FFB347" />
      <rect x={bx + 26} y={by + 6} width="5" height="23" rx="1" fill="#7FB3D8" />
      {/* 책 — 하단 */}
      <rect x={bx + 3} y={by + 38} width="5" height="24" rx="1" fill="#9A87B3" />
      <rect x={bx + 9} y={by + 40} width="5" height="22" rx="1" fill="#E85555" />
      <rect x={bx + 15} y={by + 37} width="5" height="25" rx="1" fill="#5BB8A8" />
      <rect x={bx + 21} y={by + 39} width="5" height="23" rx="1" fill="#FFC875" />
      <rect x={bx + 27} y={by + 41} width="5" height="21" rx="1" fill="#D0C4DD" />
    </g>
  );
}

function renderRug(pos: [number, number]) {
  const [px, py] = pos;
  return (
    <g>
      {/* 러그 — 아이소메트릭 타원 + 패턴 */}
      <ellipse cx={px} cy={py} rx="62" ry="28" fill="#B8A9C9" opacity="0.25" />
      <ellipse cx={px} cy={py} rx="55" ry="24" fill="#D0C4DD" opacity="0.15" />
      <ellipse cx={px} cy={py} rx="42" ry="18" fill="#B8A9C9" opacity="0.12" />
      {/* 프린지 장식 */}
      <ellipse cx={px} cy={py} rx="62" ry="28" fill="none" stroke="#B8A9C9" strokeWidth="1" opacity="0.3" strokeDasharray="4 3" />
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
    <g filter="url(#shadow)">
      <polygon points={`${x1},${fT1} ${x2},${fT2} ${x2},${fB2} ${x1},${fB1}`} fill="#FFF5E8" />
      <polygon points={`${x1},${fT1} ${x2},${fT2} ${x2},${fB2} ${x1},${fB1}`} fill="none" stroke="#E8DDD0" strokeWidth="1.5" />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14">⭐</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="5.5" fill="#FF6B6B" fontWeight="bold">힘내!</text>
    </g>
  );
}

function renderSofa(pos: [number, number]) {
  const [px, py] = pos;
  return (
    <g>
      <ellipse cx={px} cy={py + 10} rx="22" ry="7" fill="rgba(0,0,0,0.06)" />
      {/* 소파 — 3면 아이소메트릭 */}
      {/* 등받이 */}
      <polygon points={`${px - 18},${py - 14} ${px + 18},${py - 14} ${px + 18},${py - 4} ${px - 18},${py - 4}`} fill="#6B8FAD" />
      <polygon points={`${px - 18},${py - 14} ${px - 14},${py - 18} ${px + 22},${py - 18} ${px + 18},${py - 14}`} fill="#7FA0B8" />
      {/* 좌석 */}
      <polygon points={`${px - 18},${py - 4} ${px + 18},${py - 4} ${px + 18},${py + 6} ${px - 18},${py + 6}`} fill="#7ECEC1" />
      <polygon points={`${px - 18},${py - 4} ${px - 14},${py - 8} ${px + 22},${py - 8} ${px + 18},${py - 4}`} fill="#8ED8CB" />
      {/* 쿠션 라인 */}
      <line x1={px} y1={py - 4} x2={px} y2={py + 6} stroke="#6BBF9E" strokeWidth="1" opacity="0.4" />
      {/* 오른쪽 면 */}
      <polygon points={`${px + 18},${py - 14} ${px + 22},${py - 18} ${px + 22},${py + 2} ${px + 18},${py + 6}`} fill="#5E9DAD" />
      {/* 팔걸이 */}
      <rect x={px - 20} y={py - 8} width="4" height="14" rx="2" fill="#5E7F9C" />
      <rect x={px + 18} y={py - 8} width="4" height="14" rx="2" fill="#5E7F9C" />
      {/* 다리 */}
      <line x1={px - 16} y1={py + 6} x2={px - 16} y2={py + 10} stroke="#8B6F47" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={px + 16} y1={py + 6} x2={px + 16} y2={py + 10} stroke="#8B6F47" strokeWidth="2.5" strokeLinecap="round" />
      {/* 쿠션 하이라이트 */}
      <ellipse cx={px - 8} cy={py - 1} rx="7" ry="2" fill="white" opacity="0.08" />
      <ellipse cx={px + 8} cy={py - 1} rx="7" ry="2" fill="white" opacity="0.08" />
    </g>
  );
}

function renderSideTable(pos: [number, number]) {
  const [px, py] = pos;
  return (
    <g>
      <ellipse cx={px} cy={py + 8} rx="10" ry="4" fill="rgba(0,0,0,0.06)" />
      {/* 상판 — 아이소메트릭 */}
      <polygon points={`${px - 10},${py - 10} ${px},${py - 15} ${px + 10},${py - 10} ${px},${py - 5}`} fill="#D4A574" />
      <polygon points={`${px - 10},${py - 10} ${px},${py - 5} ${px},${py - 3} ${px - 10},${py - 8}`} fill="#A67B50" />
      <polygon points={`${px + 10},${py - 10} ${px},${py - 5} ${px},${py - 3} ${px + 10},${py - 8}`} fill="#B8875E" />
      {/* 다리 */}
      <line x1={px - 8} y1={py - 8} x2={px - 8} y2={py + 5} stroke="#8B6F47" strokeWidth="2" strokeLinecap="round" />
      <line x1={px + 8} y1={py - 8} x2={px + 8} y2={py + 5} stroke="#8B6F47" strokeWidth="2" strokeLinecap="round" />
      <line x1={px} y1={py - 3} x2={px} y2={py + 5} stroke="#8B6F47" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </g>
  );
}

function renderBed(pos: [number, number]) {
  const [px, py] = pos;
  return (
    <g>
      <ellipse cx={px} cy={py + 14} rx="28" ry="9" fill="rgba(0,0,0,0.06)" />
      {/* 침대 프레임 — 아이소메트릭 */}
      {/* 매트리스 */}
      <polygon points={`${px - 22},${py - 6} ${px},${py - 16} ${px + 22},${py - 6} ${px},${py + 4}`} fill="#F5E6D3" />
      <polygon points={`${px - 22},${py - 6} ${px},${py + 4} ${px},${py + 8} ${px - 22},${py - 2}`} fill="#E8D5C0" />
      <polygon points={`${px + 22},${py - 6} ${px},${py + 4} ${px},${py + 8} ${px + 22},${py - 2}`} fill="#ECD9C4" />
      {/* 이불 */}
      <polygon points={`${px - 18},${py - 5} ${px - 2},${py - 12} ${px + 18},${py - 5} ${px - 2},${py + 2}`} fill="#7ECEC1" opacity="0.8" />
      <polygon points={`${px - 18},${py - 5} ${px - 2},${py + 2} ${px - 2},${py + 5} ${px - 18},${py - 2}`} fill="#6BBF9E" opacity="0.8" />
      {/* 베개 */}
      <ellipse cx={px + 8} cy={py - 10} rx="8" ry="4" fill="white" transform={`rotate(-25 ${px + 8} ${py - 10})`} />
      <ellipse cx={px + 8} cy={py - 10} rx="7" ry="3" fill="#FFF8F0" transform={`rotate(-25 ${px + 8} ${py - 10})`} />
      {/* 머리판 */}
      <polygon points={`${px + 6},${py - 15} ${px + 24},${py - 6} ${px + 24},${py - 14} ${px + 6},${py - 23}`} fill="#8B6F47" />
      <polygon points={`${px + 6},${py - 23} ${px + 24},${py - 14} ${px + 26},${py - 15} ${px + 8},${py - 24}`} fill="#A08060" />
      {/* 다리 */}
      <line x1={px - 20} y1={py - 2} x2={px - 20} y2={py + 6} stroke="#8B6F47" strokeWidth="3" strokeLinecap="round" />
      <line x1={px + 20} y1={py - 2} x2={px + 20} y2={py + 6} stroke="#8B6F47" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function renderChair(pos: [number, number]) {
  const [px, py] = pos;
  return (
    <g>
      <ellipse cx={px} cy={py + 8} rx="10" ry="4" fill="rgba(0,0,0,0.06)" />
      {/* 좌석 — 아이소메트릭 */}
      <polygon points={`${px - 8},${py - 4} ${px},${py - 8} ${px + 8},${py - 4} ${px},${py}`} fill="#444" />
      <polygon points={`${px - 8},${py - 4} ${px},${py} ${px},${py + 2} ${px - 8},${py - 2}`} fill="#333" />
      <polygon points={`${px + 8},${py - 4} ${px},${py} ${px},${py + 2} ${px + 8},${py - 2}`} fill="#3A3A3A" />
      {/* 등받이 */}
      <polygon points={`${px + 2},${py - 8} ${px + 10},${py - 4} ${px + 10},${py - 18} ${px + 2},${py - 22}`} fill="#555" />
      <polygon points={`${px + 2},${py - 22} ${px + 10},${py - 18} ${px + 12},${py - 19} ${px + 4},${py - 23}`} fill="#666" />
      {/* 기둥 */}
      <line x1={px} y1={py + 2} x2={px} y2={py + 6} stroke="#333" strokeWidth="2" />
      {/* 바퀴 */}
      <circle cx={px - 5} cy={py + 7} r="1.5" fill="#555" />
      <circle cx={px + 5} cy={py + 7} r="1.5" fill="#555" />
      <circle cx={px} cy={py + 8} r="1.5" fill="#555" />
    </g>
  );
}

function renderCurtain(wallH: number) {
  // 창문 옆 왼쪽 벽에 배치
  const t1 = 0.15, t2 = 0.68;
  const wBot1 = 225 - t1 * 95;
  const wTop1 = (225 - wallH) - t1 * 95;
  const wBot2 = 225 - t2 * 95;
  const wTop2 = (225 - wallH) - t2 * 95;

  const curtainTop1 = wTop1 + (wBot1 - wTop1) * 0.15;
  const curtainBot1 = wTop1 + (wBot1 - wTop1) * 0.78;
  const curtainTop2 = wTop2 + (wBot2 - wTop2) * 0.15;
  const curtainBot2 = wTop2 + (wBot2 - wTop2) * 0.78;

  const x1 = 60 + t1 * 190;
  const x2 = 60 + t2 * 190;

  return (
    <g>
      {/* 커튼 봉 */}
      <line x1={x1 - 3} y1={curtainTop1 - 2} x2={x2 + 3} y2={curtainTop2 - 2} stroke="#8B6F47" strokeWidth="2.5" strokeLinecap="round" />
      {/* 왼쪽 커튼 */}
      <polygon points={`${x1},${curtainTop1} ${x1 + 18},${curtainTop1 + (curtainTop2 - curtainTop1) * 0.15} ${x1 + 15},${curtainBot1 + (curtainBot2 - curtainBot1) * 0.12} ${x1 - 2},${curtainBot1}`} fill="#FF8A8A" opacity="0.6" />
      {/* 오른쪽 커튼 */}
      <polygon points={`${x2},${curtainTop2} ${x2 - 18},${curtainTop2 - (curtainTop2 - curtainTop1) * 0.15} ${x2 - 15},${curtainBot2 - (curtainBot2 - curtainBot1) * 0.12} ${x2 + 2},${curtainBot2}`} fill="#FF6B6B" opacity="0.55" />
      {/* 주름 라인 */}
      <line x1={x1 + 5} y1={curtainTop1 + 5} x2={x1 + 4} y2={curtainBot1 - 3} stroke="#E85555" strokeWidth="0.5" opacity="0.3" />
      <line x1={x2 - 5} y1={curtainTop2 + 5} x2={x2 - 4} y2={curtainBot2 - 3} stroke="#E85555" strokeWidth="0.5" opacity="0.3" />
    </g>
  );
}

function renderLargeBookcase(wallH: number) {
  // 오른쪽 벽 중앙
  const t = 0.4;
  const bx = 250 + t * 190;
  const yCeil = (130 - wallH) + t * 95;
  const yFloor = 130 + t * 95;
  const by = yCeil + (yFloor - yCeil) * 0.2;
  const bh = (yFloor - yCeil) * 0.7;

  return (
    <g>
      {/* 본체 */}
      <rect x={bx - 2} y={by} width="30" height={bh} rx="1" fill="#C4956A" />
      <polygon points={`${bx + 28},${by} ${bx + 38},${by - 5} ${bx + 38},${by + bh - 5} ${bx + 28},${by + bh}`} fill="#A67B50" />
      <polygon points={`${bx - 2},${by} ${bx + 28},${by} ${bx + 38},${by - 5} ${bx + 8},${by - 5}`} fill="#D4A574" />
      {/* 선반 3단 */}
      {[0.3, 0.55, 0.8].map((ratio, i) => (
        <line key={i} x1={bx - 1} y1={by + bh * ratio} x2={bx + 27} y2={by + bh * ratio} stroke="#A67B50" strokeWidth="1.5" />
      ))}
      {/* 책들 */}
      {[
        { x: 1, h: 0.25, c: '#FF6B6B' }, { x: 6, h: 0.22, c: '#7ECEC1' },
        { x: 11, h: 0.26, c: '#FFB347' }, { x: 16, h: 0.23, c: '#B8A9C9' },
        { x: 21, h: 0.24, c: '#7FB3D8' },
        { x: 1, h: 0.2, c: '#9A87B3' }, { x: 6, h: 0.22, c: '#E85555' },
        { x: 11, h: 0.18, c: '#5BB8A8' },
      ].map((book, i) => (
        <rect key={i} x={bx + book.x} y={by + bh * (i < 5 ? 0.04 : 0.34)} width="4" height={bh * book.h} rx="0.5" fill={book.c} />
      ))}
    </g>
  );
}

function renderDeskLamp(pos: [number, number]) {
  const [px, py] = pos;
  // 책상 위 아이템
  return (
    <g>
      {/* 받침 */}
      <ellipse cx={px} cy={py} rx="5" ry="2.5" fill="#555" />
      <ellipse cx={px} cy={py - 1} rx="5" ry="2.5" fill="#666" />
      {/* 팔 */}
      <line x1={px} y1={py - 1} x2={px + 3} y2={py - 15} stroke="#777" strokeWidth="1.5" />
      <line x1={px + 3} y1={py - 15} x2={px - 2} y2={py - 22} stroke="#777" strokeWidth="1.5" />
      {/* 갓 */}
      <polygon points={`${px - 7},${py - 22} ${px + 3},${py - 26} ${px + 5},${py - 20} ${px - 5},${py - 16}`} fill="#FFD700" />
      <polygon points={`${px - 5},${py - 16} ${px + 5},${py - 20} ${px + 3},${py - 18} ${px - 4},${py - 15}`} fill="#E8C200" />
      {/* 빛 */}
      <ellipse cx={px - 1} cy={py - 12} rx="8" ry="4" fill="#FFD700" opacity="0.06">
        <animate attributeName="opacity" values="0.04;0.08;0.04" dur="2s" repeatCount="indefinite" />
      </ellipse>
    </g>
  );
}
