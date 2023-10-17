import { basicRouter } from "@/server/api/routers/basic";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  basic: basicRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
