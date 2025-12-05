"use client";

import { Coins, TrendingUp, BarChart3, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/global/language-provider";

interface StatItemProps {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
}

function StatItem({
  label,
  value,
  subValue,
  icon,
  trend,
  trendValue,
}: StatItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      <div className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-lg font-bold truncate">{value}</p>
          {subValue && (
            <span className="text-xs text-muted-foreground">{subValue}</span>
          )}
        </div>
      </div>
      {trend && trendValue && (
        <Badge
          variant="outline"
          className={cn(
            "text-xs shrink-0",
            trend === "up"
              ? "text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:bg-emerald-900/30"
              : "text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-900/30"
          )}
        >
          {trend === "up" ? "+" : "-"}
          {trendValue}
        </Badge>
      )}
    </div>
  );
}

interface SectorCredit {
  sector: string;
  credits: number;
  color: string;
  icon: React.ReactNode;
}
interface WalletSummaryProps {
  credits: number;
}

export default function WalletSummary({ credits }: WalletSummaryProps) {
  const { t } = useLanguage();

  // Static sector data
  const sectorCredits: SectorCredit[] = [
    {
      sector: "FARMER",
      credits: 28500,
      color: "emerald",
      icon: <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      sector: "HYBRID CAR OWNER",
      credits: 15300,
      color: "blue",
      icon: <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
    },
    {
      sector: "ECO FRIENDLY STOVES",
      credits: 22100,
      color: "orange",
      icon: <Coins className="w-4 h-4 text-orange-600 dark:text-orange-400" />,
    },
    {
      sector: "COMMERCIAL BUILDING",
      credits: 19250,
      color: "purple",
      icon: (
        <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      ),
    },
  ];

  const totalBalance = sectorCredits.reduce(
    (sum, item) => sum + item.credits,
    0
  );

  return (
    <div className="h-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/50">
              <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{t("credits.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("credits.your_portfolio")}
              </p>
            </div>
          </div>
          <Badge className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-0">
            {t("credits.active")}
          </Badge>
        </div>
      </div>

      {/* Main Balance */}
      <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
        <p className="text-sm text-muted-foreground mb-1">
          {t("credits.total_balance")}
        </p>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold">
            {totalBalance.toLocaleString()}
          </span>
          <span className="text-lg font-medium text-muted-foreground">
            C-Credits
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            {t("credits.this_week")}
          </span>
        </div>
      </div>

      {/* Sector Credits Grid */}
      <div className="p-6 space-y-3">
        {sectorCredits.map((item) => (
          <StatItem
            key={item.sector}
            label={item.sector}
            value={item.credits.toLocaleString()}
            icon={item.icon}
            subValue="Credits"
          />
        ))}
      </div>

      {/* Total Balance Footer */}
      <div className="px-6 pb-6 pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Total Across All Sectors
          </p>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {totalBalance.toLocaleString()} C-Credits
          </p>
        </div>
      </div>
    </div>
  );
}
