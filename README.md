# Birthday Invite

A web app to manage birthday party invitations and RSVPs. Guests get a personal link (usually sent through WhatsApp), confirm whether they are coming and who they are bringing, and the hosts follow the guest list in real time from an admin area.

## Features

- **Personal invite links** (`/invite/<code>`): the guest sees their name, confirms or declines, adds companions, and can change the answer until the deadline.
- **Generic link** (`/`): anyone can confirm; each answer becomes a new guest with its own personal link.
- **Admin dashboard** (`/admin`): totals, filters, search, guest registration and WhatsApp invites or reminders (`wa.me` links, one chat per click for bulk reminders).
- **Realtime updates**: the admin list refreshes by itself when a guest answers.
- **Link preview**: generated Open Graph image and metadata for WhatsApp cards.
- **Calendar export**: `.ics` file for the event.
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
| `/` | Generic invite; confirming creates a new guest |
| `/admin` | Guest list and invitations (requires login) |
| `/admin/login` | Admin login |
| `/calendar.ics` | Event calendar file |
| `/api/keep-alive` | Cron endpoint; requires `Authorization: Bearer $CRON_SECRET` |

## Configuring the event

Everything about the party (date, time, venue, RSVP deadline, contact, copy and the default WhatsApp message) lives in [`src/lib/event.ts`](src/lib/event.ts).

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

## Security notes

- Guests never access the database directly. Server Actions run with the secret key and only update the RSVP fields of the invite identified by its `code`.
- Invite codes carry a random suffix (`marina-k7q2`), so a link cannot be guessed from a name.
- Row Level Security lets only allowlisted admins read and write through their session. The public key cannot read the tables.
