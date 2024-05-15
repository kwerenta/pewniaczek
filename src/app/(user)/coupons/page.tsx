import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDecimalValue } from "@/lib/utils";
import { api } from "@/trpc/server";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

export default async function CouponsPage() {
  const coupons = await api.coupons.getAllByUser.query();

  return (
    <div className="space-y-4">
      {coupons.map((coupon) => (
        <Card key={coupon.id} className="flex items-center justify-between">
          <CardHeader>
            <CardTitle>
              {coupon.type === "single"
                ? "Zakład pojedynczy"
                : "Zakład kumulowany"}
            </CardTitle>
            <CardDescription>
              Stawka:{" "}
              {formatDecimalValue(
                (coupon.type === "single"
                  ? coupon.bets.reduce(
                      (amount, bet) =>
                        bet.amount ? amount + bet.amount : amount,
                      0,
                    )
                  : coupon.amount) ?? 0,
              )}{" "}
              PLN | Do wygrania:{" "}
              {formatDecimalValue(
                coupon.type === "single"
                  ? coupon.bets.reduce(
                      (sum, bet) =>
                        sum + (bet.amount ? (bet.amount * bet.odds) / 100 : 0),
                      0,
                    )
                  : (coupon.amount ?? 0) *
                      coupon.bets.reduce((odds, bet) => odds * bet.odds, 1),
              )}{" "}
              PLN
            </CardDescription>
          </CardHeader>
          <CardHeader className="items-end">
            <p className="text-sm text-muted-foreground">
              {format(coupon.createdAt, "PPPPp", { locale: pl })}
            </p>
            <p className="text-sm text-muted-foreground">
              {coupon.bets.some((bet) => bet.result === "pending")
                ? "W trakcie"
                : "Zakończony"}
            </p>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
