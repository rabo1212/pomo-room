export default function RoomPlant() {
  return (
    <g>
      {/* Pot */}
      <polygon points="0,20 5,35 25,35 30,20" fill="#FF6B6B" />
      <rect x="-2" y="18" width="34" height="4" rx="1" fill="#E85555" />
      {/* Soil */}
      <ellipse cx="15" cy="21" rx="12" ry="3" fill="#6B4423" />
      {/* Stem */}
      <line x1="15" y1="20" x2="15" y2="5" stroke="#4A9455" strokeWidth="2" />
      {/* Leaves */}
      <ellipse cx="8" cy="8" rx="7" ry="4" fill="#5DAA68" transform="rotate(-30 8 8)" />
      <ellipse cx="22" cy="6" rx="7" ry="4" fill="#6BBF78" transform="rotate(25 22 6)" />
      <ellipse cx="15" cy="2" rx="5" ry="3.5" fill="#4A9455" transform="rotate(5 15 2)" />
      {/* Leaf veins */}
      <line x1="5" y1="7" x2="11" y2="9" stroke="#3D8B48" strokeWidth="0.5" opacity="0.5" />
      <line x1="19" y1="5" x2="25" y2="7" stroke="#5AAF65" strokeWidth="0.5" opacity="0.5" />
    </g>
  );
}
