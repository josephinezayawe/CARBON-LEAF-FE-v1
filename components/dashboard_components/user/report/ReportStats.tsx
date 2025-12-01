"use client";

import { TrendingUp, TrendingDown, Coins, DollarSign, Upload, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/global/language-provider";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: React.ReactNode;
  gradient: string;
}

function StatCard({ title, value, change, changeType, icon, gradient }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-300 group">
      <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity", gradient)} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-xl", gradient.replace("bg-", "bg-opacity-20 "))}>
            {icon}
          </div>
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
            changeType === "up" 
              ? "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/50" 
              : "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/50"
          )}>
            {changeType === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default function ReportStats() {
  const { t } = useLanguage();
  
  const stats: StatCardProps[] = [
    {
      title: t("reports.total_credits_earned"),
      value: "160",
      change: "+12%",
      changeType: "up",
      icon: <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      gradient: "bg-emerald-500",
    },
    {
      title: t("reports.credits_sold"),
      value: "60",
      change: "+8%",
      changeType: "up",
      icon: <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      gradient: "bg-blue-500",
    },
    {
      title: t("reports.total_earnings"),
      value: "12,600 RWF",
      change: "+15%",
      changeType: "up",
      icon: <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      gradient: "bg-amber-500",
    },
    {
      title: t("reports.photos_uploaded"),
      value: "22",
      change: "-3%",
      changeType: "down",
      icon: <Upload className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      gradient: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
