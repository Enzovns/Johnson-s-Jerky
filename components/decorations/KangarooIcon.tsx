type Props = { className?: string }

export default function KangarooIcon({ className }: Props) {
  return (
    <svg
      viewBox="0 0 100 120"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
      aria-label="Kangaroo silhouette"
    >
      {/* Corps principal du kangourou — vue de profil droit, en plein saut */}
      <polygon points="
        90,44
        83,30
        87,14
        78,22
        71,11
        67,24
        61,31
        53,34
        45,41
        39,54
        43,64
        51,77
        47,90
        35,100
        27,104
        25,98
        33,94
        43,83
        47,73
        43,61
        35,55
        27,51
        15,61
        5,81
        7,86
        17,67
        29,55
        37,57
        51,49
        65,39
        79,41
        87,43
      " />
      {/* Bras avant (membres antérieurs courts) */}
      <polygon points="53,37 48,47 44,54 49,56 53,49 57,39" />
      {/* Queue — longue courbe vers le bas-gauche */}
      <path d="M35,56 Q22,64 14,80 Q10,89 14,94 Q18,98 22,92 Q20,88 24,79 Q30,66 39,57 Z" />
      {/* Œil */}
      <circle cx="84" cy="36" r="2.2" fill="white" />
      <circle cx="84" cy="36" r="1" />
    </svg>
  )
}
