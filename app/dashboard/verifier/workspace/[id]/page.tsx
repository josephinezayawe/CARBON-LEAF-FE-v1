"use client";

import React, { useEffect, useState, use } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Loader2,
  MapPin,
  User,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Shield,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import { useLanguage } from "@/components/global/language-provider";
import {
  getWorkspaceHistory,
  updateVerificationStatus,
  sendClarification,
  getClarifications,
  uploadAuditReport,
  type WorkspaceHistory,
  type ClarificationRequest,
} from "@/app/api/verifier.api";

const VERIFICATION_STATUS_OPTIONS = [
  {
    value: "VERIFIED",
    label: "Verified",
    icon: CheckCircle2,
    color: "text-green-600",
  },
  {
    value: "REJECTED",
    label: "Rejected",
    icon: XCircle,
    color: "text-red-600",
  },
  {
    value: "REVISION_REQUIRED",
    label: "Revision Required",
    icon: AlertTriangle,
    color: "text-orange-600",
  },
];

const STATUS_BADGE: Record<string, { label: string; variant: string }> = {
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
  REVISION_REQUIRED: {
    label: "Revision Required",
    variant:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  },
};

export default function WorkspaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t } = useLanguage();
  const [workspace, setWorkspace] = useState<WorkspaceHistory | null>(null);
  const [clarifications, setClarifications] = useState<ClarificationRequest[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  // Status update state
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [statusSubmitting, setStatusSubmitting] = useState(false);

  // Clarification state
  const [clarificationMessage, setClarificationMessage] = useState("");
  const [clarificationSending, setClarificationSending] = useState(false);

  // Audit report state
  const [auditFile, setAuditFile] = useState<File | null>(null);
  const [auditUploading, setAuditUploading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [wsData, clarData] = await Promise.all([
          getWorkspaceHistory(id),
          getClarifications(id),
        ]);
        setWorkspace(wsData);
        setClarifications(clarData);
      } catch (error) {
        toast.error("Failed to load workspace details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // ─── Status Update ───────────────────────────────────────
  const handleStatusUpdate = async () => {
    if (!newStatus) {
      toast.error(t("verifier.select_status"));
      return;
    }
    setStatusSubmitting(true);
    try {
      await updateVerificationStatus(
        id,
        newStatus as "VERIFIED" | "REJECTED" | "REVISION_REQUIRED",
        statusNotes || undefined,
      );
      toast.success(t("verifier.status_updated"));
      setStatusDialogOpen(false);
      setNewStatus("");
      setStatusNotes("");
      // Refresh workspace data
      const wsData = await getWorkspaceHistory(id);
      setWorkspace(wsData);
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : t("verifier.status_error");
      toast.error(msg);
    } finally {
      setStatusSubmitting(false);
    }
  };

  // ─── Clarification ───────────────────────────────────────
  const handleSendClarification = async () => {
    if (clarificationMessage.trim().length < 10) {
      toast.error(t("verifier.clarification_min"));
      return;
    }
    setClarificationSending(true);
    try {
      await sendClarification(id, clarificationMessage.trim());
      toast.success(t("verifier.clarification_sent"));
      setClarificationMessage("");
      const clarData = await getClarifications(id);
      setClarifications(clarData);
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : t("verifier.clarification_error");
      toast.error(msg);
    } finally {
      setClarificationSending(false);
    }
  };

  // ─── Audit Report Upload ─────────────────────────────────
  const handleAuditUpload = async () => {
    if (!auditFile) {
      toast.error(t("verifier.select_file"));
      return;
    }
    setAuditUploading(true);
    try {
      await uploadAuditReport(id, auditFile);
      toast.success(t("verifier.audit_uploaded"));
      setAuditFile(null);
      const wsData = await getWorkspaceHistory(id);
      setWorkspace(wsData);
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : t("verifier.audit_error");
      toast.error(msg);
    } finally {
      setAuditUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">
          {t("verifier.workspace_not_found")}
        </p>
      </div>
    );
  }

  const wsStatusInfo = STATUS_BADGE[workspace.status] ?? STATUS_BADGE.PENDING;
  const latestVerification = workspace.verificationRecords?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {t("verifier.workspace_detail")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {workspace.sector.replace(/_/g, " ")} — {workspace.user.firstName}{" "}
            {workspace.user.lastName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`text-sm ${wsStatusInfo.variant}`}>
            {wsStatusInfo.label}
          </Badge>
          <Button
            onClick={() => setStatusDialogOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Shield className="h-4 w-4 mr-2" />
            {t("verifier.update_status")}
          </Button>
        </div>
      </div>

      {/* Owner Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-indigo-600" />
            {t("verifier.project_owner")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">
                {t("verifier.name")}
              </p>
              <p className="font-medium">
                {workspace.user.firstName} {workspace.user.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t("verifier.contact")}
              </p>
              <p className="font-medium">{workspace.user.contact}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t("verifier.location")}
              </p>
              <p className="font-medium">
                {workspace.user.district}, {workspace.user.province}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t("verifier.sector")}
              </p>
              <p className="font-medium">
                {workspace.sector.replace(/_/g, " ")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workspace Images */}
      {workspace.submissions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-indigo-600" />
              {t("verifier.submission_images")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {workspace.submissions.map((sub) => (
              <div key={sub.id} className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">
                  {t("verifier.submitted_on")}{" "}
                  {format(new Date(sub.createdAt), "MMM dd, yyyy HH:mm")}
                </p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {sub.images.map((img) => (
                    <a
                      key={img.id}
                      href={img.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative aspect-square rounded-lg overflow-hidden border hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={img.imageUrl}
                        alt="Submission"
                        className="w-full h-full object-cover"
                      />
                      {img.isDuplicate && (
                        <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                          {t("verifier.duplicate")}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Field Data */}
      {workspace.fieldData.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-indigo-600" />
              {t("verifier.field_data")} ({workspace.fieldData.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {workspace.fieldData.map((fd) => (
              <div
                key={fd.id}
                className="p-4 border rounded-xl bg-muted/20 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {fd.user.firstName} {fd.user.lastName}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`text-xs ${(STATUS_BADGE[fd.status] ?? STATUS_BADGE.PENDING).variant}`}
                    >
                      {(STATUS_BADGE[fd.status] ?? STATUS_BADGE.PENDING).label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(fd.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>

                {fd.gpsLat && fd.gpsLng && (
                  <p className="text-xs text-muted-foreground">
                    GPS: {fd.gpsLat.toFixed(6)}, {fd.gpsLng.toFixed(6)}
                  </p>
                )}

                {fd.measurements && Object.keys(fd.measurements).length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(fd.measurements).map(([key, val]) => (
                      <div
                        key={key}
                        className="text-xs p-2 rounded bg-muted/30"
                      >
                        <span className="text-muted-foreground">
                          {key.replace(/_/g, " ")}:
                        </span>{" "}
                        <span className="font-medium">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {fd.notes && (
                  <p className="text-xs text-muted-foreground italic">
                    {fd.notes}
                  </p>
                )}

                {fd.imageUrls.length > 0 && (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-1">
                    {fd.imageUrls.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aspect-square rounded-md overflow-hidden border"
                      >
                        <img
                          src={url}
                          alt={`Field photo ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Verification History */}
      {workspace.verificationRecords.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-600" />
              {t("verifier.verification_history")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workspace.verificationRecords.map((rec) => {
              const recStatus =
                STATUS_BADGE[rec.status] ?? STATUS_BADGE.PENDING;
              return (
                <div
                  key={rec.id}
                  className="flex items-start justify-between p-3 border rounded-lg bg-muted/20"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${recStatus.variant}`}>
                        {recStatus.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {t("verifier.by")} {rec.verifier?.firstName}{" "}
                        {rec.verifier?.lastName}
                      </span>
                    </div>
                    {rec.notes && (
                      <p className="text-sm text-muted-foreground">
                        {rec.notes}
                      </p>
                    )}
                    {rec.auditReportUrl && (
                      <a
                        href={rec.auditReportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        <FileText className="h-3 w-3" />
                        {t("verifier.view_audit_report")}
                      </a>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {format(new Date(rec.createdAt), "MMM dd, yyyy HH:mm")}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Clarifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-indigo-600" />
            {t("verifier.clarifications")} ({clarifications.length})
          </CardTitle>
          <CardDescription>{t("verifier.clarification_desc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Thread */}
          {clarifications.length > 0 && (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {clarifications.map((clar) => (
                <div
                  key={clar.id}
                  className="p-3 border rounded-lg bg-muted/20"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">
                      {clar.from.firstName} {clar.from.lastName}{" "}
                      <Badge variant="outline" className="text-[10px] ml-1">
                        {clar.from.role}
                      </Badge>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(clar.createdAt), "MMM dd, HH:mm")}
                    </span>
                  </div>
                  <p className="text-sm">{clar.message}</p>
                  {clar.response && (
                    <div className="mt-2 pl-3 border-l-2 border-indigo-200">
                      <p className="text-sm text-muted-foreground">
                        {clar.response}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Compose */}
          <div className="space-y-2">
            <Textarea
              placeholder={t("verifier.clarification_placeholder")}
              value={clarificationMessage}
              onChange={(e) => setClarificationMessage(e.target.value)}
              className="min-h-[80px]"
              maxLength={2000}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {clarificationMessage.length}/2000
              </span>
              <Button
                size="sm"
                onClick={handleSendClarification}
                disabled={
                  clarificationSending ||
                  clarificationMessage.trim().length < 10
                }
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {clarificationSending ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-1" />
                )}
                {t("verifier.send")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Report Upload */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-600" />
            {t("verifier.audit_report")}
          </CardTitle>
          <CardDescription>{t("verifier.audit_report_desc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label
            htmlFor="audit-upload"
            className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors"
          >
            <Upload className="h-6 w-6 text-muted-foreground mb-1" />
            <span className="text-sm text-muted-foreground">
              {auditFile ? auditFile.name : t("verifier.click_to_upload")}
            </span>
            <input
              id="audit-upload"
              type="file"
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              onChange={(e) => setAuditFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
          {auditFile && (
            <Button
              onClick={handleAuditUpload}
              disabled={auditUploading}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {auditUploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {t("verifier.upload_report")}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("verifier.update_verification")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t("verifier.new_status")}</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue
                    placeholder={t("verifier.select_status_placeholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {VERIFICATION_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <opt.icon className={`h-4 w-4 ${opt.color}`} />
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("verifier.notes_optional")}</Label>
              <Textarea
                placeholder={t("verifier.notes_placeholder")}
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                className="mt-1 min-h-[100px]"
                maxLength={3000}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusDialogOpen(false)}
            >
              {t("verifier.cancel")}
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={statusSubmitting || !newStatus}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {statusSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Shield className="h-4 w-4 mr-2" />
              )}
              {t("verifier.confirm_update")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
