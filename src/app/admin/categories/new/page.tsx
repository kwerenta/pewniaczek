import Link from "next/link";
import { NewCategoryForm } from "./_components/new-category-form";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function NewCategoryPage() {
  return (
    <main className="container pb-8 pt-6 md:py-10">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Stwórz nową kategorię
          </h2>
          <p className="text-muted-foreground">
            Kategorie służą do segregacji wydarzeń
          </p>
        </div>
        <Link href="/admin/categories" className={buttonVariants()}>
          Wróć
        </Link>
      </div>
      <Separator className="my-6" />
      <NewCategoryForm />
    </main>
  );
}
