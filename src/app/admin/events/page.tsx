import { EventStatusBadge } from "@/components/event-status-badge";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/server";
import { LineChart } from "lucide-react";
import Link from "next/link";
import { EventOptionsMenu } from "./_components/event-options-menu";

export default async function EventsPage() {
  const events = await api.events.getAllWithOdds.query();

  return (
    <PageShell>
      <PageHeader
        title="Wydarzenia"
        description="Lista wydarzeń do obstawiania"
      >
        <Link href="/admin/events/new" className={buttonVariants()}>
          Dodaj nowe wydarzenie
        </Link>
      </PageHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nazwa</TableHead>
            <TableHead>Czas wydarzenia</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Kategoria</TableHead>
            <TableHead>Kursy</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.name}</TableCell>
              <TableCell>{event.time.toLocaleString("pl-PL")}</TableCell>
              <TableCell>
                <EventStatusBadge status={event.status} />
              </TableCell>
              <TableCell>{event.category.name}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="outline">
                      <LineChart className="h-3.5 w-3.5" />
                      <span className="sr-only">Kursy</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Kursy</DialogTitle>
                      <DialogDescription>
                        Kursy dla poszczególnych zakładów dla danego wydarzenia
                      </DialogDescription>
                    </DialogHeader>
                    {event.odds.map((odd) => (
                      <span key={odd.type.name + odd.option.value}>
                        {odd.type.name} | {odd.option.value} -{" "}
                        {new Intl.NumberFormat("pl-PL", {
                          minimumFractionDigits: 2,
                        }).format(odd.value / 100)}
                      </span>
                    ))}
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>
                <EventOptionsMenu eventId={event.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PageShell>
  );
}
