import { betTypesOnEvents, events, odds } from "@/server/db/schema";
import { authorizedProcedure, createTRPCRouter } from "../trpc";
import { newEventSchema } from "@/lib/validators/event";
import "node:crypto";

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
  create: authorizedProcedure
    .input(newEventSchema)
    .mutation(async ({ ctx, input }) => {
      const eventId = crypto.randomUUID();

      await ctx.db.transaction(async (tx) => {
        // TODO: validate that the category exists
        await tx.insert(events).values({
          id: eventId,
          name: input.name,
          categoryId: input.categoryId,
          time: input.time,
        });

        await tx
          .insert(betTypesOnEvents)
          .values(input.bets.map((bet) => ({ eventId, typeId: bet.typeId })));

        // TODO: validate that the option exists and belongs to the bet type
        await tx.insert(odds).values(
          input.bets.flatMap((bet) =>
            bet.options.map((option) => ({
              eventId,
              optionId: option.optionId,
              typeId: bet.typeId,
              value: option.odds,
            })),
          ),
        );
      });
    }),
});
