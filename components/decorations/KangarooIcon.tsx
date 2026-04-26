type Props = { className?: string }

// Kangaroo silhouette — upright profile facing right, built from overlapping filled shapes
export default function KangarooIcon({ className }: Props) {
  return (
    <svg
      viewBox="0 0 180 260"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
      aria-label="Kangaroo silhouette"
    >
      {/* Tail — thick at base, sweeping down-left to ground */}
      <path d="M 72,172 C 56,192 40,216 26,240 C 20,250 18,258 24,260 C 30,262 38,252 44,242 C 58,218 72,194 84,174 Z" />

      {/* Hind leg (back) — thigh ellipse + lower leg + foot */}
      <ellipse cx="74" cy="183" rx="14" ry="26" transform="rotate(12 74 183)" />
      <path d="M 65,205 C 60,220 54,234 46,246 L 58,250 C 66,238 72,224 76,208 Z" />
      <ellipse cx="49" cy="249" rx="18" ry="6" />

      {/* Body — large oval, slight forward tilt */}
      <ellipse cx="94" cy="138" rx="44" ry="58" transform="rotate(6 94 138)" />

      {/* Hind leg (front) — thigh ellipse + lower leg + foot */}
      <ellipse cx="86" cy="186" rx="16" ry="28" transform="rotate(10 86 186)" />
      <path d="M 76,210 C 70,226 64,240 58,252 L 70,256 C 76,244 82,230 88,214 Z" />
      <ellipse cx="60" cy="255" rx="22" ry="8" />

      {/* Neck — angled ellipse connecting body to head */}
      <ellipse cx="124" cy="88" rx="16" ry="30" transform="rotate(28 124 88)" />

      {/* Head */}
      <ellipse cx="146" cy="58" rx="24" ry="17" />

      {/* Snout — extending forward from the head */}
      <ellipse cx="164" cy="66" rx="14" ry="10" />

      {/* Ear (back) — tall and slightly swept back */}
      <ellipse cx="130" cy="26" rx="8" ry="23" transform="rotate(-14 130 26)" />

      {/* Ear (front) — tall and slightly forward */}
      <ellipse cx="148" cy="24" rx="8" ry="23" transform="rotate(8 148 24)" />

      {/* Front arm — short, tucked at chest */}
      <path d="M 132,90 C 138,100 140,114 134,124 C 130,128 124,125 122,118 C 128,108 130,97 124,88 Z" />

      {/* Eye */}
      <circle cx="156" cy="54" r="4" fill="white" />
      <circle cx="157" cy="55" r="2" />
    </svg>
  )
}
