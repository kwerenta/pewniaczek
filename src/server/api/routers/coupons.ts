import { db } from "@/server/db";
import { coupons } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const couponsRouter = createTRPCRouter({
  getAllByUser: protectedProcedure.query(
    async ({ ctx }) =>
      await db.query.coupons.findMany({
        with: {
          bets: true,
        },
        where: eq(coupons.userId, ctx.session.user.id),
      }),
  ),
});
