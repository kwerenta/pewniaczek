import { events } from "@/server/db/schema";
import { authorizedProcedure, createTRPCRouter } from "../trpc";

export const eventsRouter = createTRPCRouter({
  getAll: authorizedProcedure.query(
    async ({ ctx }) =>
      await ctx.db.select().from(events).orderBy(events.createdAt),
  ),
  getAllWithOdds: authorizedProcedure.query(
    async ({ ctx }) =>
      await ctx.db.query.events.findMany({
        with: {
          category: {
            columns: { name: true, slug: true },
          },
          odds: {
            columns: { value: true },
            with: {
              type: { columns: { name: true } },
              option: { columns: { value: true } },
            },
          },
        },
      }),
  ),
});
