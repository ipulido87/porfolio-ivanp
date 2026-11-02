# Pulido Labs

Website for an independent software development and technology consulting business, in Spanish (default, at the root) and English (under `/en`). Code and documentation are in English.

The goal of the site is lead generation: it presents the services, labels projects honestly, and captures enquiries through a contact form backed by a real database.

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, strict TypeScript |
| Styling | Tailwind CSS v4, shadcn-style components on Radix UI |
| Motion | Motion for React (`LazyMotion`), hand-written Canvas 2D globe |
| Forms | React Hook Form + Zod |
| Data | Drizzle ORM, Turso/libSQL |
| Email | Resend |
| Tests | Vitest, React Testing Library, Playwright |

GSAP and Three.js are not used: nothing here needed them.

## Getting started

Requires Node 20.9+ and pnpm.

```bash
pnpm install
cp .env.example .env.local
```

For local work without a Turso account, set these in `.env.local`:

```bash
ALLOW_LOCAL_DB=1
TURSO_DATABASE_URL=file:./local.db
IP_HASH_SECRET=any-local-value
```

Then create the tables and start the app:

```bash
pnpm db:migrate
pnpm dev
```

Without `RESEND_API_KEY` the form still works: leads are stored with `email_status = 'failed'`.

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm lint` / `pnpm typecheck` | Static checks |
| `pnpm test` | Unit, component and integration tests |
| `pnpm test:e2e` | Playwright against a production build (run `pnpm exec playwright install chromium` once) |
| `pnpm validate` | Lint, typecheck, tests and build |
| `pnpm db:generate` | Create a migration after changing `src/lib/db/schema.ts` |
| `pnpm db:migrate` | Apply migrations to `TURSO_DATABASE_URL` |

## Project structure

```text
src/
  app/
    (es)/               Spanish routes, with their own root layout
    (en)/en/            English routes, with their own root layout
    api/contact/        Lead endpoint
  components/
    ui/                 Design system primitives
    layout/             Document shell, header, footer, WhatsApp, page hero
    pages/              One component per page, shared by both languages
    sections/           Homepage sections
    motion/             Reveals, heading animation
    motion/globe/       Hero globe: math, scene, renderer, poster
  features/
    contact/            Form, request handler, lead pipeline
    services/           Bento grid and artwork
    projects/           Project model, cards and placeholder art
  lib/                  db, email, security, validations, SEO
  config/               Brand, routes, legal data, locales
  content/es, en/       All visible copy
  styles/               Design tokens and global CSS
