import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/auth";
import { logout } from "@/app/admin/actions";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Belt-and-braces: proxy.ts already redirects unauthenticated visitors,
  // but layouts don't re-run on every client-side navigation (see the
  // Next.js auth guide's note on layouts + auth checks), so this also
  // checks directly.
  const user = await getAdminUser();
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="flex flex-wrap items-center justify-between gap-3 bg-charcoal px-5 py-4 sm:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="font-tag text-sm font-bold uppercase tracking-[0.15em] text-orange-light"
          >
            Thrift Hub Admin
          </Link>
          <Link
            href="/admin/products/new"
            className="text-sm font-medium text-cloud/80 hover:text-cloud"
          >
            Add product
          </Link>
          <Link
            href="/admin/messages"
            className="text-sm font-medium text-cloud/80 hover:text-cloud"
          >
            Messages
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-cloud/60">{user.email}</span>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-md border border-cloud/30 px-3 py-1.5 text-sm text-cloud hover:bg-cloud/10"
            >
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-[1800px] px-5 py-8 sm:px-8">{children}</main>
    </div>
  );
}
