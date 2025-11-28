import React from "react";
import GuidanceContent from "@/components/dashboard_components/user/guidance/GuidanceContent";

export default function GuidancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Guidance</h1>
      <GuidanceContent />
    </div>
  );
}
