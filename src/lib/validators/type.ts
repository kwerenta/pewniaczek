import { z } from "zod";

export const newOptionTypeSchema = z.object({
  name: z
    .string()
    .min(3, "Nazwa musi mieć co najmniej 3 znaki")
    .max(255, "Nazwa może mieć maksymalnie 255 znaków"),
  options: z
    .array(
      z.object({
        value: z
          .string()
          .min(1, "Wartość musi mieć co najmniej 1 znak")
          .max(255, "Wartość może mieć maksymalnie 255 znaków"),
      }),
    )
    .min(2, "Musisz dodać co najmniej 2 opcje")
    .max(16, "Możesz dodać maksymalnie 16 opcji"),
});

export type NewOptionTypeInput = z.infer<typeof newOptionTypeSchema>;
