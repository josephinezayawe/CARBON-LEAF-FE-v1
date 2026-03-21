"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Plus,
  Eye,
  Award,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { creditIssuanceApi } from "@/app/api/creditIssuance.api";
import { useLanguage } from "@/components/global/language-provider";
import { toast } from "sonner";
import api from "@/app/api/api";

interface Holding {
  id: string;
  holderLabel: string;
  creditsIssued: number;
  creditsAvailable: number;
  creditsSold: number;
  creditsRetired: number;
  serialStart: string;
  serialEnd: string;
  status: "ACTIVE" | "EXHAUSTED";
  holder?: { id: string; firstName: string; lastName: string } | null;
}

interface Issuance {
  id: string;
  workspaceId: string;
  monitoringCycleId: string;
  vintageYear: number;
  totalCredits: number;
  serialStart: string;
  serialEnd: string;
  issuedAt: string;
  createdAt: string;
  holdings: Holding[];
  workspace?: {
    id: string;
    sector: string;
    user?: { id: string; firstName: string; lastName: string };
  };
  issuer?: { id: string; firstName: string; lastName: string };
  monitoringCycle?: {
    id: string;
    cycleNumber: number;
    startDate: string;
    endDate: string;
    calculatedCredits: number | null;
  };
}

interface ApprovedCycle {
  id: string;
  workspaceId: string;
  cycleNumber: number;
  calculatedCredits: number | null;
  endDate: string;
  workspace: {
    id: string;
    sector: string;
    user: { firstName: string; lastName: string };
  };
}

