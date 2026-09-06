"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, LayoutDashboard, Target, Wallet, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/goals", label: "Goals", icon: Target },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // Don't show sidebar on login/signup pages
  if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="w-64 min-h-screen bg-[#fbfefc] border-r border-[#e3ede7] flex flex-col">
      <Link href="/dashboard" className="flex items-center gap-2 px-6 py-6 border-b border-[#e3ede7]">
        <div className="w-9 h-9 rounded-xl bg-[#16a34a] flex items-center justify-center">
          <Wallet size={18} className="text-white" />
        </div>
        <span className="text-[#1a2e22] font-bold text-lg tracking-tight">FinMate</span>
      </Link>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive ? "bg-[#16a34a] text-white" : "text-[#4d6b5a] hover:bg-[#dcfce7]"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-5 border-t border-[#e3ede7]">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#4d6b5a] hover:bg-[#fee2e2] hover:text-red-600 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </aside>
  );
}