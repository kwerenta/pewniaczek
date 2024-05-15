import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BetButton } from "./_components/bet-button";

interface EventPageParams {
  params: { eventId: string };
}

export default async function EventPage({ params }: EventPageParams) {
  const event = await api.events.getEventById({ id: params.eventId });
  if (!event) return notFound();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{event.name}</h1>
        <h3 className="text-lg text-muted-foreground">
          <Link href={`/categories/${event.category.slug}`}>
            {event.category.name}
          </Link>
        </h3>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-medium">Zakłady</h2>
        {event.odds.map((odd) => (
          <Card key={odd.id}>
            <CardHeader>
              <CardTitle>{odd.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              {odd.options.map((option) => (
                <div key={option.id} className="flex flex-col text-center">
                  <p>{option.value}</p>
                  <BetButton
                    eventId={event.id}
                    odds={option.odd}
                    option={option}
                    type={{ id: odd.id, name: odd.name }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
