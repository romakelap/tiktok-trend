"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Icon } from "@tabler/icons-react";
import { useLanguage, translations } from "@/context/LanguageContext";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  url: string;
  icon: Icon;
};

type NavSecondaryProps = {
  items: NavItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>;

function getTranslationKey(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "_");
}

/**
 * Secondary sidebar group (e.g. Profile/Settings). Same active-state
 * behaviour as NavMain but renders without a label by default.
 */
export function NavSecondary({ items, ...props }: NavSecondaryProps) {
  const pathname = usePathname();
  const { language, t } = useLanguage();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              pathname === item.url ||
              (item.url !== "/" && pathname.startsWith(`${item.url}/`));

            const key = getTranslationKey(item.title);
            const translatedTitle = (translations[language] as any)[key] ? t(key as any) : item.title;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={translatedTitle}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{translatedTitle}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
