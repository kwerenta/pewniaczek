import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { MainNav } from "./main-nav";
import { LogOut } from "lucide-react";
import { getServerAuthSession } from "@/server/auth";
import { AdminNav } from "./admin-nav";

interface SiteHeaderProps {
  isAdminPage?: boolean;
}

export async function SiteHeader({ isAdminPage }: SiteHeaderProps) {
  const session = await getServerAuthSession();

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        {isAdminPage ? <AdminNav /> : <MainNav />}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            {session ? (
              <Link href="/api/auth/signout">
                <div
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                    }),
                    "w-9 px-0",
                  )}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Wyloguj się</span>
                </div>
              </Link>
            ) : (
              <Link
                className={buttonVariants({ variant: "secondary" })}
                href="/api/auth/signin"
              >
                Zaloguj się
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
