"use client";

import { usePathname } from "next/navigation";
import { IconHelpCircle } from "@tabler/icons-react";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getPageTitle } from "@/lib/routes";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

type SiteHeaderProps = {
  /** Optional title override; falls back to a title derived from the route. */
  title?: string;
};

/**
 * Site header rendered above each protected page. Resolves its title from
 * the current pathname via the route map, so pages don't need to pass it
 * unless they want a custom one.
 */
export function SiteHeader({ title }: SiteHeaderProps) {
  const pathname = usePathname();
  const resolvedTitle = title ?? getPageTitle(pathname);

  const handleStartTour = () => {
    window.dispatchEvent(new Event("start-onboarding-tour"));
  };

  return (
    <header className="bg-background flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-1">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-semibold">{resolvedTitle}</h1>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleStartTour}
            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-black/5 dark:border-white/5 bg-white dark:bg-neutral-900 shadow-sm text-neutral-700 dark:text-neutral-300 cursor-pointer"
            title="Start Onboarding Tour"
            aria-label="Start Tour"
          >
            <IconHelpCircle className="w-4 h-4" />
          </button>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
