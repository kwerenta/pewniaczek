"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type Bet, useCouponStore } from "@/lib/stores/coupon";
import { formatDecimalValue } from "@/lib/utils";
import { PopoverClose } from "@radix-ui/react-popover";
import { useState } from "react";

interface BetButtonProps {
  eventId: string;
  option: Bet["option"];
  type: Bet["type"];
  odds: number;
}

export function BetButton({ eventId, option, type, odds }: BetButtonProps) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const addBet = useCouponStore((state) => state.addBet);
  const [amount, setAmount] = useState(0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm">{formatDecimalValue(odds)}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-2">
        <Label htmlFor="amount">Wartość zakładu [PLN]</Label>
        <Input
          id="amount"
          type="number"
          step={0.01}
          value={(amount / 100).toFixed(2)}
          onChange={(e) => setAmount(Number(e.target.value) * 100)}
        />
        <PopoverClose asChild>
          <Button
            variant="secondary"
            onClick={() => addBet({ eventId, option, type, amount, odds })}
          >
            Dodaj
          </Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
}
