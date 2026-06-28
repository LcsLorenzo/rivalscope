# RivalScope — Setup Guide

## Prerequisites
- Node.js 20+ or Bun 1.1+
- PostgreSQL database (we recommend [Neon](https://neon.tech) — free tier works)
- Stripe account
- Resend account (free tier: 3k emails/month)
- OpenAI API key

---

## 1. Clone & install

```bash
git clone https://github.com/LcsLorenzo/rivalscope
cd rivalscope
bun install
```

## 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in each variable (see comments in `.env.example`).

## 3. Database setup

```bash
# Push schema to your Neon DB
bun run db:push

# (Optional) Open Drizzle Studio to inspect
bun run db:studio
```

## 4. Stripe setup

1. Create two products in Stripe Dashboard:
   - **Pro** — $29/month recurring → copy Price ID to `STRIPE_PRO_PRICE_ID`
   - **Agency** — $99/month recurring → copy Price ID to `STRIPE_AGENCY_PRICE_ID`

2. Set up webhook:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`.

## 5. Run locally

```bash
bun dev
# → http://localhost:3000
```

## 6. Deploy to Vercel

```bash
vercel deploy
```

Add all `.env.local` variables in Vercel Dashboard → Project → Settings → Environment Variables.

---

## Architecture

```
User request
  → TanStack Router (file-based, type-safe)
  → beforeLoad / authMiddleware (Better Auth session)
  → Server Function (Drizzle ORM → Neon PostgreSQL)
  → Trigger.dev background job (scraping)
  → OpenAI GPT-4o-mini (AI diff summary)
  → Resend email (alert notification)
  → Stripe webhook (plan update)
```

## Scripts

| Command | Description |
|---|---|
| `bun dev` | Start dev server |
| `bun build` | Production build |
| `bun run db:push` | Push Drizzle schema |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run db:generate` | Generate migrations |
