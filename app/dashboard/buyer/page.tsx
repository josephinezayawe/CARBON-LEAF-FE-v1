"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Leaf,
  Recycle,
  DollarSign,
  Package,
  FileCheck,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import {
  getBuyerStats,
  getPortfolio,
  type BuyerStats,
  type PortfolioItem,
} from "@/app/api/buyer.api";
import { toast } from "sonner";
import { useLanguage } from "@/components/global/language-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function BuyerDashboardPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<BuyerStats | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, portfolioData] = await Promise.all([
          getBuyerStats(),
          getPortfolio(),
        ]);
        setStats(statsData);
        setPortfolio(portfolioData);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      titleKey: "buyer.active_credits",
      value: stats?.activeCredits ?? 0,
      icon: Leaf,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      titleKey: "buyer.total_purchased",
      value: stats?.totalCreditsOwned ?? 0,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      titleKey: "buyer.total_retired",
      value: stats?.totalRetired ?? 0,
      icon: Recycle,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      titleKey: "buyer.total_spent",
      value: `${(stats?.totalSpent ?? 0).toLocaleString()} RWF`,
      icon: DollarSign,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      titleKey: "buyer.purchases_count",
      value: stats?.totalPurchases ?? 0,
      icon: Package,
      color: "text-cyan-600",
      bg: "bg-cyan-50 dark:bg-cyan-950/30",
    },
    {
      titleKey: "buyer.retirements_count",
      value: stats?.totalRetirements ?? 0,
      icon: FileCheck,
      color: "text-rose-600",
      bg: "bg-rose-50 dark:bg-rose-950/30",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {t("buyer.dashboard_title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("buyer.dashboard_subtitle")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <Card
            key={card.titleKey}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {t(card.titleKey)}
                  </p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${card.bg}`}>
                  <card.icon className={`size-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingCart className="size-5 text-emerald-600" />
              {t("buyer.browse_marketplace")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t("buyer.marketplace_desc")}
            </p>
            <Link href="/dashboard/buyer/marketplace">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                {t("buyer.go_to_marketplace")}
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="size-5 text-teal-600" />
              {t("buyer.view_portfolio")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t("buyer.portfolio_desc")}
            </p>
            <Link href="/dashboard/buyer/portfolio">
              <Button
                variant="outline"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                {t("buyer.go_to_portfolio")}
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Portfolio */}
      {portfolio.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("buyer.recent_holdings")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {portfolio.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {item.saleNumber}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.description || item.sectors.join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {item.remainingCredits}{" "}
                        <span className="text-muted-foreground font-normal">
                          {t("buyer.credits")}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(item.purchasedAt), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Badge
                      variant={
                        item.remainingCredits > 0 ? "default" : "secondary"
                      }
                      className={
                        item.remainingCredits > 0
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                          : ""
                      }
                    >
                      {item.remainingCredits > 0
                        ? t("buyer.active")
                        : t("buyer.fully_retired")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
