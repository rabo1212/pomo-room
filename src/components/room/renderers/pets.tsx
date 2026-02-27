// 동물 렌더러 — 7종 (고양이 3 + 신규 4)

export function renderPet(itemId: string, pos: [number, number]) {
  const [px, py] = pos;

  switch (itemId) {
    case 'cat_01': return renderCat(px, py, 'orange');
    case 'cat_02': return renderCat(px, py, 'black');
    case 'cat_03': return renderCat(px, py, 'tricolor');
    case 'pet_01': return renderDog(px, py);
    case 'pet_02': return renderHamster(px, py);
    case 'pet_03': return renderParrot(px, py);
    case 'pet_04': return renderFishBowl(px, py);
    default: return null;
  }
}

type CatType = 'orange' | 'black' | 'tricolor';

function renderCat(cx: number, cy: number, type: CatType) {
  const colors = type === 'black'
    ? { body: '#444', head: '#444', ear: '#555', earInner: '#886666', eye: '#FFD700', paw: '#555', tail: '#444', nose: '#888' }
    : type === 'tricolor'
    ? { body: '#FFB347', head: '#F5F5F5', ear: '#F5F5F5', earInner: '#FFD5D5', eye: '#3D3D3D', paw: '#444', tail: '#FFB347', nose: '#FFB0B0' }
    : { body: '#FFB347', head: '#FFB347', ear: '#FFB347', earInner: '#FFD5D5', eye: '#3D3D3D', paw: '#FFC875', tail: '#FFB347', nose: '#FFB0B0' };

  return (
    <g>
      <ellipse cx={cx + 8} cy={cy + 10} rx="16" ry="5" fill="rgba(0,0,0,0.06)" />
      {/* 몸통 */}
      <ellipse cx={cx + 8} cy={cy} rx="13" ry="8" fill={colors.body} />
      <ellipse cx={cx + 8} cy={cy - 1} rx="11" ry="6" fill={colors.body} opacity="0.7" />
      {type === 'tricolor' && (
        <>
          <ellipse cx={cx + 3} cy={cy - 2} rx="5" ry="4" fill="#444" opacity="0.7" />
          <ellipse cx={cx + 14} cy={cy + 1} rx="4" ry="3" fill="#FFB347" opacity="0.7" />
        </>
      )}
      {/* 머리 */}
      <circle cx={cx - 4} cy={cy - 5} r="7" fill={colors.head} />
      <circle cx={cx - 4} cy={cy - 6} r="6" fill={colors.head} opacity="0.8" />
      {type === 'tricolor' && <circle cx={cx - 7} cy={cy - 6} r="3.5" fill="#FFB347" opacity="0.7" />}
      {/* 귀 */}
      <polygon points={`${cx - 9},${cy - 10} ${cx - 11},${cy - 18} ${cx - 4},${cy - 13}`} fill={colors.ear} />
      <polygon points={`${cx + 1},${cy - 10} ${cx + 3},${cy - 18} ${cx - 4},${cy - 13}`} fill={colors.ear} />
      <polygon points={`${cx - 8},${cy - 11} ${cx - 10},${cy - 16} ${cx - 5},${cy - 12}`} fill={colors.earInner} />
      <polygon points={`${cx},${cy - 11} ${cx + 2},${cy - 16} ${cx - 3},${cy - 12}`} fill={colors.earInner} />
      {/* 눈 — 깜빡임 */}
      <ellipse cx={cx - 7} cy={cy - 5} rx="1.3" ry="1.6" fill={colors.eye}>
        <animate attributeName="ry" values="1.6;0.2;1.6" keyTimes="0;0.025;0.05" dur="5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx={cx - 1} cy={cy - 5} rx="1.3" ry="1.6" fill={colors.eye}>
        <animate attributeName="ry" values="1.6;0.2;1.6" keyTimes="0;0.025;0.05" dur="5s" repeatCount="indefinite" />
      </ellipse>
      {/* 코 */}
      <ellipse cx={cx - 4} cy={cy - 2} rx="1" ry="0.6" fill={colors.nose} />
      {/* 꼬리 — 흔들림 */}
      <path d={`M${cx + 21},${cy - 2} C${cx + 26},${cy - 8} ${cx + 28},${cy - 14} ${cx + 25},${cy - 17}`} fill="none" stroke={colors.tail} strokeWidth="2.5" strokeLinecap="round">
        <animate attributeName="d" values={`M${cx + 21},${cy - 2} C${cx + 26},${cy - 8} ${cx + 28},${cy - 14} ${cx + 25},${cy - 17};M${cx + 21},${cy - 2} C${cx + 27},${cy - 6} ${cx + 30},${cy - 11} ${cx + 28},${cy - 14};M${cx + 21},${cy - 2} C${cx + 26},${cy - 8} ${cx + 28},${cy - 14} ${cx + 25},${cy - 17}`} dur="3s" repeatCount="indefinite" />
      </path>
      {/* 발 */}
      <ellipse cx={cx} cy={cy + 6} rx="3" ry="2" fill={colors.paw} />
      <ellipse cx={cx + 8} cy={cy + 6} rx="3" ry="2" fill={colors.paw} />
    </g>
  );
}

