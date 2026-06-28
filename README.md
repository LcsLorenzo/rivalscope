# 🔍 RivalScope

> **AI-powered competitor monitoring SaaS** — Know every move your competitors make, automatically.

[![TanStack Start](https://img.shields.io/badge/TanStack-Start-orange)](https://tanstack.com/start)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-green)](https://orm.drizzle.team/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-purple)](https://stripe.com)

---

## ✨ What is RivalScope?

RivalScope watches your competitors 24/7 and sends instant AI-generated alerts when they:
- 💰 Change their pricing
- 🆕 Launch new features or pages
- 📝 Update their messaging or copy
- 🐦 Post on social media

**Market size:** $1.2B (2024) → $3.8B (2033) — validated, growing niche.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start (React 19 + Vite) |
| Routing | TanStack Router (file-based, type-safe) |
| Server API | Elysia (embedded, single deployment) |
| Database | Neon PostgreSQL (serverless) |
| ORM | Drizzle ORM (type-safe migrations) |
| Auth | Better Auth (email + Google OAuth) |
| Payments | Stripe (freemium + subscriptions) |
| Email | Resend + React Email |
| Background Jobs | Trigger.dev |
| Analytics | PostHog |
| Error Tracking | Sentry |
| UI | shadcn/ui + Tailwind CSS v4 |
| Deploy | Vercel |

---

## 💸 Pricing Model (Freemium)

| Plan | Price | Competitors | Alerts |
|------|-------|-------------|--------|
| **Free** | $0/mo | 2 | Weekly digest |
| **Pro** | $29/mo | 10 | Real-time + AI summary |
| **Agency** | $99/mo | Unlimited | Real-time + API + multi-workspace |

---

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/LcsLorenzo/rivalscope.git
cd rivalscope

# 2. Install dependencies
bun install

# 3. Copy env file and fill in values
cp .env.example .env.local

# 4. Push database schema
bun run db:push

# 5. Start dev server
bun run dev
```

---

## 📁 Project Structure

```
rivalscope/
├── app/
│   ├── routes/              # File-based routing (TanStack Router)
│   │   ├── __root.tsx       # Root layout
│   │   ├── index.tsx        # Landing page
│   │   ├── pricing.tsx      # Pricing page
│   │   ├── dashboard/
│   │   │   ├── index.tsx    # Dashboard overview
│   │   │   ├── competitors/ # Competitor management
│   │   │   └── alerts/      # Alert feed
│   │   └── api/
│   │       ├── auth/        # Better Auth routes
│   │       └── stripe/      # Stripe webhooks
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Core logic
│   │   ├── auth.ts          # Better Auth config
│   │   ├── db.ts            # Drizzle + Neon connection
│   │   ├── schema.ts        # Database schema
│   │   ├── stripe.ts        # Stripe config + helpers
│   │   └── email.ts         # Resend config
│   └── server/              # Elysia API routes
├── trigger/                 # Background jobs
├── emails/                  # React Email templates
├── drizzle/                 # DB migrations
└── public/
```

---

## 🔑 Environment Variables

See `.env.example` for the full list of required variables.

---

## 📦 Scripts

```bash
bun run dev          # Start dev server
bun run build        # Production build
bun run db:push      # Push schema to Neon
bun run db:studio    # Open Drizzle Studio
bun run db:migrate   # Run migrations
```

---

## 🗺️ Roadmap

- [x] Project scaffold & stack setup
- [ ] Auth (email + Google)
- [ ] Database schema & migrations
- [ ] Add/manage competitors
- [ ] Scraping engine (Trigger.dev jobs)
- [ ] AI diff summarizer (OpenAI)
- [ ] Alert feed + email digests
- [ ] Stripe billing (freemium)
- [ ] Landing page
- [ ] Admin panel
- [ ] API access (Agency plan)

---

## 📄 License

MIT © 2026 LcsLorenzo
