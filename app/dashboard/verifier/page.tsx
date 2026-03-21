"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Hash,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import {
  getVerifierStats,
  getVerifierWorkspaces,
  type VerifierStats,
  type VerifierWorkspace,
} from "@/app/api/verifier.api";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { useLanguage } from "@/components/global/language-provider";
import VerifierCreditIssuancesTab from "@/components/dashboard_components/verifier/VerifierCreditIssuancesTab";
import VerifierRetirementsTab from "@/components/dashboard_components/verifier/VerifierRetirementsTab";

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

const VERIFICATION_BADGE: Record<string, { label: string; variant: string }> = {
  PENDING: {
    label: "Pending",
    variant:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
  VERIFIED: {
    label: "Verified",
    variant:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  },
  REJECTED: {
    label: "Rejected",
    variant: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  },
  REVISION_REQUIRED: {
    label: "Revision",
    variant:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  },
};

const WORKSPACE_STATUS_BADGE: Record<
  string,
  { label: string; variant: string }
> = {
  UNDER_REVIEW: {
    label: "Under Review",
    variant:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
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
  PENDING_ANALYSIS: {
    label: "Pending Analysis",
    variant: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
};

export default function VerifierDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<VerifierStats | null>(null);
  const [recentWorkspaces, setRecentWorkspaces] = useState<VerifierWorkspace[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, workspaces] = await Promise.all([
          getVerifierStats(),
          getVerifierWorkspaces(),
        ]);
        setStats(statsData);
        setRecentWorkspaces(workspaces.slice(0, 5));
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
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
          {t("verifier.dashboard_title")}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base mt-1">
          {t("verifier.dashboard_subtitle")}
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <ClipboardList className="w-4 h-4" />
              {t("verifier.overview_tab")}
            </TabsTrigger>
            <TabsTrigger value="credit-issuances" className="gap-2">
              <Hash className="w-4 h-4" />
              {t("verifier_issuances.tab_title")}
            </TabsTrigger>
            <TabsTrigger value="retirements" className="gap-2">
              <FileText className="w-4 h-4" />
              {t("verifier_retirements.tab_title")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              <StatCard
                title={t("verifier.pending_workspaces")}
                value={stats?.pendingWorkspaces ?? 0}
                icon={Clock}
                color="text-yellow-600"
                bgColor="bg-yellow-100 dark:bg-yellow-900/40"
              />
              <StatCard
                title={t("verifier.verified")}
                value={stats?.verified ?? 0}
                icon={CheckCircle2}
                color="text-green-600"
                bgColor="bg-green-100 dark:bg-green-900/40"
              />
              <StatCard
                title={t("verifier.rejected")}
                value={stats?.rejected ?? 0}
                icon={XCircle}
                color="text-red-600"
                bgColor="bg-red-100 dark:bg-red-900/40"
              />
              <StatCard
                title={t("verifier.revision_required")}
                value={stats?.revisionRequired ?? 0}
                icon={AlertTriangle}
                color="text-orange-600"
                bgColor="bg-orange-100 dark:bg-orange-900/40"
              />
              <StatCard
                title={t("verifier.total_verifications")}
                value={stats?.totalVerifications ?? 0}
                icon={ClipboardList}
                color="text-indigo-600"
                bgColor="bg-indigo-100 dark:bg-indigo-900/40"
              />
              <StatCard
                title={t("verifier.open_clarifications")}
                value={stats?.openClarifications ?? 0}
                icon={MessageSquare}
                color="text-blue-600"
                bgColor="bg-blue-100 dark:bg-blue-900/40"
              />
            </div>

            {/* Recent Workspaces */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t("verifier.recent_workspaces")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentWorkspaces.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p>{t("verifier.no_workspaces")}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentWorkspaces.map((ws) => {
                      const latestVer = ws.verificationRecords?.[0];
                      const verStatus = latestVer
                        ? VERIFICATION_BADGE[latestVer.status]
                        : null;
                      const wsStatus =
                        WORKSPACE_STATUS_BADGE[ws.status] ??
                        WORKSPACE_STATUS_BADGE.PENDING_ANALYSIS;
                      return (
                        <a
                          key={ws.id}
                          href={`/dashboard/verifier/workspace/${ws.id}`}
                          className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 shrink-0">
                              <ClipboardList className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                {ws.user.firstName} {ws.user.lastName} —{" "}
                                {ws.sector.replace(/_/g, " ")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(
                                  new Date(ws.uploadDate),
                                  "MMM dd, yyyy · HH:mm",
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {verStatus && (
                              <Badge className={`text-xs ${verStatus.variant}`}>
                                {verStatus.label}
                              </Badge>
                            )}
                            <Badge className={`text-xs ${wsStatus.variant}`}>
                              {wsStatus.label}
                            </Badge>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credit-issuances">
            <VerifierCreditIssuancesTab />
          </TabsContent>

          <TabsContent value="retirements">
            <VerifierRetirementsTab />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
