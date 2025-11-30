"use client";

import ThemeToggle from "@/components/global/theme-toggle";
import LanguageSwitcher from "@/components/global/language-switcher";
import { useLanguage } from "@/components/global/language-provider";

export default function Navbar() {
  const { t } = useLanguage();

  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <h1 className="font-bold text-lg">{t("navigation.dashboard")}</h1>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </nav>
  );
}
