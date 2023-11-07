import {
  betOptionsOnTypes,
  betTypesOnEvents,
  categories,
  events,
  odds,
} from "@/server/db/schema";
import { authorizedProcedure, createTRPCRouter } from "../trpc";
import { newEventSchema } from "@/lib/validators/event";
import "node:crypto";
import { and, eq, inArray, or, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

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

      const doesCategoryExist = await ctx.db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.id, input.categoryId))
        .then((res) => res.length > 0);
      if (!doesCategoryExist)
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Podana kategoria nie istnieje",
        });

      // Check if all bet options belong to proper bet types
      const areBetOptionsValid = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(betOptionsOnTypes)
        .where(
          or(
            ...input.bets.map((bet) =>
              and(
                eq(betOptionsOnTypes.typeId, bet.typeId),
                inArray(
                  betOptionsOnTypes.optionId,
                  bet.options.map((option) => option.optionId),
                ),
              ),
            ),
          ),
        )
        .then(
          (res) =>
            Number(res[0]?.count) ===
            input.bets.reduce((sum, bet) => sum + bet.options.length, 0),
        );
      if (!areBetOptionsValid)
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Podano nieprawidłowe zakłady",
        });

      await ctx.db.transaction(async (tx) => {
        await tx.insert(events).values({
          id: eventId,
          name: input.name,
          categoryId: input.categoryId,
          time: input.time,
        });

        await tx
          .insert(betTypesOnEvents)
          .values(input.bets.map((bet) => ({ eventId, typeId: bet.typeId })));

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
