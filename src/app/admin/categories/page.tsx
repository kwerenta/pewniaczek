import { api } from "@/trpc/server";

export default async function CategoriesPage() {
  const categories = await api.categories.getAll.query();

  return (
    <main className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl">Lista kategorii</h1>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              {category.name} | {category.slug}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