function renderDog(cx: number, cy: number) {
  return (
    <g>
      <ellipse cx={cx + 6} cy={cy + 12} rx="16" ry="5" fill="rgba(0,0,0,0.06)" />
      {/* 몸통 — 아이소메트릭 */}
      <ellipse cx={cx + 6} cy={cy} rx="14" ry="9" fill="#D4A574" />
      <ellipse cx={cx + 6} cy={cy - 1} rx="12" ry="7" fill="#E0B98A" />
      {/* 머리 */}
      <circle cx={cx - 5} cy={cy - 6} r="8" fill="#D4A574" />
      <circle cx={cx - 5} cy={cy - 7} r="7" fill="#E0B98A" />
      {/* 주둥이 */}
      <ellipse cx={cx - 9} cy={cy - 3} rx="4" ry="3" fill="#E8C9A0" />
      <ellipse cx={cx - 9} cy={cy - 4} rx="2" ry="1.5" fill="#3D3D3D" />
      {/* 귀 — 축 처짐 */}
      <ellipse cx={cx - 11} cy={cy - 5} rx="4" ry="7" fill="#C4956A" transform={`rotate(-20 ${cx - 11} ${cy - 5})`} />
      <ellipse cx={cx + 1} cy={cy - 6} rx="3.5" ry="6" fill="#C4956A" transform={`rotate(15 ${cx + 1} ${cy - 6})`} />
      {/* 눈 */}
      <circle cx={cx - 7} cy={cy - 8} r="1.8" fill="#3D3D3D">
        <animate attributeName="r" values="1.8;0.3;1.8" keyTimes="0;0.025;0.05" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx - 2} cy={cy - 8} r="1.8" fill="#3D3D3D">
        <animate attributeName="r" values="1.8;0.3;1.8" keyTimes="0;0.025;0.05" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx - 6.5} cy={cy - 8.5} r="0.6" fill="white" />
      <circle cx={cx - 1.5} cy={cy - 8.5} r="0.6" fill="white" />
      {/* 혀 */}
      <ellipse cx={cx - 9} cy={cy - 1} rx="1.5" ry="2" fill="#FF8A8A" />
      {/* 꼬리 — 흔들림 */}
      <path d={`M${cx + 20},${cy - 3} Q${cx + 24},${cy - 12} ${cx + 22},${cy - 18}`} fill="none" stroke="#D4A574" strokeWidth="3" strokeLinecap="round">
        <animate attributeName="d" values={`M${cx + 20},${cy - 3} Q${cx + 24},${cy - 12} ${cx + 22},${cy - 18};M${cx + 20},${cy - 3} Q${cx + 26},${cy - 10} ${cx + 28},${cy - 14};M${cx + 20},${cy - 3} Q${cx + 24},${cy - 12} ${cx + 22},${cy - 18}`} dur="0.8s" repeatCount="indefinite" />
      </path>
      {/* 발 */}
      <ellipse cx={cx - 2} cy={cy + 7} rx="3.5" ry="2.5" fill="#C4956A" />
      <ellipse cx={cx + 10} cy={cy + 7} rx="3.5" ry="2.5" fill="#C4956A" />
    </g>
  );
}

