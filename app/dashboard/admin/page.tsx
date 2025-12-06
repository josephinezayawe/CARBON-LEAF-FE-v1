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
        <h1 className="text-3xl font-bold tracking-tight">
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
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits in System</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5M</div>
            <p className="text-xs text-muted-foreground">+8.2% this week</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Reduced</CardTitle>
            <Leaf className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2K</div>
            <p className="text-xs text-muted-foreground">Tons CO₂ this month</p>
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
