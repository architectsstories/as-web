# Architects Stories — Website (Next.js)

This is the **public website**. It reads content live from your Sanity
project (the same one your Admin Panel writes to) — no content is
hardcoded here anymore.

```
Sanity CMS (Admin Panel)  ──►  this Next.js website  ──►  Vercel (hosting)
     you already have this         you're setting this up now
```

## What's included

| Page                  | Pulls from Sanity                          |
|------------------------|---------------------------------------------|
| `/` (homepage)          | the `featured` singleton (hero, featured projects/stories/courses/people) |
| `/projects`             | all `project` documents                    |
| `/projects/[slug]`      | one `project` document                     |
| `/stories`              | all `story` documents                      |
| `/stories/[slug]`       | one `story` document                       |
| `/courses`              | all `course` documents                     |
| `/courses/[slug]`       | one `course` document, with curriculum accordion and instructor card |

## Setup (same terminal you already used for the Admin Panel)

1. **Install dependencies:**
   ```
   npm install
   ```

2. **Connect it to your Sanity project.** Copy `.env.local.example` to a
   new file called `.env.local` (same folder). It already has your
   project ID filled in:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=d9jupajq
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
   You shouldn't need to change anything here unless you create a new
   Sanity project later.

3. **Run it locally:**
   ```
   npm run dev
   ```
   Open **http://localhost:3000** — you should see your real Projects,
   Stories and Courses from the Admin Panel.

4. **If a page looks empty:** that's expected until you:
   - Publish at least one Project / Story / Course in the Admin Panel, and
   - Add them to the **Featured (Homepage)** singleton so they show up on
     the homepage specifically (the listing pages like `/projects` show
     everything automatically, featured or not).

## Deploying to Vercel

1. Push this folder to a **GitHub** repo (a new one, separate from the
   Admin Panel repo, or a subfolder in the same repo — either works).
2. Go to [vercel.com](https://vercel.com), click **New Project**, and
   import that repo.
3. Under **Environment Variables**, add the same two values from
   `.env.local`:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = `d9jupajq`
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
4. Click **Deploy**. Vercel gives you a live URL — your public website,
   now permanently connected to your Sanity content.

From then on, any time you publish something in the Admin Panel, the
website will show it (pages re-check Sanity at most once a minute — see
`revalidate` in each page file).

## Notes

- Images are served straight from Sanity's CDN (`cdn.sanity.io`), already
  allowed in `next.config.js`.
- Rich text fields (Project description, Story body, Course description)
  use Sanity's Portable Text format and render automatically via
  `@portabletext/react`.
- The visual design (colors, fonts, spacing) matches the original static
  site — see `app/globals.css`.
