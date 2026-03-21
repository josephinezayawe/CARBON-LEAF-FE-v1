"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  getMonitoringCycles,
  createMonitoringCycle,
  updateMonitoringCycle,
  submitMonitoringCycle,
  reviseMonitoringCycle,
  uploadMonitoringReport,
  MonitoringCycle,
} from "@/app/api/monitoringCycle.api";
import { Workspace } from "@/app/api/workspace";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Activity,
  Plus,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Eye,
  CalendarDays,
  Hash,
  ExternalLink,
  AlertTriangle,
  RotateCcw,
  Upload,
  Lock,
  FileText,
} from "lucide-react";
import { useLanguage } from "@/components/global/language-provider";

interface WorkspaceInfo {
  id: string;
  sector: string;
}

export default function UserMonitoringTab() {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [cycles, setCycles] = useState<MonitoringCycle[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<MonitoringCycle | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create form
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [createNotes, setCreateNotes] = useState("");

  // Activity data editor
  const [editingActivityData, setEditingActivityData] = useState(false);
  const [activityDataJson, setActivityDataJson] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // Submit dialog
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  // Load workspace + cycles
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const wsResult = await Workspace.get();
        if (!wsResult.success) {
          toast.error("Failed to load workspace");
          return;
        }
        const workspaces = wsResult?.data?.data?.workspaces ?? [];
        if (workspaces.length > 0) {
          const ws = workspaces[0];
          setWorkspace({ id: ws.id, sector: ws.sector });
          const cyclesData = await getMonitoringCycles(ws.id);
          setCycles(cyclesData);
          if (cyclesData.length > 0) {
            setSelectedCycle(cyclesData[cyclesData.length - 1]);
          }
        }
      } catch {
        toast.error(t("monitoring.load_error"));
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [t]);

  const refreshCycles = useCallback(async () => {
    if (!workspace) return;
    try {
      const data = await getMonitoringCycles(workspace.id);
      setCycles(data);
      if (data.length > 0) {
        const current = selectedCycle
          ? data.find((c) => c.id === selectedCycle.id) || data[data.length - 1]
          : data[data.length - 1];
        setSelectedCycle(current);
      }
    } catch {
      /* ignore */
    }
  }, [workspace, selectedCycle]);

  // Create new cycle
  const handleCreate = async () => {
    if (!workspace) return;
    if (!startDate || !endDate) {
      toast.error("Please provide start and end dates");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      toast.error("End date must be after start date");
      return;
    }
    setIsSubmitting(true);
    try {
      const created = await createMonitoringCycle({
        workspaceId: workspace.id,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        notes: createNotes || undefined,
      });
      setCycles((prev) => [...prev, created]);
      setSelectedCycle(created);
      setCreateDialogOpen(false);
      setStartDate("");
      setEndDate("");
      setCreateNotes("");
      toast.success(t("monitoring.create_success"));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || t("monitoring.create_error"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update activity data
  const startEditingActivityData = () => {
    if (!selectedCycle) return;
    setActivityDataJson(
      selectedCycle.activityData
        ? JSON.stringify(selectedCycle.activityData, null, 2)
        : "{}",
    );
    setEditNotes(selectedCycle.notes || "");
    setEditingActivityData(true);
  };

  const handleSaveActivityData = async () => {
    if (!selectedCycle) return;
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(activityDataJson);
    } catch {
      toast.error("Invalid JSON format");
      return;
    }
    setIsSubmitting(true);
    try {
      const updated = await updateMonitoringCycle(selectedCycle.id, {
        activityData: parsed,
        notes: editNotes || undefined,
      });
      setCycles((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setSelectedCycle(updated);
      setEditingActivityData(false);
      toast.success(t("monitoring.update_success"));
    } catch {
      toast.error(t("monitoring.update_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit
  const handleSubmit = async () => {
    if (!selectedCycle) return;
    setIsSubmitting(true);
    try {
      const updated = await submitMonitoringCycle(selectedCycle.id);
      setCycles((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setSelectedCycle(updated);
      setSubmitDialogOpen(false);
      toast.success(t("monitoring.submit_success"));
    } catch {
      toast.error(t("monitoring.submit_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Revise
  const handleRevise = async () => {
    if (!selectedCycle) return;
    setIsSubmitting(true);
    try {
      const updated = await reviseMonitoringCycle(selectedCycle.id);
      setCycles((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setSelectedCycle(updated);
      toast.success(t("monitoring.revise_success"));
    } catch {
      toast.error(t("monitoring.revise_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upload report
  const handleReportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCycle) return;
    setIsSubmitting(true);
    try {
      const updated = await uploadMonitoringReport(selectedCycle.id, file);
      setCycles((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setSelectedCycle(updated);
      toast.success(t("monitoring.report_upload_success"));
    } catch {
      toast.error(t("monitoring.report_upload_error"));
    } finally {
      setIsSubmitting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300"
          >
            <Clock className="h-3 w-3 mr-1" /> {t("monitoring.status_open")}
          </Badge>
        );
      case "SUBMITTED":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
          >
            <Send className="h-3 w-3 mr-1" /> {t("monitoring.status_submitted")}
          </Badge>
        );
      case "UNDER_REVIEW":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
          >
            <Eye className="h-3 w-3 mr-1" />{" "}
            {t("monitoring.status_under_review")}
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />{" "}
            {t("monitoring.status_approved")}
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
          >
            <XCircle className="h-3 w-3 mr-1" />{" "}
            {t("monitoring.status_rejected")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Can create new cycle?
  const canCreateNewCycle =
    cycles.length === 0 || cycles[cycles.length - 1].status === "APPROVED";
  const isOpen = selectedCycle?.status === "OPEN";
  const isRejected = selectedCycle?.status === "REJECTED";

  // ─── Loading ─────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-muted-foreground">
          {t("monitoring.loading")}
        </span>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p>{t("monitoring.load_error")}</p>
      </div>
    );
  }

  // ─── Main render ─────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header with Open New Cycle button */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {t("monitoring.cycles_title")}
        </h3>
        <Button
          size="sm"
          onClick={() => setCreateDialogOpen(true)}
          disabled={!canCreateNewCycle}
          className="bg-emerald-600 hover:bg-emerald-700"
          title={
            !canCreateNewCycle
              ? t("monitoring.cannot_create_tooltip")
              : undefined
          }
        >
          <Plus className="h-4 w-4 mr-1" />
          {t("monitoring.open_cycle")}
        </Button>
      </div>

      {cycles.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="text-center py-16">
            <Activity className="h-16 w-16 mx-auto mb-4 text-emerald-200 dark:text-emerald-800" />
            <h3 className="text-lg font-semibold mb-2">
              {t("monitoring.no_cycles")}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              {t("monitoring.no_cycles_user_desc")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Cycle list / timeline */}
          <div className="space-y-2">
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
                      {cycle.cycleNumber}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {t("monitoring.cycle")} {cycle.cycleNumber}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(cycle.startDate).toLocaleDateString()} –{" "}
                        {new Date(cycle.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {cycle.calculatedCredits != null && (
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700"
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
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {t("monitoring.cycle")} {selectedCycle.cycleNumber}
                  </CardTitle>
                  {renderStatusBadge(selectedCycle.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Rejection banner */}
                {isRejected && selectedCycle.rejectionReason && (
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

                {/* Info grid */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        {t("monitoring.start_date")}:
                      </span>{" "}
                      <span className="font-medium">
                        {new Date(selectedCycle.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {t("monitoring.end_date")}:
                      </span>{" "}
                      <span className="font-medium">
                        {new Date(selectedCycle.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    {selectedCycle.calculatedCredits != null && (
                      <div>
                        <span className="text-muted-foreground">
                          {t("monitoring.calculated_credits")}:
                        </span>{" "}
                        <span className="font-bold text-emerald-700 dark:text-emerald-300">
                          {selectedCycle.calculatedCredits.toLocaleString()}{" "}
                          tCO₂e
                        </span>
                      </div>
                    )}
                    {selectedCycle.reportUrl && (
                      <div>
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

                {/* Activity data section */}
                {editingActivityData ? (
                  <div className="space-y-3">
                    <Label>{t("monitoring.activity_data")}</Label>
                    <Textarea
                      value={activityDataJson}
                      onChange={(e) => setActivityDataJson(e.target.value)}
                      rows={8}
                      className="font-mono text-xs"
                      placeholder='{"stoves_in_use": 450, "total_meals": 492750}'
                    />
                    <div>
                      <Label>{t("monitoring.notes")}</Label>
                      <Textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        rows={3}
                        className="mt-1"
                        placeholder={t("monitoring.notes_placeholder")}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        onClick={handleSaveActivityData}
                        disabled={isSubmitting}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {isSubmitting && (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        )}
                        {t("monitoring.save_button")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingActivityData(false)}
                      >
                        {t("monitoring.cancel")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
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
                    {selectedCycle.notes && (
                      <div className="bg-muted/30 rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">
                          {t("monitoring.notes")}
                        </h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {selectedCycle.notes}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {isOpen && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={startEditingActivityData}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        {t("monitoring.edit_activity_data")}
                      </Button>
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleReportUpload}
                          className="hidden"
                          id="report-upload"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <Upload className="h-4 w-4 mr-1" />
                          )}
                          {t("monitoring.upload_report")}
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setSubmitDialogOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Send className="h-4 w-4 mr-1" />
                        {t("monitoring.submit_button")}
                      </Button>
                    </>
                  )}
                  {isRejected && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRevise}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <RotateCcw className="h-4 w-4 mr-1" />
                      )}
                      {t("monitoring.revise_button")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* ─── Create Cycle Dialog ──────────────────────────────────────── */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("monitoring.create_title")}</DialogTitle>
            <DialogDescription>
              {t("monitoring.create_description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="mc-start">{t("monitoring.start_date")}</Label>
              <Input
                id="mc-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="mc-end">{t("monitoring.end_date")}</Label>
              <Input
                id="mc-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="mc-notes">
                {t("monitoring.notes")} ({t("monitoring.optional")})
              </Label>
              <Textarea
                id="mc-notes"
                placeholder={t("monitoring.notes_placeholder")}
                value={createNotes}
                onChange={(e) => setCreateNotes(e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              {t("monitoring.cancel")}
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isSubmitting || !startDate || !endDate}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              )}
              <Plus className="h-4 w-4 mr-1" />
              {t("monitoring.open_cycle")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Submit Dialog ────────────────────────────────────────────── */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("monitoring.submit_title")}</DialogTitle>
            <DialogDescription>
              {t("monitoring.submit_confirm")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSubmitDialogOpen(false)}
            >
              {t("monitoring.cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              )}
              <Send className="h-4 w-4 mr-1" />
              {t("monitoring.submit_button")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
