"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Workspace } from "@/app/api/workspace";
import {
  getDeployedMethodologies,
  Methodology,
} from "@/app/api/methodology.api";
import { getBaseline, Baseline } from "@/app/api/baseline.api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  BookOpen,
  Loader2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Tag,
  Layers,
  FileText,
} from "lucide-react";
import { useLanguage } from "@/components/global/language-provider";

interface WorkspaceInfo {
  id: string;
  sector: string;
  methodologyId: string | null;
  methodology: {
    id: string;
    name: string;
    code: string;
    version: string;
    sector: string;
    status: string;
    parameters: Record<string, unknown> | null;
  } | null;
}

export default function UserMethodologyTab() {
  const { t } = useLanguage();

  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [baseline, setBaseline] = useState<Baseline | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFrozen, setIsFrozen] = useState(false);

  // Select methodology
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);
  const [deployedMethodologies, setDeployedMethodologies] = useState<
    Methodology[]
  >([]);
  const [selectedMethodologyId, setSelectedMethodologyId] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [isLoadingMethodologies, setIsLoadingMethodologies] = useState(false);

  // Load workspace data
  const loadWorkspace = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await Workspace.get();
      if (!result.success) {
        toast.error(result.message as string);
        return;
      }

      const workspaces = result?.data?.data?.workspaces ?? [];
      if (workspaces.length > 0) {
        const ws = workspaces[0];
        setWorkspace({
          id: ws.id,
          sector: ws.sector,
          methodologyId: ws.methodologyId ?? null,
          methodology: ws.methodology ?? null,
        });

        // Load baseline status
        try {
          const baselineData = await getBaseline(ws.id);
          if (baselineData) {
            setBaseline(baselineData);
            setIsFrozen(baselineData.status === "FROZEN");
          }
        } catch {
          // No baseline yet — that's fine
        }
      }
    } catch (error) {
      console.error("Error loading workspace:", error);
      toast.error(t("methodology_tab.load_error"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  // Load deployed methodologies when dialog opens
  const handleOpenSelectDialog = async () => {
    if (!workspace) return;

    setIsLoadingMethodologies(true);
    setSelectDialogOpen(true);

    try {
      const res = await getDeployedMethodologies(workspace.sector);
      if (res.success) {
        setDeployedMethodologies(res.data);
      } else {
        toast.error(t("methodology_tab.load_methodologies_error"));
      }
    } catch {
      toast.error(t("methodology_tab.load_methodologies_error"));
    } finally {
      setIsLoadingMethodologies(false);
    }
  };

  // Link methodology to workspace
  const handleLinkMethodology = async () => {
    if (!workspace || !selectedMethodologyId) return;

    setIsLinking(true);
    try {
      const res = await Workspace.linkMethodology(
        workspace.id,
        selectedMethodologyId,
      );
      if (res.success) {
        toast.success(t("methodology_tab.link_success"));
        setSelectDialogOpen(false);
        setSelectedMethodologyId("");
        await loadWorkspace();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error(t("methodology_tab.link_error"));
    } finally {
      setIsLinking(false);
    }
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      UNDER_REVIEW:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
      APPROVED:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
      DEPLOYED:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
      DEPRECATED:
        "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
    };
    return colors[status] ?? colors.DRAFT;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        <span className="ml-2 text-sm text-muted-foreground">
          {t("methodology_tab.loading")}
        </span>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">
          {t("methodology_tab.no_workspace")}
        </p>
      </div>
    );
  }

  // ─── No methodology linked ────────────────────────────────────────────────
  if (!workspace.methodology) {
    return (
      <div className="space-y-6">
        <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t("methodology_tab.no_methodology")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
              {t("methodology_tab.no_methodology_description")}
            </p>

            {isFrozen ? (
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {t("methodology_tab.frozen_cannot_link")}
                </span>
              </div>
            ) : (
              <Button
                onClick={handleOpenSelectDialog}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {t("methodology_tab.select_methodology")}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Select Methodology Dialog */}
        <Dialog open={selectDialogOpen} onOpenChange={setSelectDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {t("methodology_tab.select_methodology")}
              </DialogTitle>
              <DialogDescription>
                {t("methodology_tab.select_description")}
              </DialogDescription>
            </DialogHeader>

            {isLoadingMethodologies ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                <span className="ml-2 text-sm text-muted-foreground">
                  {t("methodology_tab.loading_methodologies")}
                </span>
              </div>
            ) : deployedMethodologies.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  {t("methodology_tab.no_deployed")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Select
                  value={selectedMethodologyId}
                  onValueChange={setSelectedMethodologyId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t("methodology_tab.choose_methodology")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {deployedMethodologies.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {m.name} ({m.code})
                          </span>
                          <span className="text-xs text-muted-foreground">
                            v{m.version}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Preview selected methodology */}
                {selectedMethodologyId &&
                  (() => {
                    const selected = deployedMethodologies.find(
                      (m) => m.id === selectedMethodologyId,
                    );
                    if (!selected) return null;
                    return (
                      <Card className="bg-gray-50 dark:bg-gray-800/50">
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {selected.name}
                            </span>
                            <Badge className={getStatusBadge(selected.status)}>
                              {selected.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <div>
                              {t("methodology_tab.code")}: {selected.code}
                            </div>
                            <div>
                              {t("methodology_tab.version")}: v
                              {selected.version}
                            </div>
                          </div>
                          {selected.description && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {selected.description}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })()}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectDialogOpen(false)}
              >
                {t("methodology_tab.cancel")}
              </Button>
              <Button
                onClick={handleLinkMethodology}
                disabled={!selectedMethodologyId || isLinking}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isLinking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t("methodology_tab.link")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ─── Methodology is linked — show read-only details ───────────────────────
  const methodology = workspace.methodology;
  const parameters = methodology.parameters as Record<string, unknown> | null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {t("methodology_tab.linked_methodology")}
                </CardTitle>
                <CardDescription>
                  {t("methodology_tab.linked_description")}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusBadge(methodology.status)}>
                {methodology.status}
              </Badge>
              {isFrozen ? (
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">
                    {t("methodology_tab.frozen_locked")}
                  </span>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleOpenSelectDialog}
                >
                  {t("methodology_tab.change")}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("methodology_tab.name")}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {methodology.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <Code2 className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("methodology_tab.code")}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {methodology.code}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <Layers className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("methodology_tab.sector")}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {methodology.sector}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <Tag className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("methodology_tab.version")}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  v{methodology.version}
                </p>
              </div>
            </div>
          </div>

          {/* Parameters Table */}
          {parameters && Object.keys(parameters).length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {t("methodology_tab.parameters")}
              </h4>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                      <TableHead className="text-xs font-medium">
                        {t("methodology_tab.parameter_key")}
                      </TableHead>
                      <TableHead className="text-xs font-medium">
                        {t("methodology_tab.parameter_value")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(parameters).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="text-sm font-mono text-gray-700 dark:text-gray-300">
                          {key}
                        </TableCell>
                        <TableCell className="text-sm text-gray-900 dark:text-gray-100">
                          {String(value)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Linked success indicator */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm text-emerald-700 dark:text-emerald-300">
              {t("methodology_tab.linked_active")}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Select Methodology Dialog (for changing) */}
      <Dialog open={selectDialogOpen} onOpenChange={setSelectDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("methodology_tab.change_methodology")}</DialogTitle>
            <DialogDescription>
              {t("methodology_tab.change_description")}
            </DialogDescription>
          </DialogHeader>

          {isLoadingMethodologies ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
              <span className="ml-2 text-sm text-muted-foreground">
                {t("methodology_tab.loading_methodologies")}
              </span>
            </div>
          ) : deployedMethodologies.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                {t("methodology_tab.no_deployed")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Select
                value={selectedMethodologyId}
                onValueChange={setSelectedMethodologyId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("methodology_tab.choose_methodology")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {deployedMethodologies.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {m.name} ({m.code})
                        </span>
                        <span className="text-xs text-muted-foreground">
                          v{m.version}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Preview */}
              {selectedMethodologyId &&
                (() => {
                  const selected = deployedMethodologies.find(
                    (m) => m.id === selectedMethodologyId,
                  );
                  if (!selected) return null;
                  return (
                    <Card className="bg-gray-50 dark:bg-gray-800/50">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {selected.name}
                          </span>
                          <Badge className={getStatusBadge(selected.status)}>
                            {selected.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <div>
                            {t("methodology_tab.code")}: {selected.code}
                          </div>
                          <div>
                            {t("methodology_tab.version")}: v{selected.version}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectDialogOpen(false)}
            >
              {t("methodology_tab.cancel")}
            </Button>
            <Button
              onClick={handleLinkMethodology}
              disabled={!selectedMethodologyId || isLinking}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isLinking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("methodology_tab.link")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
