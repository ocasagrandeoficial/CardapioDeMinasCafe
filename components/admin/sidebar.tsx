"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, LayoutDashboard, Tags, UtensilsCrossed } from "lucide-react";

import { cn } from "@/lib/utils";
import { LogoutButton } from "./logout-button";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/produtos", label: "Produtos", icon: UtensilsCrossed },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-stone-900 text-stone-100">
      <div className="flex items-center gap-2 border-b border-stone-800 px-6 py-5">
        <Coffee className="h-6 w-6 text-coffee-300" />
        <div className="flex flex-col leading-tight">
          <span className="font-serif text-lg font-semibold">Dê Minas</span>
          <span className="text-xs text-stone-400">Painel Admin</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-coffee-600 text-white"
                  : "text-stone-300 hover:bg-stone-800 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-stone-800 p-3">
        <LogoutButton />
      </div>
    </aside>
  );
}
