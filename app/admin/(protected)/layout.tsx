import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Sidebar } from "@/components/admin/sidebar";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defesa em profundidade: além do middleware, garantimos a sessão aqui.
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800">
      <Sidebar />
      <div className="pl-64">
        <main className="mx-auto max-w-6xl p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
