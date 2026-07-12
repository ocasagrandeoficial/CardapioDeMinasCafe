"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-stone-300 transition-colors hover:bg-stone-800 hover:text-white"
    >
      <LogOut className="h-5 w-5" />
      Sair
    </button>
  );
}
