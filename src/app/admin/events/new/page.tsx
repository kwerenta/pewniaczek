import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { NewEventForm } from "../_components/new-event-form";
import { api } from "@/trpc/server";

export default async function NewEventPage() {
  const betTypesWithOptions = await api.types.getAllWithOptions();
  const categories = await api.categories.getAll();

  return (
    <PageShell>
      <PageHeader
        title="Stwórz nowe wydarzenie"
        description="Wydarzenia są grupowane w kategorie, a każde wydarzenie posiada zakłady."
      >
        <Link href="/admin/events" className={buttonVariants()}>
          Wróć
        </Link>
      </PageHeader>
      <NewEventForm
        categories={categories}
        betTypesWithOptions={betTypesWithOptions}
      />
    </PageShell>
  );
}
