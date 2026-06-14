"use client";

import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TOKENS } from "@/lib/design-tokens";
import { OnboardingTour } from "@/components/OnboardingTour";

type PageShellProps = {
  children: React.ReactNode;
  /** Override the SiteHeader title; defaults to the route-derived title. */
  title?: string;
};

/**
 * Wrapper that provides the sidebar + site header chrome for protected pages.
 *
 * Usage in a protected page:
 *
 *   export default function FooPage() {
 *     return (
 *       <PageShell>
 *         <YourPageContent />
 *       </PageShell>
 *     );
 *   }
 */
export function PageShell({ children, title }: PageShellProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title={title} />
        <div
          className="relative flex flex-1 flex-col overflow-x-hidden"
          style={{ background: TOKENS.bg }}
        >
          {children}
        </div>
        <OnboardingTour />
      </SidebarInset>
    </SidebarProvider>
  );
}
