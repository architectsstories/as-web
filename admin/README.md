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
| **Join Applications** | `joinApplication` schema — every "Join AS" entry from `/join`: name, email, mobile (optional), role, an optional photo, and — only relevant when Role is "Architect" — a **COA number** (hidden in the Studio form for any other role). Has a custom **"Approve & Add to Community"** button (`actions/approveAndAddPerson.ts`) that creates a matching `person` document **as a draft** (carrying across mobile, photo, and COA number), marks the application Accepted, and — if a COA number was given — prefixes the new Person's name with **"Ar."** (skipped if already present). The draft shows up in People, ready to review and publish — nothing goes live automatically |
| **Work Submissions** | `submission` schema — every "Submit Your Work" entry from `/submit`, sorted newest first, with a `status` field (New → Reviewed → Confirmed → Completed/Declined) for triage. Has a custom **"Create Draft Project"** button (`actions/publishSubmissionAsProject.ts`) that maps title/studio/location/category/area/year/description onto a new `project` document **as a draft** and marks the submission Completed. That draft has no Main Image yet — a submission only ever has a Drive link, never an uploaded file — so it can't be published until someone opens it, pulls the real photos from that Drive link, adds a Main Image (required) and Gallery, and publishes from Projects |
| **Course Enrollments** | `enrollment` schema — every "Join Now" popup entry from a course page (`/courses/[slug]`), sorted newest first, with its own `status` field (New → Contacted → Enrolled → Declined). The popup itself lives in `website/components/EnrollButton.js` (name, email, phone, message) → `website/app/api/enroll/route.js` |
| Projects       | `project` schema (title, studio, location, category, gallery, `viewCount`, `showInLatestStories`...). The public `/stories` pages are just Projects with that last toggle on — there's no separate content type behind them |
| Courses        | `course` schema (title, instructor, curriculum modules, price, optional `ctaText`/`ctaLink` to point "Join Now" at an external link instead of the built-in popup) |
| People         | `person` schema — instructors, and everyone in the community directory (including anyone approved from Join Applications). Fields include: **Enable Person on Website** (`isEnabled`, default on — off hides them everywhere: Community, their profile, homepage features, course instructor credit, project Community cards, all without deleting them), **Mobile Number** (optional, never shown publicly), **COA Number** (optional — presence of this alone drives the blue verified badge shown next to their name site-wide; set it directly here for anyone added by hand, no need to go through Join Applications), and **Related Projects** (link to any published Projects; shown on their own profile page, and in reverse — that project's page lists this person in its Community card) |
| Events         | `event` schema                                                       |
| Featured       | `featured` singleton — controls homepage hero/featured sections     |
| Media          | `sanity-plugin-media` — visual asset library                        |
| Settings       | `siteSettings` singleton — logo, socials, footer text (not yet wired into the website's Header/Footer — see root README's Known Gaps) |

Join Applications, Work Submissions, and Course Enrollments sit together
near the top of the left-hand nav since they're the lists that need
regular attention.

> `admin/schemaTypes/story.ts` also exists in this folder but isn't
> registered anywhere (not in `schemaTypes/index.ts`, not in
> `deskStructure.ts`), and the website doesn't query it either — it's dead
> code left over from an earlier direction. Safe to delete, or safe to
> ignore; either way it currently does nothing.

## The "approve → draft → review → publish" pattern

Both custom actions above follow the same shape, on purpose:

1. Someone fills out a public form (`/join` or `/submit`).
2. You review their entry in the Admin Panel and click the custom button.
3. That **creates a new document as a draft** — its `_id` is prefixed
   `drafts.` — and marks the original application/submission as
   processed.
4. The draft shows up in People or Projects like any other draft. Nothing
   is live yet. Open it, fill in whatever the form couldn't capture
   (a Person doesn't need anything extra; a Project needs a Main Image at
   minimum, since forms never collect an uploaded file — only a Drive
   link), and hit **Publish** yourself when it's ready.
5. Only that manual Publish makes it appear on the website.

This means nothing from a public form ever goes live without a human
looking at it first — the automation only does the tedious retyping, not
the judgment call.

**Important: click the button — don't just change Status by hand.**
Setting Status to "Accepted" (Join Applications) or "Completed" (Work
Submissions) by itself does nothing except change that field. Whether the
Person or Project draft actually got created is tracked separately, by a
read-only **"Added to Community"** / **"Sent to Projects"** checkbox
further down the same document — that's what the button actually sets,
alongside Status, when it runs. If you edit Status manually first and then
look for the button, it'll still say "Approve & Add to Community" /
"Create Draft Project" and will still work correctly when clicked — the
button's own completed-state is independent of whatever you've set Status
to by hand.

The button itself isn't a separate prominent action in this Studio
version — look for it in the **"···" menu** at the bottom right, next to
the Publish button.

## The verified badge, in full

There is no separate "verified" checkbox anywhere. A Person shows the blue
badge if and only if their `coaNumber` field is non-empty. Two ways that
gets set:

1. **Via Join Applications** — the applicant picks "Architect" as their
   role, the form asks for a COA number, they submit it, and approving
   that application copies it onto the new Person record.
2. **Directly on a Person** — open any Person document (including ones
   added by hand, or approved before this feature existed) and type a COA
   number straight into the field.

Removing the COA number from a Person removes the badge on next publish —
same mechanism, no extra step.

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
  from four places: the Submit form, the Join form (including an image
  upload for the applicant's photo), the course Enroll popup, and
  project-view tracking (`viewCount` on `project`) — all via a **separate
  write-enabled API token** (`SANITY_API_TOKEN`), not the Studio login.
  See `../website/README.md`.
- ⚠️ If a `SANITY_API_TOKEN` value has ever been committed, shared in a zip,
  or pasted somewhere outside your local `.env.local` / Vercel's
  environment variables, treat it as compromised: go to
  **manage.sanity.io → your project → API → Tokens**, delete it, and issue
  a fresh one. (This has actually happened, more than once — see the root
  README's Secrets section.)
