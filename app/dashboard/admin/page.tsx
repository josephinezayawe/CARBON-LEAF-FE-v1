"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/components/global/language-provider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Activity,
  Users,
  TrendingUp,
  AlertCircle,
  Leaf,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { StatCard } from "@/components/dashboard_components/admin/StatCard";

// Import admin components
import CarbonEmissionStats from "@/components/dashboard_components/admin/CarbonEmissionStats";
import AllUsersOverview from "@/components/dashboard_components/admin/AllUsersOverview";
import CreditsOnSaleWidget from "@/components/dashboard_components/admin/CreditsOnSaleWidget";
import PendingApprovalsWidget from "@/components/dashboard_components/admin/PendingApprovalsWidget";
import CreditMarketStanding from "@/components/dashboard_components/admin/CreditMarketStanding";
import SystemHealthWidget from "@/components/dashboard_components/admin/SystemHealthWidget";
import AdminQuickActions from "@/components/dashboard_components/admin/AdminQuickActions";
import SystemFeesWidget from "@/components/dashboard_components/admin/SystemFeesWidget";
import { UsersAPI } from "@/app/api/users";
import { CreditsAPI } from "@/app/api/credits";
import { getAllSubmissions } from "@/app/api/submissionsandReview.api";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [creditsInSystem, setCreditsInSystem] = useState<number>(0);
  const [pendingVerifications, setPendingVerifications] = useState<number>(0);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all users
        const result = await UsersAPI.getAllUsers();
        setUsers(result);

        // Fetch system credits
        const creditsData = await CreditsAPI.getSystemCredits();
        if (creditsData?.totalAvailable !== undefined) {
          setCreditsInSystem(creditsData.totalAvailable);
        }

        // Fetch pending submissions
        const submissionsData = await getAllSubmissions();
        const data = submissionsData.data || submissionsData;
        if (Array.isArray(data)) {
          const pending = data.filter(
            (s: any) => s.status === "PENDING_ANALYSIS",
          ).length;
          setPendingVerifications(pending);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }
    fetchData();
  }, []);
  const stats: Array<{
    icon: LucideIcon;
    label: string;
    value: number;
    change: string;
    period: string;
    color: "blue" | "emerald" | "amber" | "green";
    isLarge?: boolean;
  }> = [
    {
      icon: Users,
      label: t("admin.total_users"),
      value: users.length || 0,
      change: "+12%",
      period: t("admin.from_last_month"),
      color: "blue",
    },
    {
      icon: TrendingUp,
      label: "Available Credits",
      value: creditsInSystem,
      change: "+8.2%",
      period: "Ready for sale",
      color: "emerald",
      isLarge: true,
    },
    {
      icon: AlertCircle,
      label: t("admin.pending_verifications"),
      value: pendingVerifications,
      change: "",
      period: t("admin.awaiting_approval"),
      color: "amber",
    },
    {
      icon: Leaf,
      label: t("admin.carbon_reduced"),
      value: 45200,
      change: "",
      period: t("admin.tons_co2_month"),
      color: "green",
    },
  ];

  return (
    <motion.div
      className="space-y-6 w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div className="space-y-2" variants={headerVariants}>
        <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tighter">
          {t("admin.welcome")}
        </h1>
        <p className="text-muted-foreground">{t("admin.dashboard_desc")}</p>
      </motion.div>

      {/* KPI Stats - Top Row */}
      <motion.div
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <StatCard
              {...(stat as {
                icon: LucideIcon;
                label: string;
                value: number;
                change: string;
                period: string;
                color: "blue" | "emerald" | "amber" | "green";
                isLarge?: boolean;
              })}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        className="grid gap-6 grid-cols-1 lg:grid-cols-7"
        variants={containerVariants}
      >
        {/* Left Column - Charts */}
        <motion.div className="lg:col-span-4 space-y-6" variants={itemVariants}>
          {/* Carbon Emission Statistics */}
          <CarbonEmissionStats />

          {/* System Health */}
          <SystemHealthWidget />
        </motion.div>

        {/* Right Column - Widgets */}
        <motion.div className="lg:col-span-3 space-y-6" variants={itemVariants}>
          {/* Pending Approvals */}
          <PendingApprovalsWidget />

          {/* Credits On Sale */}
          <CreditsOnSaleWidget />

          {/* System Fees */}
          <SystemFeesWidget />
        </motion.div>
      </motion.div>

      {/* Secondary Row */}
      <motion.div
        className="grid gap-6 grid-cols-1 lg:grid-cols-7"
        variants={containerVariants}
      >
        <motion.div className="lg:col-span-4" variants={itemVariants}>
          <AllUsersOverview />
        </motion.div>

        <motion.div className="lg:col-span-3" variants={itemVariants}>
          <CreditMarketStanding />
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <AdminQuickActions />
      </motion.div>
    </motion.div>
  );
}