function renderHamster(cx: number, cy: number) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + 8} rx="10" ry="3.5" fill="rgba(0,0,0,0.06)" />
      {/* 몸통 — 뚱뚱한 원형 */}
      <ellipse cx={cx} cy={cy} rx="9" ry="7" fill="#FFD5A0" />
      <ellipse cx={cx} cy={cy + 1} rx="7" ry="5" fill="#FFE4C0" />
      {/* 머리 */}
      <circle cx={cx} cy={cy - 6} r="7" fill="#FFD5A0" />
      <circle cx={cx} cy={cy - 5} r="6" fill="#FFE4C0" />
      {/* 볼 — 볼록한 볼 */}
      <circle cx={cx - 5} cy={cy - 4} r="3" fill="#FFBFA0" opacity="0.5" />
      <circle cx={cx + 5} cy={cy - 4} r="3" fill="#FFBFA0" opacity="0.5" />
      {/* 귀 */}
      <circle cx={cx - 5} cy={cy - 12} r="2.5" fill="#FFD5A0" />
      <circle cx={cx - 5} cy={cy - 12} r="1.5" fill="#FFB8B8" />
      <circle cx={cx + 5} cy={cy - 12} r="2.5" fill="#FFD5A0" />
      <circle cx={cx + 5} cy={cy - 12} r="1.5" fill="#FFB8B8" />
      {/* 눈 */}
      <circle cx={cx - 3} cy={cy - 7} r="1.5" fill="#3D3D3D" />
      <circle cx={cx + 3} cy={cy - 7} r="1.5" fill="#3D3D3D" />
      <circle cx={cx - 2.5} cy={cy - 7.5} r="0.5" fill="white" />
      <circle cx={cx + 3.5} cy={cy - 7.5} r="0.5" fill="white" />
      {/* 코 */}
      <ellipse cx={cx} cy={cy - 4} rx="1" ry="0.7" fill="#FFB0B0" />
      {/* 수염 */}
      <line x1={cx - 6} y1={cy - 4} x2={cx - 12} y2={cy - 5} stroke="#D4A574" strokeWidth="0.5" opacity="0.5" />
      <line x1={cx - 6} y1={cy - 3} x2={cx - 12} y2={cy - 2} stroke="#D4A574" strokeWidth="0.5" opacity="0.5" />
      <line x1={cx + 6} y1={cy - 4} x2={cx + 12} y2={cy - 5} stroke="#D4A574" strokeWidth="0.5" opacity="0.5" />
      <line x1={cx + 6} y1={cy - 3} x2={cx + 12} y2={cy - 2} stroke="#D4A574" strokeWidth="0.5" opacity="0.5" />
      {/* 앞발 */}
      <ellipse cx={cx - 4} cy={cy + 5} rx="2.5" ry="1.5" fill="#FFD5A0" />
      <ellipse cx={cx + 4} cy={cy + 5} rx="2.5" ry="1.5" fill="#FFD5A0" />
    </g>
  );
}

