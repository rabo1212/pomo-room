// 구역 배경 렌더러 — 5개 구역
import { iso } from './index';
import { TimerStatus } from '@/types';

// 구역별 캐릭터 목표 좌표 (u, v)
export const ZONE_POSITIONS: Record<TimerStatus, [number, number]> = {
  idle: [0.15, 0.15],          // 로비 — 왼쪽 앞
  focus: [0.42, 0.22],         // 작업 책상 — 기존 위치
  short_break: [0.78, 0.18],   // 휴게실 — 오른쪽 앞
  long_break: [0.50, 0.72],    // 옥상 정원 — 뒤쪽 중앙
  complete: [0.82, 0.62],      // 서버실 — 오른쪽 뒤
};

// 구역 이름 표시용
export const ZONE_LABELS: Record<TimerStatus, string> = {
  idle: 'LOBBY',
  focus: 'DESK',
  short_break: 'BREAK',
  long_break: 'GARDEN',
  complete: 'SERVER',
};

// 구역별 말풍선
export const ZONE_BUBBLES: Record<TimerStatus, string> = {
  idle: '출근!',
  focus: '집중!',
  short_break: '쉬는중~',
  long_break: '힐링~',
  complete: '완료!',
};

// ========== 로비 (idle) ==========
export function renderLobby() {
  const doorPos = iso(0.08, 0.08);
  const deskPos = iso(0.18, 0.25);

  return (
    <g shapeRendering="crispEdges" opacity={0.7}>
      {/* 바닥 표시 — 로비 영역 */}
      <polygon
        points={`${iso(0.02, 0.02).join(',')
          } ${iso(0.28, 0.02).join(',')
          } ${iso(0.28, 0.30).join(',')
          } ${iso(0.02, 0.30).join(',')}`}
        fill="rgba(184,169,201,0.08)"
        stroke="rgba(184,169,201,0.15)"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      {/* 문 */}
      <rect x={doorPos[0] - 10} y={doorPos[1] - 40} width={20} height={38} rx={1} fill="#8B6F47" stroke="#6B5237" strokeWidth="1.5" />
      <rect x={doorPos[0] - 8} y={doorPos[1] - 38} width={16} height={32} rx={0} fill="#A67B50" />
      <circle cx={doorPos[0] + 5} cy={doorPos[1] - 20} r={2} fill="#FFD700" />
      {/* 안내판 */}
      <rect x={doorPos[0] + 14} y={doorPos[1] - 30} width={14} height={10} rx={1} fill="#E8E0D0" stroke="#C4956A" strokeWidth="0.8" />
      <text x={doorPos[0] + 21} y={doorPos[1] - 23} textAnchor="middle" fontSize="4" fontFamily="monospace" fill="#8B6F47">IN</text>
      {/* 우산꽂이 */}
      <rect x={deskPos[0] - 4} y={deskPos[1] - 16} width={8} height={14} rx={1} fill="#666" stroke="#444" strokeWidth="0.8" />
      <line x1={deskPos[0] - 1} y1={deskPos[1] - 22} x2={deskPos[0] - 1} y2={deskPos[1] - 16} stroke="#FF6B6B" strokeWidth="1.5" />
      <line x1={deskPos[0] + 2} y1={deskPos[1] - 20} x2={deskPos[0] + 2} y2={deskPos[1] - 16} stroke="#7ECEC1" strokeWidth="1.5" />
    </g>
  );
}

