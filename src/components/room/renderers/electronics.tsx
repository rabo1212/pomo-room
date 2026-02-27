// 전자기기 렌더러 — 4종

export function renderElectronics(itemId: string, pos: [number, number]) {
  const [px, py] = pos;

  switch (itemId) {
    case 'electronics_01': return renderGamingMonitor(px, py);
    case 'electronics_02': return renderLaptop(px, py);
    case 'electronics_03': return renderGameConsole(px, py);
    case 'electronics_04': return renderSpeaker(px, py);
    default: return null;
  }
}

function renderGamingMonitor(px: number, py: number) {
  return (
    <g>
      <ellipse cx={px} cy={py + 10} rx="18" ry="6" fill="rgba(0,0,0,0.06)" />
      {/* 모니터 — 넓은 아이소메트릭 */}
      <polygon points={`${px - 20},${py - 22} ${px + 20},${py - 26} ${px + 20},${py} ${px - 20},${py + 4}`} fill="#222" />
      <polygon points={`${px - 18},${py - 20} ${px + 18},${py - 24} ${px + 18},${py - 2} ${px - 18},${py + 2}`} fill="#1a1a2e" />
      {/* 화면 내용 */}
      <line x1={px - 14} y1={py - 16} x2={px + 10} y2={py - 19} stroke="#00FF88" strokeWidth="1.5" opacity="0.6" />
      <line x1={px - 14} y1={py - 11} x2={px + 6} y2={py - 14} stroke="#7ECEC1" strokeWidth="1.5" opacity="0.5" />
      <line x1={px - 14} y1={py - 6} x2={px + 14} y2={py - 9} stroke="#FF6B6B" strokeWidth="1.5" opacity="0.4" />
      {/* RGB 테두리 */}
      <polygon points={`${px - 20},${py - 22} ${px + 20},${py - 26} ${px + 20},${py} ${px - 20},${py + 4}`} fill="none" stroke="#FF6B6B" strokeWidth="1" opacity="0.4">
        <animate attributeName="stroke" values="#FF6B6B;#00FF88;#6B6BFF;#FF6B6B" dur="3s" repeatCount="indefinite" />
      </polygon>
      {/* 스탠드 */}
      <line x1={px} y1={py + 2} x2={px} y2={py + 8} stroke="#333" strokeWidth="3" />
      <ellipse cx={px} cy={py + 9} rx="8" ry="3" fill="#333" />
      {/* RGB 글로우 */}
      <rect x={px - 22} y={py - 24} width="44" height="30" rx="2" fill="#6B6BFF" opacity="0.02">
        <animate attributeName="fill" values="#FF6B6B;#00FF88;#6B6BFF;#FF6B6B" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.02;0.04;0.02" dur="3s" repeatCount="indefinite" />
      </rect>
    </g>
  );
}

function renderLaptop(px: number, py: number) {
  return (
    <g>
      <ellipse cx={px} cy={py + 6} rx="16" ry="5" fill="rgba(0,0,0,0.06)" />
      {/* 키보드 부분 — 아이소메트릭 평면 */}
      <polygon points={`${px - 14},${py} ${px},${py - 5} ${px + 14},${py} ${px},${py + 5}`} fill="#888" />
      <polygon points={`${px - 14},${py} ${px},${py + 5} ${px},${py + 6} ${px - 14},${py + 1}`} fill="#666" />
      <polygon points={`${px + 14},${py} ${px},${py + 5} ${px},${py + 6} ${px + 14},${py + 1}`} fill="#777" />
      {/* 키보드 점들 */}
      {[[-6, -1], [-2, -2.5], [2, -1.5], [6, -2.5], [-4, 1], [0, 0], [4, 1]].map(([ox, oy], i) => (
        <rect key={i} x={px + ox - 1} y={py + oy - 0.5} width="2" height="1" rx="0.3" fill="#555" opacity="0.5" />
      ))}
      {/* 화면 — 열린 상태 */}
      <polygon points={`${px},${py - 5} ${px + 14},${py} ${px + 14},${py - 16} ${px},${py - 21}`} fill="#333" />
      <polygon points={`${px + 1},${py - 6} ${px + 13},${py - 1} ${px + 13},${py - 15} ${px + 1},${py - 20}`} fill="#2C3E6B" />
      {/* 화면 라인 */}
      <line x1={px + 3} y1={py - 16} x2={px + 11} y2={py - 13} stroke="#7ECEC1" strokeWidth="1" opacity="0.5" />
      <line x1={px + 3} y1={py - 12} x2={px + 9} y2={py - 10} stroke="#FFB347" strokeWidth="1" opacity="0.4" />
      {/* 화면 글로우 */}
      <polygon points={`${px + 1},${py - 6} ${px + 13},${py - 1} ${px + 13},${py - 15} ${px + 1},${py - 20}`} fill="#7ECEC1" opacity="0.03">
        <animate attributeName="opacity" values="0.02;0.05;0.02" dur="2s" repeatCount="indefinite" />
      </polygon>
    </g>
  );
}

