// Combine every role that's filled in, e.g. "Architect / Mentor / Computational designer and CG Artist"
export function formatRole(person) {
  if (!person) return ''
  return [person.role, person.roleSecondary, person.roleCustom].filter(Boolean).join(' / ')
}
