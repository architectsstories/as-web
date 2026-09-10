const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// Always renders as "Posted On September 09, 2026", regardless of server locale.
export function formatPostedDate(dateString) {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return ''
  const day = String(d.getDate()).padStart(2, '0')
  const month = MONTHS[d.getMonth()]
  return `Posted On ${month} ${day}, ${d.getFullYear()}`
}
