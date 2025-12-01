"use client";

import { Coins, Send, TrendingUp, Clock, DollarSign, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

function StatItem({ label, value, subValue, icon, trend, trendValue }: StatItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      <div className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-lg font-bold truncate">{value}</p>
          {subValue && <span className="text-xs text-muted-foreground">{subValue}</span>}
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
          {trend === "up" ? "+" : "-"}{trendValue}
        </Badge>
      )}
    </div>
  );
}

export default function WalletSummary() {
  const { t } = useLanguage();
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
              <p className="text-sm text-muted-foreground">{t("credits.your_portfolio")}</p>
            </div>
          </div>
          <Badge className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-0">
            {t("credits.active")}
          </Badge>
        </div>
      </div>

      {/* Main Balance */}
      <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
        <p className="text-sm text-muted-foreground mb-1">{t("credits.total_balance")}</p>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold">120,450</span>
          <span className="text-lg font-medium text-muted-foreground">C-Credits</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{t("credits.this_week")}</span>
        </div>
      </div>

      

      {/* Stats Grid */}
      <div className="p-6 space-y-3">
        <StatItem 
          label={t("credits.available")}
          value="85,250"
          icon={<Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          trend="up"
          trendValue="12%"
        />
        <StatItem 
          label={t("wallet.pending_verification")}
          value="4,300"
          icon={<Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
        />
        <StatItem 
          label={t("wallet.estimated_value")}
          value="$12,842"
          subValue="USD"
          icon={<DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
          trend="up"
          trendValue="8.5%"
        />
        <StatItem 
          label={t("wallet.total_sold")}
          value="35,200"
          icon={<BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
        />
      </div>
    </div>
  );
}
