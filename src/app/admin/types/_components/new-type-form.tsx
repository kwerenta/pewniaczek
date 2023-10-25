"use client";

import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const NewOptionTypeSchema = z.object({
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

type NewOptionTypeInput = z.infer<typeof NewOptionTypeSchema>;

export function NewTypeForm() {
  const form = useForm<NewOptionTypeInput>({
    resolver: zodResolver(NewOptionTypeSchema),
    defaultValues: {
      name: "",
      options: [{ value: "" }],
    },
  });

  const {
    fields: options,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    name: "options",
    control: form.control,
  });

  const onSubmit = (values: NewOptionTypeInput) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          {options.map((option, index) => (
            <FormField
              key={option.id}
              control={form.control}
              name={`options.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  {index === 0 ? (
                    <>
                      <FormLabel>Wartości</FormLabel>
                      <FormDescription>
                        Możliwe opcje jakie można obstawić w danym rodzaju
                        zakładu
                      </FormDescription>
                    </>
                  ) : null}
                  <div className="flex gap-4">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <Button
                      size="icon"
                      variant="outline"
                      disabled={options.length === 1}
                      onClick={() => removeOption(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Usuń wartość</span>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button variant="outline" onClick={() => appendOption({ value: "" })}>
            Dodaj wartość
          </Button>
        </div>
        <LoadingButton
          type="submit"
          isLoading={form.formState.isSubmitting}
          loadingText="Tworzenie..."
        >
          Stwórz
        </LoadingButton>
      </form>
    </Form>
  );
}
