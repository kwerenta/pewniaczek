import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/server";
import Link from "next/link";
import { DeleteCategoryButton } from "./_components/delete-category-button";

export default async function CategoriesPage() {
  const categories = await api.categories.getAll();

  return (
    <PageShell>
      <PageHeader
        title="Lista kategorii"
        description="Lista wszystkich dostępnych kategorii"
      >
        <Link href="/admin/categories/new" className={buttonVariants()}>
          Stwórz nową kategorię
        </Link>
      </PageHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nazwa</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="w-1/2">{category.name}</TableCell>
              <TableCell className="w-1/2">{category.slug}</TableCell>
              <TableCell className="whitespace-nowrap">
                <DeleteCategoryButton categoryId={category.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PageShell>
  );
}
