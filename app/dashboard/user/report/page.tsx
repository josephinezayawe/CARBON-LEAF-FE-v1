import React from "react";
import ReportsOverview from "@/components/dashboard_components/user/report/ReportsOverview";

export default function ReportPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
      <ReportsOverview />
    </div>
  );
}
