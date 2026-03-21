"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  getMonitoringCycles,
  approveMonitoringCycle,
  rejectMonitoringCycle,
  MonitoringCycle,
} from "@/app/api/monitoringCycle.api";
import { getAllSubmissions } from "@/app/api/submissionsandReview.api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Activity,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Eye,
  RefreshCw,
  ExternalLink,
  CalendarDays,
  Hash,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { useLanguage } from "@/components/global/language-provider";

interface Workspace {
  workspaceId: string;
  userName: string;
  sector: string;
  status: string;
}

const SECTOR_LABELS: Record<string, string> = {
  FARMER: "Agriculture / Agroforestry",
  HYBRID_CAR_OWNER: "Hybrid Vehicles",
  CLEAN_COOKING: "Clean Cooking",
  BUILDING_OWNER: "Green Buildings",
};

export default function MonitoringCyclesPage() {
  const { t } = useLanguage();

  // State
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [cycles, setCycles] = useState<MonitoringCycle[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<MonitoringCycle | null>(
    null,
  );
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true);
  const [isLoadingCycles, setIsLoadingCycles] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dialog states
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Fetch workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      setIsLoadingWorkspaces(true);
      try {
        const response = await getAllSubmissions();
        const data = response.data || response;
        if (Array.isArray(data)) {
          setWorkspaces(
            data.map((s: Workspace) => ({
              workspaceId: s.workspaceId,
              userName: s.userName,
              sector: s.sector,
              status: s.status,
            })),
          );
        }
      } catch {
        toast.error(t("monitoring.load_error"));
      } finally {
        setIsLoadingWorkspaces(false);
      }
    };
    fetchWorkspaces();
  }, [t]);

  // Fetch cycles when workspace changes
  const fetchCycles = useCallback(async (wsId: string) => {
    if (!wsId) return;
    setIsLoadingCycles(true);
    try {
      const data = await getMonitoringCycles(wsId);
      setCycles(data);
      setSelectedCycle(data.length > 0 ? data[data.length - 1] : null);
    } catch {
      setCycles([]);
      setSelectedCycle(null);
    } finally {
      setIsLoadingCycles(false);
    }
  }, []);

  useEffect(() => {
    if (selectedWorkspaceId) {
      fetchCycles(selectedWorkspaceId);
    } else {
      setCycles([]);
      setSelectedCycle(null);
    }
  }, [selectedWorkspaceId, fetchCycles]);

  // Filter workspaces
  const filteredWorkspaces = workspaces.filter((ws) => {
    const matchesSearch =
      ws.workspaceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = sectorFilter === "all" || ws.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  // Status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800"
          >
            <Clock className="h-3 w-3 mr-1" />
            {t("monitoring.status_open")}
          </Badge>
        );
      case "SUBMITTED":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
          >
            <Send className="h-3 w-3 mr-1" />
            {t("monitoring.status_submitted")}
          </Badge>
        );
      case "UNDER_REVIEW":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
          >
            <Eye className="h-3 w-3 mr-1" />
            {t("monitoring.status_under_review")}
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {t("monitoring.status_approved")}
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
          >
            <XCircle className="h-3 w-3 mr-1" />
            {t("monitoring.status_rejected")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Admin actions
  const handleApprove = async () => {
    if (!selectedCycle) return;
    setIsSubmitting(true);
    try {
      const updated = await approveMonitoringCycle(selectedCycle.id);
      setCycles((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setSelectedCycle(updated);
      setApproveDialogOpen(false);
      toast.success(t("monitoring.approve_success"));
    } catch {
      toast.error(t("monitoring.approve_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedCycle) return;
    if (rejectReason.trim().length < 5) {
      toast.error(t("monitoring.reason_required"));
      return;
    }
    setIsSubmitting(true);
    try {
      const updated = await rejectMonitoringCycle(
        selectedCycle.id,
        rejectReason,
      );
      setCycles((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setSelectedCycle(updated);
      setRejectDialogOpen(false);
      setRejectReason("");
      toast.success(t("monitoring.reject_success"));
    } catch {
      toast.error(t("monitoring.reject_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedWorkspace = workspaces.find(
    (ws) => ws.workspaceId === selectedWorkspaceId,
  );

  return (
    <div className="space-y-6 w-full text-foreground bg-background">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Activity className="h-8 w-8 text-emerald-600" />
          {t("monitoring.page_title")}
        </h1>
        <p className="text-muted-foreground">
          {t("monitoring.page_description")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel — Workspace selector */}
        <Card className="border-0 shadow-sm bg-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">
              {t("monitoring.select_workspace")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("monitoring.search_workspaces")}
                className="pl-8 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sector filter */}
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {Object.entries(SECTOR_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Workspace list */}
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {isLoadingWorkspaces ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                </div>
              ) : filteredWorkspaces.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  {t("monitoring.no_workspaces")}
                </p>
              ) : (
                filteredWorkspaces.map((ws) => (
                  <button
                    key={ws.workspaceId}
                    onClick={() => setSelectedWorkspaceId(ws.workspaceId)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedWorkspaceId === ws.workspaceId
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="font-medium text-sm truncate">
                      {ws.userName}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                      <span className="truncate">
                        {ws.workspaceId.slice(0, 8)}...
                      </span>
                      <Badge variant="outline" className="text-[10px] ml-2">
                        {SECTOR_LABELS[ws.sector] || ws.sector}
                      </Badge>
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right panel — Cycles detail */}
        <Card className="border-0 shadow-sm bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {t("monitoring.cycles_title")}
            </CardTitle>
            {selectedWorkspace && (
              <CardDescription>
                {t("monitoring.workspace_label")}: {selectedWorkspace.userName}{" "}
                (
                {SECTOR_LABELS[selectedWorkspace.sector] ||
                  selectedWorkspace.sector}
                )
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {!selectedWorkspaceId ? (
              <div className="text-center py-16 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>{t("monitoring.select_workspace")}</p>
              </div>
            ) : isLoadingCycles ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <span className="ml-2 text-muted-foreground">
                  {t("monitoring.loading")}
                </span>
              </div>
            ) : cycles.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>{t("monitoring.no_cycles")}</p>
                <p className="text-xs mt-1">{t("monitoring.no_cycles_desc")}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Cycle timeline */}
                <div className="space-y-3">
                  {cycles.map((cycle) => (
                    <button
                      key={cycle.id}
                      onClick={() => setSelectedCycle(cycle)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        selectedCycle?.id === cycle.id
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold">
                            <Hash className="h-3.5 w-3.5 mr-0.5" />
                            {cycle.cycleNumber}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {t("monitoring.cycle")} {cycle.cycleNumber}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              {new Date(
                                cycle.startDate,
                              ).toLocaleDateString()} –{" "}
                              {new Date(cycle.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {cycle.calculatedCredits != null && (
                            <Badge
                              variant="outline"
                              className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200"
                            >
                              {cycle.calculatedCredits.toLocaleString()} tCO₂e
                            </Badge>
                          )}
                          {renderStatusBadge(cycle.status)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Selected cycle detail */}
                {selectedCycle && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">
                        {t("monitoring.cycle")} {selectedCycle.cycleNumber} —{" "}
                        {t("monitoring.detail_title")}
                      </h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fetchCycles(selectedWorkspaceId)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        {t("monitoring.refresh")}
                      </Button>
                    </div>

                    {/* Rejection banner */}
                    {selectedCycle.status === "REJECTED" &&
                      selectedCycle.rejectionReason && (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium">
                              {t("monitoring.rejection_reason")}:
                            </span>{" "}
                            {selectedCycle.rejectionReason}
                          </div>
                        </div>
                      )}

                    {/* Cycle info */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            {t("monitoring.start_date")}:
                          </span>{" "}
                          <span className="font-medium">
                            {new Date(
                              selectedCycle.startDate,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {t("monitoring.end_date")}:
                          </span>{" "}
                          <span className="font-medium">
                            {new Date(
                              selectedCycle.endDate,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {t("monitoring.calculated_credits")}:
                          </span>{" "}
                          <span className="font-medium">
                            {selectedCycle.calculatedCredits != null
                              ? `${selectedCycle.calculatedCredits.toLocaleString()} tCO₂e`
                              : t("monitoring.not_calculated")}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {t("monitoring.status")}:
                          </span>{" "}
                          {renderStatusBadge(selectedCycle.status)}
                        </div>
                        {selectedCycle.submitter && (
                          <div>
                            <span className="text-muted-foreground">
                              {t("monitoring.submitted_by")}:
                            </span>{" "}
                            <span>
                              {selectedCycle.submitter.firstName}{" "}
                              {selectedCycle.submitter.lastName}
                            </span>
                          </div>
                        )}
                        {selectedCycle.approver && (
                          <div>
                            <span className="text-muted-foreground">
                              {t("monitoring.approved_by")}:
                            </span>{" "}
                            <span>
                              {selectedCycle.approver.firstName}{" "}
                              {selectedCycle.approver.lastName}
                            </span>
                          </div>
                        )}
                        {selectedCycle.reportUrl && (
                          <div className="sm:col-span-2">
                            <a
                              href={selectedCycle.reportUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:underline inline-flex items-center gap-1 text-sm"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {t("monitoring.view_report")}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Activity data */}
                    {selectedCycle.activityData && (
                      <div className="bg-muted/30 rounded-lg p-4">
                        <h4 className="font-medium text-sm mb-2">
                          {t("monitoring.activity_data")}
                        </h4>
                        <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
                          {JSON.stringify(selectedCycle.activityData, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Notes */}
                    {selectedCycle.notes && (
                      <div className="bg-muted/30 rounded-lg p-4">
                        <h4 className="font-medium text-sm mb-1">
                          {t("monitoring.notes")}
                        </h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {selectedCycle.notes}
                        </p>
                      </div>
                    )}

                    {/* Admin action buttons */}
                    {(selectedCycle.status === "SUBMITTED" ||
                      selectedCycle.status === "UNDER_REVIEW") && (
                      <div className="flex gap-3 pt-2">
                        <Button
                          size="sm"
                          onClick={() => setApproveDialogOpen(true)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          {t("monitoring.approve_button")}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setRejectDialogOpen(true)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          {t("monitoring.reject_button")}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─── Approve Dialog ───────────────────────────────────────────── */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("monitoring.approve_title")}</DialogTitle>
            <DialogDescription>
              {t("monitoring.approve_confirm")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
            >
              {t("monitoring.cancel")}
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              )}
              <CheckCircle2 className="h-4 w-4 mr-1" />
              {t("monitoring.approve_button")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Reject Dialog ────────────────────────────────────────────── */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("monitoring.reject_title")}</DialogTitle>
            <DialogDescription>
              {t("monitoring.reject_confirm")}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Textarea
              placeholder={t("monitoring.rejection_placeholder")}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
            {rejectReason.length > 0 && rejectReason.length < 5 && (
              <p className="text-xs text-red-500 mt-1">
                {t("monitoring.reason_min_chars")}
              </p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              {t("monitoring.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isSubmitting || rejectReason.trim().length < 5}
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              )}
              <XCircle className="h-4 w-4 mr-1" />
              {t("monitoring.reject_button")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
