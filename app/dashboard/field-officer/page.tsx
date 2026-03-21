"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Eye,
  type LucideIcon,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import {
  getFieldDataStats,
  getOwnFieldData,
  type FieldDataStats,
  type FieldDataEntry,
} from "@/app/api/fieldData.api";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { useLanguage } from "@/components/global/language-provider";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

function StatCard({ title, value, icon: Icon, color, bgColor }: StatCardProps) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl md:text-3xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-2 md:p-3 rounded-xl ${bgColor}`}>
            <Icon className={`h-5 w-5 md:h-6 md:w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const STATUS_BADGE: Record<string, { label: string; variant: string }> = {
  PENDING: {
    label: "Pending",
    variant:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
  REVIEWED: {
    label: "Reviewed",
    variant: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  APPROVED: {
    label: "Approved",
    variant:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  },
  REJECTED: {
    label: "Rejected",
    variant: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  },
};

export default function FieldOfficerDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<FieldDataStats | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<FieldDataEntry[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, submissions] = await Promise.all([
          getFieldDataStats(),
          getOwnFieldData(),
        ]);
        setStats(statsData);
        setRecentSubmissions(submissions.slice(0, 5));
      } catch (error) {
        toast.error("Failed to load dashboard data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl md:text-3xl font-bold">
          {t("field_officer.dashboard_title")}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base mt-1">
          {t("field_officer.dashboard_subtitle")}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
      >
        <StatCard
          title={t("field_officer.total_submissions")}
          value={stats?.total ?? 0}
          icon={ClipboardList}
          color="text-green-600"
          bgColor="bg-green-100 dark:bg-green-900/40"
        />
        <StatCard
          title={t("field_officer.pending")}
          value={stats?.pending ?? 0}
          icon={Clock}
          color="text-yellow-600"
          bgColor="bg-yellow-100 dark:bg-yellow-900/40"
        />
        <StatCard
          title={t("field_officer.approved")}
          value={stats?.approved ?? 0}
          icon={CheckCircle2}
          color="text-emerald-600"
          bgColor="bg-emerald-100 dark:bg-emerald-900/40"
        />
        <StatCard
          title={t("field_officer.workspaces")}
          value={stats?.assignedWorkspaces ?? 0}
          icon={MapPin}
          color="text-blue-600"
          bgColor="bg-blue-100 dark:bg-blue-900/40"
        />
      </motion.div>

      {/* Recent Submissions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("field_officer.recent_submissions")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSubmissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>{t("field_officer.no_submissions_yet")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSubmissions.map((submission) => {
                  const statusInfo =
                    STATUS_BADGE[submission.status] ?? STATUS_BADGE.PENDING;
                  return (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/40 shrink-0">
                          <MapPin className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {submission.workspace.sector.replace(/_/g, " ")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(
                              new Date(submission.createdAt),
                              "MMM dd, yyyy · HH:mm",
                            )}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`text-xs shrink-0 ${statusInfo.variant}`}
                      >
                        {statusInfo.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
