import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { user, session, account, verification } from "../database/auth-schema";
import { config } from "../config";
import db from "../database";
import { uuidv7 } from "uuidv7";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  advanced: {
    database: {
      generateId: () => uuidv7()
    },
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      partitioned: true // New browser standards will mandate this for foreign cookies
    },
    crossSubDomainCookies: {
      enabled: true
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  account: {
    accountLinking: {
      enabled: false,
    },
  },
  socialProviders: {
    // Add social providers if needed in the future
    // google: {
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "customer",
      },
    },
  },
  baseURL: config.app.baseUrl || "http://localhost:3000",
  trustedOrigins: [config.app.baseUrl || "http://localhost:3000"],
});

export type Auth = typeof auth;