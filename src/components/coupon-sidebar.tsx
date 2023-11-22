"use client";

import { useCouponStore } from "@/lib/stores/coupon";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { formatDecimalValue } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export function CouponSidebar() {
  const bets = useCouponStore((state) => state.bets);

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const removeBet = useCouponStore((state) => state.removeBet);

  const amount = bets.reduce((acc, bet) => acc + bet.amount, 0);

  const placeCoupon = () => {
    console.log(bets);
  };

  return (
    <aside className="sticky top-[4.5rem] h-[calc(100vh-12rem)] w-96">
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle>Twój kupon</CardTitle>
          <CardDescription>
            Lista wydarzeń, które chcesz obstawić
          </CardDescription>
        </CardHeader>
        <CardContent className="mb-4 space-y-4 overflow-y-auto">
          {bets.length === 0 ? (
            <span className="text-muted-foreground">
              Aktualnie twój kupon jest pusty :(
            </span>
          ) : (
            bets.map((bet) => (
              <div
                key={`${bet.eventId}${bet.type.id}${bet.option.id}`}
                className="flex items-center"
              >
                <div className="flex-1">
                  <p className="font-bold">
                    {bet.type.name} | {bet.option.value}
                  </p>
                  <p>
                    {formatDecimalValue(bet.amount)} PLN x{" "}
                    {formatDecimalValue(bet.odds)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeBet(bet)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Remove bet</span>
                </Button>
              </div>
            ))
          )}
        </CardContent>
        <CardFooter className="mt-auto justify-between">
          <Button disabled={amount <= 0} onClick={placeCoupon}>
            Obstaw {formatDecimalValue(amount)} PLN
          </Button>
          <div>
            <p className="font-bold">Do wygrania</p>
            <p>
              {formatDecimalValue(
                bets.reduce(
                  (acc, bet) => acc + (bet.amount * bet.odds) / 100,
                  0,
                ),
              )}{" "}
              PLN
            </p>
          </div>
        </CardFooter>
      </Card>
    </aside>
  );
}
