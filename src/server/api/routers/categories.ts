import { categories } from "@/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const categoriesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(categories);
  }),
});
