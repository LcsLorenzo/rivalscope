import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { userProfiles } from "../../drizzle/schema";

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

  user: {
    additionalFields: {
      plan: { type: "string", defaultValue: "free" },
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await db
            .insert(userProfiles)
            .values({ userId: user.id })
            .onConflictDoNothing();
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
