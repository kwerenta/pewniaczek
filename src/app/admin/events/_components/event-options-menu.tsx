"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { CalendarX2Icon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface EventOptionsMenuProps {
  eventId: string;
}

export function EventOptionsMenu({ eventId }: EventOptionsMenuProps) {
  const router = useRouter();
  const { toast } = useToast();

  const { mutate: deleteEvent } = api.events.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Sukces",
        description: "Pomyślnie usunięto wydarzenie",
      });
    },
    onError: (error) => {
      toast({
        title: "Błąd",
        description: error.message,
      });
    },
  });

  const { mutate: finishEvent } = api.events.finish.useMutation({
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Sukces",
        description: "Pomyślnie zakończono wydarzenie",
      });
    },
    onError: (error) => {
      toast({
        title: "Błąd",
        description: error.message,
      });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <MoreVerticalIcon className="h-3.5 w-3.5" />
          <span className="sr-only">Opcje wydarzenia</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => finishEvent({ id: eventId })}>
          <CalendarX2Icon className="mr-2 h-3.5 w-3.5" />
          Zakończ
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => deleteEvent({ id: eventId })}
        >
          <TrashIcon className="mr-2 h-3.5 w-3.5" />
          Usuń
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