function renderParrot(cx: number, cy: number) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + 10} rx="10" ry="4" fill="rgba(0,0,0,0.06)" />
      {/* 횃대 */}
      <line x1={cx - 10} y1={cy + 6} x2={cx + 10} y2={cy + 6} stroke="#8B6F47" strokeWidth="3" strokeLinecap="round" />
      {/* 몸통 */}
      <ellipse cx={cx} cy={cy - 2} rx="7" ry="10" fill="#4CAF50" />
      <ellipse cx={cx - 1} cy={cy - 2} rx="5.5" ry="8" fill="#66BB6A" />
      {/* 날개 — 접힌 상태 */}
      <ellipse cx={cx + 5} cy={cy} rx="4" ry="8" fill="#388E3C" transform={`rotate(10 ${cx + 5} ${cy})`} />
      {/* 머리 */}
      <circle cx={cx - 1} cy={cy - 12} r="6" fill="#FFD700" />
      <circle cx={cx - 1} cy={cy - 13} r="5" fill="#FFEB3B" />
      {/* 부리 */}
      <polygon points={`${cx - 6},${cy - 12} ${cx - 10},${cy - 10} ${cx - 5},${cy - 9}`} fill="#FF6B6B" />
      <line x1={cx - 6} y1={cy - 11} x2={cx - 9} y2={cy - 10.5} stroke="#E85555" strokeWidth="0.5" />
      {/* 눈 */}
      <circle cx={cx - 3} cy={cy - 13} r="1.5" fill="#3D3D3D" />
      <circle cx={cx - 2.5} cy={cy - 13.5} r="0.5" fill="white" />
      {/* 꼬리 깃털 */}
      <path d={`M${cx},${cy + 6} L${cx + 3},${cy + 18}`} stroke="#4CAF50" strokeWidth="2" />
      <path d={`M${cx + 1},${cy + 6} L${cx + 5},${cy + 17}`} stroke="#FF6B6B" strokeWidth="1.5" />
      <path d={`M${cx - 1},${cy + 6} L${cx + 1},${cy + 19}`} stroke="#2196F3" strokeWidth="1.5" />
      {/* 발 */}
      <line x1={cx - 3} y1={cy + 6} x2={cx - 3} y2={cy + 8} stroke="#444" strokeWidth="1.5" />
      <line x1={cx + 3} y1={cy + 6} x2={cx + 3} y2={cy + 8} stroke="#444" strokeWidth="1.5" />
      {/* 머리 까딱 */}
      <animateTransform attributeName="transform" type="rotate" values="0 ${cx} ${cy};3 ${cx} ${cy};0 ${cx} ${cy};-2 ${cx} ${cy};0 ${cx} ${cy}" dur="4s" repeatCount="indefinite" />
    </g>
  );
}

function renderFishBowl(cx: number, cy: number) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + 10} rx="12" ry="4" fill="rgba(0,0,0,0.06)" />
      {/* 어항 — 둥근 유리 */}
      <circle cx={cx} cy={cy - 4} r="14" fill="#D0EEF5" opacity="0.4" />
      <circle cx={cx} cy={cy - 4} r="13" fill="#B8E4F0" opacity="0.3" />
      {/* 물 */}
      <clipPath id="bowlClip">
        <circle cx={cx} cy={cy - 4} r="12" />
      </clipPath>
      <rect x={cx - 12} y={cy - 8} width="24" height="18" fill="#7ECEC1" opacity="0.25" clipPath="url(#bowlClip)" />
      {/* 금붕어 */}
      <ellipse cx={cx - 2} cy={cy - 2} rx="3.5" ry="2" fill="#FF6B6B">
        <animate attributeName="cx" values={`${cx - 5};${cx + 5};${cx - 5}`} dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx={cx + 3} cy={cy - 6} rx="2.5" ry="1.5" fill="#FFB347">
        <animate attributeName="cx" values={`${cx + 5};${cx - 3};${cx + 5}`} dur="3.8s" repeatCount="indefinite" />
      </ellipse>
      {/* 유리 반사 */}
      <ellipse cx={cx - 6} cy={cy - 10} rx="3" ry="5" fill="white" opacity="0.2" transform={`rotate(-15 ${cx - 6} ${cy - 10})`} />
      {/* 모래 */}
      <ellipse cx={cx} cy={cy + 6} rx="10" ry="3" fill="#E8D5A0" opacity="0.5" />
      {/* 테두리 */}
      <circle cx={cx} cy={cy - 4} r="14" fill="none" stroke="#A0D0E0" strokeWidth="1" />
      {/* 주둥이 */}
      <ellipse cx={cx} cy={cy - 17} rx="6" ry="2" fill="#A0D0E0" opacity="0.6" />
      {/* 버블 */}
      <circle cx={cx + 2} cy={cy - 8} r="1" fill="white" opacity="0.5">
        <animate attributeName="cy" values={`${cy - 4};${cy - 15};${cy - 4}`} dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}
