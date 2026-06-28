import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { userProfiles } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",

  emailAndPassword: { enabled: true },

  socialProviders: {
    ...(process.env.GITHUB_CLIENT_ID ? {
      github: {
        clientId:     process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      },
    } : {}),
    ...(process.env.GOOGLE_CLIENT_ID ? {
      google: {
        clientId:     process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    } : {}),
  },

  // Auto-create user profile on signup
  user: {
    additionalFields: {
      plan: { type: "string", defaultValue: "free" },
    },
  },

  // Hook: create user_profile row after signup
  hooks: {
    after: [
      {
        matcher: (ctx) => ctx.path === "/sign-up/email",
        handler: async (ctx) => {
          if (ctx.context?.newSession?.user?.id) {
            await db
              .insert(userProfiles)
              .values({ userId: ctx.context.newSession.user.id })
              .onConflictDoNothing();
          }
        },
      },
    ],
  },
});

export type Session = typeof auth.$Infer.Session;
