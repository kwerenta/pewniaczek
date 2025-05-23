import { env } from "@/env.mjs";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
} satisfies Config;
