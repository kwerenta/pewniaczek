import { z } from "zod";

export const newCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Nazwa musi mieć co najmniej 2 znaki")
    .max(255, "Nazwa może mieć maksymalnie 255 znaków"),
});

export type NewCategoryInput = z.infer<typeof newCategorySchema>;
