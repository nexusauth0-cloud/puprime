# Market Education Session — Event Registration SaaS

A full-stack, production-ready event registration platform built for the **Market Education Session**, a high-conversion webinar funnel designed to drive registrations, deliver event details via WhatsApp, and provide a comprehensive admin dashboard for tracking and managing attendees.

Built with **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS v4**, **ShadCN UI** components, and **Prisma ORM** with **PostgreSQL**. The UI follows a dark SaaS theme inspired by Stripe and Linear, featuring a deep navy background, blue accents, glassmorphism cards, and smooth hover animations throughout.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Run the Development Server](#run-the-development-server)
- [Pages & Components](#pages--components)
  - [Landing Page (/)](#landing-page-)
  - [Success Page (/success)](#success-page-success)
  - [Admin Dashboard (/admin)](#admin-dashboard-admin)
- [API Routes](#api-routes)
  - [POST /api/register](#post-apiregister)
  - [GET /api/registrations](#get-apiregistrations)
  - [POST /api/auth/login](#post-apiauthlogin)
- [Database Schema](#database-schema)
- [Design System](#design-system)
- [Deployment](#deployment)
- [Admin Access](#admin-access)
- [WhatsApp Integration](#whatsapp-integration)
- [Customization Guide](#customization-guide)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The **Market Education Session** platform is a complete event registration funnel that transforms website visitors into confirmed attendees. The system is architected around a proven conversion flow:

**Traffic → Landing Page → Trust Building → Registration → Confirmation → WhatsApp + Email Delivery → Admin Tracking**

Every component of the funnel has been carefully designed to maximize registrations. The landing page includes social proof elements (counters, mentor profiles), a live countdown timer to create urgency, a clean and minimal registration form, and clear calls-to-action that guide the user toward conversion.

Once a visitor registers, they are instantly redirected to a success page that reinforces their decision with visual confirmation, another countdown timer, and multiple touchpoints including a WhatsApp group join button and a shareable invitation link they can forward to friends and colleagues.

The admin dashboard provides real-time visibility into all registrations with search, date filtering, CSV export, and summary statistics — everything an event organizer needs to manage their audience effectively.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14+ (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, Tailwind CSS Animate |
| **UI Components** | ShadCN UI (Radix UI primitives + custom components) |
| **Backend** | Next.js API Routes (Edge-ready serverless functions) |
| **Database** | PostgreSQL 18 |
| **ORM** | Prisma 6 (auto-generated type-safe client) |
| **Auth** | JSON Web Tokens (JWT) with bcrypt password comparison |
| **Icons** | Lucide React (consistent, lightweight icon set) |
| **Package Manager** | npm |

### Why This Stack?

- **Next.js App Router** provides a modern file-system based routing paradigm with React Server Components by default, enabling excellent performance and SEO out of the box.
- **Tailwind CSS v4** is the latest iteration of the utility-first CSS framework with a completely revamped engine that uses CSS-first configuration, making it faster and more flexible than ever before.
- **ShadCN UI** offers beautifully designed, accessible, and customizable components that are copied directly into your project — no dependency lock-in, full control over styling.
- **Prisma** provides a type-safe database client with an intuitive schema definition language, automatic migrations, and a powerful query API that eliminates entire categories of runtime errors.
- **PostgreSQL** is the most advanced open-source relational database, offering reliability, performance, and a rich feature set that scales from MVP to production workloads.

---

## Features

### Landing Page (Conversion-Optimized)

- **Hero Section** — Bold headline with gradient text, subtitle, dual CTA buttons (Register + WhatsApp), and social proof counters (1,000+ registered, Free Access, Live Zoom Session)
- **Trust Section** — Explains the "why" behind the event, building credibility and addressing visitor skepticism
- **Speakers Section** — Mentor cards with gradient avatars showing initials, names, and roles; limited to 3 with "+ more inside" teaser
- **What You'll Learn** — Four feature cards covering Market Fundamentals, Winning Strategies, Risk Management, and Growth & Scaling
- **Event Details** — Date, time (WAT), platform (Zoom), and duration displayed in a clean card layout with icons
- **Live Countdown Timer** — Real-time countdown to the event date that creates urgency and excitement
- **Registration Form** — FullName (required), WhatsApp Number (required with validation), Email (optional); duplicate WhatsApp detection; loading states; error handling; redirect to success page

### Success Page (Post-Conversion)

- Animated confirmation with green checkmark icon
- Personalized greeting with the registrant's name
- Live countdown timer (repeats from landing page)
- WhatsApp group join CTA card with green accent styling
- Share invitation button that copies a pre-formatted message to clipboard
- Back-to-home navigation link

### Admin Dashboard (Event Management)

- **JWT-Protected** — Secure authentication with JSON Web Tokens; token stored in localStorage; auto-redirect to login when unauthenticated
- **Login Page** — Simple email + password login with error handling and loading state
- **Statistics Cards** — Total registrations, this week count, with-email count, today's count
- **Search Filter** — Real-time filtering by name, phone number, or email
- **Date Filter** — Filter registrations by date using a date picker input
- **Registrations Table** — Sortable columns: #, Name, WhatsApp, Email, Date (formatted with locale)
- **CSV Export** — One-click download of filtered registrations as a CSV file
- **Responsive Design** — Fully functional on mobile, tablet, and desktop screens

### API Layer

- **Input Validation** — All API endpoints validate required fields, check data types, and return descriptive error messages
- **Duplicate Prevention** — WhatsApp numbers are normalized (strip spaces/dashes) and checked for uniqueness before registration
- **JWT Auth Middleware** — Registrations endpoint requires Bearer token authentication
- **Consistent Error Responses** — All API errors return structured JSON with `{ error: string }` body
- **Type Safety** — Full TypeScript coverage across all route handlers and database queries

---

## Project Structure

```
market-edu/
├── prisma/
│   ├── schema.prisma          # Database schema (Registration model)
│   └── seed.ts                # Sample data seeder script
├── public/                    # Static assets (favicon, images)
├── src/
│   ├── app/
│   │   ├── globals.css        # Global styles, theme, animations
│   │   ├── layout.tsx         # Root layout with dark mode HTML
│   │   ├── page.tsx           # Landing page (all sections)
│   │   ├── success/
│   │   │   └── page.tsx       # Post-registration confirmation
│   │   ├── admin/
│   │   │   └── page.tsx       # Admin dashboard + login
│   │   └── api/
│   │       ├── register/
│   │       │   └── route.ts   # POST /api/register
│   │       ├── registrations/
│   │       │   └── route.ts   # GET /api/registrations (JWT-protected)
│   │       └── auth/
│   │           └── login/
│   │               └── route.ts # POST /api/auth/login
│   ├── components/
│   │   ├── RegistrationForm.tsx   # Client form component
│   │   ├── CountdownTimer.tsx     # Live countdown component
│   │   └── ui/                    # ShadCN UI primitives
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── card.tsx
│   │       ├── badge.tsx
│   │       └── separator.tsx
│   └── lib/
│       ├── prisma.ts              # Prisma client singleton
│       ├── auth.ts                # JWT generation/verification
│       └── utils.ts               # cn() className utility
├── .env.example                   # Environment variable template
├── .env                           # Environment variables (gitignored)
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20 LTS or later)
- **PostgreSQL** 14+ (recommended: 16 or 18)
- **npm** 9+ (comes with Node.js)
- A GitHub account (for deployment via Vercel or similar)
- A WhatsApp group invite link (optional, for the WhatsApp integration)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nexusauth0-cloud/puprime.git
   cd puprime
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

### Environment Variables

Copy the example environment file and customize it:

```bash
cp .env.example .env
```

Edit `.env` with your values:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://u0_a318@localhost:5432/market_edu` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `puprime-market-edu-secret-2026` |
| `ADMIN_EMAIL` | Admin login email | `admin@marketedu.com` |
| `ADMIN_PASSWORD` | Admin login password | `admin123` |
| `NEXT_PUBLIC_WHATSAPP_LINK` | WhatsApp group invite URL | WhatsApp group link |
| `NEXT_PUBLIC_EVENT_DATE` | Event date in ISO 8601 format | `2026-06-16T18:00:00+01:00` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for sharing | `http://localhost:3000` |

### Database Setup

1. Ensure PostgreSQL is running:
   ```bash
   pg_isready
   ```

2. Create the database:
   ```bash
   createdb market_edu
   ```

3. Push the Prisma schema to your database:
   ```bash
   npx prisma db push
   ```

4. (Optional) Seed sample data:
   ```bash
   npx tsx prisma/seed.ts
   ```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the landing page.

---

## Pages & Components

### Landing Page (/)

The landing page is a single-server-component page (`src/app/page.tsx`) that composes multiple sections:

1. **Navigation Bar** — Fixed position, blurred background, logo, Register and WhatsApp buttons
2. **Hero Section** — Full-width hero with gradient text, CTA buttons, and social proof stats
3. **Trust Section** — Centered explanatory text about the event's purpose
4. **Speakers Section** — Three mentor cards with gradient avatar circles
5. **Features Section** — Four-column grid of "What You'll Learn" cards
6. **Event Details** — Date/time/platform/duration card
7. **Countdown Section** — Live countdown timer using client-side JavaScript
8. **Registration Section** — The critical conversion form
9. **Footer** — Copyright, WhatsApp link, admin link

The `RegistrationForm` is a client component (`"use client"`) that handles form state, validation, API submission, loading states, error display, and redirect.

The `CountdownTimer` is a client component that continuously updates the countdown display every second using `setInterval`.

### Success Page (/success)

A client-rendered page wrapped in a `Suspense` boundary. The `SuccessContent` component reads the `name` query parameter from the URL and displays a personalized confirmation message. It includes the countdown timer again, a WhatsApp join CTA card with green styling, and a share button.

### Admin Dashboard (/admin)

The admin page conditionally renders either `AdminLogin` or `AdminDashboard` based on authentication state. On mount, it checks for a stored JWT token and validates it by making a test request to `/api/registrations`.

- **AdminLogin** — Simple email/password form with error handling
- **AdminDashboard** — Stats cards, search/date filters, registrations table, CSV export button

---

## API Routes

### POST /api/register

Registers a new attendee.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "whatsappNumber": "+2348012345678",
  "email": "john@example.com" // optional
}
```

**Validation Rules:**
- `fullName` — required, minimum 2 characters
- `whatsappNumber` — required, minimum 8 digits after normalization; spaces, dashes, and parentheses are stripped
- `email` — optional, stored as-is if provided

**Duplicate Detection:**
The endpoint checks for an existing registration with the same normalized WhatsApp number. If found, returns `409 Conflict` with a descriptive message.

**Success Response (201):**
```json
{
  "success": true,
  "registration": {
    "id": "clx...",
    "fullName": "John Doe"
  }
}
```

### GET /api/registrations

Returns all registrations (admin-only). Requires a Bearer token in the Authorization header.

**Request Headers:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
```json
{
  "registrations": [
    {
      "id": "clx...",
      "fullName": "John Doe",
      "whatsappNumber": "+2348012345678",
      "email": "john@example.com",
      "createdAt": "2026-06-13T05:47:45.000Z"
    }
  ]
}
```

### POST /api/auth/login

Authenticates an admin user and returns a JWT token.

**Request Body:**
```json
{
  "email": "admin@marketedu.com",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbG...",
  "success": true
}
```

The token expires after 7 days.

---

## Database Schema

```prisma
model Registration {
  id              String   @id @default(cuid())
  fullName        String
  whatsappNumber  String   @unique
  email           String?
  createdAt       DateTime @default(now())

  @@map("registrations")
}
```

The schema uses Prisma's `cuid()` for ID generation, ensuring globally unique identifiers without database round-trips. The `whatsappNumber` field has a `@unique` constraint to prevent duplicate registrations from the same phone number.

---

## Design System

The UI follows a cohesive dark SaaS design language:

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0B1220` | Page background (deep navy) |
| Accent | `#2563EB` | Primary buttons, links, highlights |
| Card Background | `rgba(15, 23, 42, 0.5)` | Glassmorphism cards |
| Card Border | `rgba(30, 41, 59, 0.8)` | Subtle card borders |
| Text Primary | `#f1f5f9` | Headings and body text |
| Text Muted | `#64748b` | Secondary and helper text |

### Animations

- **Float** — A gentle 3s up-and-down animation used for the success checkmark icon
- **Fade-in-up** — Staggered entrance animation for hero section elements
- **Hover Glow** — Cards and buttons have subtle shadow intensification on hover
- **Glassmorphism** — Semi-transparent backgrounds with backdrop blur create depth
- **Gradient Text** — Blue-to-indigo gradient on the main headline and logo

### Mobile-First

All components are fully responsive with breakpoints at `sm` (640px), `md` (768px), and `lg` (1024px). The registration form, stats cards, feature grid, and admin table all stack vertically on smaller screens and expand to multi-column layouts on larger ones.

---

## Deployment

### Deploy on Vercel (Recommended)

1. Push the repository to GitHub
2. Import the project into [Vercel](https://vercel.com/new)
3. Set the environment variables in the Vercel dashboard
4. Deploy — Vercel auto-detects Next.js and configures the build

### Deploy on Other Platforms

The project is a standard Next.js application and can be deployed on any platform that supports Node.js:

- **Railway** — Supports PostgreSQL + Next.js deployments
- **Fly.io** — Docker-based deployment with PostgreSQL
- **DigitalOcean App Platform** — Simple Git-based deployment

For all platforms, make sure to:
1. Set all environment variables from `.env.example`
2. Provision a PostgreSQL database and set the `DATABASE_URL`
3. Run `npx prisma db push` as a post-deploy step

---

## Admin Access

Navigate to `/admin` in your browser and log in with:

- **Email:** `admin@marketedu.com`
- **Password:** `admin123`

*(Change these in your `.env` file before going to production)*

---

## WhatsApp Integration

The platform is designed to work with WhatsApp in two ways:

1. **WhatsApp Group Link** — The `NEXT_PUBLIC_WHATSAPP_LINK` environment variable controls the group invite link displayed throughout the site. Set this to your permanent WhatsApp group invite URL.

2. **Direct Messaging** — For production, you can extend the registration API to send automated WhatsApp messages via:
   - **WhatsApp Business API** (official, requires Meta Business account)
   - **Twilio WhatsApp API** (easier integration, pay-as-you-go)
   - **WATI** or **WhatsApp Cloud API** (third-party providers)

The `whatsappNumber` collected during registration is already normalized for programmatic use.

---

## Customization Guide

### Event Details

Edit the following environment variables:
- `NEXT_PUBLIC_EVENT_DATE` — Change the event date/time
- `NEXT_PUBLIC_WHATSAPP_LINK` — Update the WhatsApp group link

### Content

All landing page text is in `src/app/page.tsx`. Key sections to customize:
- Event title and subtitle (Hero section)
- Speaker names, roles, and initials (Speakers section)
- Feature card titles and descriptions
- "Why This Event Exists" text
- Event details (date, time, platform, duration)

### Styling

Global theme tokens are defined in `src/app/globals.css`:
- Background color: `#0B1220` (change `--color-background`)
- Accent color: `#2563EB` (change `--color-accent`)
- Animation timing and keyframes

### Admin Credentials

Change `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` before production deployment.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- All components should be TypeScript with proper typing
- Use the `cn()` utility for className merging
- Follow the existing glassmorphism and animation patterns
- Keep forms accessible with proper labels and ARIA attributes
- API routes should always return structured JSON responses

---

## License

This project is licensed under the MIT License — see the LICENSE file for details.

---

Built with ❤️ for the Market Education community.
