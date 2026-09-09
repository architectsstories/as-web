// All the GROQ queries the website needs, matching the Admin Panel schemas.

// Hero, Featured Projects, and Latest Stories are all manually curated in the
// Featured singleton (pick from projects that have their respective toggle
// on in Projects → Settings — "Show in Featured Projects" / "Show in Latest
// Stories"). The /stories page on its own still shows every project with
// "Show in Latest Stories" on, curated or not.
export const homepageQuery = `*[_type == "featured"][0]{
  heroSlides[]->{title, "slug": slug.current, studio, location, category, mainImage, description},
  featuredProjects[]->{title, "slug": slug.current, studio, location, category, area, year, mainImage},
  "latestProjects": latestStories[]->{title, "slug": slug.current, studio, location, category, area, year, mainImage},
  featuredCourses[]->{title, "slug": slug.current, category, thumbnail, price, isFree, instructor->{name}},
  featuredPeople[]->{name, role, location, photo}
}`

export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  siteName, logo, tagline, socialLinks, contactEmail, newsletterText, footerText
}`

export const allProjectsQuery = `*[_type == "project"] | order(year desc){
  title, "slug": slug.current, studio, location, category, area, year, mainImage
}`

export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0]{
  title, studio, location, category, area, year, mainImage, gallery, description
}`

// "Stories" on the website is powered by Projects with "Show in Latest
// Stories" toggled on — there is no separate Story content type.
export const allStoriesQuery = `*[_type == "project" && showInLatestStories == true] | order(_createdAt desc){
  title, "slug": slug.current, studio, location, category, area, year, mainImage
}`

export const storyBySlugQuery = `*[_type == "project" && slug.current == $slug && showInLatestStories == true][0]{
  title, studio, location, category, area, year, mainImage, gallery, description
}`

export const allCoursesQuery = `*[_type == "course"] | order(_createdAt desc){
  title, "slug": slug.current, category, thumbnail, price, isFree, level, duration, mode,
  instructor->{name}
}`

export const courseBySlugQuery = `*[_type == "course" && slug.current == $slug][0]{
  title, category, thumbnail, bannerImage, price, isFree, level, duration, description, outcomes, curriculum, ctaText, ctaLink,
  instructor->{name, role, location, photo, bio, portfolioUrl}
}`

export const upcomingEventsQuery = `*[_type == "event" && startDateTime >= now()] | order(startDateTime asc){
  title, "slug": slug.current, category, startDateTime, location, mode, summary, coverImage, rsvpLink, ctaText
}`

export const pastEventsQuery = `*[_type == "event" && startDateTime < now()] | order(startDateTime desc)[0...12]{
  title, "slug": slug.current, category, startDateTime, location, mode, summary, coverImage
}`

export const allPeopleQuery = `*[_type == "person"] | order(name asc){
  name, "slug": slug.current, role, category, location, photo
}`

export const personBySlugQuery = `*[_type == "person" && slug.current == $slug][0]{
  name, role, category, location, photo, bio, portfolioUrl
}`
