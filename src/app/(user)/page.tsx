import { EventStatusBadge } from "@/components/event-status-badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/server";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import Link from "next/link";

export default async function Home() {
  const events = await api.events.getAllWithCategory.query();
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="flex items-center justify-between">
          <CardHeader>
            <CardTitle>
              <Link href={`/events/${event.id}`}>{event.name}</Link>
            </CardTitle>
            <CardDescription>
              <Link href={`/categories/${event.category.slug}`}>
                {event.category.name}
              </Link>
            </CardDescription>
          </CardHeader>
          <CardHeader className="items-end">
            <p className="text-sm text-muted-foreground">
              {format(event.time, "PPPPp", { locale: pl })}
            </p>
            <EventStatusBadge status={event.status} />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
