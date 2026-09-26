"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IconBrandTiktok,
  IconDashboard,
  IconTimeline,
  IconUsers,
  IconArrowLeft,
  IconShieldLock,
  IconLogout,
} from "@tabler/icons-react";
import AdminGuard from "@/components/auth/AdminGuard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { clearAuthTokens, getStoredUser } from "@/lib/auth";
import { logoutUser } from "@/lib/auth-api";
import { toast } from "sonner";
import { ROUTES } from "@/lib/routes";

const ADMIN_NAV_LINKS = [
  {
    name: "Dashboard Overview",
    href: "/admin/dashboard",
    icon: IconDashboard,
  },
  {
    name: "Pipeline & DAGs",
    href: "/admin/pipeline",
    icon: IconTimeline,
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: IconUsers,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = getStoredUser();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {}
    clearAuthTokens();
    toast.success("Signed out");
    router.replace(ROUTES.login);
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 flex flex-col font-sans">
        {/* Admin Header */}
        <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2.5 font-bold text-neutral-900 dark:text-neutral-100 hover:opacity-90 transition-opacity"
              >
                <div className="size-9 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-sm">
                  <IconBrandTiktok className="size-5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold tracking-tight">TikTrend BI</span>
                    <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <IconShieldLock className="size-3 inline" /> Admin
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-normal">System & Pipeline Console</span>
                </div>
              </Link>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-neutral-100/80 dark:bg-neutral-800/80 p-1 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50">
              {ADMIN_NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                    }`}
                  >
                    <Icon className="size-4" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Tools */}
            <div className="flex items-center gap-2">
              <Link
                href={ROUTES.dashboard}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-neutral-200/60 dark:border-neutral-800"
              >
                <IconArrowLeft className="size-3.5" />
                <span>App Dashboard</span>
              </Link>

              <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1 hidden sm:block" />

              <ThemeToggle />
              <LanguageSwitcher />

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-neutral-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <IconLogout className="size-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Admin Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
