"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderSearch, Eye, Loader2, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  getVerifierWorkspaces,
  type VerifierWorkspace,
} from "@/app/api/verifier.api";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/global/language-provider";

const STATUS_TABS = [
  { key: "ALL", labelKey: "verifier.tab_all" },
  { key: "PENDING", labelKey: "verifier.tab_pending" },
  { key: "VERIFIED", labelKey: "verifier.tab_verified" },
  { key: "REJECTED", labelKey: "verifier.tab_rejected" },
  { key: "REVISION_REQUIRED", labelKey: "verifier.tab_revision" },
];

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
  INSUFFICIENT_DATA: {
    label: "Insufficient Data",
    variant: "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
  },
};

export default function VerifierQueuePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<VerifierWorkspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");

  const fetchWorkspaces = async (statusFilter?: string) => {
    setLoading(true);
    try {
      const data = await getVerifierWorkspaces(statusFilter);
      setWorkspaces(data);
    } catch (error) {
      toast.error("Failed to load verification queue");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces(activeTab === "ALL" ? undefined : activeTab);
  }, [activeTab]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <FolderSearch className="h-7 w-7 text-indigo-600" />
          {t("verifier.queue_title")}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base mt-1">
          {t("verifier.queue_subtitle")}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab.key)}
            className={
              activeTab === tab.key ? "bg-indigo-600 hover:bg-indigo-700" : ""
            }
          >
            {t(tab.labelKey)}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t("verifier.workspaces")} ({workspaces.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : workspaces.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">
                {t("verifier.no_workspaces")}
              </p>
              <p className="text-sm mt-1">{t("verifier.no_workspaces_desc")}</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("verifier.col_owner")}</TableHead>
                      <TableHead>{t("verifier.col_sector")}</TableHead>
                      <TableHead>{t("verifier.col_submitted")}</TableHead>
                      <TableHead>{t("verifier.col_field_data")}</TableHead>
                      <TableHead>{t("verifier.col_status")}</TableHead>
                      <TableHead>{t("verifier.col_verification")}</TableHead>
                      <TableHead className="text-right">
                        {t("verifier.col_actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workspaces.map((ws) => {
                      const wsStatus =
                        WORKSPACE_STATUS_BADGE[ws.status] ??
                        WORKSPACE_STATUS_BADGE.PENDING_ANALYSIS;
                      const latestVer = ws.verificationRecords?.[0];
                      return (
                        <TableRow key={ws.id}>
                          <TableCell className="text-sm font-medium">
                            {ws.user.firstName} {ws.user.lastName}
                          </TableCell>
                          <TableCell className="text-sm">
                            {ws.sector.replace(/_/g, " ")}
                          </TableCell>
                          <TableCell className="text-sm">
                            {format(new Date(ws.uploadDate), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell className="text-sm">
                            {ws._count.fieldData}
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${wsStatus.variant}`}>
                              {wsStatus.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {latestVer ? (
                              <Badge className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                                {latestVer.status.replace(/_/g, " ")}
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/dashboard/verifier/workspace/${ws.id}`,
                                )
                              }
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              {t("verifier.view")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {workspaces.map((ws) => {
                  const wsStatus =
                    WORKSPACE_STATUS_BADGE[ws.status] ??
                    WORKSPACE_STATUS_BADGE.PENDING_ANALYSIS;
                  return (
                    <div
                      key={ws.id}
                      className="p-4 border rounded-xl bg-muted/20 space-y-3 cursor-pointer"
                      onClick={() =>
                        router.push(`/dashboard/verifier/workspace/${ws.id}`)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {ws.user.firstName} {ws.user.lastName}
                        </span>
                        <Badge className={`text-xs ${wsStatus.variant}`}>
                          {wsStatus.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{ws.sector.replace(/_/g, " ")}</span>
                        <span>
                          {format(new Date(ws.uploadDate), "MMM dd, yyyy")}
                        </span>
                        <span>
                          {ws._count.fieldData} {t("verifier.field_records")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
