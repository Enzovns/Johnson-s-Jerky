type Props = { className?: string }

// Guitare acoustique — corps figure-8 avec rosace, manche, mécaniques et cordes
export default function GuitarIcon({ className }: Props) {
  return (
    <svg
      viewBox="0 0 120 300"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
      aria-label="Acoustic guitar"
    >
      {/* Corps figure-8 avec rosace découpée (evenodd) */}
      <path
        fillRule="evenodd"
        d={
          // Corps principal — deux lobes symétriques reliés à la taille
          'M 60,108 ' +
          'C 86,108 98,123 98,140 ' +   // lobe supérieur droit
          'C 98,156 87,163 86,173 ' +   // vers la taille droite
          'C 85,183 99,194 99,215 ' +   // lobe inférieur droit
          'C 99,238 83,288 60,288 ' +   // bas du corps
          'C 37,288 21,238 21,215 ' +   // lobe inférieur gauche
          'C 21,194 35,183 34,173 ' +   // taille gauche
          'C 33,163 22,156 22,140 ' +   // lobe supérieur gauche
          'C 22,123 34,108 60,108 Z ' + // retour au haut
          // Rosace — sous-chemin crée un trou via evenodd
          'M 45,198 ' +
          'a 15,15 0 1,0 30,0 ' +
          'a 15,15 0 1,0 -30,0'
        }
      />

      {/* Manche — légèrement effilé du bas vers le haut */}
      <path d="M 47,42 L 45,108 L 75,108 L 73,42 Z" />

      {/* Tête (headstock) — arrondie au sommet */}
      <path d="M 37,10 C 37,3 44,0 60,0 C 76,0 83,3 83,10 L 83,42 L 37,42 Z" />

      {/* Sillet (nut) */}
      <rect x="45" y="42" width="30" height="3.5" />

      {/* Mécaniques gauche — 3 clés rectangulaires */}
      <rect x="17" y="12" width="20" height="6" rx="3" />
      <rect x="17" y="22" width="20" height="6" rx="3" />
      <rect x="17" y="32" width="20" height="6" rx="3" />

      {/* Mécaniques droite — 3 clés rectangulaires */}
      <rect x="83" y="12" width="20" height="6" rx="3" />
      <rect x="83" y="22" width="20" height="6" rx="3" />
      <rect x="83" y="32" width="20" height="6" rx="3" />

      {/* Repères de frette sur le manche */}
      <rect x="46" y="54"  width="28" height="2" rx="1" opacity="0.45" />
      <rect x="46" y="64"  width="28" height="2" rx="1" opacity="0.45" />
      <rect x="46" y="74"  width="28" height="2" rx="1" opacity="0.45" />
      <rect x="46" y="84"  width="28" height="2" rx="1" opacity="0.45" />
      <rect x="46" y="94"  width="28" height="2" rx="1" opacity="0.45" />
      <rect x="46" y="104" width="28" height="2" rx="1" opacity="0.45" />

      {/* Chevalet (bridge) */}
      <rect x="48" y="272" width="24" height="8" rx="2" />

      {/* 6 cordes — du sillet jusqu'au chevalet */}
      <line x1="50" y1="45.5" x2="50" y2="276" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.55" />
      <line x1="53" y1="45.5" x2="53" y2="276" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.55" />
      <line x1="56" y1="45.5" x2="56" y2="276" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.55" />
      <line x1="60" y1="45.5" x2="60" y2="276" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.55" />
      <line x1="64" y1="45.5" x2="64" y2="276" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.55" />
      <line x1="68" y1="45.5" x2="68" y2="276" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.55" />
    </svg>
  )
}