// ========== 휴게실 (short_break) ==========
export function renderBreakRoom() {
  const sofaPos = iso(0.80, 0.22);
  const coffeePos = iso(0.72, 0.12);
  const vendingPos = iso(0.85, 0.08);

  return (
    <g shapeRendering="crispEdges" opacity={0.7}>
      {/* 바닥 표시 */}
      <polygon
        points={`${iso(0.65, 0.02).join(',')
          } ${iso(0.95, 0.02).join(',')
          } ${iso(0.95, 0.30).join(',')
          } ${iso(0.65, 0.30).join(',')}`}
        fill="rgba(126,206,193,0.06)"
        stroke="rgba(126,206,193,0.12)"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      {/* 소파 */}
      <rect x={sofaPos[0] - 16} y={sofaPos[1] - 14} width={32} height={12} rx={2} fill="#7ECEC1" stroke="#5BB8A8" strokeWidth="1" />
      <rect x={sofaPos[0] - 18} y={sofaPos[1] - 16} width={6} height={16} rx={2} fill="#5BB8A8" />
      <rect x={sofaPos[0] + 12} y={sofaPos[1] - 16} width={6} height={16} rx={2} fill="#5BB8A8" />
      {/* 쿠션 */}
      <rect x={sofaPos[0] - 10} y={sofaPos[1] - 12} width={8} height={6} rx={2} fill="#FFB347" />
      <rect x={sofaPos[0] + 2} y={sofaPos[1] - 12} width={8} height={6} rx={2} fill="#FF8A8A" />
      {/* 커피머신 */}
      <rect x={coffeePos[0] - 6} y={coffeePos[1] - 20} width={12} height={18} rx={1} fill="#444" stroke="#333" strokeWidth="1" />
      <rect x={coffeePos[0] - 4} y={coffeePos[1] - 16} width={8} height={6} rx={0} fill="#222" />
      <circle cx={coffeePos[0]} cy={coffeePos[1] - 6} r={2} fill="#FF4444" />
      {/* 자판기 */}
      <rect x={vendingPos[0] - 8} y={vendingPos[1] - 28} width={16} height={26} rx={1} fill="#4A90D9" stroke="#3A7BC8" strokeWidth="1" />
      <rect x={vendingPos[0] - 6} y={vendingPos[1] - 24} width={12} height={10} rx={0} fill="rgba(255,255,255,0.2)" />
      {/* 음료 픽셀 */}
      {[0, 1, 2].map(i => (
        <rect key={`drink${i}`} x={vendingPos[0] - 4 + i * 4} y={vendingPos[1] - 22} width={3} height={6} rx={0.5}
          fill={['#FF6B6B', '#7ECEC1', '#FFB347'][i]} />
      ))}
    </g>
  );
}

