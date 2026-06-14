"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Icon } from "@tabler/icons-react";
import { useLanguage, translations } from "@/context/LanguageContext";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  url: string;
  icon: Icon;
};

type NavMainProps = {
  /** Optional section label rendered above the items. */
  label?: string;
  items: NavItem[];
};

function getTranslationKey(title: string): string {
  const norm = title.toLowerCase().replace(/\s+/g, "_");
  if (norm === "time_posting") return "timeposting";
  if (norm === "ml_predictions") return "ml_predict";
  if (norm === "nlp_insights") return "nlp_insight";
  if (norm === "account_mgmt") return "profile";
  if (norm === "account_&_competitor_analysis") return "account_competitor_analysis";
  return norm;
}

/**
 * Primary sidebar nav group. Items are real Next.js `Link` components and
 * pick up the `isActive` state from the current pathname.
 */
export function NavMain({ label, items }: NavMainProps) {
  const pathname = usePathname();
  const { language, t } = useLanguage();

  const groupLabels: Record<string, string> = {
    "Overview": language === "id" ? "Ikhtisar" : "Overview",
    "Intelligence": language === "id" ? "Kecerdasan Buatan" : "Intelligence",
    "Content Discovery": language === "id" ? "Eksplorasi Konten" : "Content Discovery",
    "Accounts & Library": language === "id" ? "Akun & Galeri" : "Accounts & Library",
    "Workspace": language === "id" ? "Ruang Kerja" : "Workspace"
  };

  const translatedLabel = label ? (groupLabels[label] || label) : undefined;

  return (
    <SidebarGroup>
      {translatedLabel ? <SidebarGroupLabel>{translatedLabel}</SidebarGroupLabel> : null}
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
                <SidebarMenuButton
                  asChild
                  tooltip={translatedTitle}
                  isActive={isActive}
                >
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
