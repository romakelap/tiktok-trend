"use client";

import { useLanguage } from "@/context/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "id" ? "en" : "id")}
      className="flex items-center justify-center h-9 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-black/5 dark:border-white/5 bg-white dark:bg-neutral-900 shadow-sm text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer"
      title={language === "id" ? "Switch to English" : "Ubah ke Bahasa Indonesia"}
      aria-label="Switch Language"
    >
      {language.toUpperCase()}
    </button>
  );
}
