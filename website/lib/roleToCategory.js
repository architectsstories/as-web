// Maps a Person's Role — Primary value to the plural "Category" used
// to power the "Find your people" search and filter tabs on the homepage.
// Student / Other have no matching tab — they just won't appear under a
// category filter, but still show up in plain text search.
const ROLE_TO_CATEGORY = {
  Architect: 'Architects',
  Designer: 'Designers',
  Studio: 'Studios',
  Maker: 'Makers',
  Mentor: 'Mentors',
  'Material Brand': 'Material Brands',
}

export function personCategory(person) {
  if (!person?.role) return null
  return ROLE_TO_CATEGORY[person.role] || null
}
