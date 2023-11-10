import { CategoriesSidebar } from "@/components/categories-sidebar";
import { CouponSidebar } from "@/components/coupon-sidebar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session?.user) return redirect("/login");

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 gap-4 p-4">
        <CategoriesSidebar />
        <main className="flex-1">{children}</main>
        <CouponSidebar />
      </div>
      <SiteFooter />
    </>
  );
}
