import { newOptionTypeSchema } from "@/lib/validators/type";
import { authorizedProcedure, createTRPCRouter } from "../trpc";
import { betOptions, betOptionsOnTypes, betTypes } from "@/server/db/schema";
import { z } from "zod";
import { eq, inArray } from "drizzle-orm";

export const typesRouter = createTRPCRouter({
  getAll: authorizedProcedure.query(
    async ({ ctx }) => await ctx.db.select().from(betTypes),
  ),
  getAllWithOptions: authorizedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.betTypes.findMany({
      with: { optionsOnTypes: { with: { option: true } } },
    });
    return result.map((type) => ({
      id: type.id,
      name: type.name,
      options: type.optionsOnTypes.map((opt) => ({
        id: opt.option.id,
        value: opt.option.value,
      })),
    }));
  }),
  delete: authorizedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx.delete(betTypes).where(eq(betTypes.id, input.id));

        const optionIds = await tx
          .select({ optionsId: betOptionsOnTypes.optionId })
          .from(betOptionsOnTypes)
          .where(eq(betOptionsOnTypes.typeId, input.id));
        await tx.delete(betOptions).where(
          inArray(
            betOptions.id,
            optionIds.map((opt) => opt.optionsId),
          ),
        );

        await tx
          .delete(betOptionsOnTypes)
          .where(eq(betOptionsOnTypes.typeId, input.id));
      });
    }),
  create: authorizedProcedure
    .input(newOptionTypeSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const [insertedBetType] = await tx
          .insert(betTypes)
          .values({ name: input.name })
          .returning({ id: betTypes.id });

        if (!insertedBetType) {
          tx.rollback();
          return;
        }

        const insertedOptions = await tx
          .insert(betOptions)
          .values(input.options.map((opt) => ({ value: opt.value })))
          .returning({ id: betOptions.id });

        await tx.insert(betOptionsOnTypes).values(
          insertedOptions.map((option) => ({
            typeId: insertedBetType.id,
            optionId: option.id,
          })),
        );
      });
    }),
});
