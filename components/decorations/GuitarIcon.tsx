type Props = { className?: string }

export default function GuitarIcon({ className }: Props) {
  return (
    <svg
      viewBox="0 0 80 220"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
      aria-label="Acoustic guitar"
    >
      {/* Corps de la guitare — forme 8 avec étranglement au milieu */}
      <path d="
        M40,95
        C60,95 72,108 72,124
        C72,138 64,148 58,154
        C54,158 52,162 52,168
        C52,182 46,195 40,198
        C34,195 28,182 28,168
        C28,162 26,158 22,154
        C16,148 8,138 8,124
        C8,108 20,95 40,95 Z
      " />
      <path d="
        M40,95
        C58,95 68,84 68,72
        C68,58 58,50 40,50
        C22,50 12,58 12,72
        C12,84 22,95 40,95 Z
      " />

      {/* Manche (neck) */}
      <rect x="36" y="12" width="8" height="54" rx="3" />

      {/* Tête (headstock) */}
      <rect x="30" y="4" width="20" height="14" rx="3" />
      <rect x="28" y="4" width="24" height="10" rx="2" />

      {/* Mécaniques d'accordage — 3 à gauche, 3 à droite */}
      <circle cx="26" cy="8" r="3.5" />
      <circle cx="26" cy="15" r="3.5" />
      <circle cx="26" cy="22" r="3.5" />
      <circle cx="54" cy="8" r="3.5" />
      <circle cx="54" cy="15" r="3.5" />
      <circle cx="54" cy="22" r="3.5" />

      {/* Repères de fret */}
      <rect x="35.5" y="28" width="9" height="1.5" rx="0.5" fill="#3E2723" />
      <rect x="35.5" y="36" width="9" height="1.5" rx="0.5" fill="#3E2723" />
      <rect x="35.5" y="44" width="9" height="1.5" rx="0.5" fill="#3E2723" />

      {/* Rosace (sound hole) */}
      <circle cx="40" cy="130" r="12" fill="#3E2723" />
      <circle cx="40" cy="130" r="9" fill="currentColor" />
      <circle cx="40" cy="130" r="6" fill="#3E2723" opacity="0.5" />

      {/* Chevalet (bridge) */}
      <rect x="30" y="170" width="20" height="6" rx="2" fill="#3E2723" />

      {/* Cordes (6 cordes — lignes fines) */}
      <line x1="37" y1="14" x2="34" y2="176" stroke="#C9A961" strokeWidth="0.6" opacity="0.8" />
      <line x1="38.5" y1="14" x2="37" y2="176" stroke="#C9A961" strokeWidth="0.6" opacity="0.8" />
      <line x1="40" y1="14" x2="40" y2="176" stroke="#C9A961" strokeWidth="0.6" opacity="0.8" />
      <line x1="41.5" y1="14" x2="43" y2="176" stroke="#C9A961" strokeWidth="0.6" opacity="0.8" />
      <line x1="43" y1="14" x2="46" y2="176" stroke="#C9A961" strokeWidth="0.6" opacity="0.8" />
      <line x1="44" y1="14" x2="48" y2="176" stroke="#C9A961" strokeWidth="0.6" opacity="0.8" />
    </svg>
  )
}
