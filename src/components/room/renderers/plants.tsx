// 식물 렌더러 — 7종

export function renderPlant(itemId: string, pos: [number, number]) {
  const [px, py] = pos;

  switch (itemId) {
    case 'plant_01': return renderCactus(px, py);
    case 'plant_02': return renderMonstera(px, py);
    case 'plant_03': return renderCherryBlossom(px, py);
    case 'plant_04': return renderFlowerPot(px, py);
    case 'plant_05': return renderBigTree(px, py);
    case 'plant_06': return renderAquarium(px, py);
    case 'plant_07': return renderHangingPlant(px, py);
    default: return null;
  }
}

function renderCactus(px: number, py: number) {
  return (
    <g>
      <ellipse cx={px} cy={py + 8} rx="12" ry="4" fill="rgba(0,0,0,0.06)" />
      {/* 화분 — 3면 아이소메트릭 */}
      <polygon points={`${px - 8},${py + 6} ${px - 6},${py - 2} ${px + 6},${py - 2} ${px + 8},${py + 6}`} fill="#C4956A" />
      <polygon points={`${px - 8},${py + 6} ${px - 6},${py - 2} ${px},${py} ${px},${py + 8}`} fill="#A67B50" />
      <polygon points={`${px + 8},${py + 6} ${px + 6},${py - 2} ${px},${py} ${px},${py + 8}`} fill="#B8875E" />
      <rect x={px - 9} y={py - 5} width="18" height="4" rx="2" fill="#8B6F47" />
      <ellipse cx={px} cy={py - 2} rx="7" ry="3" fill="#5C3318" />
      {/* 선인장 몸통 — 입체 */}
      <ellipse cx={px} cy={py - 18} rx="6" ry="14" fill="#6BBF78" />
      <ellipse cx={px - 1} cy={py - 18} rx="5" ry="13" fill="#7DD88A" />
      <line x1={px} y1={py - 30} x2={px} y2={py - 8} stroke="#5DAA68" strokeWidth="0.5" opacity="0.4" />
      {/* 가시 */}
      <line x1={px + 6} y1={py - 22} x2={px + 10} y2={py - 25} stroke="#4A9455" strokeWidth="1" />
      <line x1={px - 6} y1={py - 18} x2={px - 10} y2={py - 21} stroke="#4A9455" strokeWidth="1" />
      <line x1={px + 5} y1={py - 14} x2={px + 9} y2={py - 13} stroke="#4A9455" strokeWidth="1" />
      {/* 꽃 */}
      <circle cx={px + 2} cy={py - 31} r="3" fill="#FF6B6B" />
      <circle cx={px + 2} cy={py - 31} r="1.5" fill="#FFB347" />
    </g>
  );
}

function renderMonstera(px: number, py: number) {
  return (
    <g>
      <ellipse cx={px} cy={py + 7} rx="14" ry="5" fill="rgba(0,0,0,0.06)" />
      {/* 화분 — 아이소메트릭 흰색 */}
      <polygon points={`${px - 9},${py + 5} ${px - 7},${py - 4} ${px + 7},${py - 4} ${px + 9},${py + 5}`} fill="white" />
      <polygon points={`${px - 9},${py + 5} ${px - 7},${py - 4} ${px},${py - 1} ${px},${py + 7}`} fill="#E8E8E8" />
      <polygon points={`${px + 9},${py + 5} ${px + 7},${py - 4} ${px},${py - 1} ${px},${py + 7}`} fill="#F0F0F0" />
      <rect x={px - 10} y={py - 7} width="20" height="4" rx="2" fill="#E0E0E0" />
      <ellipse cx={px} cy={py - 4} rx="8" ry="3" fill="#5C3318" />
      {/* 줄기 */}
      <line x1={px} y1={py - 6} x2={px - 3} y2={py - 28} stroke="#4A9455" strokeWidth="2.5" />
      <line x1={px} y1={py - 6} x2={px + 5} y2={py - 26} stroke="#4A9455" strokeWidth="2" />
      {/* 잎 — 입체적 */}
      <ellipse cx={px - 10} cy={py - 28} rx="12" ry="6" fill="#5DAA68" transform={`rotate(-30 ${px - 10} ${py - 28})`} />
      <ellipse cx={px - 9} cy={py - 27} rx="10" ry="5" fill="#6BBF78" transform={`rotate(-30 ${px - 9} ${py - 27})`} />
      <ellipse cx={px + 10} cy={py - 26} rx="11" ry="5.5" fill="#5DAA68" transform={`rotate(25 ${px + 10} ${py - 26})`} />
      <ellipse cx={px + 11} cy={py - 25} rx="9" ry="4.5" fill="#6BBF78" transform={`rotate(25 ${px + 11} ${py - 25})`} />
      <ellipse cx={px - 2} cy={py - 34} rx="9" ry="5" fill="#4A9455" transform={`rotate(-10 ${px - 2} ${py - 34})`} />
      <ellipse cx={px - 1} cy={py - 33} rx="7" ry="4" fill="#5DAA68" transform={`rotate(-10 ${px - 1} ${py - 33})`} />
    </g>
  );
}

