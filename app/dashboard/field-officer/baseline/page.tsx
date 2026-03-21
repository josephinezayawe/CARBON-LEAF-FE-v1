"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  createBaseline,
  getBaseline,
  submitBaseline,
  updateBaseline,
  reviseBaseline,
  Baseline,
} from "@/app/api/baseline.api";
import { Workspace } from "@/app/api/workspace";
import { useLanguage } from "@/components/global/language-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { AssignableWorkspace } from "@/lib/workspaceSchemas";
import {
  Loader2,
  Gauge,
  Save,
  Send,
  RefreshCcw,
  CheckCircle2,
  Lock,
  XCircle,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const currentYear = new Date().getFullYear();

export default function FieldOfficerBaselinePage() {
  const { t } = useLanguage();

  const [workspaces, setWorkspaces] = useState<AssignableWorkspace[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");

  const [baseline, setBaseline] = useState<Baseline | null>(null);
  const [loadingBaseline, setLoadingBaseline] = useState(false);

  const [baselineYear, setBaselineYear] = useState<number>(currentYear);
  const [measurementMethod, setMeasurementMethod] = useState(
    "Field evidence + approved methodology factors",
  );
  const [dataSource, setDataSource] = useState("AUTO_FIELD_EVIDENCE");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [revising, setRevising] = useState(false);

  const selectedWorkspace = useMemo(
    () => workspaces.find((w) => w.id === selectedWorkspaceId),
    [workspaces, selectedWorkspaceId],
  );

  const formatWorkspaceOption = (workspace: AssignableWorkspace) => {
    if (workspace.label?.trim()) return workspace.label;

    const parts = [
      workspace.workspaceName,
      workspace.assetIdentifier ?? "No asset linked",
      workspace.sector,
      workspace.status,
    ].filter(Boolean);

    return parts.join(" - ");
  };

  const isDraft = baseline?.status === "DRAFT";
  const isSubmitted = baseline?.status === "SUBMITTED";
  const isApproved = baseline?.status === "APPROVED";
  const isFrozen = baseline?.status === "FROZEN";
  const isRejected = baseline?.status === "REJECTED";

  const canEdit = !baseline || isDraft;

  useEffect(() => {
    const loadWorkspaces = async () => {
      setLoadingWorkspaces(true);
      const result = await Workspace.getAssignable();
      if (!result.success) {
        toast.error(result.message || t("baseline.load_error"));
        setWorkspaces([]);
      } else {
        setWorkspaces(result.data);
      }
      setLoadingWorkspaces(false);
    };

    loadWorkspaces();
  }, [t]);

  useEffect(() => {
    const loadBaseline = async () => {
      if (!selectedWorkspaceId) {
        setBaseline(null);
        return;
      }

      setLoadingBaseline(true);
      try {
        const data = await getBaseline(selectedWorkspaceId);
        setBaseline(data);

        if (data) {
          setBaselineYear(data.baselineYear);
          setMeasurementMethod(data.measurementMethod ?? "");
          setDataSource(data.dataSource ?? "AUTO_FIELD_EVIDENCE");
          setNotes(data.notes ?? "");
        } else {
          setBaselineYear(currentYear);
          setMeasurementMethod("Field evidence + approved methodology factors");
          setDataSource("AUTO_FIELD_EVIDENCE");
          setNotes("");
        }
      } catch {
        toast.error(t("baseline.load_error"));
      } finally {
        setLoadingBaseline(false);
      }
    };

    loadBaseline();
  }, [selectedWorkspaceId, t]);

  const validateForm = () => {
    if (!selectedWorkspaceId) {
      toast.error(t("field_officer.workspace_id_required"));
      return false;
    }

    if (
      !Number.isInteger(baselineYear) ||
      baselineYear < 1990 ||
      baselineYear > 2100
    ) {
      toast.error("Baseline year must be between 1990 and 2100");
      return false;
    }

    if (!measurementMethod.trim() || measurementMethod.trim().length < 2) {
      toast.error("Measurement method is required");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (!baseline) {
        const created = await createBaseline({
          workspaceId: selectedWorkspaceId,
          baselineYear,
          measurementMethod: measurementMethod.trim(),
          dataSource: dataSource.trim() || undefined,
          notes: notes.trim() || undefined,
        });
        setBaseline(created);
        toast.success(t("baseline.create_success"));
      } else {
        const updated = await updateBaseline(selectedWorkspaceId, {
          baselineYear,
          measurementMethod: measurementMethod.trim(),
          dataSource: dataSource.trim() || undefined,
          notes: notes.trim() || undefined,
        });
        setBaseline(updated);
        toast.success(t("baseline.update_success"));
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          (baseline ? t("baseline.update_error") : t("baseline.create_error")),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!selectedWorkspaceId || !baseline) return;

    setSubmitting(true);
    try {
      const updated = await submitBaseline(selectedWorkspaceId);
      setBaseline(updated);
      toast.success(t("baseline.submit_success"));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t("baseline.submit_error"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevise = async () => {
    if (!selectedWorkspaceId || !baseline) return;

    setRevising(true);
    try {
      const updated = await reviseBaseline(selectedWorkspaceId);
      setBaseline(updated);
      toast.success(t("baseline.revise_success"));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t("baseline.revise_error"));
    } finally {
      setRevising(false);
    }
  };

  const statusBadge = (status?: string) => {
    switch (status) {
      case "DRAFT":
        return <Badge variant="outline">{t("baseline.status_draft")}</Badge>;
      case "SUBMITTED":
        return (
          <Badge className="bg-blue-600">
            {t("baseline.status_submitted")}
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge className="bg-emerald-600">
            {t("baseline.status_approved")}
          </Badge>
        );
      case "FROZEN":
        return (
          <Badge className="bg-cyan-600">{t("baseline.status_frozen")}</Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-600">{t("baseline.status_rejected")}</Badge>
        );
      default:
        return <Badge variant="secondary">Not created</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Gauge className="h-6 w-6 text-green-600" />
            {t("baseline.create_title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Collect baseline setup information for calculation and review.
          </p>
        </div>

        <div className="pt-1">{statusBadge(baseline?.status)}</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("baseline.select_workspace")}</CardTitle>
          <CardDescription>
            Select target workspace before baseline actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedWorkspaceId}
            onValueChange={setSelectedWorkspaceId}
          >
            <SelectTrigger className="w-full h-11 [&>span]:truncate">
              <SelectValue
                placeholder={
                  loadingWorkspaces
                    ? t("field_officer.loading_workspaces")
                    : t("field_officer.workspace_id_placeholder")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {workspaces.length === 0 ? (
                <div className="p-3 text-sm text-muted-foreground">
                  {t("field_officer.no_workspaces_available")}
                </div>
              ) : (
                workspaces.map((ws) => (
                  <SelectItem
                    key={ws.id}
                    value={ws.id}
                    className="whitespace-normal break-words leading-snug py-2"
                  >
                    {formatWorkspaceOption(ws)}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {selectedWorkspace && (
            <div className="mt-3 rounded-md border bg-muted/20 p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                Selected workspace
              </p>
              <p className="text-sm break-words leading-relaxed">
                {formatWorkspaceOption(selectedWorkspace)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t("baseline.info_title")}
          </CardTitle>
          <CardDescription>
            Baseline emissions are computed from approved field evidence and
            methodology factors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingBaseline ? (
            <div className="py-6 flex items-center justify-center text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {t("baseline.loading")}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("baseline.year_label")}</Label>
                  <Input
                    type="number"
                    min={1990}
                    max={2100}
                    value={baselineYear}
                    onChange={(e) => setBaselineYear(Number(e.target.value))}
                    disabled={!canEdit}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("baseline.emissions_label")}</Label>
                  <Input
                    value={
                      baseline?.baselineEmissions
                        ? `${Number(baseline.baselineEmissions).toFixed(4)} tCO₂e`
                        : "Will be calculated on save"
                    }
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("baseline.method_label")}</Label>
                <Input
                  value={measurementMethod}
                  onChange={(e) => setMeasurementMethod(e.target.value)}
                  placeholder={t("baseline.method_placeholder")}
                  disabled={!canEdit}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("baseline.data_source_label")}</Label>
                <Input
                  value={dataSource}
                  onChange={(e) => setDataSource(e.target.value)}
                  placeholder={t("baseline.data_source_placeholder")}
                  disabled={!canEdit}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("baseline.notes_label")}</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("baseline.notes_placeholder")}
                  className="min-h-[120px]"
                  disabled={!canEdit}
                />
              </div>

              {!!baseline?.rejectionReason && (
                <div className="rounded-md border border-red-300 bg-red-50 dark:bg-red-950/20 p-3">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-300 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    {t("baseline.rejection_reason")}
                  </p>
                  <p className="text-sm mt-1 text-red-800 dark:text-red-200">
                    {baseline.rejectionReason}
                  </p>
                </div>
              )}

              {isFrozen && (
                <div className="rounded-md border border-cyan-300 bg-cyan-50 dark:bg-cyan-950/20 p-3 text-sm text-cyan-800 dark:text-cyan-200 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  {t("baseline.frozen_banner")}
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={!selectedWorkspaceId || !canEdit || saving}
                  className={cn(canEdit && "bg-green-600 hover:bg-green-700")}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {baseline
                        ? t("baseline.save_button")
                        : t("baseline.create_button")}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {baseline
                        ? t("baseline.save_button")
                        : t("baseline.create_button")}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSubmitForReview}
                  disabled={!baseline || !isDraft || submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t("baseline.submit_button")}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {t("baseline.submit_button")}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRevise}
                  disabled={!baseline || !isRejected || revising}
                >
                  {revising ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t("baseline.revise_button")}
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      {t("baseline.revise_button")}
                    </>
                  )}
                </Button>
              </div>

              {(isSubmitted || isApproved) && (
                <p className="text-sm text-muted-foreground pt-1 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Baseline is under review workflow. Editing is disabled until
                  revised.
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
