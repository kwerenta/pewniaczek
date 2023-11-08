import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (session?.user) redirect("/");

  return (
    <main className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary sm:text-[5rem]">
          pewniaczek
        </h1>
        <h2 className="text-3xl">w pełni legalny bukmacher</h2>
      </div>
      {children}
    </main>
  );
}
