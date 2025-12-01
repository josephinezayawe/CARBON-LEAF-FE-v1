"use client";

import { useTheme } from "./theme-provider";
import { useLanguage } from "./language-provider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 transition"
    >
      {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
      <span className="text-sm">{theme === "light" ? t("general.light") : t("general.dark")}</span>
    </button>
  );
}
