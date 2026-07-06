"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getBaseline, Baseline } from "@/app/api/baseline.api";
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
  CheckCircle2,
  Lock,
  XCircle,
  FileText,
} from "lucide-react";

export default function FieldOfficerBaselinePage() {
  const { t } = useLanguage();

  const [workspaces, setWorkspaces] = useState<AssignableWorkspace[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");

  const [baseline, setBaseline] = useState<Baseline | null>(null);
  const [loadingBaseline, setLoadingBaseline] = useState(false);

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
      } catch {
        toast.error(t("baseline.load_error"));
      } finally {
        setLoadingBaseline(false);
      }
    };

    loadBaseline();
  }, [selectedWorkspaceId, t]);

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
            {t("baseline.info_title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Field Officers review baseline status and continue uploading
            evidence.
          </p>
        </div>

        <div className="pt-1">{statusBadge(baseline?.status)}</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("baseline.select_workspace")}</CardTitle>
          <CardDescription>
            Select a workspace to view baseline workflow status.
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
            Baseline workflow
          </CardTitle>
          <CardDescription>
            Project owners create and submit baselines. Field officers provide
            field evidence in the submission workflow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingBaseline ? (
            <div className="py-6 flex items-center justify-center text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {t("baseline.loading")}
            </div>
          ) : !selectedWorkspaceId ? (
            <p className="text-sm text-muted-foreground">
              Select a workspace to view baseline details.
            </p>
          ) : !baseline ? (
            <div className="space-y-3 rounded-md border bg-muted/20 p-4">
              <p className="text-sm font-medium">No baseline created yet.</p>
              <p className="text-sm text-muted-foreground">
                The project owner creates baseline records from the user
                workspace tab. Continue collecting and submitting field evidence
                to support baseline creation.
              </p>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/field-officer/submit">
                  Continue evidence collection
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("baseline.year_label")}</Label>
                  <Input type="number" value={baseline.baselineYear} disabled />
                </div>

                <div className="space-y-2">
                  <Label>{t("baseline.emissions_label")}</Label>
                  <Input
                    value={`${Number(baseline.baselineEmissions).toFixed(4)} tCO₂e`}
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("baseline.method_label")}</Label>
                <Input
                  value={baseline.measurementMethod ?? ""}
                  placeholder={t("baseline.method_placeholder")}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label>{t("baseline.data_source_label")}</Label>
                <Input
                  value={baseline.dataSource ?? ""}
                  placeholder={t("baseline.data_source_placeholder")}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label>{t("baseline.notes_label")}</Label>
                <Textarea
                  value={baseline.notes ?? ""}
                  placeholder={t("baseline.notes_placeholder")}
                  className="min-h-[120px]"
                  disabled
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

              {(isSubmitted || isApproved) && (
                <p className="text-sm text-muted-foreground pt-1 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Baseline is under review. Continue collecting evidence for
                  future updates requested by the project owner.
                </p>
              )}

              {isDraft && (
                <p className="text-sm text-muted-foreground pt-1">
                  Draft baseline belongs to the project owner for final edits
                  and submission.
                </p>
              )}

              {isRejected && (
                <p className="text-sm text-muted-foreground pt-1">
                  Baseline was rejected. The project owner can revise and
                  resubmit after addressing feedback.
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
