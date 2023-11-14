"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { newEventSchema, type NewEventInput } from "@/lib/validators/event";
import { type RouterOutputs } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { addHours, format, setHours, setMinutes, startOfToday } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarIcon, CheckIcon, ChevronsUpDown } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { NewBetForm } from "./new-bet-form";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { TimePicker } from "@/components/ui/time-picker";

interface NewEventFormProps {
  betTypesWithOptions: RouterOutputs["types"]["getAllWithOptions"];
  categories: RouterOutputs["categories"]["getAll"];
}

export function NewEventForm({
  betTypesWithOptions,
  categories,
}: NewEventFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const eventMutation = api.events.create.useMutation({});

  const form = useForm<NewEventInput>({
    resolver: zodResolver(newEventSchema),
    defaultValues: {
      name: "",
      categoryId: 0,
      time: setMinutes(addHours(new Date(), 1), 0),
      bets: [
        {
          typeId: 0,
          options: [],
        },
      ],
    },
  });

  const {
    fields: bets,
    append: appendBet,
    remove: removeBet,
  } = useFieldArray({ control: form.control, name: "bets" });

  const onSubmit = (values: NewEventInput) => {
    eventMutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: "Sukces!",
          description: "Wydarzenie zostało dodane.",
        });
        router.push("/admin/events");
        router.refresh();
      },
      onError: (error) => {
        toast({
          title: "Błąd!",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data i czas</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP HH:mm", { locale: pl })
                      ) : (
                        <span>Wybierz datę i czas</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    locale={pl}
                    selected={field.value}
                    onSelect={(date) =>
                      field.onChange(
                        setMinutes(
                          setHours(date ?? new Date(), field.value.getHours()),
                          field.value.getMinutes(),
                        ),
                      )
                    }
                    disabled={(date) => date < startOfToday()}
                    initialFocus
                  />
                  <div className="border-t border-border p-3">
                    <TimePicker setDate={field.onChange} date={field.value} />
                  </div>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Kategoria</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? categories.find(
                            (category) => category.id === field.value,
                          )?.name
                        : "Wybierz kategorię"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Szukaj kategorii..."
                      className="h-9"
                    />
                    <CommandEmpty>
                      Nie znaleziono takiej kategorii.
                    </CommandEmpty>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          value={category.name}
                          key={category.id}
                          onSelect={() => {
                            field.onChange(category.id);
                          }}
                        >
                          {category.name}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              category.id === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          {bets.map((bet, index) => (
            <NewBetForm
              key={bet.id}
              index={index}
              removeBet={removeBet}
              betTypesWithOptions={betTypesWithOptions}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendBet({ typeId: 0, options: [] })}
          >
            Dodaj zakład
          </Button>
        </div>
        <Button type="submit">Stwórz</Button>
      </form>
    </Form>
  );
}
