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

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
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
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