export default function IssuancesPage() {
  const { t } = useLanguage();
  const [issuances, setIssuances] = useState<Issuance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIssuance, setSelectedIssuance] = useState<Issuance | null>(
    null,
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [approvedCycles, setApprovedCycles] = useState<ApprovedCycle[]>([]);
  const [selectedCycleId, setSelectedCycleId] = useState("");
  const [isIssuing, setIsIssuing] = useState(false);
  const [loadingCycles, setLoadingCycles] = useState(false);

  const fetchIssuances = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await creditIssuanceApi.listIssuances({
        page,
        limit: 20,
      });
      setIssuances(response.data || []);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages || 1);
      }
    } catch {
      toast.error(t("issuance.fetch_error"));
    } finally {
      setIsLoading(false);
    }
  }, [page, t]);

  useEffect(() => {
    fetchIssuances();
  }, [fetchIssuances]);

  const fetchApprovedCycles = async () => {
    setLoadingCycles(true);
    try {
      // Fetch monitoring cycles with APPROVED status that don't have an issuance yet
      const response = await api.get("/api/monitoring-cycles", {
        params: { status: "APPROVED", limit: 100 },
      });
      const cycles = response.data?.data || response.data || [];

      // Filter out cycles that already have issuances
      const issuedCycleIds = new Set(issuances.map((i) => i.monitoringCycleId));
      const available = (Array.isArray(cycles) ? cycles : []).filter(
        (c: ApprovedCycle) =>
          !issuedCycleIds.has(c.id) &&
          c.calculatedCredits &&
          c.calculatedCredits > 0,
      );
      setApprovedCycles(available);
    } catch {
      toast.error(t("issuance.fetch_cycles_error"));
    } finally {
      setLoadingCycles(false);
    }
  };

  const handleOpenIssueDialog = () => {
    setSelectedCycleId("");
    setIssueDialogOpen(true);
    fetchApprovedCycles();
  };

  const handleIssueCredits = async () => {
    if (!selectedCycleId) return;
    const cycle = approvedCycles.find((c) => c.id === selectedCycleId);
    if (!cycle) return;

    setIsIssuing(true);
    try {
      await creditIssuanceApi.issueCredits({
        workspaceId: cycle.workspaceId,
        monitoringCycleId: cycle.id,
      });
      toast.success(t("issuance.issue_success"));
      setIssueDialogOpen(false);
      fetchIssuances();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || t("issuance.issue_error");
      toast.error(message);
    } finally {
      setIsIssuing(false);
    }
  };

  const handleViewDetails = async (issuance: Issuance) => {
    try {
      const response = await creditIssuanceApi.getIssuanceById(issuance.id);
      setSelectedIssuance(response.data || response);
      setDetailsOpen(true);
    } catch {
      toast.error(t("issuance.fetch_error"));
    }
  };

  const selectedCycle = approvedCycles.find((c) => c.id === selectedCycleId);

  const getSectorLabel = (sector: string) => {
    const map: Record<string, string> = {
      FARMER: "Agriculture",
      HYBRID_CAR_OWNER: "Vehicles",
      ECO_FRIENDLY_STOVES: "Stoves",
      COMMERCIAL_BUILDING: "Buildings",
    };
    return map[sector] || sector;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                {t("issuance.title")}
              </CardTitle>
              <CardDescription>{t("issuance.description")}</CardDescription>
            </div>
            <Button onClick={handleOpenIssueDialog}>
              <Plus className="h-4 w-4 mr-2" />
              {t("issuance.issue_credits")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : issuances.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Award className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {t("issuance.no_issuances")}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("issuance.date")}</TableHead>
                    <TableHead>{t("issuance.workspace")}</TableHead>
                    <TableHead>{t("issuance.vintage_year")}</TableHead>
                    <TableHead>{t("issuance.total_credits")}</TableHead>
                    <TableHead>{t("issuance.serial_range")}</TableHead>
                    <TableHead>{t("issuance.holdings_count")}</TableHead>
                    <TableHead>{t("issuance.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issuances.map((issuance) => (
                    <TableRow key={issuance.id}>
                      <TableCell>
                        {new Date(issuance.issuedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {issuance.workspace?.user
                              ? `${issuance.workspace.user.firstName} ${issuance.workspace.user.lastName}`
                              : "—"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {issuance.workspace?.sector
                              ? getSectorLabel(issuance.workspace.sector)
                              : ""}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{issuance.vintageYear}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {issuance.totalCredits.toLocaleString()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs">
                          {issuance.serialStart} → {issuance.serialEnd}
                        </code>
                      </TableCell>
                      <TableCell>{issuance.holdings?.length || 0}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(issuance)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Issue Credits Dialog */}
      <Dialog open={issueDialogOpen} onOpenChange={setIssueDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("issuance.issue_credits")}</DialogTitle>
            <DialogDescription>
              {t("issuance.issue_dialog_desc")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {loadingCycles ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : approvedCycles.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t("issuance.no_approved_cycles")}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("issuance.select_cycle")}
                  </label>
                  <Select
                    value={selectedCycleId}
                    onValueChange={setSelectedCycleId}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("issuance.select_cycle_placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {approvedCycles.map((cycle) => (
                        <SelectItem key={cycle.id} value={cycle.id}>
                          {cycle.workspace?.user
                            ? `${cycle.workspace.user.firstName} ${cycle.workspace.user.lastName}`
                            : "Workspace"}{" "}
                          — Cycle #{cycle.cycleNumber} (
                          {cycle.calculatedCredits} credits)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCycle && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {t("issuance.sector")}:
                        </span>
                        <span className="font-medium">
                          {getSectorLabel(
                            selectedCycle.workspace?.sector || "",
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {t("issuance.calculated_credits")}:
                        </span>
                        <Badge variant="secondary">
                          {selectedCycle.calculatedCredits?.toLocaleString()}{" "}
                          tCO₂e
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {t("issuance.vintage_year")}:
                        </span>
                        <span>
                          {new Date(selectedCycle.endDate).getFullYear()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {t("issuance.cycle")}:
                        </span>
                        <span>#{selectedCycle.cycleNumber}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIssueDialogOpen(false)}
                  >
                    {t("issuance.cancel")}
                  </Button>
                  <Button
                    onClick={handleIssueCredits}
                    disabled={!selectedCycleId || isIssuing}
                  >
                    {isIssuing && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    {t("issuance.confirm_issue")}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Issuance Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("issuance.details_title")}</DialogTitle>
            <DialogDescription>
              {selectedIssuance &&
                `${selectedIssuance.serialStart} → ${selectedIssuance.serialEnd}`}
            </DialogDescription>
          </DialogHeader>

          {selectedIssuance && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {t("issuance.total_credits")}
                  </p>
                  <p className="text-lg font-bold">
                    {selectedIssuance.totalCredits.toLocaleString()} tCO₂e
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {t("issuance.vintage_year")}
                  </p>
                  <p className="text-lg font-bold">
                    {selectedIssuance.vintageYear}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {t("issuance.issued_by")}
                  </p>
                  <p className="text-sm">
                    {selectedIssuance.issuer
                      ? `${selectedIssuance.issuer.firstName} ${selectedIssuance.issuer.lastName}`
                      : "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {t("issuance.issued_at")}
                  </p>
                  <p className="text-sm">
                    {new Date(selectedIssuance.issuedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Holdings Table */}
              <div>
                <h3 className="text-sm font-semibold mb-2">
                  {t("issuance.holdings")}
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("issuance.holder")}</TableHead>
                      <TableHead>{t("issuance.credits_issued")}</TableHead>
                      <TableHead>{t("issuance.credits_available")}</TableHead>
                      <TableHead>{t("issuance.serial_range")}</TableHead>
                      <TableHead>{t("issuance.status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedIssuance.holdings?.map((holding) => (
                      <TableRow key={holding.id}>
                        <TableCell>
                          <div>
                            <span className="font-medium">
                              {holding.holderLabel}
                            </span>
                            {holding.holder && (
                              <span className="text-xs text-muted-foreground block">
                                {holding.holder.firstName}{" "}
                                {holding.holder.lastName}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{holding.creditsIssued}</TableCell>
                        <TableCell>{holding.creditsAvailable}</TableCell>
                        <TableCell>
                          <code className="text-xs">
                            {holding.serialStart} → {holding.serialEnd}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              holding.status === "ACTIVE"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {holding.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
