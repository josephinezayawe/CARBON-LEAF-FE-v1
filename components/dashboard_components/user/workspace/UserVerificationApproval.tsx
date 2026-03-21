"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Workspace } from "@/app/api/workspace";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useLanguage } from "@/components/global/language-provider";

interface WorkspaceInfo {
  id: string;
  status: string;
  ownerApprovedForVerification: boolean;
  ownerApprovalForVerificationAt: string | null;
}

export default function UserVerificationApproval() {
  const { t } = useLanguage();

  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadWorkspace = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await Workspace.get();
      if (!result.success) {
        return;
      }

      const workspaces = result?.data?.data?.workspaces ?? [];
      if (workspaces.length > 0) {
        const ws = workspaces[0];
        setWorkspace({
          id: ws.id,
          status: ws.status,
          ownerApprovedForVerification:
            ws.ownerApprovedForVerification ?? false,
          ownerApprovalForVerificationAt:
            ws.ownerApprovalForVerificationAt ?? null,
        });
      }
    } catch (error) {
      console.error("Error loading workspace:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  const handleApprove = async () => {
    if (!workspace) return;

    setIsSubmitting(true);
    try {
      const res = await Workspace.approveForVerification(workspace.id);
      if (res.success) {
        toast.success(t("verification_approval.approve_success"));
        setConfirmDialogOpen(false);
        await loadWorkspace();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error(t("verification_approval.approve_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return null; // Don't show anything while loading
  }

  if (!workspace) {
    return null;
  }

  // Only show when workspace status is APPROVED
  if (workspace.status !== "APPROVED") {
    return null;
  }

  // Already approved for verification
  if (workspace.ownerApprovedForVerification) {
    return (
      <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10">
        <CardContent className="flex items-center gap-3 py-4">
          <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              {t("verification_approval.submitted_badge")}
            </p>
            {workspace.ownerApprovalForVerificationAt && (
              <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                {t("verification_approval.approved_on")}{" "}
                {new Date(
                  workspace.ownerApprovalForVerificationAt,
                ).toLocaleDateString()}
              </p>
            )}
          </div>
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-0">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            {t("verification_approval.verified_label")}
          </Badge>
        </CardContent>
      </Card>
    );
  }

  // Show "Approve for Verification" button
  return (
    <>
      <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-base">
                {t("verification_approval.title")}
              </CardTitle>
              <CardDescription className="text-sm">
                {t("verification_approval.description")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setConfirmDialogOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            {t("verification_approval.approve_button")}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              {t("verification_approval.dialog_title")}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed pt-2">
              {t("verification_approval.dialog_description")}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-3 text-sm text-amber-700 dark:text-amber-300">
            {t("verification_approval.dialog_warning")}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              {t("verification_approval.cancel")}
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {t("verification_approval.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
