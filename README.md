# Architects Stories

Both halves of the project, connected to the **same Sanity project** (`k5fw7bl7` / `production` dataset):

```
architects-stories/
├── admin/     ─── Sanity Studio (Content / Admin Panel)   → writes to Sanity
└── website/   ─── Next.js public site                     → reads from Sanity
```

They talk to each other only through Sanity — there's no direct code
dependency between the two folders, so each has its own `package.json` and
its own `npm install`.

## What's already connected

- `admin/sanity.config.ts` and `admin/sanity.cli.ts` → `projectId: 'k5fw7bl7'`
- `website/.env.local` → `NEXT_PUBLIC_SANITY_PROJECT_ID=k5fw7bl7`

Both point at the same `production` dataset, so anything published in the
Admin Panel shows up on the website (the site re-checks Sanity at most once
a minute — see `revalidate` in each page file).

## Running both locally

Open two terminals from this `architects-stories` folder:

```
# Terminal 1 — Admin Panel (Sanity Studio)
cd admin
npm install
npm run dev
# → http://localhost:3333
```

```
# Terminal 2 — Website (Next.js)
cd website
npm install
npm run dev
# → http://localhost:3000
```

## First-time setup checklist

1. In the Admin Panel (`localhost:3333`), sign in with `npx sanity login`
   (run once from `admin/`) using the account that owns project `k5fw7bl7`.
2. Create and publish at least one Project, Story, and Course.
3. Open the **Featured (Homepage)** singleton and add the ones you want to
   appear on the homepage — listing pages (`/projects`, `/stories`,
   `/courses`) show everything automatically; the homepage only shows what's
   featured.
4. Reload `localhost:3000` — your real content should now appear.

## Deploying

- **Admin Panel:** `cd admin && npm run deploy` → hosts the Studio at
  `https://<your-project-name>.sanity.studio`.
- **Website:** push `website/` to GitHub (or this whole folder, with
  Vercel's root directory set to `website/`) and import it in Vercel.
  Add the same two environment variables from `website/.env.local`:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID` = `k5fw7bl7`
  - `NEXT_PUBLIC_SANITY_DATASET` = `production`

## Known gap (from the earlier review)

The `siteSettings` singleton (logo, tagline, social links, footer text) is
modeled in the Admin Panel and queried via `siteSettingsQuery` in
`website/lib/queries.js`, but `Header.js` / `Footer.js` don't call it yet —
they still show hardcoded text. Say the word if you want that wired up too.
