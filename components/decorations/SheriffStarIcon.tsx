type Props = { className?: string }

export default function SheriffStarIcon({ className }: Props) {
  // Étoile de shérif à 5 branches
  // Rayon extérieur R=42, rayon intérieur r=17, centre (50,50)
  // Sommets calculés : angles -90°, -18°, 54°, 126°, 198° pour les pointes
  //                   -54°, 18°, 90°, 162°, 234° pour les creux
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
      aria-label="Sheriff star badge"
    >
      {/* Cercle de badge externe */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />

      {/* Étoile à 5 branches */}
      <polygon points="
        50,8
        61,35
        90,37
        68,56
        75,84
        50,68
        25,84
        32,56
        10,37
        39,35
      " />

      {/* Cercle central décoratif */}
      <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.6" />
      <circle cx="50" cy="50" r="5" />
    </svg>
  )
}
