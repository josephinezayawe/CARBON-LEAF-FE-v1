"use client";

import { ScrollText, ShieldCheck, ArrowLeft, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/global/theme-provider";
import { useLanguage } from "@/components/global/language-provider";
import { PREAMBLE, SECTIONS, type TermsBlock } from "./termsContent";

function TermsBlockRenderer({ block }: { block: TermsBlock }) {
  switch (block.type) {
    case "text":
      return (
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {block.text}
        </p>
      );

    case "heading":
      return (
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-l-4 border-emerald-500 pl-3">
          {block.text}
        </h3>
      );

    case "list":
      if (block.ordered) {
        return (
          <ol className="space-y-2.5">
            {block.items.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item}
                </span>
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="space-y-2.5">
          {block.items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
              <span className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {item}
              </span>
            </li>
          ))}
        </ul>
      );

    case "definitions":
      return (
        <dl className="space-y-4">
          {block.items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3"
            >
              <dt className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 sm:flex-shrink-0">
                {item.term}
              </dt>
              <dd className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {item.definition}
              </dd>
            </div>
          ))}
        </dl>
      );

    default:
      return null;
  }
}

export default function TermsPage() {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-green-100/20 dark:from-slate-950 dark:via-emerald-950/20 dark:to-green-950/10 px-4 py-8">
      {/* Theme and Language Switchers */}
      <div className="absolute top-6 right-6 flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="px-3 py-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-white dark:hover:bg-slate-700 transition-colors flex items-center gap-2 shadow-sm"
          title={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </button>

        <div className="relative group">
          <button className="px-3 py-1.5 rounded-lg bg-white/80 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-white transition-colors flex items-center gap-2 shadow-sm">
            {lang.toUpperCase()}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
          <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            {(["en", "fr", "rw"] as const).map((language) => (
              <button
                key={language}
                onClick={() => setLanguage(language)}
                className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  lang === language
                    ? "bg-emerald-600 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {language === "en" && "English"}
                {language === "fr" && "Français"}
                {language === "rw" && "Kinyarwanda"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto pt-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
            <ScrollText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent drop-shadow-sm">
            {t("terms.title")}
          </h1>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t("terms.badge")}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
            {t("terms.subtitle")}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-500">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
              {t("terms.effective_date")}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
              {t("terms.last_updated")}
            </span>
          </div>
        </div>

        {/* Terms Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20">
          <div className="p-8">
            {/* Preamble */}
            <div className="space-y-4">
              {PREAMBLE.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Table of Contents */}
            <div className="mt-8 p-5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-4">
                Contents
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                {SECTIONS.map((section) => (
                  <a
                    key={section.number}
                    href={`#section-${section.number}`}
                    className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {section.number}.
                    </span>
                    {section.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="mt-8 space-y-10">
              {SECTIONS.map((section) => (
                <section
                  key={section.number}
                  id={`section-${section.number}`}
                  className="scroll-mt-24"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-green-600 text-white text-sm font-bold flex-shrink-0 shadow-md shadow-emerald-500/25">
                      {section.number}
                    </span>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                      {section.title}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {section.blocks.map((block, index) => (
                      <TermsBlockRenderer key={index} block={block} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Copyright */}
            <div className="mt-10 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 text-center">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-500">
                {t("terms.copyright").replace(
                  "{year}",
                  new Date().getFullYear().toString(),
                )}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                variant="outline"
                className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <a href="/signin" className="flex items-center gap-2">
                  {t("terms.back_to_signin")}
                </a>
              </Button>
              <Button
                asChild
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-600/25"
              >
                <a href="/signup">
                  <ArrowLeft className="w-4 h-4" />
                  {t("terms.back_to_signup")}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
