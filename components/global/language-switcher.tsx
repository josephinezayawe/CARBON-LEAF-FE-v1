"use client";

import { useLanguage } from "./language-provider";

export default function LanguageSwitcher() {
  const { lang, setLanguage } = useLanguage();

  return (
    <select
      value={lang}
      onChange={(e) => setLanguage(e.target.value as any)}
      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm"
    >
      <option value="en">English</option>
      <option value="fr">Français</option>
      <option value="rw">Kinyarwanda</option>
    </select>
  );
}
