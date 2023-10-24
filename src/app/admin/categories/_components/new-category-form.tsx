"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/utils";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import {
  newCategorySchema,
  type NewCategoryInput,
} from "@/lib/validators/category";
import { useToast } from "@/components/ui/use-toast";
import { LoadingButton } from "@/components/loading-button";

export function NewCategoryForm() {
  const [slug, setSlug] = useState("");
  const { toast } = useToast();

  const categoryMutation = api.categories.create.useMutation();
  const router = useRouter();

  const form = useForm<NewCategoryInput>({
    resolver: zodResolver(newCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: NewCategoryInput) => {
    categoryMutation.mutate(values, {
      onSuccess: () => {
        router.push("/admin/categories");
        router.refresh();

        toast({
          title: "Kategoria została stworzona",
          description: "Możesz teraz dodać wydarzenia do tej kategorii",
        });
      },
      onError(error) {
        toast({
          variant: "destructive",
          title: "Błąd podczas tworzenia kategorii",
          description: error.message,
        });
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa kategorii</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setSlug(slugify(e.target.value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input disabled value={slug} />
          <p className="text-[0.8rem] text-muted-foreground">
            Wygenerowany uproszczony adres URL kategorii
          </p>
        </div>
        <LoadingButton
          isLoading={categoryMutation.isLoading}
          loadingText="Tworzenie..."
          type="submit"
        >
          Stwórz
        </LoadingButton>
      </form>
    </Form>
  );
}
