"use client";

import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/context/LanguageContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        {children}
        <Toaster richColors position="top-right" />
      </LanguageProvider>
    </ThemeProvider>
  );
}