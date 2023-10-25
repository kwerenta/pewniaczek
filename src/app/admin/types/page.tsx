import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function TypesPage() {
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
      Lista
    </PageShell>
  );
}
