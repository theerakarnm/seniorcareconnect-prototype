import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { db } from "@acme/db/client";
import { user } from "@acme/db";
import { eq } from "drizzle-orm";

import { initAuth } from "@acme/auth";

import { env } from "~/env";

const baseUrl =
  env.NODE_ENV === "production"
    ? `https://${env.LAUNCH_PROJECT_PRODUCTION_URL}`
    : env.NODE_ENV === "test"
      ? `https://${env.LAUNCH_URL}`
      : "http://localhost:3000";

export const auth = initAuth({
  baseUrl,
  productionUrl: `https://${env.LAUNCH_PROJECT_PRODUCTION_URL ?? "seniorcareconnect.com"}`,
  secret: env.AUTH_SECRET,
  discordClientId: env.AUTH_DISCORD_ID,
  discordClientSecret: env.AUTH_DISCORD_SECRET,
});

export const getSession = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  // If session exists, fetch user with role
  if (session?.user?.id) {
    const userWithRole = await db.select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (userWithRole.length > 0) {
      session.user = { ...session.user, ...userWithRole[0] };
    }
  }

  return session;
});
