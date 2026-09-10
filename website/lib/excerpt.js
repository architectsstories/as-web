// Flattens a Sanity Portable Text array (Project.description) into a short
// plain-text excerpt for use on cards, e.g. "ABOUT THE PROJECT: ..."
export function excerptFromBlocks(blocks, maxLen = 140) {
  if (!Array.isArray(blocks)) return ''
  const text = blocks
    .filter((b) => b._type === 'block' && Array.isArray(b.children))
    .map((b) => b.children.map((c) => c.text || '').join(''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return ''
  if (text.length <= maxLen) return text
  return `${text.slice(0, maxLen).replace(/\s+\S*$/, '')}…`
}
