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
  featuredCourses[]->{title, "slug": slug.current, category, thumbnail, price, isFree, "instructor": select(instructor && instructor->isEnabled != false => instructor->{name})},
  featuredPeople[@->isEnabled != false]->{name, role, roleSecondary, roleCustom, location, photo}
}`

export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  siteName, logo, tagline, socialLinks, contactEmail, newsletterText, footerText
}`

export const allProjectsQuery = `*[_type == "project"] | order(year desc){
  title, "slug": slug.current, studio, location, category, area, year, mainImage
}`

export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0]{
  title, studio, location, category, area, year, mainImage, gallery, description,
  "relatedPeople": *[_type == "person" && references(^._id) && isEnabled != false][0...3]{
    name, "slug": slug.current, role, roleSecondary, roleCustom, photo
  }
}`

// Auto-ranked by page views (Project.viewCount) — no manual curation.
export const popularProjectsQuery = `*[_type == "project"] | order(viewCount desc, _createdAt desc)[0...10]{
  title, "slug": slug.current, studio, location, category, area, year, mainImage, description, _createdAt
}`

// Auto-sorted by publish date, newest first — no manual curation.
export const recentProjectsQuery = `*[_type == "project"] | order(_createdAt desc)[0...8]{
  title, "slug": slug.current, studio, location, category, area, year, mainImage, description, _createdAt
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
  "instructor": select(instructor && instructor->isEnabled != false => instructor->{name})
}`

export const courseBySlugQuery = `*[_type == "course" && slug.current == $slug][0]{
  title, category, thumbnail, bannerImage, price, isFree, level, duration, description, outcomes, curriculum, ctaText, ctaLink,
  "instructor": select(instructor && instructor->isEnabled != false => instructor->{name, role, roleSecondary, roleCustom, location, photo, bio, portfolioUrl})
}`

export const upcomingEventsQuery = `*[_type == "event" && startDateTime >= now()] | order(startDateTime asc){
  title, "slug": slug.current, category, startDateTime, location, mode, summary, coverImage, rsvpLink, ctaText
}`

export const pastEventsQuery = `*[_type == "event" && startDateTime < now()] | order(startDateTime desc)[0...12]{
  title, "slug": slug.current, category, startDateTime, location, mode, summary, coverImage
}`

export const allPeopleQuery = `*[_type == "person" && isEnabled != false] | order(name asc){
  name, "slug": slug.current, role, roleSecondary, roleCustom, location, photo
}`

export const personBySlugQuery = `*[_type == "person" && slug.current == $slug && isEnabled != false][0]{
  name, role, roleSecondary, roleCustom, location, photo, bio, portfolioUrl,
  "relatedProjects": relatedProjects[]->{title, "slug": slug.current, studio, location, category, area, year, mainImage}
}`
