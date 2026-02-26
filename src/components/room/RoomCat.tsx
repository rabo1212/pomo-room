export default function RoomCat() {
  return (
    <g>
      {/* Body */}
      <ellipse cx="20" cy="18" rx="15" ry="10" fill="#FFB347" />
      {/* Stripes */}
      <path d="M12,12 Q20,10 25,14" fill="none" stroke="#E89A2E" strokeWidth="1" opacity="0.4" />
      <path d="M14,18 Q20,16 24,19" fill="none" stroke="#E89A2E" strokeWidth="1" opacity="0.3" />

      {/* Head */}
      <circle cx="6" cy="10" r="8" fill="#FFB347" />
      {/* Ears */}
      <polygon points="0,3 -2,-4 5,0" fill="#FFB347" />
      <polygon points="12,3 14,-4 7,0" fill="#FFB347" />
      <polygon points="1,2 0,-2 4,1" fill="#FFD5D5" />
      <polygon points="11,2 12,-2 8,1" fill="#FFD5D5" />

      {/* Eyes */}
      <ellipse cx="3" cy="9" rx="1.5" ry="1.8" fill="#3D3D3D">
        <animate attributeName="ry" values="1.8;0.3;1.8" dur="4s" repeatCount="indefinite" keyTimes="0;0.48;0.52" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" calcMode="spline" />
      </ellipse>
      <ellipse cx="9" cy="9" rx="1.5" ry="1.8" fill="#3D3D3D">
        <animate attributeName="ry" values="1.8;0.3;1.8" dur="4s" repeatCount="indefinite" keyTimes="0;0.48;0.52" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" calcMode="spline" />
      </ellipse>

      {/* Nose */}
      <ellipse cx="6" cy="12" rx="1" ry="0.7" fill="#FFB0B0" />
      {/* Mouth */}
      <path d="M5,13 Q6,14.5 7,13" fill="none" stroke="#CC9988" strokeWidth="0.5" />

      {/* Whiskers */}
      <line x1="-4" y1="11" x2="2" y2="12" stroke="#DDD" strokeWidth="0.4" />
      <line x1="-3" y1="13" x2="2" y2="13" stroke="#DDD" strokeWidth="0.4" />
      <line x1="10" y1="12" x2="16" y2="11" stroke="#DDD" strokeWidth="0.4" />
      <line x1="10" y1="13" x2="15" y2="13" stroke="#DDD" strokeWidth="0.4" />

      {/* Tail */}
      <path d="M35,15 C40,10 42,5 38,2" fill="none" stroke="#FFB347" strokeWidth="3" strokeLinecap="round">
        <animate attributeName="d" values="M35,15 C40,10 42,5 38,2;M35,15 C40,12 44,8 40,5;M35,15 C40,10 42,5 38,2" dur="3s" repeatCount="indefinite" />
      </path>

      {/* Front paws */}
      <ellipse cx="8" cy="25" rx="3" ry="2" fill="#FFC875" />
      <ellipse cx="16" cy="25" rx="3" ry="2" fill="#FFC875" />
    </g>
  );
}
