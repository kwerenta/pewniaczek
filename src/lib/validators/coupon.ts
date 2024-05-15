import { z } from "zod";

export const newCouponSchema = z
  .object({
    amount: z.number().positive().gt(100, "Wartość musi być większa niż 1 PLN"),
    odds: z.number().positive().gt(100, "Nieprawidłowy kurs"),
    eventId: z.string().uuid(),
    typeId: z.number().positive("Podano niepoprawny rodzaj zakładu"),
    optionId: z.number().positive("Podano niepoprawną wartość zakładu"),
  })
  .array()
  .min(1, "Kupon musi posiadać co najmniej jeden zakład");

export type NewCoupon = z.infer<typeof newCouponSchema>;
