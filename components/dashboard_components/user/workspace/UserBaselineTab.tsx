"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  getBaseline,
  createBaseline,
  updateBaseline,
  submitBaseline,
  reviseBaseline,
  Baseline,
  CreateBaselineData,
  UpdateBaselineData,
} from "@/app/api/baseline.api";
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
  Gauge,
  CheckCircle2,
  XCircle,
  Clock,
  Lock,
  Loader2,
  Send,
  FileText,
  CalendarDays,
  Activity,
  User,
  Plus,
  Pencil,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "@/components/global/language-provider";

interface WorkspaceInfo {
  id: string;
  sector: string;
}

export default function UserBaselineTab() {
  const { t } = useLanguage();

  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [baseline, setBaseline] = useState<Baseline | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form mode
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form fields
  const [baselineYear, setBaselineYear] = useState("");
  const [measurementMethod, setMeasurementMethod] = useState("");
  const [dataSource, setDataSource] = useState("");
  const [notes, setNotes] = useState("");

  // Dialog
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  // Load workspace + baseline
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
          const bl = await getBaseline(ws.id);
          setBaseline(bl);
        }
      } catch {
        toast.error(t("baseline.load_error"));
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [t]);

  const refreshBaseline = useCallback(async () => {
    if (!workspace) return;
    try {
      const bl = await getBaseline(workspace.id);
      setBaseline(bl);
    } catch {
      setBaseline(null);
    }
  }, [workspace]);

  // Populate form for editing
  const startEditing = () => {
    if (!baseline) return;
    setBaselineYear(baseline.baselineYear.toString());
    setMeasurementMethod(baseline.measurementMethod);
    setDataSource(baseline.dataSource || "");
    setNotes(baseline.notes || "");
    setIsEditing(true);
  };

  const startCreating = () => {
    setBaselineYear("");
    setMeasurementMethod("");
    setDataSource("");
    setNotes("");
    setIsCreating(true);
  };

  const cancelForm = () => {
    setIsEditing(false);
    setIsCreating(false);
  };

  // Create
  const handleCreate = async () => {
    if (!workspace) return;
    const year = parseInt(baselineYear);
    if (isNaN(year) || year < 1990 || year > 2100) {
      toast.error("Please enter a valid year (1990-2100)");
      return;
    }
    if (measurementMethod.trim().length < 2) {
      toast.error("Please enter a measurement method");
      return;
    }

    setIsSubmitting(true);
    try {
      const data: CreateBaselineData = {
        workspaceId: workspace.id,
        baselineYear: year,
        measurementMethod: measurementMethod.trim(),
        ...(dataSource.trim() && { dataSource: dataSource.trim() }),
        ...(notes.trim() && { notes: notes.trim() }),
      };
      const created = await createBaseline(data);
      setBaseline(created);
      setIsCreating(false);
      toast.success(t("baseline.create_success"));
    } catch (err: any) {
      // TASK-11: Show specific reason for baseline creation failure
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        t("baseline.create_error");
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update
  const handleUpdate = async () => {
    if (!workspace) return;
    const year = parseInt(baselineYear);
    if (isNaN(year) || year < 1990 || year > 2100) {
      toast.error("Please enter a valid year (1990-2100)");
      return;
    }
    if (measurementMethod.trim().length < 2) {
      toast.error("Please enter a measurement method");
      return;
    }

    setIsSubmitting(true);
    try {
      const data: UpdateBaselineData = {
        baselineYear: year,
        measurementMethod: measurementMethod.trim(),
        dataSource: dataSource.trim() || undefined,
        notes: notes.trim() || undefined,
      };
      const updated = await updateBaseline(workspace.id, data);
      setBaseline(updated);
      setIsEditing(false);
      toast.success(t("baseline.update_success"));
    } catch (err: any) {
      // TASK-11: Show specific reason for baseline update failure
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        t("baseline.update_error");
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit
  const handleSubmit = async () => {
    if (!workspace) return;
    setIsSubmitting(true);
    try {
      const updated = await submitBaseline(workspace.id);
      setBaseline(updated);
      setSubmitDialogOpen(false);
      toast.success(t("baseline.submit_success"));
    } catch (err: any) {
      // TASK-11: Show specific reason for baseline submission failure
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        t("baseline.submit_error");
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Revise
  const handleRevise = async () => {
    if (!workspace) return;
    setIsSubmitting(true);
    try {
      const updated = await reviseBaseline(workspace.id);
      setBaseline(updated);
      toast.success(t("baseline.revise_success"));
    } catch (err: any) {
      // TASK-11: Show specific reason for baseline revision failure
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        t("baseline.revise_error");
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status badge
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

  const isFrozen = baseline?.status === "FROZEN";
  const isDraft = baseline?.status === "DRAFT";
  const isRejected = baseline?.status === "REJECTED";

  // ─── Loading ─────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-muted-foreground">
          {t("baseline.loading")}
        </span>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Gauge className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p>{t("baseline.load_error")}</p>
      </div>
    );
  }

  // ─── No baseline yet — show create form ──────────────────────────────────

  if (!baseline && !isCreating) {
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="text-center py-16">
            <Gauge className="h-16 w-16 mx-auto mb-4 text-emerald-200 dark:text-emerald-800" />
            <h3 className="text-lg font-semibold mb-2">
              {t("baseline.no_baseline")}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              {t("baseline.create_description")}
            </p>
            <Button
              onClick={startCreating}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("baseline.create_button")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Create / Edit form ──────────────────────────────────────────────────

  if (isCreating || isEditing) {
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              {isCreating
                ? t("baseline.create_title")
                : t("baseline.edit_button")}
            </CardTitle>
            <CardDescription>
              {isCreating
                ? t("baseline.create_description")
                : t("baseline.update_success").replace("successfully", "")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="bl-year">{t("baseline.year_label")}</Label>
                <Input
                  id="bl-year"
                  type="number"
                  min={1990}
                  max={2100}
                  placeholder={t("baseline.year_placeholder")}
                  value={baselineYear}
                  onChange={(e) => setBaselineYear(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20 p-3 text-sm text-emerald-800 dark:text-emerald-300">
              {t("baseline.emissions_auto_note")}
            </div>

            <div>
              <Label htmlFor="bl-method">{t("baseline.method_label")}</Label>
              <Input
                id="bl-method"
                placeholder={t("baseline.method_placeholder")}
                value={measurementMethod}
                onChange={(e) => setMeasurementMethod(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="bl-source">
                {t("baseline.data_source_label")}
              </Label>
              <Input
                id="bl-source"
                placeholder={t("baseline.data_source_placeholder")}
                value={dataSource}
                onChange={(e) => setDataSource(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="bl-notes">{t("baseline.notes_label")}</Label>
              <Textarea
                id="bl-notes"
                placeholder={t("baseline.notes_placeholder")}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={isCreating ? handleCreate : handleUpdate}
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                )}
                {isCreating
                  ? t("baseline.create_button")
                  : t("baseline.save_button")}
              </Button>
              <Button variant="outline" onClick={cancelForm}>
                {t("baseline.cancel")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Display baseline (read-only) ────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Frozen banner */}
      {isFrozen && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-sm">
          <Lock className="h-4 w-4 flex-shrink-0" />
          <span>{t("baseline.frozen_banner")}</span>
        </div>
      )}

      {/* Rejection reason */}
      {isRejected && baseline?.rejectionReason && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-medium">
              {t("baseline.rejection_reason")}:
            </span>{" "}
            {baseline.rejectionReason}
          </div>
        </div>
      )}

      {/* Baseline info card */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {isFrozen && <Lock className="h-4 w-4 text-cyan-600" />}
              <Gauge className="h-5 w-5" />
              {t("baseline.info_title")}
            </CardTitle>
            {baseline && renderStatusBadge(baseline.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {baseline && (
            <>
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

              {/* Notes */}
              {baseline.notes && (
                <div className="bg-muted/30 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-1">
                    {t("baseline.notes")}
                  </h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {baseline.notes}
                  </p>
                </div>
              )}

              {/* People info */}
              <div className="bg-muted/30 rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t("baseline.people_title")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
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
                  {baseline.freezer && (
                    <div>
                      <span className="text-muted-foreground">
                        {t("baseline.frozen_by")}:
                      </span>{" "}
                      <span>
                        {baseline.freezer.firstName} {baseline.freezer.lastName}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons — only visible when actionable */}
              <div className="flex flex-wrap gap-3 pt-2">
                {isDraft && (
                  <>
                    <Button size="sm" variant="outline" onClick={startEditing}>
                      <Pencil className="h-4 w-4 mr-1" />
                      {t("baseline.edit_button")}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setSubmitDialogOpen(true)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      {t("baseline.submit_button")}
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
                    {t("baseline.revise_button")}
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ─── Submit Dialog ──────────────────────────────────────── */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("baseline.submit_title")}</DialogTitle>
            <DialogDescription>
              {t("baseline.submit_confirm")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSubmitDialogOpen(false)}
            >
              {t("baseline.cancel")}
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
              {t("baseline.submit_button")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