tests/                  unit, component, integration, e2e
drizzle/                SQL migrations
```

## Editing content

| To change | Edit |
| --- | --- |
| Brand name | `src/config/site.ts` |
| Copy | `src/content/es/*.ts` and `src/content/en/*.ts` |
| Services | `src/content/{es,en}/services.ts` |
| Projects | `src/content/{es,en}/projects.ts` |
| Legal owner data | `src/config/legal.ts` |

**Projects.** Every project has a `kind`: `personal` (real, your own), `live` (real and in production, without saying who it was built for) or `concept` (illustrative), and the badge is rendered from it. Describe scope only: never add clients, testimonials or results that did not happen. Real projects use screenshots from `public/projects/` and link to the live site; the homepage shows the first four. Keep the same order in both languages.

**Languages.** Each English content file is typed `typeof` its Spanish twin, so a missing key fails the type check, and `tests/component/content.test.tsx` catches lists that drift apart. To change a URL, edit `localizedRoutes` in `src/config/site.ts` and rename the folder in `src/app`. To add a language, create `src/content/<locale>`, register it in `src/config/i18n.ts`, `src/content/index.ts` and `localizedRoutes`, then add a route group.

There is no automatic redirect by browser language: search engines and shared links always get the URL they asked for, and visitors switch with the header link.

## The globe

`src/components/motion/globe/` draws a sphere with real perspective projection, in three steps:

1. **Scene** (`scene.ts`): deterministic geometry on the unit sphere, built from a fixed seed.
2. **Poster** (`globe-poster.tsx`): a Server Component that projects that geometry to static SVG. It is the first paint, the no-JavaScript version, and the closing CTA artwork. It ships no JavaScript.
3. **Renderer** (`renderer.ts`, `globe-canvas.tsx`): a lazy-loaded canvas that crossfades over the poster.

Depth comes from painter's order: far hemisphere, a translucent body that dims it, then near hemisphere. Halo, body and rim are pre-rendered sprites, and geometry is batched by brightness, so each frame needs few draw calls.

Rendering pauses when the globe is off screen or the tab is hidden. With `prefers-reduced-motion` it draws one still frame. Slow devices drop to a lighter tier (fewer dots and particles, lower resolution, about 30 fps), and phones start there.

Revolution time is `REVOLUTION_MS` in `scene.ts` (40 s).

## Contact pipeline

The form is a three-step intake (`contact-form.tsx`): where the visitor is, what is going on, then their details. Personal data comes last on purpose. Each step validates its own fields, answers survive moving back, and focus follows the step. New steps type themselves out (`src/components/motion/typewriter.tsx`, no library): the full text stays in the DOM for screen readers, its space is reserved so nothing moves, and it is skipped when going back or under `prefers-reduced-motion`.

Each lead stores its `stage` and `locale`, so you know the visitor's starting point and which language to reply in. Notification emails are always in Spanish.

`POST /api/contact` runs these steps in `src/features/contact/`:

1. Reject cross-origin requests and bodies over 16 KB.
2. Rate limit by hashed IP (5 per 10 minutes by default). Counters live in the database because serverless instances share no memory.
3. Drop honeypot submissions with a normal-looking success.
4. Validate with Zod, independently of the client.
5. Reject duplicates: same `submissionId`, or the same email and message within 24 hours.
6. **Store the lead.**
7. Send the Resend notification (8 s timeout).

Storing comes before sending, so an email failure can never lose a lead. The visitor still sees success, and the row records the failure:

```sql
SELECT id, name, email, created_at, email_error
FROM leads
WHERE email_status = 'failed';
```

Check this query regularly, or after any Resend incident: there is no automatic resend.

**Privacy.** IPs are stored only as a keyed HMAC. Logs contain event names, lead ids and error classes, never form content. Only trust `x-forwarded-for` behind a platform that overwrites it, as Vercel does: elsewhere clients could spoof it to evade the rate limit.

## Deployment

The steps below assume Vercel; any Node host works.

1. **Database.** Create it with the [Turso CLI](https://docs.turso.tech/cli):

   ```bash
   turso db create pulido-labs
   turso db show pulido-labs --url
   turso db tokens create pulido-labs
   ```

2. **Email.** Verify your domain in Resend and create an API key.
3. **Environment.** Set every variable from `.env.example`. Generate `IP_HASH_SECRET` with `openssl rand -hex 32`. Do not set `ALLOW_LOCAL_DB`.
4. **Migrate.** Run this from your machine with the production values, before the first deploy and after any schema change:

   ```bash
   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... pnpm db:migrate
   ```

5. **Deploy.** Import the repository. `NEXT_PUBLIC_*` values are inlined at build time, so redeploy after changing them.

### Before going live

- [ ] Fill in `src/config/legal.ts` (the placeholders show on the legal pages until you do).
- [ ] Have the privacy policy, legal notice and 12-month retention period reviewed.
- [ ] Set `NEXT_PUBLIC_CONTACT_EMAIL` (hidden while empty). The WhatsApp number lives in `src/config/site.ts`.
- [ ] Confirm each project's `kind` in `src/content/{es,en}/projects.ts`, and refresh the screenshots if the sites change.
- [ ] Have a native speaker review the English copy and legal translations.
- [ ] Send a real test lead and confirm the row and the email arrive.
- [ ] Run Lighthouse against production. No score has been measured for this site.

## Testing notes

- Integration tests use a real libSQL database built from `drizzle/`. Only the email sender is mocked.
- E2E tests run a production build with a real API and a temporary database. Resend is left unconfigured on purpose, which exercises lead retention end to end. Server errors and rate limits are simulated by intercepting the request.
- The globe tests compare canvas frames, so they prove that pixels move, stop off screen and stay still under reduced motion.
