# AGENT.md — Ticketor Cineplex Pro (Movie Ticketing Web App)

Operating manual for an AI coding agent (or human) implementing this project.
Structure: **1. Overall Architecture → 2. Frontend Design Principles → 3. Backend
Design Principles → 4. DB Design Principles**, followed by the step-by-step build
plan and progress tracker. Follow top to bottom. Do not start a step until the
previous one's tests are green.

Scope: Phases 1–4 complete.

---

# 1. Overall Architecture

### 1.1 Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 14+ (App Router, `src/app` directory), TypeScript strict mode |
| Styling | Tailwind CSS, theme tokens matching the design system (1.2 below) |
| ORM / DB | Prisma + PostgreSQL (Neon/Supabase for dev+prod) |
| Auth | Auth.js / Custom Auth (JWT & Session Cookies) |
| Validation | Zod (shared schemas, client + server) |
| Unit / component tests | Vitest + React Testing Library |
| Integration tests | Vitest against a real test database |
| E2E tests | Playwright |
| Payments | Stripe (test mode) / Instant Confirmation |
| Email | Resend / Confirmation Notifications |
| Charts (admin dashboard) | Recharts (Area, Donut, Bar) |
| AI Integration | TMDB API + OpenRouter LLM + Autonomous Admin Agent |
| Lint / format | ESLint + Prettier, husky + lint-staged pre-commit |

### 1.2 Engineering Principles (non-negotiable)

1. **TDD loop for every step:** write failing test → confirm it fails → implement
   minimum code to pass → confirm full suite passes → refactor → commit → next step.
2. **No `any`.** Strict TypeScript; validate all external/user input with Zod.
3. **Feature-based folders**, not type-based. `src/app/` stays thin (routing only);
   logic lives in `src/features/<domain>/`.
4. **Server is the source of truth for money and seats.** Never trust client-supplied
   price or availability — re-check server-side, always.
5. **Every step ships in a runnable, tested state.** No long-lived broken branches.

---

# 2. Frontend Design Principles

### 2.1 Design System / Tokens

Defined as Tailwind theme extensions matching Figma design specs:

```
colors: {
  accent:        '#FCFC65',   // primary CTA, active pills, badges, ratings
  accentHover:   '#ecec50',
  onAccent:      '#010108',   // text on accent background
  bg:            '#010108',   // base background
  surface:       '#141418',   // card/container surface
  border:        '#1A1A1F',   // default border
  borderMuted:   '#25252C',
  divider:       '#353541',
  text:          '#FFFFFF',
  textSecondary: '#E0E0E4',
  textMuted:     '#9797AA',
  textFaint:     '#565669',
}
fontFamily: {
  heading: ['Manrope', 'sans-serif'],
  body:    ['Inter', 'Manrope', 'sans-serif'],
}
```

---

# 3. Backend & AI Architecture

### 3.1 Auth & Access Rules
- **Public browsing is anonymous**: Home, movie details, showtimes, cinemas, reviews, seat selection, and food cart stay open.
- **Admin Control Panel (`/admin/*`)**: Gated with single admin navigation header and role check.
- **Autonomous Admin AI Agent**: Floating chat window supporting TMDB movie imports, showtime scheduling, cinema matrix generation, and promo voucher creation.

---

# 4. Progress Tracker

- [x] **0.1 Scaffold**: Next.js + TS + Tailwind + Vitest + Playwright
- [x] **0.2 Prisma + Postgres**: Schema with Movie, Cinema, Hall, Seat, Showtime, Booking, FoodItem, Review, PromoCode
- [x] **1.1 Movie data service**: TMDB integration & DB services
- [x] **1.2 Home page**: Hero, Now Showing, Top 10, Festivals, Coming Soon, FAQ, App download
- [x] **1.3 Movie details page**: Hero media split, real TMDB cast photos, synopsis, trailer video overlay
- [x] **1.4 Reviews & ratings display**: User score breakdown, rating bars, and filter pills
- [x] **1.5 Cinemas + Showtimes pages**: Format filters, city pills, venue details
- [x] **1.6 Static & Dynamic seat grid**: Trapezoid stage, seat types (`REGULAR`, `PREMIUM`, `VIP`), live selection tracker
- [x] **1.7 Buy flow → confirmation**: Seat → Food & Drink → Payment → Ticket QR confirmation
- [x] **1.8 Admin movie CRUD**: Manual movie add & catalog management
- [x] **2.1 Prisma-backed movies/cinemas/showtimes/reviews**: Pure DB queries
- [x] **2.2 Seat grid backed by DB**: Real seat matrix & status
- [x] **2.3 Seat locking**: Session-based holds & concurrency guard
- [x] **2.4 Food & drink catalog + cart**: Category filters, item steppers, sticky summary bar
- [x] **2.5 Booking creation transaction**: DB atomic transactions for seats + tickets + food
- [x] **2.6 Auth**: Login, Signup, Registration API, Protected Admin routes
- [x] **2.7 Booking history**: `my-tickets` page with QR code modal
- [ ] **3.1 Stripe checkout + webhook**: Direct DB checkout active (Stripe webhook endpoint deferred)
- [x] **3.2 Promo code redemption**: Promo code validation & discount calculation
- [x] **3.3 Ticket QR code**: Live QR code generator for booking reference
- [ ] **3.4 Email confirmation**: In-app digital ticket wallet active (Resend email delivery deferred)
- [x] **4.1 Cinema/screen/seat-layout admin UI**: Venue creation & seat matrix layout generator
- [x] **4.2 Showtime scheduling**: Session creator with overlap collision detection
- [x] **4.3 Sales dashboard**: Recharts Area line chart, Donut chart, Bar chart, real DB metrics
- [x] **4.4 Promo code management UI**: Promo CRUD, usage limits, percentage/fixed discounts
- [x] **4.5 Role-based access**: Server-side admin authorization checks
- [x] **4.6 Autonomous Admin AI Assistant**: Floating AI chat widget with TMDB imports & OpenRouter LLM

---

# 5. Unimplemented / Optional Deferred Features Summary

1. **Step 3.1 — Stripe Webhook (`/api/webhooks/stripe`)**:
   - *Current State*: Checkout processes directly through database atomic transactions and produces confirmed tickets with QR codes immediately.
   - *Status*: Optional (Stripe test mode webhook handler can be added if live payment processing is required).

2. **Step 3.4 — Resend Email Delivery**:
   - *Current State*: Digital tickets with QR code references are stored and viewable in the user's `My Tickets` wallet (`/my-tickets`).
   - *Status*: Optional (Resend API email dispatch on payment can be added if external email delivery is desired).