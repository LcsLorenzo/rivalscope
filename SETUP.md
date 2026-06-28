# 🚀 RivalScope — Setup Guide

## Prerequisites

- [Bun](https://bun.sh) installed (`curl -fsSL https://bun.sh/install | bash`)
- A [Neon](https://neon.tech) account (free)
- A [Stripe](https://stripe.com) account (free to start)
- A [Resend](https://resend.com) account (free tier: 3k emails/month)
- A [Trigger.dev](https://trigger.dev) account (free tier)
- A [Vercel](https://vercel.com) account (free)

---

## Step 1: Install dependencies

```bash
bun install
```

## Step 2: Configure environment variables

```bash
cp .env.example .env.local
```

Fill in each value:

### Neon (Database)
1. Go to [neon.tech](https://neon.tech) → Create project → Copy connection string
2. Paste it as `DATABASE_URL`

### Better Auth
```bash
openssl rand -hex 32
# Paste the output as BETTER_AUTH_SECRET
```

### Google OAuth
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project → APIs & Services → Credentials → OAuth 2.0 Client
3. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Secret

### Stripe
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Get your test API keys
3. Create two products: "Pro" ($29/month) and "Agency" ($99/month)
4. Copy the price IDs
5. For webhooks: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### Resend
1. Go to [resend.com](https://resend.com) → API Keys → Create
2. Add and verify your domain

### Trigger.dev
1. Go to [trigger.dev](https://trigger.dev) → Create project
2. Copy your secret key

---

## Step 3: Push database schema

```bash
bun run db:push
```

Verify in Drizzle Studio:
```bash
bun run db:studio
```

## Step 4: Start development server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## Step 5: Deploy to Vercel

```bash
bun install -g vercel
vercel
```

Add all environment variables in the Vercel dashboard.

---

## Architecture Overview

```
User Request
    │
    ▼
TanStack Start (SSR + Server Functions)
    │
    ├── Better Auth (session validation)
    ├── Drizzle ORM → Neon PostgreSQL
    └── Elysia API (embedded)
            │
            ├── Stripe webhooks
            └── Trigger.dev job dispatch
                    │
                    └── Background scraping + AI analysis
```
