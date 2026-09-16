# Architects Stories

This is the **live, current** state of the project — the single source of
truth going forward. Older exports of this project (different Sanity
project ID, different repo) are superseded; don't mix code or IDs from them
back in.

```
Sanity project:  k5fw7bl7  (dataset: production)
GitHub repo:     https://github.com/architectsstories/as-web
Website hosting: Vercel — Root Directory = website/
Studio hosting:  https://architects-stories.sanity.studio (auto-deployed)
```

```
as-web/
├── admin/     ─── Sanity Studio (Content / Admin Panel)   → writes to Sanity
└── website/   ─── Next.js public site                     → reads from Sanity
```

They talk to each other only through Sanity — no direct code dependency
between the two folders, so each has its own `package.json` and its own
`npm install`. See `admin/README.md` and `website/README.md` for the
specifics of each half.

## Running both locally

Open two terminals from this `as-web` folder:

```bash
# Terminal 1 — Admin Panel (Sanity Studio)
cd admin
npm install
npm run dev
# → http://localhost:3333
```

```bash
# Terminal 2 — Website (Next.js)
cd website
npm install
cp .env.local.example .env.local   # already points at k5fw7bl7 — no edits needed
npm run dev
# → http://localhost:3000
```

## Day-to-day workflow

- **Editing content** (projects, stories, courses, people, homepage
  features) → do this in the Admin Panel, either `localhost:3333` or
  `https://architects-stories.sanity.studio`. No git involved — publishing
  updates the live site within about a minute (see `revalidate` in each
  `website/app/**/page.js`).
- **Editing code** (layout, components, schemas, styling) → edit locally in
  VS Code, then from the **Source Control** tab: stage → commit → **Sync
  Changes**. That push alone does both of these, automatically:
  - touched `website/**` → Vercel rebuilds and redeploys the site
  - touched `admin/**` → GitHub Actions (`.github/workflows/deploy-admin.yml`)
    redeploys the Studio to `architects-stories.sanity.studio`

Nothing else to trigger by hand.

## Don't commit

Already covered by `.gitignore`, but worth knowing: `node_modules/`,
`.next/`, `.sanity/`, `.env.local`, `admin/dist/` (Studio build output), and
`admin/old-production.tar.gz` (a dataset backup) never belong in a commit —
they're either regenerated automatically or are local-only.

## ⚠️ Secrets

`website/.env.local` holds `SANITY_API_TOKEN` — a **write-enabled**
credential (used by `/submit`, `/join`, and project-view tracking). It is
not a public key. Never commit it, paste it into chat, or include it in a
zip you hand off — if a real value ever leaks that way, rotate it
immediately at **manage.sanity.io → your project → API → Tokens**. See
`website/README.md` for the full note.

## What's live right now

Beyond the original homepage, the site now includes:

- **`/submit`** — the Submit Your Work form (writes a `submission` doc)
- **`/plans`** — Featuring & Promotion Plans (static pricing page)
- **`/join`** — Join AS community application (writes a `joinApplication`
  doc; approving one in the Admin Panel auto-creates a `person` via a
  custom Studio action)
- Project view tracking (`viewCount`) powering a "Popular Posts" rail
  (`PopularPostsScroller` / `PublicationCard`)

`admin/README.md` and `website/README.md` have the full breakdown.

## Known gaps (carried over, still open)

- The `siteSettings` singleton (logo, tagline, social links, footer text)
  is modeled in the Admin Panel and queried via `siteSettingsQuery` in
  `website/lib/queries.js`, but `Header.js` / `Footer.js` don't call it
  yet — they still show hardcoded text.
- The header's nav links to `/submit` ("Get Featured") and `/join` ("Join
  Community"), but not to `/plans` — worth adding if you want pricing
  reachable directly from the nav.

Say the word if you want either wired up.
