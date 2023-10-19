"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Coins } from "lucide-react";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Coins className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">Pewniaczek</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Zakłady
        </Link>
        <Link
          href="/coupons"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname.startsWith("/coupons")
              ? "text-foreground"
              : "text-foreground/60",
          )}
        >
          Kupony
        </Link>
      </nav>
    </div>
  );
}
