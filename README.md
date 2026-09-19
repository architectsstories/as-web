# Architects Stories

This is the **live, current** state of the project — the single source of
truth going forward. Older exports of this project (different Sanity
project ID, different repo, or missing features described below) are
superseded; don't mix code or IDs from them back in.

```
Sanity project:  k5fw7bl7  (dataset: production)
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
cp .env.local.example .env.local   # then fill in SANITY_API_TOKEN, see below
npm run dev
# → http://localhost:3000
```

## Day-to-day workflow

- **Editing content** (projects, courses, people, homepage features) → do
  this in the Admin Panel, either `localhost:3333` or
  `https://architects-stories.sanity.studio`. No git involved — publishing
  updates the live site within about a minute (see `revalidate` in each
  `website/app/**/page.js`).
- **Editing code** (layout, components, schemas, styling) → edit locally,
  then from VS Code's **Source Control** tab: stage → commit → **Sync
  Changes**. That push alone does both of these, automatically:
  - touched `website/**` → Vercel rebuilds and redeploys the site
  - touched `admin/**` → GitHub Actions (`.github/workflows/deploy-admin.yml`)
    redeploys the Studio to `architects-stories.sanity.studio`

## What's live right now

- **`/submit`** — Submit Your Work form → creates a `submission` doc
- **`/plans`** — Featuring & Promotion Plans (static pricing page)
- **`/join`** — Join AS community application → creates a `joinApplication`
  doc. Asks for name, email, mobile (optional), role, and — only when role
  is **Architect** — a **COA number** (Council of Architecture
  registration). Also accepts an optional photo upload.
  - Approving an application in the Admin Panel (**"Approve & Add to
    Community"** button) auto-creates a matching `person` document,
    carrying across their mobile, photo, and COA number.
  - If a COA number was given, that new Person is automatically prefixed
    **"Ar."** in their name (skipped if they already typed it themselves),
    and gets a small **blue verified badge** next to their name everywhere
    on the site — Community directory, their own profile, homepage
    featured people, course instructor credit, and any project's Community
    card. The badge is driven purely by whether `coaNumber` is set on the
    Person — there's no separate flag to keep in sync, and you can set it
    directly on a Person added by hand, too.
- **Course "Join Now" popup** — `EnrollButton` on `/courses/[slug]` opens
  an inline form (writes an `enrollment` doc) unless that course has an
  external `ctaLink` set, in which case it's just a plain link instead.
- **Per-person visibility** — People have an "Enable Person on Website"
  toggle (`isEnabled`, on by default). Off hides them everywhere, without
  deleting them.
- **Related Projects ↔ Community** — a Person can be linked to any
  published Projects; that project's page then shows up to 3 linked
  (enabled) community members in a small side card.
- Project view tracking (`viewCount`) powering a "Popular Posts" rail.

`admin/README.md` and `website/README.md` have the full breakdown.

## Known gaps (carried over, still open)

- The `siteSettings` singleton (logo, tagline, social links, footer text)
  is modeled in the Admin Panel but `Header.js` / `Footer.js` don't call it
  yet — they still show hardcoded text.
- The header's nav doesn't link to `/plans` — pricing isn't reachable
  directly from the nav.
- `admin/schemaTypes/story.ts` is dead code — not registered in
  `schemaTypes/index.ts`, not in `deskStructure.ts`, and the website's
  `/stories` pages actually run on `project` documents with a
  `showInLatestStories` toggle, not this schema. Safe to delete or ignore.

Say the word on any of these.

## ⚠️ Secrets

`website/.env.local` holds `SANITY_API_TOKEN` — a **write-enabled**
credential (used by `/submit`, `/join`, the course Enroll popup, and
project-view tracking). It is not a public key. Never commit it, paste it
into chat, or include it in a zip you hand off.

**This exact token has now shipped, unredacted, in three separate zip
exports handed off outside this repo.** It has not been rotated. I strip it
from every snapshot I save, but I don't control what leaves your machine —
rotating it takes two minutes at **manage.sanity.io → your project → API →
Tokens → delete the old one → issue a new one → update `.env.local` and
Vercel's environment variables**. Worth doing regardless of where the
copies ended up; the point of treating it as a password is not having to
reconstruct where all the copies went.

## A recurring pattern worth knowing about

More than once, a fresh export has reverted work from a previous round —
most recently, the course page's "Join Now" button and its modal CSS
disappeared after being fixed, then had to be re-applied. If you're working
across multiple tools/sessions (e.g. Claude Code locally *and* this chat),
it's worth pulling the latest saved zip from here before making further
local changes, so fixes don't get silently undone by an older local copy
being re-exported on top of them.
