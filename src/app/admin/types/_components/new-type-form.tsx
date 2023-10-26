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
import { useToast } from "@/components/ui/use-toast";
import {
  type NewOptionTypeInput,
  newOptionTypeSchema,
} from "@/lib/validators/type";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";

export function NewTypeForm() {
  const router = useRouter();
  const { toast } = useToast();
  const typesMutation = api.types.create.useMutation();

  const form = useForm<NewOptionTypeInput>({
    resolver: zodResolver(newOptionTypeSchema),
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
    typesMutation.mutate(values, {
      onSuccess: () => {
        router.push("/admin/types");
        router.refresh();

        toast({
          title: "Sukces",
          description: "Pomyślnie utworzono nowy rodzaj zakładu",
        });
      },
      onError: (error) => {
        toast({
          title: "Błąd",
          description: error.message,
          variant: "destructive",
        });
      },
    });
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
