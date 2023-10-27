import { createTRPCRouter } from "@/server/api/trpc";
import { categoriesRouter } from "./routers/categories";
import { typesRouter } from "./routers/types";
import { eventsRouter } from "./routers/events";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  types: typesRouter,
  events: eventsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
