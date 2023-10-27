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
import DeleteTypeButton from "./_components/delete-type-button";

export default async function TypesPage() {
  const types = await api.types.getAllWithOptions.query();
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nazwa</TableHead>
            <TableHead>Wartości</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {types.map((type) => (
            <TableRow key={type.id}>
              <TableCell className="w-1/2">{type.name}</TableCell>
              <TableCell className="w-1/2">
                {type.options.map((option) => option.value).join(", ")}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <DeleteTypeButton typeId={type.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PageShell>
  );
}
