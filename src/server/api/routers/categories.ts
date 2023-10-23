import { categories } from "@/server/db/schema";
import {
  authorizedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";
import { z } from "zod";
import { slugify } from "@/lib/utils";

export const newCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Nazwa musi mieć co najmniej 2 znaki")
    .max(255, "Nazwa może mieć maksymalnie 255 znaków"),
});

export const categoriesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(categories);
  }),
  create: authorizedProcedure
    .input(newCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const slug = slugify(input.name);
      await ctx.db.insert(categories).values({ name: input.name, slug });
    }),
});
