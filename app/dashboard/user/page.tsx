"use client";

import React from "react";
import { useLanguage } from "@/components/global/language-provider";
import CreditStats from "@/components/dashboard_components/user/CreditStats";
import Updates from "@/components/dashboard_components/user/Updates";
import MarketSummary from "@/components/dashboard_components/user/MarketSummary";
import WalletSummary from "@/components/dashboard_components/user/WalletSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";

export default function UserDashboardHomePage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Stats Cards - Responsive grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.total_credits")}
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">300</div>
            <p className="text-xs text-muted-foreground">
              +20.1% {t("dashboard.from_last_month")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.wallet_balance")}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,234</div>
            <p className="text-xs text-muted-foreground">
              +4% {t("dashboard.from_last_month")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.pending_sales")}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 {t("dashboard.since_last_hour")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.active_projects")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">
              +2 {t("dashboard.new_projects")}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Row - Stack on mobile, side by side on larger screens */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <CreditStats />
        </div>
        <div className="lg:col-span-3">
          <WalletSummary />
        </div>
      </div>
      
      {/* Updates & Market - Stack on mobile, side by side on larger screens */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <div className="lg:col-span-3">
          <Updates />
        </div>
        <div className="lg:col-span-4">
          <MarketSummary />
        </div>
      </div>
    </div>
  );
}