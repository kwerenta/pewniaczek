import { getServerAuthSession } from "@/server/auth";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { notFound } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session?.user.isAdmin) notFound();

  return (
    <>
      <SiteHeader isAdminPage />
      <div className="flex-1">{children}</div>
      <SiteFooter isAdminPage />
    </>
  );
}
