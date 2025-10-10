import { createAuthClient } from "better-auth/react";
import { env } from "~/env";

export const authClient = createAuthClient({
  // baseURL: env.NODE_ENV === "production"
  //   ? `https://${env.LAUNCH_PROJECT_PRODUCTION_URL}`
  //   : env.NODE_ENV === "test"
  //     ? `https://${env.LAUNCH_URL}`
  //     : "http://localhost:3000",
});
