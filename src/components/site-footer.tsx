import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export function SiteFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col gap-4 text-center text-sm leading-loose text-muted-foreground md:flex-row md:text-left">
          <Link
            href="/termsandconditions"
            className="font-medium underline underline-offset-4"
          >
            Regulamin
          </Link>
          <Link
            href="/responsiblegame"
            className="font-medium underline underline-offset-4"
          >
            Odpowiedzialna gra
          </Link>
        </div>
        <ModeToggle />
      </div>
    </footer>
  );
}