function renderCherryBlossom(px: number, py: number) {
  return (
    <g>
      <ellipse cx={px} cy={py + 8} rx="16" ry="5" fill="rgba(0,0,0,0.06)" />
      {/* 화분 */}
      <polygon points={`${px - 8},${py + 6} ${px - 6},${py - 2} ${px + 6},${py - 2} ${px + 8},${py + 6}`} fill="#FFB0B0" />
      <polygon points={`${px - 8},${py + 6} ${px - 6},${py - 2} ${px},${py} ${px},${py + 8}`} fill="#FF9494" />
      <rect x={px - 9} y={py - 5} width="18" height="4" rx="2" fill="#FF8A8A" />
      <ellipse cx={px} cy={py - 2} rx="7" ry="3" fill="#5C3318" />
      {/* 나무 줄기 */}
      <line x1={px} y1={py - 4} x2={px} y2={py - 26} stroke="#8B6F47" strokeWidth="3" />
      <line x1={px} y1={py - 18} x2={px - 8} y2={py - 28} stroke="#8B6F47" strokeWidth="2" />
      <line x1={px} y1={py - 20} x2={px + 7} y2={py - 30} stroke="#8B6F47" strokeWidth="2" />
      {/* 벚꽃 */}
      {[-8, 0, 7, -4, 4].map((ox, i) => (
        <circle key={i} cx={px + ox} cy={py - 28 - i * 2.5 - Math.abs(ox)} r={3.5 - i * 0.2} fill={i % 2 === 0 ? '#FFB8C6' : '#FFC8D6'} opacity="0.85" />
      ))}
      {/* 떨어지는 꽃잎 */}
      <circle cx={px + 12} cy={py - 15} r="1.5" fill="#FFD0D8" opacity="0.5">
        <animate attributeName="cy" values={`${py - 20};${py};${py - 20}`} dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0;0.5" dur="4s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

function renderFlowerPot(px: number, py: number) {
  return (
    <g>
      <ellipse cx={px} cy={py + 8} rx="12" ry="4" fill="rgba(0,0,0,0.06)" />
      {/* 화분 */}
      <polygon points={`${px - 7},${py + 5} ${px - 5},${py - 3} ${px + 5},${py - 3} ${px + 7},${py + 5}`} fill="#E88B5A" />
      <polygon points={`${px - 7},${py + 5} ${px - 5},${py - 3} ${px},${py - 1} ${px},${py + 7}`} fill="#D47A4A" />
      <ellipse cx={px} cy={py - 3} rx="6" ry="2.5" fill="#5C3318" />
      {/* 줄기 */}
      <line x1={px - 2} y1={py - 5} x2={px - 2} y2={py - 18} stroke="#4A9455" strokeWidth="1.5" />
      <line x1={px + 2} y1={py - 5} x2={px + 3} y2={py - 16} stroke="#4A9455" strokeWidth="1.5" />
      <line x1={px} y1={py - 5} x2={px - 4} y2={py - 20} stroke="#4A9455" strokeWidth="1.5" />
      {/* 튤립 */}
      <ellipse cx={px - 4} cy={py - 22} rx="3.5" ry="4.5" fill="#FF6B6B" />
      <ellipse cx={px - 4} cy={py - 23} rx="2.5" ry="3" fill="#FF8A8A" />
      <ellipse cx={px - 2} cy={py - 19} rx="3" ry="4" fill="#FFB347" />
      <ellipse cx={px - 2} cy={py - 20} rx="2" ry="2.5" fill="#FFD580" />
      <ellipse cx={px + 3} cy={py - 18} rx="3" ry="3.5" fill="#FF6B9D" />
      <ellipse cx={px + 3} cy={py - 19} rx="2" ry="2.5" fill="#FF8ABF" />
      {/* 잎 */}
      <ellipse cx={px + 6} cy={py - 10} rx="4" ry="2" fill="#5DAA68" transform={`rotate(30 ${px + 6} ${py - 10})`} />
    </g>
  );
}

function renderBigTree(px: number, py: number) {
  return (
    <g>
      <ellipse cx={px} cy={py + 10} rx="18" ry="6" fill="rgba(0,0,0,0.06)" />
      {/* 화분 — 큰 사각 */}
      <polygon points={`${px - 10},${py + 8} ${px - 8},${py - 4} ${px + 8},${py - 4} ${px + 10},${py + 8}`} fill="#8B7355" />
      <polygon points={`${px - 10},${py + 8} ${px - 8},${py - 4} ${px},${py - 1} ${px},${py + 10}`} fill="#7A6345" />
      <polygon points={`${px + 10},${py + 8} ${px + 8},${py - 4} ${px},${py - 1} ${px},${py + 10}`} fill="#9A8365" />
      <ellipse cx={px} cy={py - 4} rx="9" ry="3.5" fill="#5C3318" />
      {/* 나무 줄기 */}
      <rect x={px - 3} y={py - 25} width="6" height="22" rx="2" fill="#8B6F47" />
      <rect x={px - 2} y={py - 25} width="4" height="22" rx="1.5" fill="#A08060" />
      {/* 나뭇잎 — 둥근 캐노피 */}
      <circle cx={px} cy={py - 34} r="16" fill="#4A9455" />
      <circle cx={px - 3} cy={py - 36} r="14" fill="#5DAA68" />
      <circle cx={px + 2} cy={py - 38} r="11" fill="#6BBF78" />
      <circle cx={px - 5} cy={py - 30} r="8" fill="#5DAA68" opacity="0.8" />
      <circle cx={px + 6} cy={py - 31} r="7" fill="#4A9455" opacity="0.7" />
    </g>
  );
}

function renderAquarium(px: number, py: number) {
  return (
    <g>
      <ellipse cx={px} cy={py + 10} rx="20" ry="6" fill="rgba(0,0,0,0.06)" />
      {/* 수족관 — 아이소메트릭 박스 */}
      <polygon points={`${px - 16},${py - 22} ${px + 16},${py - 22} ${px + 16},${py + 6} ${px - 16},${py + 6}`} fill="#B8E4F0" opacity="0.5" />
      <polygon points={`${px - 16},${py - 22} ${px - 10},${py - 26} ${px + 22},${py - 26} ${px + 16},${py - 22}`} fill="#333" />
      <polygon points={`${px + 16},${py - 22} ${px + 22},${py - 26} ${px + 22},${py + 2} ${px + 16},${py + 6}`} fill="#8BD4E8" opacity="0.4" />
      {/* 물 */}
      <rect x={px - 14} y={py - 18} width="28" height="22" rx="1" fill="#7ECEC1" opacity="0.3" />
      {/* 모래 */}
      <rect x={px - 14} y={py + 1} width="28" height="4" rx="1" fill="#E8D5A0" opacity="0.6" />
      {/* 물고기 */}
      <g>
        <ellipse cx={px - 4} cy={py - 8} rx="4" ry="2.5" fill="#FF6B6B">
          <animate attributeName="cx" values={`${px - 10};${px + 10};${px - 10}`} dur="4s" repeatCount="indefinite" />
        </ellipse>
        <polygon points={`${px - 8},${py - 8} ${px - 12},${py - 12} ${px - 12},${py - 4}`} fill="#FF8A8A">
          <animate attributeName="points" values={`${px - 14},${py - 8} ${px - 18},${py - 12} ${px - 18},${py - 4};${px + 6},${py - 8} ${px + 2},${py - 12} ${px + 2},${py - 4};${px - 14},${py - 8} ${px - 18},${py - 12} ${px - 18},${py - 4}`} dur="4s" repeatCount="indefinite" />
        </polygon>
      </g>
      <g>
        <ellipse cx={px + 5} cy={py - 2} rx="3" ry="1.8" fill="#FFB347">
          <animate attributeName="cx" values={`${px + 8};${px - 6};${px + 8}`} dur="3.5s" repeatCount="indefinite" />
        </ellipse>
      </g>
      {/* 버블 */}
      <circle cx={px + 3} cy={py - 12} r="1.2" fill="white" opacity="0.4">
        <animate attributeName="cy" values={`${py - 5};${py - 20};${py - 5}`} dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* 수초 */}
      <path d={`M${px - 8},${py + 2} C${px - 10},${py - 6} ${px - 6},${py - 8} ${px - 8},${py - 14}`} fill="none" stroke="#4A9455" strokeWidth="1.5" opacity="0.6" />
      <path d={`M${px + 6},${py + 2} C${px + 8},${py - 4} ${px + 4},${py - 10} ${px + 7},${py - 12}`} fill="none" stroke="#5DAA68" strokeWidth="1.5" opacity="0.6" />
      {/* 프레임 */}
      <polygon points={`${px - 16},${py - 22} ${px + 16},${py - 22} ${px + 16},${py + 6} ${px - 16},${py + 6}`} fill="none" stroke="#444" strokeWidth="1.5" />
    </g>
  );
}

function renderHangingPlant(px: number, py: number) {
  // 벽 아이템 — 왼쪽 벽 상단에 고정
  const hx = 110, hy = 85;
  return (
    <g>
      {/* 고리 */}
      <circle cx={hx} cy={hy} r="3" fill="#8B6F47" />
      {/* 줄 */}
      <line x1={hx} y1={hy + 3} x2={hx} y2={hy + 15} stroke="#A08060" strokeWidth="1" />
      {/* 화분 */}
      <polygon points={`${hx - 6},${hy + 15} ${hx - 5},${hy + 22} ${hx + 5},${hy + 22} ${hx + 6},${hy + 15}`} fill="#C4956A" />
      <ellipse cx={hx} cy={hy + 15} rx="6" ry="2" fill="#D4A574" />
      {/* 늘어지는 덩굴 */}
      <path d={`M${hx - 3},${hy + 18} C${hx - 10},${hy + 28} ${hx - 5},${hy + 35} ${hx - 12},${hy + 42}`} fill="none" stroke="#5DAA68" strokeWidth="1.5" />
      <path d={`M${hx + 2},${hy + 18} C${hx + 8},${hy + 30} ${hx + 3},${hy + 36} ${hx + 10},${hy + 44}`} fill="none" stroke="#4A9455" strokeWidth="1.5" />
      <path d={`M${hx},${hy + 18} C${hx - 4},${hy + 25} ${hx + 2},${hy + 32} ${hx - 2},${hy + 40}`} fill="none" stroke="#6BBF78" strokeWidth="1.2" />
      {/* 잎 */}
      {[[-10, 30], [-12, 38], [8, 32], [10, 40], [-2, 35]].map(([ox, oy], i) => (
        <ellipse key={i} cx={hx + ox} cy={hy + oy} rx="3" ry="1.8" fill={i % 2 === 0 ? '#5DAA68' : '#6BBF78'} transform={`rotate(${ox > 0 ? 30 : -30} ${hx + ox} ${hy + oy})`} />
      ))}
    </g>
  );
}
