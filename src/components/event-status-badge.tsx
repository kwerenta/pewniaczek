import { Badge, type BadgeProps } from "@/components/ui/badge";
import { type EventStatus } from "@/server/db/schema";

type StatusBadge = {
  text: string;
  variant: Exclude<BadgeProps["variant"], null | undefined>;
};

const statusBadgeMapping: Record<EventStatus, StatusBadge> = {
  upcoming: { text: "Nadchodzące", variant: "outline" },
  finished: { text: "Zakończone", variant: "secondary" },
  live: { text: "Trwające", variant: "default" },
  cancelled: { text: "Odwołane", variant: "destructive" },
};

interface EventStatusBadgeProps {
  status: EventStatus;
}

export function EventStatusBadge({ status }: EventStatusBadgeProps) {
  const { variant, text } = statusBadgeMapping[status];
  return <Badge variant={variant}>{text}</Badge>;
}
