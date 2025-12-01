"use client";

import React from "react";
import { useLanguage } from "@/components/global/language-provider";
import GuidanceContent from "@/components/dashboard_components/user/guidance/GuidanceContent";

export default function GuidancePage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t("guidance.title")}</h1>
      <GuidanceContent />
    </div>
  );
}
