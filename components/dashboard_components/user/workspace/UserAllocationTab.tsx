"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lock, Plus, Trash2, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/components/global/language-provider";
import {
  getAllocationRule,
  createAllocationRule,
  updateAllocationRule,
  AllocationEntry,
  RevenueAllocationRule,
} from "@/app/api/revenueAllocation.api";
import { Workspace } from "@/app/api/workspace";

// Predefined colors for allocation bar segments
const ALLOCATION_COLORS = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-pink-500",
];

export default function UserAllocationTab() {
  const { t } = useLanguage();
  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [rule, setRule] = useState<RevenueAllocationRule | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editAllocations, setEditAllocations] = useState<AllocationEntry[]>([
    { holderLabel: "", percentage: 0 },
  ]);

  // Fetch workspace first, then allocation rule
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const wsResult = await Workspace.get();
        if (!wsResult.success) return;
        const workspaces = wsResult?.data?.data?.workspaces ?? [];
        if (workspaces.length > 0) {
          const wsId = workspaces[0].id;
          setWorkspaceId(wsId);
          const data = await getAllocationRule(wsId);
          setRule(data);
        }
      } catch (err) {
        console.error("Failed to load allocation data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalPercentage = editAllocations.reduce(
    (sum, a) => sum + (a.percentage || 0),
    0,
  );

  const openEditDialog = () => {
    if (rule) {
      setEditAllocations(
        rule.allocations.map((a) => ({
          holderLabel: a.holderLabel,
          holderUserId: a.holderUserId,
          percentage: a.percentage,
        })),
      );
    } else {
      setEditAllocations([{ holderLabel: "", percentage: 0 }]);
    }
    setDialogOpen(true);
  };

  const addRow = () => {
    if (editAllocations.length >= 10) {
      toast.error(t("allocation.max_allocations"));
      return;
    }
    setEditAllocations([
      ...editAllocations,
      { holderLabel: "", percentage: 0 },
    ]);
  };

  const removeRow = (index: number) => {
    if (editAllocations.length <= 1) return;
    setEditAllocations(editAllocations.filter((_, i) => i !== index));
  };

  const updateRow = (
    index: number,
    field: keyof AllocationEntry,
    value: string | number,
  ) => {
    const updated = [...editAllocations];
    if (field === "percentage") {
      updated[index] = { ...updated[index], percentage: Number(value) || 0 };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setEditAllocations(updated);
  };

  const handleSave = async () => {
    // Validate
    for (const alloc of editAllocations) {
      if (!alloc.holderLabel.trim()) {
        toast.error(t("allocation.label_required"));
        return;
      }
    }

    if (Math.abs(totalPercentage - 100) >= 0.01) {
      toast.error(t("allocation.must_sum_100"));
      return;
    }

    setSaving(true);
    try {
      if (rule) {
        const updated = await updateAllocationRule(
          workspaceId,
          editAllocations,
        );
        setRule(updated);
        toast.success(t("allocation.updated"));
      } else {
        const created = await createAllocationRule(
          workspaceId,
          editAllocations,
        );
        setRule(created);
        toast.success(t("allocation.created"));
      }
      setDialogOpen(false);
    } catch (err: any) {
      // TASK-12: Show specific revenue allocation error message
      const message =
        err?.response?.data?.message ||
        (err instanceof Error ? err.message : null) ||
        t("allocation.save_error");
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspaceId) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            {t("allocation.select_workspace")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Locked Banner */}
      {rule?.locked && (
        <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {t("allocation.locked_message")}
          </p>
        </div>
      )}

      {!rule ? (
        /* No allocation rule yet */
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Edit className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {t("allocation.no_rule_title")}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t("allocation.no_rule_desc")}
              </p>
            </div>
            <Button onClick={openEditDialog} className="gap-2">
              <Plus className="w-4 h-4" />
              {t("allocation.create_rule")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Existing allocation rule */
        <div className="space-y-6">
          {/* Visual Allocation Bar */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    {t("allocation.distribution")}
                  </CardTitle>
                  <CardDescription>
                    {t("allocation.distribution_desc")}
                  </CardDescription>
                </div>
                {!rule.locked && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openEditDialog}
                    className="gap-2"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    {t("allocation.edit")}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Horizontal bar */}
              <div className="flex h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                {rule.allocations.map((alloc, idx) => (
                  <div
                    key={idx}
                    className={`${ALLOCATION_COLORS[idx % ALLOCATION_COLORS.length]} flex items-center justify-center text-white text-xs font-medium transition-all`}
                    style={{ width: `${alloc.percentage}%` }}
                    title={`${alloc.holderLabel}: ${alloc.percentage}%`}
                  >
                    {alloc.percentage >= 8 && `${alloc.percentage}%`}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3">
                {rule.allocations.map((alloc, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div
                      className={`w-3 h-3 rounded-sm ${ALLOCATION_COLORS[idx % ALLOCATION_COLORS.length]}`}
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {alloc.holderLabel}
                    </span>
                    <span className="text-muted-foreground">
                      ({alloc.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Allocation Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {t("allocation.details")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("allocation.holder_label")}</TableHead>
                    <TableHead>{t("allocation.user")}</TableHead>
                    <TableHead className="text-right">
                      {t("allocation.percentage")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rule.allocations.map((alloc, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2.5 h-2.5 rounded-sm ${ALLOCATION_COLORS[idx % ALLOCATION_COLORS.length]}`}
                          />
                          {alloc.holderLabel}
                        </div>
                      </TableCell>
                      <TableCell>
                        {alloc.holderUserId ? (
                          <Badge variant="outline" className="text-xs">
                            {alloc.holderUserId.slice(0, 8)}...
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            {t("allocation.external")}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {alloc.percentage}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit / Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {rule ? t("allocation.edit_title") : t("allocation.create_title")}
            </DialogTitle>
            <DialogDescription>{t("allocation.dialog_desc")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {editAllocations.map((alloc, idx) => (
              <div
                key={idx}
                className="flex items-end gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">
                    {t("allocation.holder_label")}
                  </Label>
                  <Input
                    placeholder={t("allocation.holder_placeholder")}
                    value={alloc.holderLabel}
                    onChange={(e) =>
                      updateRow(idx, "holderLabel", e.target.value)
                    }
                    className="h-9"
                  />
                </div>
                <div className="w-24 space-y-1">
                  <Label className="text-xs">%</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    value={alloc.percentage || ""}
                    onChange={(e) =>
                      updateRow(idx, "percentage", e.target.value)
                    }
                    className="h-9"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => removeRow(idx)}
                  disabled={editAllocations.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Running total */}
          <div className="flex items-center justify-between pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addRow}
              className="gap-1"
              disabled={editAllocations.length >= 10}
            >
              <Plus className="w-3.5 h-3.5" />
              {t("allocation.add_row")}
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {t("allocation.total")}:
              </span>
              <Badge
                variant={
                  Math.abs(totalPercentage - 100) < 0.01
                    ? "default"
                    : "destructive"
                }
                className={
                  Math.abs(totalPercentage - 100) < 0.01 ? "bg-emerald-500" : ""
                }
              >
                {totalPercentage.toFixed(2)}%
              </Badge>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              {t("allocation.cancel")}
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || Math.abs(totalPercentage - 100) >= 0.01}
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {t("allocation.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
