import { create } from "zustand";

export interface Bet {
  amount: number;
  odds: number;
  eventId: string;
  type: {
    id: number;
    name: string;
  };
  option: {
    id: number;
    value: string;
  };
}

interface CouponStore {
  bets: Bet[];
  addBet(bet: Bet): void;
  removeBet(bet: Bet): void;
}

export const useCouponStore = create<CouponStore>((set) => ({
  bets: [],
  amount: 0,
  addBet: (bet) => set((state) => ({ bets: [...state.bets, bet] })),
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
}));
