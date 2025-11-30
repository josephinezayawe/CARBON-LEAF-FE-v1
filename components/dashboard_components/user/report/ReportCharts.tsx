"use client";

import { TrendingUp, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/global/language-provider";

export default function ReportCharts() {
  const { t } = useLanguage();
  const monthlyData = [
    { month: "Aug", credits: 20, earnings: 4200 },
    { month: "Sep", credits: 35, earnings: 7350 },
    { month: "Oct", credits: 28, earnings: 5880 },
    { month: "Nov", credits: 42, earnings: 8820 },
    { month: "Dec", credits: 38, earnings: 7980 },
    { month: "Jan", credits: 60, earnings: 12600 },
  ];

  const maxCredits = Math.max(...monthlyData.map(d => d.credits));
  const maxEarnings = Math.max(...monthlyData.map(d => d.earnings));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Credits Chart */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold">{t("reports.credits_generated")}</h3>
              <p className="text-sm text-muted-foreground">{t("reports.last_6_months")}</p>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 h-48">
          {monthlyData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                  {data.credits}
                </span>
                <div 
                  className="w-full max-w-[40px] bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-500 hover:from-emerald-600 hover:to-emerald-500"
                  style={{ height: `${(data.credits / maxCredits) * 140}px` }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-medium">{data.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold">{t("reports.earnings_rwf")}</h3>
              <p className="text-sm text-muted-foreground">{t("reports.last_6_months")}</p>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 h-48">
          {monthlyData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  {(data.earnings / 1000).toFixed(1)}k
                </span>
                <div 
                  className="w-full max-w-[40px] bg-gradient-to-t from-blue-500 to-indigo-400 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-indigo-500"
                  style={{ height: `${(data.earnings / maxEarnings) * 140}px` }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-medium">{data.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
