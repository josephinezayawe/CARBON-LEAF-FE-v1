"use client"

import React from "react"
import { useLanguage } from "@/components/global/language-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, Users, TrendingUp, AlertCircle, Leaf, BarChart3 } from "lucide-react"

// Import admin components
import CarbonEmissionStats from "@/components/dashboard_components/admin/CarbonEmissionStats"
import AllUsersOverview from "@/components/dashboard_components/admin/AllUsersOverview"
import CreditsOnSaleWidget from "@/components/dashboard_components/admin/CreditsOnSaleWidget"
import PendingApprovalsWidget from "@/components/dashboard_components/admin/PendingApprovalsWidget"
import CreditMarketStanding from "@/components/dashboard_components/admin/CreditMarketStanding"
import SystemHealthWidget from "@/components/dashboard_components/admin/SystemHealthWidget"
import AdminQuickActions from "@/components/dashboard_components/admin/AdminQuickActions"

export default function AdminDashboard() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6 w-full">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tighter">
          {t("admin.welcome")}
        </h1>
        <p className="text-muted-foreground">
          {t("admin.dashboard_desc")}
        </p>
      </div>

      {/* KPI Stats - Top Row */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.total_users")}</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450</div>
            <p className="text-xs text-muted-foreground">+12% {t("admin.from_last_month")}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.credits_in_system")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5M</div>
            <p className="text-xs text-muted-foreground">+8.2% {t("admin.this_week")}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.pending_verifications")}</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">{t("admin.awaiting_approval")}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.carbon_reduced")}</CardTitle>
            <Leaf className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2K</div>
            <p className="text-xs text-muted-foreground">{t("admin.tons_co2_month")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        {/* Left Column - Charts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Carbon Emission Statistics */}
          <CarbonEmissionStats />

          {/* System Health */}
          <SystemHealthWidget />
        </div>

        {/* Right Column - Widgets */}
        <div className="lg:col-span-3 space-y-6">
          {/* Pending Approvals */}
          <PendingApprovalsWidget />

          {/* Credits On Sale */}
          <CreditsOnSaleWidget />
        </div>
      </div>

      {/* Secondary Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <AllUsersOverview />
        </div>

        <div className="lg:col-span-3">
          <CreditMarketStanding />
        </div>
      </div>

      {/* Quick Actions */}
      <AdminQuickActions />
    </div>
  )
}
