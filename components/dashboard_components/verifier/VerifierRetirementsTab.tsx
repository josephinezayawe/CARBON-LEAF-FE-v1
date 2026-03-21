"use client";

import React, { useState, useEffect } from "react";
import {
  getVerifierRetirements,
  validateRetirement,
  VerifierRetirement,
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
import {
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/components/global/language-provider";

export default function VerifierRetirementsTab() {
  const { t } = useLanguage();

  const [retirements, setRetirements] = useState<VerifierRetirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [validateDialog, setValidateDialog] = useState<{
    open: boolean;
    retirement: VerifierRetirement | null;
  }>({ open: false, retirement: null });
  const [isValidating, setIsValidating] = useState(false);

  const loadRetirements = async () => {
    try {
      setIsLoading(true);
      const data = await getVerifierRetirements();
      setRetirements(data);
    } catch (error) {
      console.error("Error loading retirements:", error);
      toast.error(t("verifier_retirements.load_error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRetirements();
  }, []);

  const handleValidate = async () => {
    if (!validateDialog.retirement) return;

    setIsValidating(true);
    try {
      await validateRetirement(validateDialog.retirement.id);
      toast.success(t("verifier_retirements.validate_success"));
      setValidateDialog({ open: false, retirement: null });
      await loadRetirements();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err?.response?.data?.message ??
          t("verifier_retirements.validate_error"),
      );
    } finally {
      setIsValidating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        <span className="ml-2 text-sm text-muted-foreground">
          {t("verifier_retirements.loading")}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {t("verifier_retirements.title")}
              </CardTitle>
              <CardDescription>
                {t("verifier_retirements.description")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {retirements.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                {t("verifier_retirements.no_retirements")}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                    <TableHead className="text-xs font-medium">
                      {t("verifier_retirements.certificate_id")}
                    </TableHead>
                    <TableHead className="text-xs font-medium">
                      {t("verifier_retirements.buyer_name")}
                    </TableHead>
                    <TableHead className="text-xs font-medium text-right">
                      {t("verifier_retirements.credits_retired")}
                    </TableHead>
                    <TableHead className="text-xs font-medium">
                      {t("verifier_retirements.retirement_date")}
                    </TableHead>
                    <TableHead className="text-xs font-medium">
                      {t("verifier_retirements.reason")}
                    </TableHead>
                    <TableHead className="text-xs font-medium">
                      {t("verifier_retirements.status")}
                    </TableHead>
                    <TableHead className="text-xs font-medium text-right">
                      {t("verifier_retirements.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {retirements.map((retirement) => (
                    <TableRow key={retirement.id}>
                      <TableCell className="text-xs font-mono text-gray-600 dark:text-gray-400">
                        {retirement.certificateId.slice(0, 8)}…
                      </TableCell>
                      <TableCell className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {retirement.buyer.firstName} {retirement.buyer.lastName}
                      </TableCell>
                      <TableCell className="text-sm text-right text-gray-700 dark:text-gray-300">
                        {retirement.quantityRetired}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                        {format(new Date(retirement.retiredAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700 dark:text-gray-300 max-w-[150px] truncate">
                        {retirement.retirementReason ?? "—"}
                      </TableCell>
                      <TableCell>
                        {retirement.isValidated ? (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-0">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {t("verifier_retirements.validated")}
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-0">
                            <Clock className="w-3 h-3 mr-1" />
                            {t("verifier_retirements.pending")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {!retirement.isValidated && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setValidateDialog({
                                open: true,
                                retirement,
                              })
                            }
                            className="text-xs"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                            {t("verifier_retirements.validate_btn")}
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

      {/* Validate Retirement Dialog */}
      <Dialog
        open={validateDialog.open}
        onOpenChange={(open) => {
          if (!open) setValidateDialog({ open: false, retirement: null });
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("verifier_retirements.validate_dialog_title")}
            </DialogTitle>
            <DialogDescription>
              {t("verifier_retirements.validate_dialog_desc")}
            </DialogDescription>
          </DialogHeader>

          {validateDialog.retirement && (
            <div className="space-y-3">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {t("verifier_retirements.certificate_id")}
                  </span>
                  <span className="font-mono text-xs text-gray-900 dark:text-gray-100">
                    {validateDialog.retirement.certificateId.slice(0, 12)}…
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {t("verifier_retirements.buyer_name")}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {validateDialog.retirement.buyer.firstName}{" "}
                    {validateDialog.retirement.buyer.lastName}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {t("verifier_retirements.credits_retired")}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {validateDialog.retirement.quantityRetired}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {t("verifier_retirements.reason")}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {validateDialog.retirement.retirementReason ?? "—"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setValidateDialog({ open: false, retirement: null })
              }
            >
              {t("verifier_retirements.cancel")}
            </Button>
            <Button
              onClick={handleValidate}
              disabled={isValidating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isValidating && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {t("verifier_retirements.validate_retirement")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
