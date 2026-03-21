"use client";

import React, { useState, useEffect } from "react";
import {
  getVerifierCreditIssuances,
  confirmSerialization,
  VerifierCreditIssuance,
} from "@/app/api/verifier.api";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ShieldCheck, Loader2, CheckCircle2, Clock, Hash } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/components/global/language-provider";

export default function VerifierCreditIssuancesTab() {
  const { t } = useLanguage();

  const [issuances, setIssuances] = useState<VerifierCreditIssuance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    issuance: VerifierCreditIssuance | null;
  }>({ open: false, issuance: null });
  const [isConfirming, setIsConfirming] = useState(false);

  const loadIssuances = async () => {
    try {
      setIsLoading(true);
      const data = await getVerifierCreditIssuances();
      setIssuances(data);
    } catch (error) {
      console.error("Error loading credit issuances:", error);
      toast.error(t("verifier_issuances.load_error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIssuances();
  }, []);

  const handleConfirm = async () => {
    if (!confirmDialog.issuance) return;

    setIsConfirming(true);
    try {
      await confirmSerialization(confirmDialog.issuance.id);
      toast.success(t("verifier_issuances.confirm_success"));
      setConfirmDialog({ open: false, issuance: null });
      await loadIssuances();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err?.response?.data?.message ?? t("verifier_issuances.confirm_error"),
      );
    } finally {
      setIsConfirming(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        <span className="ml-2 text-sm text-muted-foreground">
          {t("verifier_issuances.loading")}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <Hash className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {t("verifier_issuances.title")}
              </CardTitle>
              <CardDescription>
                {t("verifier_issuances.description")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {issuances.length === 0 ? (
            <div className="text-center py-8">
              <Hash className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                {t("verifier_issuances.no_issuances")}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                    <TableHead className="text-xs font-medium">
                      {t("verifier_issuances.workspace")}
                    </TableHead>
                    <TableHead className="text-xs font-medium">
                      {t("verifier_issuances.vintage_year")}
                    </TableHead>
                    <TableHead className="text-xs font-medium text-right">
                      {t("verifier_issuances.total_credits")}
                    </TableHead>
                    <TableHead className="text-xs font-medium">
                      {t("verifier_issuances.serial_range")}
                    </TableHead>
                    <TableHead className="text-xs font-medium">
                      {t("verifier_issuances.issued_date")}
                    </TableHead>
                    <TableHead className="text-xs font-medium">
                      {t("verifier_issuances.status")}
                    </TableHead>
                    <TableHead className="text-xs font-medium text-right">
                      {t("verifier_issuances.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issuances.map((issuance) => (
                    <TableRow key={issuance.id}>
                      <TableCell className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {issuance.workspace.asset?.name ??
                          issuance.workspace.sector}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                        {issuance.vintageYear}
                      </TableCell>
                      <TableCell className="text-sm text-right text-gray-700 dark:text-gray-300">
                        {issuance.totalCredits}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-gray-600 dark:text-gray-400">
                        {issuance.serialStart} — {issuance.serialEnd}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                        {format(new Date(issuance.issuedAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {issuance.serializationConfirmed ? (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-0">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {t("verifier_issuances.confirmed")}
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-0">
                            <Clock className="w-3 h-3 mr-1" />
                            {t("verifier_issuances.pending")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {!issuance.serializationConfirmed && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setConfirmDialog({
                                open: true,
                                issuance,
                              })
                            }
                            className="text-xs"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                            {t("verifier_issuances.confirm_btn")}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm Serialization Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => {
          if (!open) setConfirmDialog({ open: false, issuance: null });
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("verifier_issuances.confirm_dialog_title")}
            </DialogTitle>
            <DialogDescription>
              {t("verifier_issuances.confirm_dialog_desc")}
            </DialogDescription>
          </DialogHeader>

          {confirmDialog.issuance && (
            <div className="space-y-3">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {t("verifier_issuances.workspace")}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {confirmDialog.issuance.workspace.asset?.name ??
                      confirmDialog.issuance.workspace.sector}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {t("verifier_issuances.total_credits")}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {confirmDialog.issuance.totalCredits}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {t("verifier_issuances.serial_range")}
                  </span>
                  <span className="font-mono text-xs text-gray-900 dark:text-gray-100">
                    {confirmDialog.issuance.serialStart} —{" "}
                    {confirmDialog.issuance.serialEnd}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ open: false, issuance: null })}
            >
              {t("verifier_issuances.cancel")}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isConfirming}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isConfirming && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {t("verifier_issuances.confirm_serialization")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
