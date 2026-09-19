// Shown next to a person's name wherever it appears on the site, whenever
// they have a COA (Council of Architecture) number on file. Presence of
// `coaNumber` on the Person document is the only thing that controls this —
// there's no separate "verified" toggle to keep in sync.
export default function VerifiedBadge() {
  return (
    <svg
      className="verified-badge"
      viewBox="0 0 22 22"
      width="15"
      height="15"
      aria-label="Verified — COA registered architect"
      role="img"
    >
      <title>Verified — COA registered architect</title>
      <path
        fill="#1d9bf0"
        d="M11 0l2.39 2.39 3.3-.62.62 3.3L20.3 7.06 19.68 9.7 22 11l-2.32 2.3.62 2.64-3.3.62-.62 3.3-3.3-.62L11 22l-2.39-2.39-3.3.62-.62-3.3L1.7 15.31l.62-2.64L0 11l2.32-2.3-.62-2.64 3.3-.62.62-3.3 3.3.62L11 0z"
      />
      <path fill="#fff" d="M9.3 14.8l-3.2-3.2 1.2-1.2 2 2 4.6-4.6 1.2 1.2z" />
    </svg>
  )
}
