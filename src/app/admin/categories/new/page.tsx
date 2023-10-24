import Link from "next/link";
import { NewCategoryForm } from "../_components/new-category-form";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";

export default function NewCategoryPage() {
  return (
    <PageShell>
      <PageHeader
        title="Stwórz nową kategorię"
        description="Kategorie służą do segregacji wydarzeń"
      >
        <Link href="/admin/categories" className={buttonVariants()}>
          Wróć
        </Link>
      </PageHeader>
      <NewCategoryForm />
    </PageShell>
  );
}
