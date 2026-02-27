// 조명 렌더러 — 6종

const WALL_H = 155;

export function renderLight(itemId: string, pos: [number, number], wallH: number = WALL_H) {
  switch (itemId) {
    case 'light_01': return renderFloorLamp(pos);
    case 'light_02': return renderFairyLights(wallH);
    case 'light_03': return renderNeonSign(wallH);
    case 'light_04': return renderCandle(pos);
    case 'light_05': return renderChristmasLights(wallH);
    case 'light_06': return renderLavaLamp(pos);
    default: return null;
  }
}

function renderFloorLamp(pos: [number, number]) {
  const [lx, ly] = pos;
  return (
    <g>
      <ellipse cx={lx} cy={ly + 3} rx="10" ry="4" fill="rgba(0,0,0,0.06)" />
      {/* 기둥 */}
      <line x1={lx} y1={ly} x2={lx} y2={ly - 50} stroke="#C4956A" strokeWidth="2.5" />
      {/* 받침 — 아이소메트릭 */}
      <ellipse cx={lx} cy={ly} rx="7" ry="3" fill="#A67B50" />
      <ellipse cx={lx} cy={ly - 1} rx="7" ry="3" fill="#B8875E" />
      {/* 갓 — 사다리꼴 + 3D */}
      <polygon points={`${lx - 11},${lx < 250 ? ly - 48 : ly - 50} ${lx + 11},${lx < 250 ? ly - 52 : ly - 54} ${lx + 9},${lx < 250 ? ly - 42 : ly - 44} ${lx - 9},${lx < 250 ? ly - 38 : ly - 40}`} fill="#FFE4B5" />
      <polygon points={`${lx - 9},${ly - 48} ${lx + 9},${ly - 52} ${lx + 7},${ly - 42} ${lx - 7},${ly - 38}`} fill="#FFD59A" opacity="0.7" />
      {/* 빛 글로우 */}
      <ellipse cx={lx} cy={ly - 6} rx="18" ry="8" fill="#FFB347" opacity="0.08">
        <animate attributeName="opacity" values="0.06;0.12;0.06" dur="3s" repeatCount="indefinite" />
      </ellipse>
    </g>
  );
}

