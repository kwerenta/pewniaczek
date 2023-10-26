import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { api } from "@/trpc/server";
import Link from "next/link";

export default async function TypesPage() {
  const types = await api.types.getAll.query();
  return (
    <PageShell>
      <PageHeader
        title="Rodzaje zakładów"
        description="Lista rodzajów zakładów, które można obstawić z możliwymi wartościami"
      >
        <Link href="/admin/types/new" className={buttonVariants()}>
          Dodaj nowy rodzaj
        </Link>
      </PageHeader>
      {types.map((type) => (
        <div key={type.id}>{type.name}</div>
      ))}
    </PageShell>
  );
}
