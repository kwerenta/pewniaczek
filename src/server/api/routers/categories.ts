import { categories } from "@/server/db/schema";
import {
  authorizedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";
import { slugify } from "@/lib/utils";
import { newCategorySchema } from "@/lib/validators/category";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const categoriesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(categories);
  }),
  create: authorizedProcedure
    .input(newCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const slug = slugify(input.name);

      const isExisting = await ctx.db
        .select({ slug: categories.slug })
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1)
        .then((rows) => rows.length > 0);

      if (isExisting)
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Kategoria o takim adresie już istnieje",
        });

      await ctx.db.insert(categories).values({ name: input.name, slug });
    }),
  delete: authorizedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.delete(categories).where(eq(categories.id, input.id));
    }),
});
