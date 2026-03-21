"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  getBaseline,
  approveBaseline,
  freezeBaseline,
  rejectBaseline,
  Baseline,
} from "@/app/api/baseline.api";
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Gauge,
  CheckCircle2,
  XCircle,
  Clock,
  Lock,
  Loader2,
  Search,
  RefreshCw,
  Send,
  Snowflake,
  AlertTriangle,
  FileText,
  CalendarDays,
  Activity,
  User,
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

export default function AdminBaselinesPage() {
  const { t } = useLanguage();

  // Workspace state
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true);

  // Baseline state
  const [baseline, setBaseline] = useState<Baseline | null>(null);
  const [isLoadingBaseline, setIsLoadingBaseline] = useState(false);

  // Dialog states
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [freezeDialogOpen, setFreezeDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        toast.error(t("baseline.load_error"));
      } finally {
        setIsLoadingWorkspaces(false);
      }
    };
    fetchWorkspaces();
  }, [t]);

  // Fetch baseline when workspace changes
  const fetchBaseline = useCallback(async (wsId: string) => {
    if (!wsId) return;
    setIsLoadingBaseline(true);
    try {
      const data = await getBaseline(wsId);
      setBaseline(data);
    } catch {
      setBaseline(null);
    } finally {
      setIsLoadingBaseline(false);
    }
  }, []);

  useEffect(() => {
    if (selectedWorkspaceId) {
      fetchBaseline(selectedWorkspaceId);
    } else {
      setBaseline(null);
    }
  }, [selectedWorkspaceId, fetchBaseline]);

  // Filter workspaces
  const filteredWorkspaces = workspaces.filter((ws) => {
    const matchesSearch =
      ws.workspaceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = sectorFilter === "all" || ws.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleApprove = async () => {
    if (!selectedWorkspaceId) return;
    setIsSubmitting(true);
    try {
      const updated = await approveBaseline(selectedWorkspaceId);
      setBaseline(updated);
      setApproveDialogOpen(false);
      toast.success(t("baseline.approve_success"));
    } catch {
      toast.error(t("baseline.approve_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFreeze = async () => {
    if (!selectedWorkspaceId) return;
    setIsSubmitting(true);
    try {
      const updated = await freezeBaseline(selectedWorkspaceId);
      setBaseline(updated);
      setFreezeDialogOpen(false);
      toast.success(t("baseline.freeze_success"));
    } catch {
      toast.error(t("baseline.freeze_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedWorkspaceId || rejectionReason.trim().length < 5) {
      toast.error(t("baseline.reason_required"));
      return;
    }
    setIsSubmitting(true);
    try {
      const updated = await rejectBaseline(
        selectedWorkspaceId,
        rejectionReason,
      );
      setBaseline(updated);
      setRejectDialogOpen(false);
      setRejectionReason("");
      toast.success(t("baseline.reject_success"));
    } catch {
      toast.error(t("baseline.reject_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Status badge helper ─────────────────────────────────────────────────

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800"
          >
            <FileText className="h-3 w-3 mr-1" />
            {t("baseline.status_draft")}
          </Badge>
        );
      case "SUBMITTED":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
          >
            <Send className="h-3 w-3 mr-1" />
            {t("baseline.status_submitted")}
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {t("baseline.status_approved")}
          </Badge>
        );
      case "FROZEN":
        return (
          <Badge
            variant="outline"
            className="bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800"
          >
            <Lock className="h-3 w-3 mr-1" />
            {t("baseline.status_frozen")}
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
          >
            <XCircle className="h-3 w-3 mr-1" />
            {t("baseline.status_rejected")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
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
          <Gauge className="h-8 w-8 text-emerald-600" />
          {t("baseline.page_title")}
        </h1>
        <p className="text-muted-foreground">
          {t("baseline.page_description")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── Left panel — Workspace selector ──────────────────────── */}
        <Card className="border-0 shadow-sm bg-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">
              {t("baseline.select_workspace")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("baseline.search_workspaces")}
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
                  {t("baseline.no_workspaces")}
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

        {/* ─── Right panel — Baseline detail ──────────────────────── */}
        <Card className="border-0 shadow-sm bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              {t("baseline.detail_title")}
            </CardTitle>
            {selectedWorkspace && (
              <CardDescription>
                {t("baseline.workspace_label")}: {selectedWorkspace.userName} (
                {SECTOR_LABELS[selectedWorkspace.sector] ||
                  selectedWorkspace.sector}
                )
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {!selectedWorkspaceId ? (
              <div className="text-center py-16 text-muted-foreground">
                <Gauge className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>{t("baseline.select_workspace")}</p>
              </div>
            ) : isLoadingBaseline ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <span className="ml-2 text-muted-foreground">
                  {t("baseline.loading")}
                </span>
              </div>
            ) : !baseline ? (
              <div className="text-center py-16 text-muted-foreground">
                <Gauge className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>{t("baseline.no_baseline")}</p>
                <p className="text-xs mt-1">{t("baseline.no_baseline_desc")}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Status + frozen banner */}
                {baseline.status === "FROZEN" && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-sm">
                    <Lock className="h-4 w-4 flex-shrink-0" />
                    <span>{t("baseline.frozen_banner")}</span>
                  </div>
                )}

                {/* Baseline info */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      {t("baseline.info_title")}
                    </h4>
                    {renderStatusBadge(baseline.status)}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        {t("baseline.year")}:
                      </span>{" "}
                      <span className="font-medium flex items-center gap-1 inline-flex">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {baseline.baselineYear}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {t("baseline.emissions")}:
                      </span>{" "}
                      <span className="font-medium">
                        {baseline.baselineEmissions.toLocaleString()} tCO₂e
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {t("baseline.method")}:
                      </span>{" "}
                      <span className="font-medium">
                        {baseline.measurementMethod}
                      </span>
                    </div>
                    {baseline.dataSource && (
                      <div>
                        <span className="text-muted-foreground">
                          {t("baseline.data_source")}:
                        </span>{" "}
                        <span>{baseline.dataSource}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">
                        {t("baseline.created_at")}:
                      </span>{" "}
                      <span>
                        {new Date(baseline.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {t("baseline.updated_at")}:
                      </span>{" "}
                      <span>
                        {new Date(baseline.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {baseline.notes && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-medium text-sm mb-2">
                      {t("baseline.notes")}
                    </h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {baseline.notes}
                    </p>
                  </div>
                )}

                {/* Creator & approver info */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t("baseline.people_title")}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        {t("baseline.created_by")}:
                      </span>{" "}
                      <span>
                        {baseline.creator.firstName} {baseline.creator.lastName}
                      </span>
                    </div>
                    {baseline.approver && (
                      <div>
                        <span className="text-muted-foreground">
                          {t("baseline.approved_by")}:
                        </span>{" "}
                        <span>
                          {baseline.approver.firstName}{" "}
                          {baseline.approver.lastName}
                        </span>
                      </div>
                    )}
                    {baseline.approvedAt && (
                      <div>
                        <span className="text-muted-foreground">
                          {t("baseline.approved_at")}:
                        </span>{" "}
                        <span>
                          {new Date(baseline.approvedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {baseline.freezer && (
                      <div>
                        <span className="text-muted-foreground">
                          {t("baseline.frozen_by")}:
                        </span>{" "}
                        <span>
                          {baseline.freezer.firstName}{" "}
                          {baseline.freezer.lastName}
                        </span>
                      </div>
                    )}
                    {baseline.frozenAt && (
                      <div>
                        <span className="text-muted-foreground">
                          {t("baseline.frozen_at")}:
                        </span>{" "}
                        <span>
                          {new Date(baseline.frozenAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rejection reason */}
                {baseline.status === "REJECTED" && baseline.rejectionReason && (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                    <h4 className="font-medium text-sm text-red-700 dark:text-red-300 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {t("baseline.rejection_reason")}
                    </h4>
                    <p className="text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap">
                      {baseline.rejectionReason}
                    </p>
                  </div>
                )}

                {/* ─── Admin action buttons ──────────────────────────── */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {baseline.status === "SUBMITTED" && (
                    <>
                      <Button
                        onClick={() => setApproveDialogOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        {t("baseline.approve_button")}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => setRejectDialogOpen(true)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        {t("baseline.reject_button")}
                      </Button>
                    </>
                  )}

                  {baseline.status === "APPROVED" && (
                    <Button
                      onClick={() => setFreezeDialogOpen(true)}
                      className="bg-cyan-600 hover:bg-cyan-700"
                    >
                      <Snowflake className="h-4 w-4 mr-1" />
                      {t("baseline.freeze_button")}
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fetchBaseline(selectedWorkspaceId)}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    {t("baseline.refresh")}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─── Approve Dialog ──────────────────────────────────────── */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("baseline.approve_title")}</DialogTitle>
            <DialogDescription>
              {t("baseline.approve_confirm")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
            >
              {t("baseline.cancel")}
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
              {t("baseline.approve_button")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Freeze Dialog ───────────────────────────────────────── */}
      <Dialog open={freezeDialogOpen} onOpenChange={setFreezeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("baseline.freeze_title")}</DialogTitle>
            <DialogDescription>
              {t("baseline.freeze_confirm")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span>{t("baseline.freeze_warning")}</span>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setFreezeDialogOpen(false)}
            >
              {t("baseline.cancel")}
            </Button>
            <Button
              onClick={handleFreeze}
              disabled={isSubmitting}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              )}
              <Snowflake className="h-4 w-4 mr-1" />
              {t("baseline.freeze_button")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Reject Dialog ───────────────────────────────────────── */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("baseline.reject_title")}</DialogTitle>
            <DialogDescription>
              {t("baseline.reject_confirm")}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="rejection-reason">
              {t("baseline.rejection_reason")}
            </Label>
            <Textarea
              id="rejection-reason"
              placeholder={t("baseline.rejection_placeholder")}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-1"
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t("baseline.reason_min_chars")}
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              {t("baseline.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isSubmitting || rejectionReason.trim().length < 5}
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              )}
              <XCircle className="h-4 w-4 mr-1" />
              {t("baseline.reject_button")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
