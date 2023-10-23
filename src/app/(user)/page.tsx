import { getServerAuthSession } from "@/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          pewniaczek
        </h1>
        <h2 className="text-3xl">w pełni legalny bukmacher</h2>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl">
          {session && <span>Zalogowano jako {session.user.name}</span>}
        </p>
      </div>
    </main>
  );
}
