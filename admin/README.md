# Architects Stories — Admin Panel (Sanity Studio)

This is the **Admin Panel** for Architects Stories, built on Sanity Studio.
It matches this stack:

```
Architects Stories
│
├── Sanity CMS  ───────►  this project (Content / Admin Panel)
├── Next.js     ───────►  the public website (separate project, built next)
├── GitHub      ───────►  where both projects' code lives
└── Vercel      ───────►  hosting for the Next.js website (Studio can also deploy via Sanity's own hosting)
```

## Modules included

| Module     | How it's implemented                                            |
|------------|-------------------------------------------------------------------|
| Dashboard  | `@sanity/dashboard` plugin — overview widgets                     |
| Projects   | `project` schema (title, studio, location, category, gallery...)  |
| Stories    | `story` schema (title, category, author, body, publishedAt...)    |
| Courses    | `course` schema (title, instructor, curriculum modules, price...) |
| Featured   | `featured` singleton — controls homepage hero/featured sections   |
| Media      | `sanity-plugin-media` — visual asset library                      |
| Settings   | `siteSettings` singleton — logo, socials, footer text              |

A `person` schema is also included since Courses (instructors) and the
homepage "People Behind the Spaces" section both need it.

## Setup (Windows / VS Code)

1. **Install dependencies.** Open this folder in VS Code, open a terminal
   (Terminal → New Terminal), and run:
   ```
   npm install
   ```

2. **Create a Sanity project** (if you don't have one yet). Still in the
   terminal:
   ```
   npx sanity login
   npx sanity projects create
   ```
   This prints a **Project ID** — copy it.

3. **Add your Project ID.** Open `sanity.config.ts` and `sanity.cli.ts` and
   replace `YOUR_SANITY_PROJECT_ID` with the ID from step 2.

4. **Run the Studio locally:**
   ```
   npm run dev
   ```
   This starts the Admin Panel at **http://localhost:3333**.

5. **Create the two singleton documents.** In the Studio, click
   "Featured (Homepage)" and "Settings" in the left nav and save each once
   — they'll only ever have one entry.

6. **Deploy the Studio (optional, for teammates to use it online):**
   ```
   npm run deploy
   ```
   This hosts it at `https://your-project-name.sanity.studio`.

## Next steps

- Push this folder to a GitHub repo.
- Build the Next.js website in a separate project that reads this same
  Sanity dataset (via `projectId` + `dataset`) to render Projects, Stories,
  Courses and Featured content on the public site.
- Deploy the Next.js site to Vercel, with `SANITY_PROJECT_ID` and
  `SANITY_DATASET` set as environment variables.

Happy to scaffold the Next.js website next, wired up to these exact schemas.
