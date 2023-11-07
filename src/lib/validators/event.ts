import { z } from "zod";

export const newEventSchema = z.object({
  name: z
    .string()
    .min(3, "Nazwa wydarzenia musi mieć co najmniej 3 znaki")
    .max(255, "Nazwa wydarzenia może mieć maksymalnie 255 znaków"),
  time: z.date().min(new Date(), "Wydarzenie nie może być w przeszłości"),
  categoryId: z.number().positive("Kategoria musi być wybrana"),
  bets: z
    .array(
      z.object({
        typeId: z.number().positive("Rodzaj zakładu musi być wybrany"),
        options: z
          .array(
            z.object({
              optionId: z.coerce
                .number()
                .positive("Opcja zakładu musi być wybrana"),
              odds: z
                .number()
                .gt(100, "Kurs musi być większy od 1")
                .lte(100000, "Kurs musi być mniejszy od 1000"),
            }),
          )
          .min(1, "Zakład musi mieć co najmniej jedną opcję"),
      }),
    )
    .min(1)
    .refine(
      (bets) => bets.length === new Set(bets.map((bet) => bet.typeId)).size,
      "Jeden rodzaj zakładu może być wybrany tylko raz",
    ),
});

export type NewEventInput = z.infer<typeof newEventSchema>;
