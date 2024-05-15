import { api } from "@/trpc/server";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

export async function CategoriesSidebar() {
  const categories = await api.categories.getAll();
  return (
    <aside className="sticky top-[4.5rem] flex max-h-[calc(100vh-12rem)] w-[200px] flex-col gap-2">
      <h3 className="text-center font-semibold tracking-tight">Kategorie</h3>
      {categories.map((category) => (
        <Link
          className={buttonVariants({ variant: "secondary" })}
          key={category.id}
          href={`/categories/${category.slug}`}
        >
          {category.name}
        </Link>
      ))}
    </aside>
  );
}
