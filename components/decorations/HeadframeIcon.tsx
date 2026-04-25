type Props = { className?: string }

// Silhouette du chevalet minier (headframe) de Kalgoorlie
export default function HeadframeIcon({ className }: Props) {
  return (
    <svg
      viewBox="0 0 120 200"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="Kalgoorlie mine headframe"
    >
      {/* Jambes principales formant le A-frame */}
      <line x1="60" y1="28" x2="8" y2="182" strokeWidth="6" />
      <line x1="60" y1="28" x2="112" y2="182" strokeWidth="6" />

      {/* Plateforme de base */}
      <line x1="2" y1="182" x2="118" y2="182" strokeWidth="7" />

      {/* Plateforme intermédiaire haute */}
      <line x1="20" y1="122" x2="100" y2="122" strokeWidth="5" />

      {/* Croix de contreventement — section basse */}
      <line x1="18" y1="152" x2="56" y2="122" strokeWidth="2.5" />
      <line x1="102" y1="152" x2="64" y2="122" strokeWidth="2.5" />
      <line x1="10" y1="182" x2="52" y2="152" strokeWidth="2" />
      <line x1="110" y1="182" x2="68" y2="152" strokeWidth="2" />

      {/* Croisillons milieu */}
      <line x1="26" y1="122" x2="58" y2="88" strokeWidth="2" />
      <line x1="94" y1="122" x2="62" y2="88" strokeWidth="2" />

      {/* Traverse du milieu */}
      <line x1="34" y1="90" x2="86" y2="90" strokeWidth="3.5" />

      {/* Croisillons section haute */}
      <line x1="36" y1="90" x2="54" y2="62" strokeWidth="1.8" />
      <line x1="84" y1="90" x2="66" y2="62" strokeWidth="1.8" />

      {/* Traverse haute */}
      <line x1="46" y1="60" x2="74" y2="60" strokeWidth="3" />

      {/* Support de la roue de molette */}
      <line x1="52" y1="60" x2="56" y2="38" strokeWidth="2.5" />
      <line x1="68" y1="60" x2="64" y2="38" strokeWidth="2.5" />
      <line x1="54" y1="36" x2="66" y2="36" strokeWidth="2.5" />

      {/* Roue de molette (sheave wheel) — emblème du headframe */}
      <circle cx="60" cy="22" r="14" strokeWidth="3" />
      <circle cx="60" cy="22" r="7" strokeWidth="2" />
      <circle cx="60" cy="22" r="2" fill="currentColor" />
      {/* Rayons de la roue */}
      <line x1="60" y1="8" x2="60" y2="15" strokeWidth="1.5" />
      <line x1="60" y1="29" x2="60" y2="36" strokeWidth="1.5" />
      <line x1="46" y1="22" x2="53" y2="22" strokeWidth="1.5" />
      <line x1="67" y1="22" x2="74" y2="22" strokeWidth="1.5" />

      {/* Câbles de treuil */}
      <line x1="57" y1="34" x2="38" y2="182" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
      <line x1="63" y1="34" x2="82" y2="182" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />

      {/* Petite plateforme de travail */}
      <line x1="48" y1="62" x2="72" y2="62" strokeWidth="2" />
      <line x1="49" y1="66" x2="71" y2="66" strokeWidth="1.5" />
      <line x1="48" y1="58" x2="72" y2="58" strokeWidth="1.5" />
    </svg>
  )
}
