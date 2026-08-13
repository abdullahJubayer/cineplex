# Ticketor Cineplex Pro

Ticketor Cineplex Pro is an enterprise-grade movie ticketing and cinema management web application built with Next.js (App Router), TypeScript, Prisma ORM, and Tailwind CSS. It features anonymous browsing, dynamic seat matrix selection, food and drink concession purchasing, digital ticket wallet generation with live QR codes, AI-powered movie recommendation agents, external agent MCP integration, and a complete autonomous admin control panel.

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
| MCP Protocol | Model Context Protocol (MCP) | JSON-RPC 2.0 (`/api/mcp`) & SSE Bridge (`/api/mcp/sse`) for external agent integration |
| Authentication | Custom Session & Role Management | Protected routes, HTTP-only session state, Role-Based Access Control (RBAC) |
| Testing | Vitest + React Testing Library + Playwright | Unit, integration, and end-to-end test suites |
| Visualization | Recharts | Sales dashboard analytics, revenue area charts, booking metrics |

---

## 2. Overall Features & Recent Updates

### User Experience & AI Floating Assistant
- **Floating User AI Movie Assistant**: Interactive floating widget (`UserAiChatFloating`) available across all public pages for movie recommendations, seat availability queries, and instant ticket booking.
- **Dedicated Moviegoer Login (`/login`)**: Streamlined sign-in flow for cinema guests.
- **Digital Ticket Wallet (`/my-tickets`)**: Live digital ticket history with SVG/PNG QR entry codes. Tickets booked via AI chat or web UI automatically persist in PostgreSQL under the user's account across sessions and logouts.
- **Interactive Hero Carousel**: Auto-rotating hero slider showcasing current blockbusters with trailer modals, slide indicators, and manual controls.
- **Dynamic Seat Selection Matrix**: Interactive trapezoid stage screen layout with real-time seat status tracking, seat categories (VIP, COUPLE, STANDARD), and live total calculation.

### Admin Control Panel Features (`/admin/*`)
- **Dedicated Admin Login Portal (`/login/admin`)**: Restricted sign-in portal for cinema managers with default credentials (`admin@gmail.com` / `123456`).
- **Tickets List Management (`/admin/tickets`)**: Admin reservation viewer with **Upcoming** and **Already Passed** status filters, search functionality, and digital QR receipt popups.
- **Autonomous Admin AI Assistant**: Floating AI assistant (`AdminAiChat`) with conversation history compaction and strict context retention guardrails to prevent TMDB search fallback on follow-up schedule requests.
- **Sales Analytics Dashboard (`/admin/dashboard`)**: Analytics dashboard featuring Recharts area line charts, revenue tracking, ticket counts, and dynamic blockbuster suggestions that automatically exclude titles already in the database catalog.
- **Venue & Showtime Management**: CRUD interfaces for movies, cinemas, seat matrix layouts, showtime collision validation, and promo code management.

### Model Context Protocol (MCP) Integration for External Agents
External AI agents (such as Claude Code, Cursor, or custom subagents) can connect to running instances of Ticketor Cineplex Pro via MCP to query movies, check showtimes, inspect seats, and book tickets.

- **JSON-RPC 2.0 Endpoint**: `http://localhost:3000/api/mcp`
- **SSE Stream Endpoint**: `http://localhost:3000/api/mcp/sse`
- **MCP Server Name**: `ticketor-cineplex-mcp`
- **Figma/Remote Bridge Configuration**:
  ```json
  "cineplex-mcp-server": {
    "command": "npx",
    "args": [
      "mcp-remote",
      "http://127.0.0.1:3000/api/mcp/sse"
    ]
  }
  ```

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
│   ├── figma-design-to-code/      # Figma Dev Mode MCP design-to-code translation guidelines
│   └── ...
├── src/
│   ├── app/                       # Next.js App Router routes & API endpoints
│   │   ├── admin/                 # Admin control panel pages
│   │   │   ├── cinemas/           # Cinema layout management
│   │   │   ├── dashboard/         # Sales analytics dashboard
│   │   │   ├── movies/            # Movie catalog management
│   │   │   ├── promos/            # Promo code management
│   │   │   ├── showtimes/         # Showtime scheduler
│   │   │   └── tickets/           # Admin ticket reservation list & QR receipt viewer
│   │   ├── ai-recommend/          # User AI recommendation agent page
│   │   ├── api/                   # Serverless API routes
│   │   │   ├── admin/             # Admin management, tickets & AI assistant APIs
│   │   │   │   └── tickets/       # Admin ticket listing API
│   │   │   ├── ai-chat/           # AI chat summarization & persistence APIs
│   │   │   ├── ai-recommendations/# Recommendation LLM engine APIs
│   │   │   ├── auth/              # Authentication & registration APIs
│   │   │   ├── bookings/          # Booking creation & checkout APIs
│   │   │   ├── food/              # Food menu APIs
│   │   │   ├── mcp/               # MCP JSON-RPC & SSE endpoints (/api/mcp & /api/mcp/sse)
│   │   │   ├── movies/            # Movie catalog APIs
│   │   │   └── showtimes/         # Showtime session APIs
│   │   ├── booking/               # Booking flow pages (seats, food, checkout)
│   │   ├── cinemas/               # Cinema venue listing page
│   │   ├── food/                  # Food menu standalone page
│   │   ├── login/                 # Moviegoer login page
│   │   │   └── admin/             # Dedicated Admin portal login page
│   │   ├── movies/[id]/           # Movie detail page
│   │   ├── my-tickets/            # Digital ticket wallet page
│   │   ├── showtimes/             # Showtime browsing page
│   │   ├── signup/                # User registration page
│   │   ├── layout.tsx             # Root application layout
│   │   └── page.tsx               # Homepage with hero carousel & featured sections
│   ├── components/                # Reusable UI components
│   │   ├── AdminAiChat.tsx        # Floating/embedded autonomous admin AI assistant
│   │   ├── UserAiChatFloating.tsx # Floating user AI movie assistant widget
│   │   ├── Navbar.tsx             # Main navigation header
│   │   └── Footer.tsx             # Application footer
│   ├── context/                   # React context providers
│   │   ├── AuthContext.tsx        # Authentication state & session provider
│   │   └── BookingContext.tsx     # Active booking pipeline state provider
│   └── lib/                       # Utility modules & external service clients
│       ├── adminAuth.ts           # Admin authorization helper
│       ├── ai-config.ts           # Central AI agent system prompts & configuration
│       ├── prisma.ts              # Prisma Client singleton
│       └── tmdb.ts                # TMDB API integration & data mapper
├── AGENTS.md                      # Operational manual & implementation checklist
├── MCP_CONFIG.md                  # MCP remote connection guide
├── MCP_SERVER_GUIDE.md            # Comprehensive MCP tool documentation
├── package.json                   # Project scripts and dependencies
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
   git clone https://github.com/abdullahJubayer/cineplex.git
   cd cineplex
   npm install
   ```

2. Configure environment variables in `.env`:
   ```env
   DATABASE_URL="file:./dev.db"
   TMDB_API_KEY="your-tmdb-api-key"
   OPEN_ROUTER_API_KEY="your-openrouter-api-key"
   ```

3. Seed the database with TMDB blockbusters and cinema layouts:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 5. Default Credentials

- **Admin Login Portal**: `/login/admin`
  - **Email**: `admin@gmail.com`
  - **Password**: `123456`
- **Moviegoer Login**: `/login`

---

## 6. Verification Commands

Run static type analysis and build verification:

```bash
# Type check & build
npm run build
```