"use client";

import { Button } from "@/components/ui/button";
import { type Bet, useCouponStore } from "@/lib/stores/coupon";
import { formatOdds } from "@/lib/utils";

interface BetButtonProps {
  eventId: string;
  option: Bet["option"];
  type: Bet["type"];
  odds: number;
}

export function BetButton({ eventId, option, type, odds }: BetButtonProps) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const addBet = useCouponStore((state) => state.addBet);
  return (
    <Button
      onClick={() => addBet({ eventId, option, type, amount: 1000, odds })}
    >
      {formatOdds(odds)}
    </Button>
  );
}
