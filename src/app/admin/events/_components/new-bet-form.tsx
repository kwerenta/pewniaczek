import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
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
import { type NewEventInput } from "@/lib/validators/event";
import { type RouterOutputs } from "@/trpc/shared";
import { CheckIcon, ChevronsUpDown, Trash2 } from "lucide-react";
import {
  useFieldArray,
  useFormContext,
  type UseFieldArrayRemove,
} from "react-hook-form";

interface NewBetFormProps {
  index: number;
  betTypesWithOptions: RouterOutputs["types"]["getAllWithOptions"];
  removeBet: UseFieldArrayRemove;
}

export function NewBetForm({
  index,
  betTypesWithOptions,
  removeBet,
}: NewBetFormProps) {
  const form = useFormContext<NewEventInput>();
  const { fields: options, replace: replaceOptions } = useFieldArray({
    control: form.control,
    name: `bets.${index}.options`,
  });

  const optionNames = betTypesWithOptions.flatMap((betType) =>
    betType.options.map((option) => ({ name: option.value, id: option.id })),
  );

  return (
    <>
      <FormField
        control={form.control}
        name={`bets.${index}.typeId`}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Rodzaj zakładu</FormLabel>
            <Popover>
              <div className="flex gap-4">
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
                        ? betTypesWithOptions.find(
                            (betType) => betType.id === field.value,
                          )?.name
                        : "Wybierz rodzaj zakładu"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeBet(index)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Usuń rodzaj zakładu</span>
                </Button>
              </div>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Szukaj rodzaju zakładu..."
                    className="h-9"
                  />
                  <CommandEmpty>Nie znaleziono takiego rodzaju.</CommandEmpty>
                  <CommandGroup>
                    {betTypesWithOptions.map((betType) => (
                      <CommandItem
                        value={betType.name}
                        key={betType.id}
                        onSelect={() => {
                          field.onChange(betType.id);
                          replaceOptions(
                            betType.options.map((option) => ({
                              optionId: option.id,
                              odds: 100,
                            })),
                          );
                        }}
                      >
                        {betType.name}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            betType.id === field.value
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
      <p
        className={cn(
          "py-2 text-sm font-medium leading-none",
          options.length === 0 && "hidden",
        )}
      >
        Kursy
      </p>
      <div>
        {options.map((option, optionIndex) => (
          <React.Fragment key={option.id}>
            <FormField
              control={form.control}
              name={`bets.${index}.options.${optionIndex}.optionId`}
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name={`bets.${index}.options.${optionIndex}.odds`}
              render={({ field }) => (
                <FormItem className="ml-8">
                  <FormLabel>
                    {
                      optionNames.find(
                        (optionName) => optionName.id === option.optionId,
                      )?.name
                    }
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step={0.01}
                      {...field}
                      value={(field.value / 100).toFixed(2)}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) * 100)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
