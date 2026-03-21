"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/components/global/language-provider";
import CreditStats from "@/components/dashboard_components/user/CreditStats";
import Updates from "@/components/dashboard_components/user/Updates";
import MarketSummary from "@/components/dashboard_components/user/MarketSummary";
import WalletSummary from "@/components/dashboard_components/user/WalletSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { WalletAPI } from "@/app/api/wallet";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/auth";
import { Account } from "@/lib/dataSchemas";

export default function UserDashboardHomePage() {
  const [account, setAccount] = useState<Account>();
  const [credits, setCredits] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = await getCurrentUser();
        if (!user?.id) {
          return toast.error("User Not Found");
        }
        if (user?.role !== "USER") {
          return toast.error("UnAuthenticated User");
        }
        setAccount(user);

        // Fetch wallet data
        const res = await WalletAPI.getWallet();
        if (res.data) {
          setCredits(res.data.totalNetCredits || 0);
          setWalletBalance(res.data.totalNetCredits || 0);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch wallet data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserData();
  }, []);
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
            <div className="text-2xl font-bold">
              {isLoading ? "..." : credits}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.from_last_month")}
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
            <div className="text-2xl font-bold">
              {isLoading ? "..." : walletBalance}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.from_last_month")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.pending_sales")}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.since_last_hour")}
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
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.new_projects")}
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
          <WalletSummary credits={credits} />
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
