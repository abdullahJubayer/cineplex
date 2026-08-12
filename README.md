# Ticketor Cineplex Pro

Ticketor Cineplex Pro is an enterprise-grade movie ticketing and cinema management web application built with Next.js (App Router), TypeScript, Prisma ORM, and Tailwind CSS. It features anonymous browsing, dynamic seat matrix selection, food and drink concession purchasing, digital ticket wallet generation with live QR codes, AI-powered movie recommendation agents, and a complete autonomous admin control panel.

---

## 1. System Architecture

The application is architected following modular, test-driven development principles, decoupling client routing from core domain logic and backend database services.

| Concern | Technology Choice | Description |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Server Components, Client Components, Dynamic API Routes, Turbopack |
| Language | TypeScript | Strict mode, zero untyped code, Zod schema validation |
| Styling | Tailwind CSS | Custom theme design system tokens (#FCFC65, #010108, #141418, #1A1A1F) |
| Database & ORM | Prisma ORM + PostgreSQL / SQLite | Data access layer with atomic transactions for seat holds and bookings |
| AI Integration | OpenRouter LLM + TMDB API | Autonomous admin operating agent and movie recommendation chat agent |
| Authentication | Custom Session & Role Management | Protected routes, HTTP-only session state, Role-Based Access Control (RBAC) |
| Testing | Vitest + React Testing Library + Playwright | Unit, integration, and end-to-end test suites |
| Visualization | Recharts | Sales dashboard analytics, revenue area charts, booking metrics |

---

## 2. Overall Features

### User Experience Features
- **Interactive Hero Carousel**: Auto-rotating hero slider showcasing current blockbusters with trailer modals, slide indicators, and manual navigation controls.
- **Movie Catalog & Search**: Comprehensive movie catalog supporting filter pills (Now Showing, Coming Soon, Top 10), genre tags, age ratings, and full cast lists with real TMDB actor profile images.
- **Dynamic Seat Selection Matrix**: Interactive trapezoid stage screen layout with real-time seat status tracking, seat categories (VIP, COUPLE, STANDARD), dynamic pricing, and live total calculation.
- **Food & Drink Concession Store**: Category-filtered concession store with item counter steppers, full item previews, and sticky checkout summaries.
- **Atomic Booking & Checkout**: Multi-step booking pipeline backed by database transactions, promo code discount applications, and instant booking confirmation.
- **Digital Ticket Wallet (`/my-tickets`)**: Personal booking history page featuring live SVG/PNG QR code reference generation for cinema entry.
- **AI Recommendation Agent (`/ai-recommend`)**: Personalized movie recommendation engine powered by OpenRouter LLM. Guest interactions persist in session storage, while logged-in user chats are automatically summarized into the database for cross-device synchronization.
- **User Reviews & Ratings**: Aggregate user score breakdown, rating percentage bars, and user feedback submission.

### Admin Control Panel Features (`/admin/*`)
- **Role-Based Access Control (RBAC)**: Gated admin navigation and API endpoints enforcing strict role verification.
- **Sales Analytics Dashboard**: Analytics dashboard featuring Recharts area line charts, revenue tracking, ticket counts, and dynamic blockbuster suggestions that automatically exclude titles already in the database catalog.
- **Movie Catalog Management**: Full CRUD interface for adding movies manually or importing top releases from TMDB in one click.
- **Showtime Session Scheduler**: Session planner with overlap collision detection, hall assignment, format selection (IMAX 3D Laser, Dolby Atmos, 2D), and pricing controls.
- **Cinema & Auditorium Layout Builder**: Venue manager and seat matrix generator allowing custom row/column counts and hall assignments.
- **Promo Code Manager**: Discount management supporting percentage and fixed value reductions, usage limits, and expiration tracking.
- **Autonomous Admin AI Assistant**: Floating AI assistant widget with function calling tools capable of importing movies from TMDB, scheduling showtimes, creating cinema layouts, and issuing promo codes directly through natural language chat.

---

## 3. Folder Structure

```
cineplex-pro/
├── prisma/
│   ├── schema.prisma              # Database models (User, Movie, Cinema, Hall, Seat, Showtime, Booking, FoodItem, Review, PromoCode, ChatSummary)
│   ├── seed.ts                    # TMDB import and demo data seed script
│   └── dev.db                     # Development SQLite database
├── public/                        # Static assets, branding, and images
├── skills/                        # Curated AI agent skill modules
│   ├── brainstorming/
│   ├── dashboard-designer/
│   ├── figma-design-to-code/
│   ├── verification-before-completion/
│   └── writing-plans/
├── src/
│   ├── app/                       # Next.js App Router routes & API endpoints
│   │   ├── admin/                 # Admin control panel pages
│   │   │   ├── cinemas/           # Cinema layout management
│   │   │   ├── dashboard/         # Sales analytics dashboard
│   │   │   ├── movies/            # Movie catalog management
│   │   │   ├── promos/            # Promo code management
│   │   │   └── showtimes/         # Showtime scheduler
│   │   ├── ai-recommend/          # User AI recommendation agent page
│   │   ├── api/                   # Serverless API routes
│   │   │   ├── admin/             # Admin management & AI assistant APIs
│   │   │   ├── ai-chat/           # AI chat summarization & persistence APIs
│   │   │   ├── ai-recommendations/# Recommendation LLM engine APIs
│   │   │   ├── auth/              # Authentication & registration APIs
│   │   │   ├── bookings/          # Booking creation & checkout APIs
│   │   │   ├── food/              # Food menu APIs
│   │   │   ├── movies/            # Movie catalog APIs
│   │   │   └── showtimes/         # Showtime session APIs
│   │   ├── booking/               # Booking flow pages (seats, food, checkout)
│   │   ├── cinemas/               # Cinema venue listing page
│   │   ├── food/                  # Food menu standalone page
│   │   ├── login/                 # User & Admin authentication login page
│   │   ├── movies/[id]/           # Movie detail page
│   │   ├── my-tickets/            # Digital ticket wallet page
│   │   ├── showtimes/             # Showtime browsing page
│   │   ├── signup/                # User registration page
│   │   ├── layout.tsx             # Root application layout
│   │   └── page.tsx               # Homepage with hero carousel & featured sections
│   ├── components/                # Reusable UI components
│   │   ├── AdminAiChat.tsx        # Floating/embedded autonomous admin AI assistant
│   │   ├── Navbar.tsx             # Main navigation header
│   │   └── Footer.tsx             # Application footer
│   ├── context/                   # React context providers
│   │   ├── AuthContext.tsx        # Authentication state & session provider
│   │   └── BookingContext.tsx     # Active booking pipeline state provider
│   └── lib/                       # Utility modules & external service clients
│       ├── prisma.ts              # Prisma Client singleton
│       └── tmdb.ts                # TMDB API integration & data mapper
├── AGENTS.md                      # Operational manual & implementation checklist
├── package.json                   # Project scripts and dependencies
├── render.yaml                    # Render blueprint deployment configuration
└── tsconfig.json                  # TypeScript strict mode configuration
```

---

## 4. Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Local Setup Instructions

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/YOUR_USERNAME/cineplex.git
   cd cineplex
   npm install
   ```

2. Configure environment variables in `.env`:
   ```env
   DATABASE_URL="file:./dev.db"
   TMDB_API_KEY="your tmdb api key"
   OPEN_ROUTER_API_KEY="your-openrouter-api-key"
   ```

3. Seed the database with TMDB blockbusters and cinema layouts:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 5. Verification Commands

Run static type analysis and build verification:

```bash
# Type check
npx tsc --noEmit

# Production build
npm run build
```

---

## 6. Production Deployment (Render)

This repository includes a pre-configured `render-build` script in `package.json` for deployment to Render:

1. Create a PostgreSQL database on Render.
2. Create a Web Service connected to this repository.
3. Set the following Build and Start commands:
   - Build Command: `npm run render-build`
   - Start Command: `npm start`
4. Set Environment Variables:
   - `DATABASE_URL`: Your Render PostgreSQL connection string
   - `TMDB_API_KEY`: `Your TMDB API Key`
   - `OPEN_ROUTER_API_KEY`: Your OpenRouter API Key
   - `NODE_ENV`: `production`