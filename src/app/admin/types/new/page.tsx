import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { NewTypeForm } from "../_components/new-type-form";

export default function NewTypePage() {
  return (
    <PageShell>
      <PageHeader
        title="Stwórz nowy rodzaj zakładu"
        description="Rodzaje zakładów określają, co można obstawić w ramach danego wydarzenia"
      >
        <Link href="/admin/types" className={buttonVariants()}>
          Wróć
        </Link>
      </PageHeader>
      <NewTypeForm />
    </PageShell>
  );
}
