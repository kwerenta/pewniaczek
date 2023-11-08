import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function WhitelistPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-destructive">Brak dostępu!</h1>
      <p>
        Aktualnie nie znajdujesz się na liście dostępu do{" "}
        <span className="font-medium underline underline-offset-2">
          pewniaczka
        </span>
      </p>
      <Link className={buttonVariants({ variant: "outline" })} href="/login">
        Wróć do ekranu logowania
      </Link>
    </>
  );
}
