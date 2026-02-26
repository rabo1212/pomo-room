export default function RoomBookshelf() {
  return (
    <g>
      {/* Shelf frame - isometric box */}
      {/* Front face */}
      <polygon points="0,0 0,60 30,50 30,-10" fill="#A67B50" />
      {/* Top face */}
      <polygon points="0,0 30,-10 55,-2 25,8" fill="#C4956A" />
      {/* Side face */}
      <polygon points="30,-10 55,-2 55,48 30,50" fill="#8B6F47" />

      {/* Shelf divider */}
      <line x1="2" y1="28" x2="29" y2="19" stroke="#8B6F47" strokeWidth="1.5" />

      {/* Top shelf books */}
      <rect x="4" y="6" width="4" height="18" rx="0.5" fill="#FF6B6B" />
      <rect x="9" y="8" width="4" height="16" rx="0.5" fill="#7ECEC1" />
      <rect x="14" y="5" width="4" height="19" rx="0.5" fill="#B8A9C9" />
      <rect x="19" y="9" width="4" height="15" rx="0.5" fill="#FFB347" />

      {/* Bottom shelf books */}
      <rect x="4" y="32" width="4" height="16" rx="0.5" fill="#9A87B3" />
      <rect x="9" y="34" width="4" height="14" rx="0.5" fill="#7FB3D8" />
      <rect x="14" y="31" width="5" height="17" rx="0.5" fill="#E85555" />
      <rect x="20" y="33" width="4" height="15" rx="0.5" fill="#5BB8A8" />
    </g>
  );
}
