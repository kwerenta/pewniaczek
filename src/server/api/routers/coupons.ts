import { newCouponSchema } from "@/lib/validators/coupon";
import { db } from "@/server/db";
import { bets, coupons } from "@/server/db/schema";
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
        orderBy: ({ createdAt }, { desc }) => desc(createdAt),
      }),
  ),
  create: protectedProcedure
    .input(newCouponSchema)
    .mutation(async ({ ctx, input }) => {
      await db.transaction(async (tx) => {
        const [insertedCoupon] = await tx
          .insert(coupons)
          // TEMP: Enforce single coupon type for now
          .values({ userId: ctx.session.user.id, type: "single" })
          .returning({ id: coupons.id });

        if (!insertedCoupon?.id) {
          tx.rollback();
          return;
        }

        await tx.insert(bets).values(
          input.map((bet) => ({
            couponId: insertedCoupon.id,
            amount: bet.amount,
            odds: bet.odds,
            eventId: bet.eventId,
            typeId: bet.typeId,
            optionId: bet.optionId,
            result: "pending" as const,
          })),
        );
      });
    }),
});
