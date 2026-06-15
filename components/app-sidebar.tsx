"use client";

import * as React from "react";
import Link from "next/link";
import { IconBrandTiktok } from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ROUTES, SIDEBAR_FOOTER_NAV, SIDEBAR_NAV } from "@/lib/routes";
import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [lastSync, setLastSync] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    apiFetch<any>(API_ENDPOINTS.dashboard.summary)
      .then((res) => {
        if (active && res?.success && res.data?.latestSnapshotAt) {
          const rawDate = res.data.latestSnapshotAt;
          let date: Date;

          if (typeof rawDate === "string") {
            // Treat the ISO date-time string as UTC
            const utcStr = rawDate.endsWith("Z") || rawDate.includes("+") ? rawDate : `${rawDate}Z`;
            date = new Date(utcStr);
          } else if (Array.isArray(rawDate)) {
            // Treat the Jackson array representation [YYYY, MM, DD, HH, mm, ss] as UTC
            const [year, month, day, hour, minute, second] = rawDate;
            date = new Date(Date.UTC(year, month - 1, day, hour, minute, second || 0));
          } else {
            date = new Date(rawDate);
          }

          const formatted = date.toLocaleString("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          setLastSync(formatted);
        }
      })
      .catch((err) => {
        console.error("Failed to load last sync time in sidebar:", err);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={ROUTES.dashboard}>
                <IconBrandTiktok className="!size-5" />
                <span className="text-base font-semibold">TikTrend BI</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {SIDEBAR_NAV.map((group) => (
          <NavMain key={group.label} label={group.label} items={group.items} />
        ))}
        <NavSecondary items={SIDEBAR_FOOTER_NAV} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="gap-3">
        {lastSync && (
          <div className="px-3 py-2 mx-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-0.5">
                Sync Terakhir
              </span>
              <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
                {lastSync}
              </span>
            </div>
          </div>
        )}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
