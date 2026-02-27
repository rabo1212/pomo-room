// 장식 렌더러 — 5종

const WALL_H = 155;

export function renderDecor(itemId: string, pos: [number, number], wallH: number = WALL_H) {
  const [px, py] = pos;

  switch (itemId) {
    case 'decor_01': return renderWallClock(wallH);
    case 'decor_02': return renderMirror(wallH);
    case 'decor_03': return renderTrophy(px, py);
    case 'decor_04': return renderPhotoFrame(wallH);
    case 'decor_05': return renderGlobe(px, py);
    default: return null;
  }
}

function renderWallClock(wallH: number) {
  // 왼쪽 벽 중앙에 배치
  const t = 0.4;
  const cx = 60 + t * 190;
  const yCeil = (225 - wallH) - t * 95;
  const yFloor = 225 - t * 95;
  const cy = yCeil + (yFloor - yCeil) * 0.35;
  return (
    <g>
      {/* 시계 몸통 — 원형 */}
      <circle cx={cx} cy={cy} r="12" fill="#8B6914" />
      <circle cx={cx} cy={cy} r="11" fill="#FFF8E7" />
      <circle cx={cx} cy={cy} r="10.5" fill="#FFFDF5" />
      {/* 시간 표시 점 */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const r = i % 3 === 0 ? 8.5 : 9;
        const dotR = i % 3 === 0 ? 1.2 : 0.6;
        return (
          <circle
            key={i}
            cx={cx + Math.sin(rad) * r}
            cy={cy - Math.cos(rad) * r}
            r={dotR}
            fill="#333"
          />
        );
      })}
      {/* 시침 (10시 방향) */}
      <line x1={cx} y1={cy} x2={cx - 3} y2={cy - 5} stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      {/* 분침 (2시 방향) */}
      <line x1={cx} y1={cy} x2={cx + 5} y2={cy - 4} stroke="#333" strokeWidth="1" strokeLinecap="round" />
      {/* 초침 */}
      <line x1={cx} y1={cy} x2={cx + 2} y2={cy + 6} stroke="#FF6B6B" strokeWidth="0.5" strokeLinecap="round">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${cx} ${cy}`}
          to={`360 ${cx} ${cy}`}
          dur="60s"
          repeatCount="indefinite"
        />
      </line>
      {/* 중심 핀 */}
      <circle cx={cx} cy={cy} r="1" fill="#333" />
      {/* 테두리 하이라이트 */}
      <circle cx={cx} cy={cy} r="12" fill="none" stroke="#A67B14" strokeWidth="1.5" />
    </g>
  );
}

function renderMirror(wallH: number) {
  // 왼쪽 벽에 배치
  const t = 0.65;
  const mx = 60 + t * 190;
  const yCeil = (225 - wallH) - t * 95;
  const yFloor = 225 - t * 95;
  const my = yCeil + (yFloor - yCeil) * 0.3;
  return (
    <g>
      {/* 프레임 */}
      <rect x={mx - 10} y={my - 16} width="20" height="28" rx="3" fill="#C4956A" />
      <rect x={mx - 9} y={my - 15} width="18" height="26" rx="2" fill="#B8875E" />
      {/* 거울 면 */}
      <rect x={mx - 8} y={my - 14} width="16" height="24" rx="1.5" fill="#D0E8F0" />
      <rect x={mx - 8} y={my - 14} width="16" height="24" rx="1.5" fill="url(#mirrorGrad)" opacity="0.5" />
      {/* 반사 하이라이트 */}
      <line x1={mx - 5} y1={my - 10} x2={mx - 3} y2={my + 4} stroke="white" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <line x1={mx - 2} y1={my - 12} x2={mx} y2={my + 2} stroke="white" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
      {/* 반짝임 */}
      <circle cx={mx + 4} cy={my - 8} r="1.5" fill="white" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

function renderTrophy(px: number, py: number) {
  return (
    <g>
      <ellipse cx={px} cy={py + 6} rx="10" ry="4" fill="rgba(0,0,0,0.06)" />
      {/* 받침대 — 아이소메트릭 */}
      <polygon points={`${px - 6},${py + 3} ${px},${py} ${px + 6},${py + 3} ${px},${py + 6}`} fill="#555" />
      <polygon points={`${px - 6},${py + 3} ${px},${py + 6} ${px},${py + 8} ${px - 6},${py + 5}`} fill="#444" />
      <polygon points={`${px + 6},${py + 3} ${px},${py + 6} ${px},${py + 8} ${px + 6},${py + 5}`} fill="#4A4A4A" />
      {/* 기둥 */}
      <rect x={px - 1.5} y={py - 8} width="3" height="9" fill="#DAA520" />
      <rect x={px - 1} y={py - 8} width="2" height="9" fill="#FFD700" />
      {/* 컵 부분 */}
      <path d={`M${px - 6},${py - 18} Q${px - 7},${py - 10} ${px - 3},${py - 8} L${px + 3},${py - 8} Q${px + 7},${py - 10} ${px + 6},${py - 18} Z`} fill="#DAA520" />
      <path d={`M${px - 5},${py - 17} Q${px - 6},${py - 11} ${px - 2.5},${py - 9} L${px + 2.5},${py - 9} Q${px + 6},${py - 11} ${px + 5},${py - 17} Z`} fill="#FFD700" />
      {/* 손잡이 */}
      <path d={`M${px - 6},${py - 16} Q${px - 10},${py - 14} ${px - 6},${py - 11}`} fill="none" stroke="#DAA520" strokeWidth="1.5" />
      <path d={`M${px + 6},${py - 16} Q${px + 10},${py - 14} ${px + 6},${py - 11}`} fill="none" stroke="#DAA520" strokeWidth="1.5" />
      {/* 별 장식 */}
      <polygon points={`${px},${py - 17} ${px + 1},${py - 15} ${px + 3},${py - 14.5} ${px + 1.5},${py - 13} ${px + 2},${py - 11} ${px},${py - 12.5} ${px - 2},${py - 11} ${px - 1.5},${py - 13} ${px - 3},${py - 14.5} ${px - 1},${py - 15}`} fill="#FFF8DC" opacity="0.7" />
      {/* 반짝임 */}
      <circle cx={px + 3} cy={py - 15} r="1" fill="white" opacity="0.4">
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

function renderPhotoFrame(wallH: number) {
  // 오른쪽 벽에 배치
  const t = 0.3;
  const fx = 250 + t * 190;
  const yCeil = (130 - wallH) + t * 95;
  const yFloor = 130 + t * 95;
  const fy = yCeil + (yFloor - yCeil) * 0.25;
  return (
    <g>
      {/* 프레임 — 아이소메트릭 벽면 */}
      <polygon points={`${fx - 10},${fy - 10} ${fx + 6},${fy - 14} ${fx + 6},${fy + 6} ${fx - 10},${fy + 10}`} fill="#8B6914" />
      <polygon points={`${fx - 9},${fy - 9} ${fx + 5},${fy - 13} ${fx + 5},${fy + 5} ${fx - 9},${fy + 9}`} fill="#A67B14" />
      {/* 사진 영역 */}
      <polygon points={`${fx - 7},${fy - 7} ${fx + 3},${fy - 10.5} ${fx + 3},${fy + 3.5} ${fx - 7},${fy + 7}`} fill="#FFE4B5" />
      {/* 사진 내용 — 풍경 */}
      <polygon points={`${fx - 7},${fy + 2} ${fx - 3},${fy - 3} ${fx},${fy} ${fx + 3},${fy - 2} ${fx + 3},${fy + 3.5} ${fx - 7},${fy + 7}`} fill="#7ECEC1" opacity="0.5" />
      <circle cx={fx - 3} cy={fy - 5} r="1.5" fill="#FFD700" opacity="0.6" />
      {/* 프레임 하이라이트 */}
      <line x1={fx - 10} y1={fy - 10} x2={fx + 6} y2={fy - 14} stroke="#C4956A" strokeWidth="0.5" opacity="0.5" />
    </g>
  );
}

function renderGlobe(px: number, py: number) {
  return (
    <g>
      <ellipse cx={px} cy={py + 8} rx="10" ry="4" fill="rgba(0,0,0,0.06)" />
      {/* 받침 */}
      <ellipse cx={px} cy={py + 5} rx="6" ry="2.5" fill="#8B6914" />
      <ellipse cx={px} cy={py + 4.5} rx="6" ry="2.5" fill="#A67B14" />
      {/* 기둥 */}
      <line x1={px} y1={py + 3} x2={px} y2={py - 2} stroke="#8B6914" strokeWidth="2" />
      {/* 지구본 */}
      <circle cx={px} cy={py - 10} r="10" fill="#4A90D9" />
      <circle cx={px} cy={py - 10} r="9.5" fill="#5BA0E9" />
      {/* 대륙 표현 */}
      <ellipse cx={px - 3} cy={py - 13} rx="3" ry="4" fill="#6DBF6D" opacity="0.7" />
      <ellipse cx={px + 4} cy={py - 9} rx="4" ry="3" fill="#6DBF6D" opacity="0.6" />
      <ellipse cx={px - 1} cy={py - 6} rx="2" ry="1.5" fill="#6DBF6D" opacity="0.5" />
      {/* 경위선 */}
      <ellipse cx={px} cy={py - 10} rx="9.5" ry="4" fill="none" stroke="#3A80C9" strokeWidth="0.3" opacity="0.5" />
      <ellipse cx={px} cy={py - 10} rx="4" ry="9.5" fill="none" stroke="#3A80C9" strokeWidth="0.3" opacity="0.5" />
      <line x1={px - 9.5} y1={py - 10} x2={px + 9.5} y2={py - 10} stroke="#3A80C9" strokeWidth="0.3" opacity="0.3" />
      {/* 반짝 하이라이트 */}
      <ellipse cx={px - 3} cy={py - 14} rx="3" ry="4" fill="white" opacity="0.1" />
      {/* 회전 축 */}
      <line x1={px} y1={py - 21} x2={px} y2={py + 1} stroke="#A67B14" strokeWidth="0.8" opacity="0.6" />
      {/* 느린 회전 효과 */}
      <circle cx={px} cy={py - 10} r="9.5" fill="none" stroke="white" strokeWidth="0.3" opacity="0.1" strokeDasharray="2 4">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${px} ${py - 10}`}
          to={`360 ${px} ${py - 10}`}
          dur="20s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
}
