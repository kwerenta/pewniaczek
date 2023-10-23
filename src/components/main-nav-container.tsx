import { Coins } from "lucide-react";
import Link from "next/link";

interface MainNavContainerProps {
  children: React.ReactNode;
  isAdminPage?: boolean;
}

export function MainNavContainer({
  children,
  isAdminPage,
}: MainNavContainerProps) {
  return (
    <div className="mr-4 hidden md:flex">
      <Link
        href={isAdminPage ? "/admin" : "/"}
        className="mr-6 flex items-center space-x-2"
      >
        <Coins className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">Pewniaczek</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {children}
      </nav>
    </div>
  );
}