// ========== 옥상 정원 (long_break) ==========
export function renderRooftopGarden() {
  const benchPos = iso(0.48, 0.75);
  const plantPos = iso(0.55, 0.80);
  const fountainPos = iso(0.42, 0.82);

  return (
    <g shapeRendering="crispEdges" opacity={0.7}>
      {/* 바닥 표시 — 잔디 느낌 */}
      <polygon
        points={`${iso(0.35, 0.60).join(',')
          } ${iso(0.65, 0.60).join(',')
          } ${iso(0.65, 0.90).join(',')
          } ${iso(0.35, 0.90).join(',')}`}
        fill="rgba(139,195,74,0.10)"
        stroke="rgba(139,195,74,0.18)"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      {/* 벤치 */}
      <rect x={benchPos[0] - 14} y={benchPos[1] - 6} width={28} height={4} rx={0} fill="#8B6F47" stroke="#6B5237" strokeWidth="0.8" />
      <rect x={benchPos[0] - 12} y={benchPos[1] - 2} width={4} height={6} rx={0} fill="#6B5237" />
      <rect x={benchPos[0] + 8} y={benchPos[1] - 2} width={4} height={6} rx={0} fill="#6B5237" />
      <rect x={benchPos[0] - 14} y={benchPos[1] - 14} width={2} height={10} rx={0} fill="#6B5237" />
      <rect x={benchPos[0] + 12} y={benchPos[1] - 14} width={2} height={10} rx={0} fill="#6B5237" />
      <rect x={benchPos[0] - 14} y={benchPos[1] - 14} width={28} height={3} rx={0} fill="#8B6F47" />
      {/* 화분 */}
      <rect x={plantPos[0] - 5} y={plantPos[1] - 6} width={10} height={8} rx={1} fill="#C4956A" />
      <circle cx={plantPos[0]} cy={plantPos[1] - 10} r={6} fill="#66BB6A" />
      <circle cx={plantPos[0] - 3} cy={plantPos[1] - 12} r={4} fill="#81C784" />
      <circle cx={plantPos[0] + 4} cy={plantPos[1] - 9} r={3.5} fill="#4CAF50" />
      {/* 꽃 */}
      <circle cx={plantPos[0] + 2} cy={plantPos[1] - 14} r={2} fill="#FF8A8A" />
      <circle cx={plantPos[0] - 2} cy={plantPos[1] - 11} r={1.5} fill="#FFB347" />
      {/* 분수 */}
      <ellipse cx={fountainPos[0]} cy={fountainPos[1]} rx={8} ry={4} fill="#90CAF9" stroke="#64B5F6" strokeWidth="0.8" />
      <ellipse cx={fountainPos[0]} cy={fountainPos[1] - 2} rx={6} ry={3} fill="#BBDEFB" />
      <line x1={fountainPos[0]} y1={fountainPos[1] - 8} x2={fountainPos[0]} y2={fountainPos[1] - 2} stroke="#64B5F6" strokeWidth="1">
        <animate attributeName="y1" values={`${fountainPos[1] - 8};${fountainPos[1] - 12};${fountainPos[1] - 8}`} dur="2s" repeatCount="indefinite" />
      </line>
      {/* 물방울 */}
      <circle cx={fountainPos[0] - 2} cy={fountainPos[1] - 6} r={1} fill="#64B5F6" opacity={0.6}>
        <animate attributeName="cy" values={`${fountainPos[1] - 10};${fountainPos[1] - 4}`} dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

// ========== 서버실 (complete) ==========
export function renderServerRoom() {
  const rackPos = iso(0.85, 0.68);
  const rackPos2 = iso(0.80, 0.58);

  return (
    <g shapeRendering="crispEdges" opacity={0.7}>
      {/* 바닥 표시 */}
      <polygon
        points={`${iso(0.70, 0.50).join(',')
          } ${iso(0.95, 0.50).join(',')
          } ${iso(0.95, 0.78).join(',')
          } ${iso(0.70, 0.78).join(',')}`}
        fill="rgba(255,107,107,0.06)"
        stroke="rgba(255,107,107,0.12)"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      {/* 서버랙 1 */}
      <rect x={rackPos[0] - 8} y={rackPos[1] - 32} width={16} height={30} rx={1} fill="#2C2C2C" stroke="#1A1A1A" strokeWidth="1" />
      {/* 서버 슬롯 */}
      {[0, 1, 2, 3].map(i => (
        <g key={`slot${i}`}>
          <rect x={rackPos[0] - 6} y={rackPos[1] - 28 + i * 7} width={12} height={5} rx={0} fill="#3A3A3A" stroke="#222" strokeWidth="0.5" />
          <circle cx={rackPos[0] + 4} cy={rackPos[1] - 25.5 + i * 7} r={1.2}
            fill={i === 0 ? '#4CAF50' : i === 1 ? '#4CAF50' : '#FFB347'}>
            <animate attributeName="opacity" values="1;0.4;1" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {/* 서버랙 2 */}
      <rect x={rackPos2[0] - 6} y={rackPos2[1] - 26} width={12} height={24} rx={1} fill="#333" stroke="#1A1A1A" strokeWidth="1" />
      {[0, 1, 2].map(i => (
        <g key={`slot2${i}`}>
          <rect x={rackPos2[0] - 4} y={rackPos2[1] - 22 + i * 7} width={8} height={5} rx={0} fill="#3A3A3A" stroke="#222" strokeWidth="0.5" />
          <circle cx={rackPos2[0] + 2} cy={rackPos2[1] - 19.5 + i * 7} r={1}
            fill="#4CAF50">
            <animate attributeName="opacity" values="1;0.3;1" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {/* 케이블 */}
      <path d={`M${rackPos[0] - 8},${rackPos[1] - 20} Q${rackPos2[0] + 6},${rackPos[1] - 15} ${rackPos2[0] + 6},${rackPos2[1] - 15}`}
        fill="none" stroke="#FFB347" strokeWidth="1" opacity={0.5} />
      <path d={`M${rackPos[0] - 8},${rackPos[1] - 13} Q${rackPos2[0] + 6},${rackPos[1] - 10} ${rackPos2[0] + 6},${rackPos2[1] - 8}`}
        fill="none" stroke="#7ECEC1" strokeWidth="1" opacity={0.5} />
    </g>
  );
}

// 전체 구역 배경 렌더링
export function renderAllZones() {
  return (
    <g>
      {renderLobby()}
      {renderBreakRoom()}
      {renderRooftopGarden()}
      {renderServerRoom()}
    </g>
  );
}
