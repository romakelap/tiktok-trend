"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { IconSun, IconMoon } from "@tabler/icons-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-lg bg-black/5 dark:bg-white/5 animate-pulse" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-black/5 dark:border-white/5 bg-white dark:bg-neutral-900 shadow-sm cursor-pointer"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <IconSun className="w-4 h-4 text-amber-500 transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <IconMoon className="w-4 h-4 text-neutral-700 dark:text-neutral-300 transition-transform duration-300 rotate-0 scale-100" />
      )}
    </button>
  );
}