function renderFairyLights(wallH: number) {
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
    <g>
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

function renderNeonSign(wallH: number) {
  const t = 0.6;
  const nx = 250 + t * 190;
  const nyCeil = (130 - wallH) + t * 95;
  const nyFloor = 130 + t * 95;
  const ny = nyCeil + (nyFloor - nyCeil) * 0.18;
  return (
    <g>
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

function renderCandle(pos: [number, number]) {
  const [cx, cy] = pos;
  return (
    <g>
      <ellipse cx={cx} cy={cy + 6} rx="8" ry="3" fill="rgba(0,0,0,0.06)" />
      {/* 캔들 홀더 */}
      <ellipse cx={cx} cy={cy + 3} rx="6" ry="2.5" fill="#C4956A" />
      <rect x={cx - 6} y={cy + 1} width="12" height="3" rx="1" fill="#B8875E" />
      {/* 밀랍 — 아이소메트릭 원기둥 */}
      <rect x={cx - 3} y={cy - 12} width="6" height="14" rx="1" fill="#FFF5E8" />
      <rect x={cx - 2.5} y={cy - 12} width="5" height="14" rx="1" fill="#FFFAF0" />
      <ellipse cx={cx} cy={cy - 12} rx="3" ry="1.2" fill="#FFF8F0" />
      {/* 심지 */}
      <line x1={cx} y1={cy - 12} x2={cx} y2={cy - 16} stroke="#333" strokeWidth="0.8" />
      {/* 불꽃 */}
      <ellipse cx={cx} cy={cy - 19} rx="2.5" ry="4" fill="#FFB347" opacity="0.9">
        <animate attributeName="ry" values="4;3.5;4.5;4" dur="0.8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx={cx} cy={cy - 20} rx="1.5" ry="2.5" fill="#FFD700" opacity="0.8">
        <animate attributeName="ry" values="2.5;2;3;2.5" dur="0.6s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx={cx} cy={cy - 20} rx="0.8" ry="1.5" fill="white" opacity="0.5" />
      {/* 빛 글로우 */}
      <circle cx={cx} cy={cy - 18} r="12" fill="#FFB347" opacity="0.04">
        <animate attributeName="opacity" values="0.03;0.06;0.03" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

function renderChristmasLights(wallH: number) {
  const bulbs: [number, number, string][] = [];
  for (let i = 0; i < 9; i++) {
    const t = 0.05 + i * 0.1;
    const x = 60 + t * 190;
    const yTop = (225 - wallH) - t * 95;
    const yBot = 225 - t * 95;
    const sag = Math.sin(t * Math.PI) * 8;
    const by = yTop + (yBot - yTop) * 0.08 + sag;
    const colors = ['#FF0000', '#00CC00', '#FF0000', '#FFD700', '#00CC00', '#FF0000', '#FFD700', '#00CC00', '#FF0000'];
    bulbs.push([x, by, colors[i]]);
  }
  return (
    <g>
      {/* 줄 */}
      <path d={`M${bulbs[0][0]},${bulbs[0][1]} ${bulbs.map(([x, y]) => `L${x},${y}`).join(' ')}`} fill="none" stroke="#2A5E1E" strokeWidth="1.2" opacity="0.6" />
      {bulbs.map(([x, y, color], i) => (
        <g key={i}>
          {/* 전구 몸통 */}
          <rect x={x - 1.5} y={y} width="3" height="2" fill="#888" />
          <ellipse cx={x} cy={y + 5} rx="2.5" ry="3.5" fill={color} opacity="0.85">
            <animate attributeName="opacity" values="0.7;1;0.7" dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />
          </ellipse>
          <ellipse cx={x} cy={y + 5} r="5" fill={color} opacity="0.08">
            <animate attributeName="opacity" values="0.05;0.12;0.05" dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />
          </ellipse>
        </g>
      ))}
    </g>
  );
}

function renderLavaLamp(pos: [number, number]) {
  const [cx, cy] = pos;
  return (
    <g>
      <ellipse cx={cx} cy={cy + 8} rx="10" ry="4" fill="rgba(0,0,0,0.06)" />
      {/* 받침 */}
      <polygon points={`${cx - 6},${cy + 5} ${cx - 4},${cy - 2} ${cx + 4},${cy - 2} ${cx + 6},${cy + 5}`} fill="#555" />
      <polygon points={`${cx - 6},${cy + 5} ${cx - 4},${cy - 2} ${cx},${cy} ${cx},${cy + 7}`} fill="#444" />
      {/* 유리 몸통 */}
      <ellipse cx={cx} cy={cy - 18} rx="5" ry="18" fill="#9C27B0" opacity="0.25" />
      <ellipse cx={cx - 0.5} cy={cy - 18} rx="4" ry="17" fill="#CE93D8" opacity="0.15" />
      {/* 라바 방울들 */}
      <ellipse cx={cx} cy={cy - 10} rx="3" ry="4" fill="#FF6B6B" opacity="0.7">
        <animate attributeName="cy" values={`${cy - 8};${cy - 28};${cy - 8}`} dur="5s" repeatCount="indefinite" />
        <animate attributeName="rx" values="3;2;4;3" dur="5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx={cx + 1} cy={cy - 20} rx="2" ry="3" fill="#FFB347" opacity="0.6">
        <animate attributeName="cy" values={`${cy - 18};${cy - 6};${cy - 18}`} dur="4s" repeatCount="indefinite" />
        <animate attributeName="ry" values="3;2;3.5;3" dur="4s" repeatCount="indefinite" />
      </ellipse>
      <circle cx={cx - 1} cy={cy - 14} r="1.5" fill="#FF8A8A" opacity="0.5">
        <animate attributeName="cy" values={`${cy - 14};${cy - 30};${cy - 14}`} dur="6s" repeatCount="indefinite" />
      </circle>
      {/* 상단 캡 */}
      <ellipse cx={cx} cy={cy - 35} rx="3" ry="1.5" fill="#555" />
      {/* 유리 반사 */}
      <line x1={cx - 3} y1={cy - 28} x2={cx - 3} y2={cy - 10} stroke="white" strokeWidth="0.5" opacity="0.2" />
      {/* 글로우 */}
      <ellipse cx={cx} cy={cy - 18} rx="10" ry="20" fill="#CE93D8" opacity="0.04">
        <animate attributeName="opacity" values="0.03;0.06;0.03" dur="3s" repeatCount="indefinite" />
      </ellipse>
    </g>
  );
}