function renderGameConsole(px: number, py: number) {
  return (
    <g>
      <ellipse cx={px} cy={py + 8} rx="14" ry="5" fill="rgba(0,0,0,0.06)" />
      {/* 본체 — 아이소메트릭 박스 */}
      <polygon points={`${px - 12},${py - 4} ${px},${py - 8} ${px + 12},${py - 4} ${px},${py}`} fill="#333" />
      <polygon points={`${px - 12},${py - 4} ${px},${py} ${px},${py + 5} ${px - 12},${py + 1}`} fill="#222" />
      <polygon points={`${px + 12},${py - 4} ${px},${py} ${px},${py + 5} ${px + 12},${py + 1}`} fill="#2A2A2A" />
      {/* LED */}
      <circle cx={px - 4} cy={py - 3} r="1" fill="#00FF88" opacity="0.8">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* 디스크 슬롯 */}
      <line x1={px - 6} y1={py - 5} x2={px + 6} y2={py - 7} stroke="#444" strokeWidth="0.8" />
      {/* 컨트롤러 */}
      <g transform={`translate(${px - 18}, ${py + 2})`}>
        <ellipse cx="0" cy="0" rx="6" ry="3.5" fill="#444" />
        <ellipse cx="0" cy="-0.5" rx="5" ry="3" fill="#555" />
        {/* 버튼 */}
        <circle cx="-2" cy="-1" r="0.8" fill="#FF6B6B" />
        <circle cx="2" cy="-1" r="0.8" fill="#7ECEC1" />
        {/* 스틱 */}
        <circle cx="-3.5" cy="0.5" r="1.2" fill="#333" />
      </g>
    </g>
  );
}

function renderSpeaker(px: number, py: number) {
  return (
    <g>
      <ellipse cx={px} cy={py + 8} rx="10" ry="4" fill="rgba(0,0,0,0.06)" />
      {/* 스피커 몸통 — 아이소메트릭 원기둥 */}
      <ellipse cx={px} cy={py + 4} rx="8" ry="4" fill="#333" />
      <rect x={px - 8} y={py - 14} width="16" height="18" rx="3" fill="#444" />
      <rect x={px - 7} y={py - 13} width="14" height="16" rx="2" fill="#555" />
      <ellipse cx={px} cy={py - 14} rx="8" ry="4" fill="#555" />
      <ellipse cx={px} cy={py - 14} rx="7" ry="3.5" fill="#666" />
      {/* 스피커 콘 */}
      <circle cx={px} cy={py - 5} r="5" fill="#333" />
      <circle cx={px} cy={py - 5} r="3.5" fill="#444" />
      <circle cx={px} cy={py - 5} r="1.5" fill="#555" />
      {/* 소리 파동 */}
      <circle cx={px + 10} cy={py - 5} r="3" fill="none" stroke="#7ECEC1" strokeWidth="0.5" opacity="0.3">
        <animate attributeName="r" values="3;8;3" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx={px + 10} cy={py - 5} r="5" fill="none" stroke="#7ECEC1" strokeWidth="0.5" opacity="0.2">
        <animate attributeName="r" values="5;12;5" dur="1.5s" repeatCount="indefinite" begin="0.3s" />
        <animate attributeName="opacity" values="0.2;0;0.2" dur="1.5s" repeatCount="indefinite" begin="0.3s" />
      </circle>
      {/* LED */}
      <circle cx={px + 5} cy={py - 12} r="1" fill="#7ECEC1" opacity="0.7">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}
