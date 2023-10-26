import { newOptionTypeSchema } from "@/lib/validators/type";
import { authorizedProcedure, createTRPCRouter } from "../trpc";
import { betOptions, betOptionsOnTypes, betTypes } from "@/server/db/schema";

export const typesRouter = createTRPCRouter({
  getAll: authorizedProcedure.query(
    async ({ ctx }) => await ctx.db.select().from(betTypes),
  ),
  create: authorizedProcedure
    .input(newOptionTypeSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const { insertId: typeId } = await tx
          .insert(betTypes)
          .values({ name: input.name });

        const { insertId } = await tx
          .insert(betOptions)
          .values(input.options.map((opt) => ({ value: opt.value })));
        const firstOptionId = Number(insertId);

        await tx.insert(betOptionsOnTypes).values(
          input.options.map((_, index) => ({
            typeId: Number(typeId),
            optionId: firstOptionId + index,
          })),
        );
      });
    }),
});
