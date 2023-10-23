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
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { newCategorySchema } from "@/server/api/routers/categories";
import { type z } from "zod";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export function NewCategoryForm() {
  const [slug, setSlug] = useState("");

  const categoryMutation = api.categories.create.useMutation();
  const router = useRouter();

  const form = useForm<z.infer<typeof newCategorySchema>>({
    resolver: zodResolver(newCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof newCategorySchema>) => {
    await categoryMutation.mutateAsync(values);
    router.push("/admin/categories");
    router.refresh();
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
        <Button type="submit">Stwórz</Button>
      </form>
    </Form>
  );
}
