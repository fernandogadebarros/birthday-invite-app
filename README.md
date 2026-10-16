# Birthday Invite

A web app to manage birthday party invitations and RSVPs. Guests get a personal link (usually sent through WhatsApp), confirm whether they are coming and who they are bringing, and the hosts follow the guest list in real time from an admin area.

## Features

- **Personal invite links** (`/invite/<code>`): the guest sees their name, confirms or declines, adds companions, and can change the answer until the deadline.
- **Admin dashboard** (`/admin`): totals, filters, search, guest registration and WhatsApp invites or reminders (`wa.me` links, one chat per click for bulk reminders).
- **Realtime updates**: the admin list refreshes by itself when a guest answers.
- **Editable event**: date, time, deadline and venue are changed in the admin area, no deploy needed.
- **Link preview**: generated Open Graph image and metadata for WhatsApp cards.
- **Email and password login** for the admin area, restricted to an allowlist of emails.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, Server Actions), React 19, TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4, with the design tokens declared in `src/app/globals.css`
- [Supabase](https://supabase.com): Postgres, Auth (admin only) and Realtime
- [Zod](https://zod.dev) for validation, [Vitest](https://vitest.dev) and [Playwright](https://playwright.dev) for tests
- Deployed on [Vercel](https://vercel.com), with a daily cron job that keeps the free Supabase project awake

## Routes

| Route | Description |
|---|---|
| `/invite/[code]` | Personal invite with the RSVP form |
| `/` | Explains that each guest needs their personal link |
| `/admin` | Guest list and invitations (requires login) |
| `/admin/login` | Admin login |
| `/api/keep-alive` | Cron endpoint; requires `Authorization: Bearer $CRON_SECRET` |

## Configuring the event

The date, time, RSVP deadline and venue are editable in the admin area (**Editar evento**) and stored in the `event_settings` table. The invite page, the WhatsApp message and the "ver mapa" link (built from the venue text) follow automatically. Defaults, the contact, the copy and the other static details live in [`src/lib/event.ts`](src/lib/event.ts).

The animated header of the invite is a looping video (`public/video/invite.mp4`) rendered from `motion/invite-motion.html`. To regenerate it, run `pnpm motion:render` (requires `ffmpeg`).

## Getting started

Requirements: Node 24+, pnpm and Docker.

```bash
pnpm install
pnpm db:start               # local Supabase: applies migrations and seeds sample guests
cp .env.example .env.local  # fill it with the keys printed by db:start
pnpm dev
```

- Sample invite: http://localhost:3000/invite/marina-k7q2
- Admin: http://localhost:3000/admin, signing in with `admin@festa.local` / `festa123` (local seed only).

To use a hosted Supabase project instead, put its URL and keys in `.env.local` (see below).

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Generate route types and run `tsc` |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm test:e2e` | Reset the local database and run Playwright (needs `db:start`) |
| `pnpm db:start` / `db:stop` / `db:reset` | Manage the local Supabase stack |
| `pnpm db:types` | Regenerate `src/lib/supabase/database.types.ts` |

## Environment variables

See [`.env.example`](.env.example).

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable (public) key |
| `SUPABASE_SECRET_KEY` | Secret key. Server only, never expose it |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the app; used in invite links and OG tags |
| `CRON_SECRET` | Shared secret for the keep-alive cron |

## Deploying

1. **Supabase**: create a project, then run `pnpm exec supabase link --project-ref <ref>` and `pnpm exec supabase db push`.
   - Authentication → Sign In / Providers: turn off **Allow new users to sign up**.
   - Authentication → URL Configuration: set the Site URL to the production URL.
   - Create each admin under Authentication → Users (with a password and **Auto Confirm User**), then allow the email:
     `insert into public.admins (email) values ('admin@example.com');`
2. **Vercel**: import the repository and set the variables above. `vercel.json` schedules the keep-alive cron once a day.

## Database backup

A GitHub Actions workflow (`.github/workflows/backup.yml`) dumps the `public` schema every day at 07:00 UTC and stores it as an **encrypted** artifact for 30 days. You can also run it from the **Actions** tab (**Run workflow**). It needs two repository secrets:

| Secret | Value |
|---|---|
| `SUPABASE_DB_URL` | Session pooler connection string (Supabase → Connect → Session pooler), with the database password filled in |
| `BACKUP_PASSPHRASE` | A long random passphrase used to encrypt the dump |

To restore, download the artifact from a workflow run, then:

```bash
gpg --decrypt backup-YYYY-MM-DD.sql.gpg > backup.sql
psql "$TARGET_DB_URL" -f backup.sql
```

The dump does not include `auth.users`: admin accounts are recreated in Supabase Auth and listed in `public.admins`. GitHub disables scheduled workflows after 60 days without repository activity.

## Security notes

- Guests never access the database directly. Server Actions run with the secret key and only update the RSVP fields of the invite identified by its `code`.
- Invite codes carry a random suffix (`marina-k7q2`), so a link cannot be guessed from a name.
- Row Level Security lets only allowlisted admins read and write through their session. The public key cannot read the tables.
