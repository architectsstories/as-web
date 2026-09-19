# Architects Stories — Website (Next.js)

The **public website**. It reads content live from the Architects Stories
Sanity project (`k5fw7bl7` / `production`) — the same one the Admin Panel
writes to — and writes back to it in four places (Submit, Join, course
Enroll, view tracking). No content is hardcoded here.

```
Sanity CMS (../admin)  ──►  this Next.js website  ──►  Vercel (hosting)
        live                        live                     live
```

**This is the live project — not a template.** It's already deployed on
Vercel with `NEXT_PUBLIC_SANITY_PROJECT_ID=k5fw7bl7` set as an environment
variable there. `.env.local.example` mirrors that for local dev.

## Pages

| Page                  | What it does                                              |
|------------------------|-------------------------------------------------------------|
| `/` (homepage)          | `featured` singleton — hero, featured projects/stories/courses/people |
| `/projects`, `/projects/[slug]` | all Projects · one Project (fires `TrackProjectView` → increments `viewCount`; also shows up to 3 linked Community members via the reverse of Person's Related Projects, each with a verified badge if they have a COA number) |
| `/stories`, `/stories/[slug]`   | all Projects with **Show in Latest Stories** on · one of them. There's no separate Story content type behind this despite the name — see `storyBySlugQuery` in `lib/queries.js` |
| `/courses`, `/courses/[slug]`   | all Courses · one Course, with curriculum accordion, instructor card (badged if the instructor has a COA number), and a **Join Now** popup (`EnrollButton` → `enrollment` doc) unless the course has an external `ctaLink` set, in which case that link is used instead |
| `/learn`, `/learn/[slug]`       | Learn programmes |
| `/community`, `/community/people/[slug]` | community directory · one person, including any Related Projects picked for them in the Admin Panel, and a verified badge next to their name if they have a COA number. People with **Enable Person on Website** turned off are excluded everywhere |
| `/plans`                | Featuring & Promotion Plans (static pricing page) |
| `/submit`                | Submit Your Work (writes a `submission` doc) |
| `/join`                  | Join AS community application (writes a `joinApplication` doc) |

## The write-back forms

All post to a Next.js Route Handler, which uses a **write-enabled** Sanity
client (`lib/sanityWriteClient.js`, separate from the public read client in
`lib/sanity.js`) to create a document. Nothing is emailed — everything
shows up in the Admin Panel.

- **`/submit`** (`components/SubmitForm.js` → `app/api/submit/route.js`)
  → creates a `submission` document. Asks for contact info, project
  details, credits, a plan choice, and a **Google Drive / Dropbox /
  WeTransfer link** (no file upload — links only).
- **`/join`** (`components/JoinForm.js` → `app/api/join/route.js`)
  → creates a `joinApplication` document. Fields: name, email, mobile
  (optional), role, an optional photo (uploaded as a real Sanity image
  asset — the client reads the file as a data URL and the API route
  decodes + uploads it via `writeClient.assets.upload`), and — only shown
  when Role is "Architect" — a COA number. In the Admin Panel, approving
  one auto-creates a matching `person` document via a custom Studio
  action, carrying the mobile/photo/COA number across and prefixing "Ar."
  onto the name if a COA number was given.
- **Course "Join Now" popup** (`components/EnrollButton.js` →
  `app/api/enroll/route.js`) → creates an `enrollment` document, tagged
  with which course it came from. Skipped entirely if that course has a
  `ctaLink` set in the Admin Panel — the button just becomes a plain link
  to that URL instead of opening the popup.

Project page views are tracked the same way: `TrackProjectView.js` fires
once per real page load, hitting `app/api/track-view/route.js`, which
increments `viewCount` on that `project` document. `PopularPostsScroller.js`
+ `PublicationCard.js` use that to show a "Popular Posts" rail.

## The verified badge

`components/VerifiedBadge.js` is a small inline SVG (blue checkmark). It
takes no props and has no logic of its own — every place a person's name
renders just checks `p.coaNumber` and conditionally renders the badge next
to it:

- `components/PeopleDirectory.js` (Community grid)
- `app/community/people/[slug]/page.js` (profile page heading)
- `app/page.js` (homepage featured people)
- `app/courses/[slug]/page.js` (instructor, in both the meta strip and the
  bio card)
- `app/projects/[slug]/page.js` (the Community side card)

Because it's driven by a plain field rather than a separate flag, adding
the badge to a new spot later is always the same one-line pattern:
`{p.coaNumber && <VerifiedBadge />}` — the field just needs to be present
in whatever GROQ query feeds that page (see `lib/queries.js`).

## Running locally

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.local.example` → `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=k5fw7bl7
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=          # ← paste your own token here, see below
   ```
   Reading pages (`/`, `/projects`, etc.) work with just the first two
   lines. The Submit form, Join form (including its photo upload), course
   Enroll popup, and view tracking all need a token too — create one at
   **manage.sanity.io → your project → API → Tokens → Add API token**,
   permission **Editor**, and paste it in. Never commit this file or share
   it outside your own `.env.local` / Vercel's environment variables — see
   the security note below.
3. Run it:
   ```
   npm run dev
   ```
   Open **http://localhost:3000**.

If a page looks empty, publish at least one Project / Course in the Admin
Panel, and add it to the **Featured (Homepage)** singleton so it also
shows up on the homepage (listing pages show everything automatically,
featured or not).

## Deploying

Already wired up: this repo is connected to a Vercel project with **Root
Directory** set to `website/`. Push to `main` → Vercel builds and deploys
automatically.

Environment variables set on Vercel (Project Settings → Environment
Variables): `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
and `SANITY_API_TOKEN`.

## ⚠️ About `SANITY_API_TOKEN`

This is a **write-enabled credential**, not a public key — anyone with it
can create, edit, or delete content in the live dataset. Treat it like a
password:

- Never commit `.env.local` (it's gitignored — keep it that way).
- Never paste a real token value into a zip, a chat, a doc, or a
  screenshot you share with anyone, including for troubleshooting.
- If a real token value ever ends up somewhere outside your local
  `.env.local` or Vercel's environment variables, consider it compromised:
  go to **manage.sanity.io → your project → API → Tokens**, delete it, and
  issue a new one, then update `.env.local` and Vercel with the new value.

This exact token has now shipped, unredacted, in three separate zip
exports. Rotating it is worth doing soon even though it hasn't shown up
anywhere public (checked each time: it's not in this repo's git history) —
the point of treating it as a password is not having to reconstruct where
all the copies went.

## Notes

- Images are served from Sanity's CDN (`cdn.sanity.io`), already allowed in
  `next.config.js`.
- Rich text fields use Sanity's Portable Text format, rendered via
  `@portabletext/react`.
- Visual design (colors, fonts, spacing) lives in `app/globals.css` and the
  component files in `components/`.
- The modal styling used by `EnrollButton.js` (`.modal-overlay`,
  `.modal-box`, `.modal-close`, `.modal-title`, `.modal-sub`) has gone
  missing from `globals.css` in at least one prior export, which silently
  breaks the course "Join Now" popup's appearance (it still works, it just
  renders unstyled). If that popup ever looks broken, check those five
  classes exist in `globals.css` before debugging anything else.
