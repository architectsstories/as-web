# Architects Stories — Website (Next.js)

The **public website**. It reads content live from the Architects Stories
Sanity project (`k5fw7bl7` / `production`) — the same one the Admin Panel
writes to — and writes back to it in three places (Submit, Join, view
tracking). No content is hardcoded here.

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
| `/projects`, `/projects/[slug]` | all Projects · one Project (fires `TrackProjectView` → increments `viewCount`) |
| `/stories`, `/stories/[slug]`   | all Stories · one Story |
| `/courses`, `/courses/[slug]`   | all Courses · one Course, with curriculum accordion + instructor card |
| `/learn`, `/learn/[slug]`       | Learn programmes |
| `/community`, `/community/people/[slug]` | community directory · one person, including any Related Projects picked for them in the Admin Panel |
| `/plans`                | **Featuring & Promotion Plans** — static pricing/plans page |
| `/submit`                | **Submit Your Work** — the featuring intake form (see below) |
| `/join`                  | **Join AS** — community application form (see below) |

## The two write-back forms

Both post to a Next.js Route Handler, which uses a **write-enabled** Sanity
client (`lib/sanityWriteClient.js`, separate from the public read client in
`lib/sanity.js`) to create a document. Nothing is emailed — everything
shows up in the Admin Panel.

- **`/submit`** (`components/SubmitForm.js` → `app/api/submit/route.js`)
  → creates a `submission` document. Asks for contact info, project
  details, credits, a plan choice, and a **Google Drive / Dropbox /
  WeTransfer link** (no file upload — links only).
- **`/join`** (`components/JoinForm.js` → `app/api/join/route.js`)
  → creates a `joinApplication` document. In the Admin Panel, approving one
  auto-creates a matching `person` document via a custom Studio action —
  no manual re-entry.

Project page views are tracked the same way: `TrackProjectView.js` fires
once per real page load, hitting `app/api/track-view/route.js`, which
increments `viewCount` on that `project` document. `PopularPostsScroller.js`
+ `PublicationCard.js` use that to show a "Popular Posts" rail.

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
   Reading pages (`/`, `/projects`, etc.) works with just the first two
   lines. The Submit and Join forms, and view tracking, need a token too —
   create one at **manage.sanity.io → your project → API → Tokens → Add
   API token**, permission **Editor**, and paste it in. Never commit this
   file or share it outside your own `.env.local` / Vercel's environment
   variables — see the security note below.
3. Run it:
   ```
   npm run dev
   ```
   Open **http://localhost:3000**.

If a page looks empty, publish at least one Project / Story / Course in the
Admin Panel, and add it to the **Featured (Homepage)** singleton so it also
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

## Notes

- Images are served from Sanity's CDN (`cdn.sanity.io`), already allowed in
  `next.config.js`.
- Rich text fields use Sanity's Portable Text format, rendered via
  `@portabletext/react`.
- Visual design (colors, fonts, spacing) lives in `app/globals.css` and the
  component files in `components/`.
