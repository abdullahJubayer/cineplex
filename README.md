# Ticketor Cineplex Pro

A movie ticketing web app: browse now-showing and upcoming movies, view details/cast/
reviews, pick a showtime and seats, add food & drink, and check out. Includes an admin
panel for managing movies, cinemas, showtimes, and promotions.

See [`AGENT.md`](./AGENT.md) for the full architecture, design principles, and the
step-by-step (TDD) build plan.

## Tech Stack

Next.js 14+ (App Router) · TypeScript · Tailwind CSS · Prisma + PostgreSQL ·
Auth.js (NextAuth) · Stripe · Resend · Vitest + Playwright

## Features

- **Browse without an account** — movies, showtimes, cinemas, reviews, seat
  selection, and building a food/drink cart are all open to anonymous visitors.
- **Login required only at final purchase** — hitting "Pay" while signed out shows a
  login/signup prompt instead of blocking browsing.
- **No re-selecting after login** — the in-progress booking (showtime, seats, ticket
  quantities, food cart) is preserved across the login redirect.
- **Admin panel** (`/admin`) — requires login + admin role; manage movies, cinemas,
  screens/seat layouts, showtimes, and promo codes, plus a sales dashboard.

## Getting Started

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, NEXTAUTH_SECRET, STRIPE_SECRET_KEY,
                        # STRIPE_WEBHOOK_SECRET, RESEND_API_KEY
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Testing

```bash
npm test            # unit + integration (Vitest)
npm run test:e2e     # end-to-end (Playwright)
```

## Project Structure

See `AGENT.md` §1.3 for the full folder layout (`src/app`, `src/features`,
`src/components`, `prisma`, `tests/e2e`).

## Status

See `AGENT.md` §6 for the current build progress against the step-by-step plan.