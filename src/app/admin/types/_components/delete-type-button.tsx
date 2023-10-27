"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteTypeButtonProps {
  typeId: number;
}

export default function DeleteTypeButton({ typeId }: DeleteTypeButtonProps) {
  const router = useRouter();
  const { toast } = useToast();

  const { mutate, isLoading } = api.types.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Sukces",
        description: "Pomyślnie usunięto kategorię",
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
    <Button
      disabled={isLoading}
      variant="outline"
      size="icon"
      onClick={() => mutate({ id: typeId })}
    >
      <Trash className="h-4 w-4" />
      <span className="sr-only">Usuń rodzaj zakładu</span>
    </Button>
  );
}
