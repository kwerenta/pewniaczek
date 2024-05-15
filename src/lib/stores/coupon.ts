import { type BetOption, type BetType, type Bet } from "@/server/db/schema";
import { create } from "zustand";

type CouponBetWithOptions = Omit<
  Bet & { type: BetType; option: BetOption },
  "typeId" | "optionId" | "result" | "couponId" | "id"
>;

interface CouponStore {
  bets: CouponBetWithOptions[];
  addBet: (bet: CouponBetWithOptions) => void;
  removeBet: (bet: CouponBetWithOptions) => void;
  clearCoupon: () => void;
}

export const useCouponStore = create<CouponStore>((set) => ({
  bets: [],
  amount: 0,
  addBet: (bet) =>
    set((state) => ({
      bets: [...state.bets, bet],
    })),
  removeBet: (bet) =>
    set((state) => ({
      bets: state.bets.filter(
        (b) =>
          !(
            b.eventId === bet.eventId &&
            b.type.id === bet.type.id &&
            b.option.id === bet.option.id
          ),
      ),
    })),
  clearCoupon: () => set(() => ({ bets: [] })),
}));
