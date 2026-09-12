# Architects Stories — Admin Panel (Sanity Studio)

The **Admin Panel** for Architects Stories, built on Sanity Studio.

```
Architects Stories
│
├── Sanity CMS  ───────►  this project — k5fw7bl7 / production dataset
├── Next.js     ───────►  ../website — the public site, reads the same dataset
├── GitHub      ───────►  both folders live in the same repo
└── Vercel      ───────►  hosts ../website (Studio hosts itself via Sanity)
```

**This is the live project — not a template.** `projectId: 'k5fw7bl7'` in
`sanity.config.ts` and `sanity.cli.ts` is the real, already-created Sanity
project. There's nothing to swap out before running this.

## Modules

| Module        | How it's implemented                                              |
|----------------|---------------------------------------------------------------------|
| Dashboard      | `@sanity/dashboard` plugin — overview widgets                       |
| **Submissions**| `submission` schema — every "Submit Your Work" entry from `/submit`, sorted newest first, with a `status` field (New → Contacted → Confirmed/Declined → Published) for triage |
| **Join Applications** | `joinApplication` schema — every "Join AS" entry from `/join`. Has a custom **"Approve & Add to Community"** button (`actions/approveAndAddPerson.ts`) that creates a matching `person` document and marks the application Accepted, in one click |
| Projects       | `project` schema (title, studio, location, category, gallery, `viewCount`...) |
| Stories        | `story` schema (title, category, author, body, publishedAt...)      |
| Courses        | `course` schema (title, instructor, curriculum modules, price...)   |
| People         | `person` schema — instructors, and everyone in the community directory (including anyone approved from Join Applications). Each person can also be linked to any number of published `project` documents via **Related Projects**, shown on their `/community/people/[slug]` page |
| Events         | `event` schema                                                       |
| Featured       | `featured` singleton — controls homepage hero/featured sections     |
| Media          | `sanity-plugin-media` — visual asset library                        |
| Settings       | `siteSettings` singleton — logo, socials, footer text                |

Submissions sit at the top of the left-hand nav since they're the one list
that needs regular attention.

## Running locally

```
npm install
npx sanity login     # once per machine — use the account that owns k5fw7bl7
npm run dev
```
Opens the Admin Panel at **http://localhost:3333**.

## Deploying

The Studio auto-deploys — `.github/workflows/deploy-admin.yml` runs
`npm run deploy` on every push to `main` that touches `admin/**`, using the
`SANITY_AUTH_TOKEN` repo secret. You normally don't need to run
`npm run deploy` by hand; just push.

Live at: **https://architects-stories.sanity.studio** (`studioHost` in
`sanity.cli.ts`).

## Notes

- `admin/dist/` and `admin/old-production.tar.gz` are build output / a
  dataset backup — both gitignored, don't hand-edit or commit them.
- The website in `../website` reads this same dataset, and writes to it
  from three places: the Submit form, the Join form, and project-view
  tracking (`viewCount` on `project`) — all via a **separate write-enabled
  API token** (`SANITY_API_TOKEN`), not the Studio login. See
  `../website/README.md`.
- ⚠️ If a `SANITY_API_TOKEN` value has ever been committed, shared in a zip,
  or pasted somewhere outside your local `.env.local` / Vercel's
  environment variables, treat it as compromised: go to
  **manage.sanity.io → your project → API → Tokens**, delete it, and issue
  a fresh one.
