import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";
import ThemeProvider from "@/components/theme-provides";
import { type Metadata } from "next";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pewniaczek",
  description: "W pełni legalny bukmacher",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <TRPCReactProvider headers={headers()}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
            </div>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
