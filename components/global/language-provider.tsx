"use client";

import { createContext, useContext, useEffect, useState } from "react";
import en from "../../locales/en.json";
import fr from "../../locales/fr.json";
import rw from "../../locales/rw.json";

type Lang = "en" | "fr" | "rw";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const translations: Record<Lang, any> = { en, fr, rw };

interface LanguageContextProps {
  lang: Lang;
  t: (key: string) => string;
  setLanguage: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageContextProps | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved && translations[saved]) {
      setLang(saved);
    }
    setMounted(true);
  }, []);

  const setLanguage = (l: Lang) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  const t = (key: string) => {
    // Return key if not mounted to avoid hydration mismatch on first render
    // or handle it by just returning default language content.
    // For simple consistency we use current state.
    const parts = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = translations[lang];

    for (const p of parts) {
      current = current?.[p];
      if (current === undefined) return key; // fallback
    }
    return String(current);
  };

  if (!mounted) {
    // Optional: Return null or a loader if you want to strictly block 
    // untranslated content, but usually rendering default (en) is better 
    // for SEO/Performance, effectively "hydrating" the language.
    // However, if we change language in useEffect, we might get text content mismatch.
    // A common pattern is to render children but we accept the flicker or use a different strategy.
    // For now, we just render children with default "en".
  }

  return (
    <LanguageContext.Provider value={{ lang, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
