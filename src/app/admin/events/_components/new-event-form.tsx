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
        router.refresh();
        router.push("/admin/events");
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
              <FormLabel>Data</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPPP", { locale: pl })
                      ) : (
                        <span>Wybierz datę</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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
                </PopoverContent>
              </Popover>
              <FormItem>
                <FormLabel>Czas</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    value={field.value.toTimeString().slice(0, 5)}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(":");
                      field.onChange(
                        setMinutes(
                          setHours(field.value, Number(hours)),
                          Number(minutes),
                        ),
                      );
                    }}
                  />
                </FormControl>
              </FormItem>
              <FormMessage />
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
