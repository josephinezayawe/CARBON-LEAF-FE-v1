"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  simulateCredits,
  finalizeCredits,
  CarbonEngineResult,
} from "@/app/api/carbonEngine.api";
import {
  getMonitoringCycles,
  MonitoringCycle,
} from "@/app/api/monitoringCycle.api";
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
  Calculator,
  Loader2,
  Play,
  Save,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Zap,
  BarChart3,
  Info,
} from "lucide-react";
import { useLanguage } from "@/components/global/language-provider";

interface WorkspaceItem {
  workspaceId: string;
  userName: string;
  sector: string;
  status: string;
}

export default function CarbonSimulationPage() {
  const { t } = useLanguage();

  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([]);
  const [selectedWs, setSelectedWs] = useState<WorkspaceItem | null>(null);
  const [cycles, setCycles] = useState<MonitoringCycle[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<MonitoringCycle | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [result, setResult] = useState<CarbonEngineResult | null>(null);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [finalizeDialogOpen, setFinalizeDialogOpen] = useState(false);

  // Load workspaces
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await getAllSubmissions();
        const data = response.data || response;
        if (Array.isArray(data)) {
          setWorkspaces(
            data.map((s: WorkspaceItem) => ({
              workspaceId: s.workspaceId,
              userName: s.userName,
              sector: s.sector,
              status: s.status,
            })),
          );
        }
      } catch {
        toast.error(t("carbon.load_error"));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [t]);

  // Load cycles when workspace selected
  const loadCycles = useCallback(async (wsId: string) => {
    try {
      const data = await getMonitoringCycles(wsId);
      setCycles(data);
      // Auto-select the latest approved or submitted cycle
      const eligible = data.filter(
        (c) => c.status === "APPROVED" || c.status === "UNDER_REVIEW",
      );
      if (eligible.length > 0) {
        setSelectedCycle(eligible[eligible.length - 1]);
      } else if (data.length > 0) {
        setSelectedCycle(data[data.length - 1]);
      } else {
        setSelectedCycle(null);
      }
    } catch {
      setCycles([]);
      setSelectedCycle(null);
    }
  }, []);

  const handleSelectWorkspace = (ws: WorkspaceItem) => {
    setSelectedWs(ws);
    setResult(null);
    setOverrides({});
    loadCycles(ws.workspaceId);
  };

  // Run simulation
  const handleSimulate = async () => {
    if (!selectedWs || !selectedCycle) return;
    setIsSimulating(true);
    setResult(null);
    try {
      const parsedOverrides: Record<string, number> = {};
      for (const [k, v] of Object.entries(overrides)) {
        if (v !== "" && !isNaN(Number(v))) {
          parsedOverrides[k] = Number(v);
        }
      }
      const res = await simulateCredits({
        workspaceId: selectedWs.workspaceId,
        monitoringCycleId: selectedCycle.id,
        overrides:
          Object.keys(parsedOverrides).length > 0 ? parsedOverrides : undefined,
      });
      setResult(res);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t("carbon.simulate_error"));
    } finally {
      setIsSimulating(false);
    }
  };

  // Finalize
  const handleFinalize = async () => {
    if (!selectedWs || !selectedCycle) return;
    setIsFinalizing(true);
    try {
      const parsedOverrides: Record<string, number> = {};
      for (const [k, v] of Object.entries(overrides)) {
        if (v !== "" && !isNaN(Number(v))) {
          parsedOverrides[k] = Number(v);
        }
      }
      const res = await finalizeCredits({
        workspaceId: selectedWs.workspaceId,
        monitoringCycleId: selectedCycle.id,
        overrides:
          Object.keys(parsedOverrides).length > 0 ? parsedOverrides : undefined,
      });
      setResult(res);
      setFinalizeDialogOpen(false);
      toast.success(
        res.isValid
          ? `${t("carbon.finalize_success")}: ${res.credits} credits`
          : t("carbon.finalize_no_credits"),
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t("carbon.finalize_error"));
    } finally {
      setIsFinalizing(false);
    }
  };

  const sectorLabel = (s: string) => {
    const map: Record<string, string> = {
      FARMER: "🌱 Agroforestry",
      ECO_FRIENDLY_STOVES: "🔥 Cookstoves",
      HYBRID_CAR_OWNER: "🚗 Vehicles",
      COMMERCIAL_BUILDING: "🏢 Buildings",
    };
    return map[s] || s;
  };

  const filtered = workspaces.filter((ws) =>
    ws.userName.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="h-6 w-6 text-emerald-600" />
          {t("carbon.page_title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("carbon.page_description")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Left: Workspace selector ── */}
        <div className="lg:col-span-4 space-y-3">
          <Input
            placeholder={t("carbon.search_workspaces")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {filtered.map((ws) => (
              <button
                key={ws.workspaceId}
                onClick={() => handleSelectWorkspace(ws)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedWs?.workspaceId === ws.workspaceId
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{ws.userName}</p>
                    <p className="text-xs text-muted-foreground">{ws.status}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {sectorLabel(ws.sector)}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t("carbon.no_workspaces")}
              </p>
            )}
          </div>
        </div>

        {/* ── Right: Simulation panel ── */}
        <div className="lg:col-span-8 space-y-6">
          {!selectedWs ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="text-center py-20">
                <Calculator className="h-16 w-16 mx-auto mb-4 text-emerald-200 dark:text-emerald-800" />
                <h3 className="text-lg font-semibold mb-2">
                  {t("carbon.select_workspace_prompt")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("carbon.select_workspace_desc")}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Cycle selector */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {t("carbon.select_cycle")}
                  </CardTitle>
                  <CardDescription>
                    {sectorLabel(selectedWs.sector)} — {selectedWs.userName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {cycles.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {t("carbon.no_cycles")}
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {cycles.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setSelectedCycle(c);
                            setResult(null);
                          }}
                          className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                            selectedCycle?.id === c.id
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 font-medium"
                              : "border-border hover:bg-muted/50"
                          }`}
                        >
                          {t("monitoring.cycle")} {c.cycleNumber}
                          <Badge variant="outline" className="ml-2 text-xs">
                            {c.status}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedCycle && (
                <>
                  {/* Activity data preview */}
                  {selectedCycle.activityData && (
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          {t("carbon.activity_data")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {Object.entries(
                            selectedCycle.activityData as Record<
                              string,
                              unknown
                            >,
                          ).map(([k, v]) => (
                            <div key={k} className="bg-muted/30 rounded-lg p-3">
                              <p className="text-xs text-muted-foreground">
                                {k.replace(/_/g, " ")}
                              </p>
                              <p className="text-sm font-medium">{String(v)}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Parameter overrides */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        {t("carbon.parameter_overrides")}
                      </CardTitle>
                      <CardDescription>
                        {t("carbon.overrides_desc")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {result?.appliedParameters &&
                          Object.entries(result.appliedParameters).map(
                            ([k, v]) => (
                              <div key={k}>
                                <Label className="text-xs">
                                  {k.replace(/_/g, " ")}
                                  <span className="text-muted-foreground ml-1">
                                    (default: {v})
                                  </span>
                                </Label>
                                <Input
                                  type="number"
                                  step="any"
                                  placeholder={String(v)}
                                  value={overrides[k] ?? ""}
                                  onChange={(e) =>
                                    setOverrides((o) => ({
                                      ...o,
                                      [k]: e.target.value,
                                    }))
                                  }
                                  className="mt-1 h-8 text-sm"
                                />
                              </div>
                            ),
                          )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Simulate + Finalize buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSimulate}
                      disabled={isSimulating}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {isSimulating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <Play className="h-4 w-4 mr-1" />
                      )}
                      {t("carbon.simulate_button")}
                    </Button>
                    {result && result.isValid && (
                      <Button
                        variant="outline"
                        onClick={() => setFinalizeDialogOpen(true)}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {t("carbon.finalize_button")}
                      </Button>
                    )}
                  </div>

                  {/* Result */}
                  {result && (
                    <Card
                      className={`border-0 shadow-sm ${
                        result.isValid
                          ? "ring-1 ring-emerald-300 dark:ring-emerald-700"
                          : "ring-1 ring-red-300 dark:ring-red-700"
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            {t("carbon.result_title")}
                          </CardTitle>
                          {result.isValid ? (
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {result.credits} {t("carbon.credits")}
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              {t("carbon.no_credits_badge")}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Summary row */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">
                              {t("carbon.baseline_emissions")}
                            </p>
                            <p className="text-lg font-bold text-red-600 dark:text-red-400">
                              {result.baselineEmissions_kgCO2e.toLocaleString(
                                undefined,
                                { maximumFractionDigits: 0 },
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              kgCO₂e
                            </p>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">
                              {t("carbon.project_emissions")}
                            </p>
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {result.projectEmissions_kgCO2e.toLocaleString(
                                undefined,
                                { maximumFractionDigits: 0 },
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              kgCO₂e
                            </p>
                          </div>
                          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">
                              {t("carbon.net_reduction")}
                            </p>
                            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                              {result.netReduction_kgCO2e.toLocaleString(
                                undefined,
                                { maximumFractionDigits: 0 },
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              kgCO₂e
                            </p>
                          </div>
                        </div>

                        {/* Breakdown table */}
                        <div>
                          <h4 className="font-medium text-sm mb-2">
                            {t("carbon.calculation_breakdown")}
                          </h4>
                          <div className="bg-muted/30 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b bg-muted/50">
                                  <th className="text-left p-2 font-medium">
                                    {t("carbon.step")}
                                  </th>
                                  <th className="text-right p-2 font-medium">
                                    {t("carbon.value")}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(
                                  result.calculationBreakdown,
                                ).map(([k, v]) => (
                                  <tr
                                    key={k}
                                    className="border-b last:border-b-0"
                                  >
                                    <td className="p-2 text-muted-foreground">
                                      {k.replace(/_/g, " ")}
                                    </td>
                                    <td className="p-2 text-right font-mono">
                                      {typeof v === "number"
                                        ? v.toLocaleString(undefined, {
                                            maximumFractionDigits: 4,
                                          })
                                        : v}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Warnings */}
                        {result.warnings.length > 0 && (
                          <div className="space-y-1">
                            <h4 className="font-medium text-sm flex items-center gap-1 text-amber-600">
                              <AlertTriangle className="h-4 w-4" />
                              {t("carbon.warnings")} ({result.warnings.length})
                            </h4>
                            {result.warnings.map((w, i) => (
                              <p
                                key={i}
                                className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded"
                              >
                                {w}
                              </p>
                            ))}
                          </div>
                        )}

                        {/* Invalid reason */}
                        {!result.isValid && result.invalidReason && (
                          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg text-sm text-red-700 dark:text-red-300">
                            <XCircle className="h-4 w-4 inline mr-1" />
                            {result.invalidReason}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Finalize Dialog ── */}
      <Dialog open={finalizeDialogOpen} onOpenChange={setFinalizeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("carbon.finalize_title")}</DialogTitle>
            <DialogDescription>
              {t("carbon.finalize_confirm")}
            </DialogDescription>
          </DialogHeader>
          {result && (
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-emerald-600">
                {result.credits}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("carbon.credits")}
              </p>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setFinalizeDialogOpen(false)}
            >
              {t("carbon.cancel")}
            </Button>
            <Button
              onClick={handleFinalize}
              disabled={isFinalizing}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isFinalizing && (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              )}
              <Save className="h-4 w-4 mr-1" />
              {t("carbon.finalize_button")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
