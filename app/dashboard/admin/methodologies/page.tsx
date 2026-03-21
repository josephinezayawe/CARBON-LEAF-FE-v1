"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  getMethodologies,
  getMethodologyById,
  createMethodology,
  updateMethodology,
  submitMethodology,
  approveMethodology,
  deployMethodology,
  deprecateMethodology,
  createEmissionFactor,
  updateEmissionFactor,
  deleteEmissionFactor,
  uploadMethodologyDocument,
  type Methodology,
  type MethodologyStatus,
  type EmissionFactor,
  type MethodologyFilters,
  type CreateMethodologyData,
  type CreateEmissionFactorData,
} from "@/app/api/methodology.api";
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
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Loader2,
  Plus,
  ChevronDown,
  ChevronRight,
  FlaskConical,
  Pencil,
  Trash2,
  Upload,
  FileText,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/components/global/language-provider";

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<MethodologyStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
  UNDER_REVIEW: "bg-amber-100 text-amber-700 border-amber-200",
  APPROVED: "bg-blue-100 text-blue-700 border-blue-200",
  DEPLOYED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  DEPRECATED: "bg-red-100 text-red-700 border-red-200",
};

function StatusBadge({
  status,
  t,
}: {
  status: MethodologyStatus;
  t: (key: string) => string;
}) {
  const labelKey = `methodology.status_${status.toLowerCase()}` as const;
  return (
    <Badge variant="outline" className={STATUS_COLORS[status]}>
      {t(labelKey)}
    </Badge>
  );
}

// ─── Sector Label ─────────────────────────────────────────────────────────────

const SECTOR_LABELS: Record<string, string> = {
  FARMER: "Agroforestry",
  HYBRID_CAR_OWNER: "Hybrid Vehicles",
  ECO_FRIENDLY_STOVES: "Clean Cookstoves",
  COMMERCIAL_BUILDING: "Commercial Buildings",
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MethodologiesPage() {
  const { t } = useLanguage();
  const [methodologies, setMethodologies] = useState<Methodology[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");

  // Expanded row for detail view
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedData, setExpandedData] = useState<Methodology | null>(null);
  const [expandedLoading, setExpandedLoading] = useState(false);

  // Create/Edit dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [editingMethodology, setEditingMethodology] =
    useState<Methodology | null>(null);
  const [createStep, setCreateStep] = useState(0);
  const [formData, setFormData] = useState<CreateMethodologyData>({
    name: "",
    code: "",
    version: "1.0",
    sector: "",
    description: "",
    parameters: {},
  });
  const [paramEntries, setParamEntries] = useState<
    { key: string; value: string }[]
  >([]);
  const [submitting, setSubmitting] = useState(false);

  // Emission Factor dialog
  const [efDialogOpen, setEfDialogOpen] = useState(false);
  const [editingEf, setEditingEf] = useState<EmissionFactor | null>(null);
  const [efForm, setEfForm] = useState<CreateEmissionFactorData>({
    name: "",
    key: "",
    value: 0,
    unit: "",
    year: new Date().getFullYear(),
    source: "",
  });

  // Confirm dialog
  const [confirmAction, setConfirmAction] = useState<{
    action: string;
    methodologyId: string;
    message: string;
  } | null>(null);

  // ─── Fetch ────────────────────────────────────────────────────────────────

  const fetchMethodologies = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const filters: MethodologyFilters = { page, limit: 10 };
        if (statusFilter !== "all")
          filters.status = statusFilter as MethodologyStatus;
        if (sectorFilter !== "all") filters.sector = sectorFilter;

        const result = await getMethodologies(filters);
        setMethodologies(result.data);
        setPagination(result.pagination);
      } catch {
        toast.error("Failed to load methodologies");
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, sectorFilter],
  );

  useEffect(() => {
    fetchMethodologies(1);
  }, [fetchMethodologies]);

  // ─── Row expand ───────────────────────────────────────────────────────────

  const toggleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedData(null);
      return;
    }
    setExpandedId(id);
    setExpandedLoading(true);
    try {
      const result = await getMethodologyById(id);
      setExpandedData(result.data);
    } catch {
      toast.error("Failed to load methodology details");
    } finally {
      setExpandedLoading(false);
    }
  };

  // ─── Create/Edit ──────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingMethodology(null);
    setFormData({
      name: "",
      code: "",
      version: "1.0",
      sector: "",
      description: "",
      parameters: {},
    });
    setParamEntries([]);
    setCreateStep(0);
    setCreateOpen(true);
  };

  const openEdit = (m: Methodology) => {
    setEditingMethodology(m);
    setFormData({
      name: m.name,
      code: m.code,
      version: m.version,
      sector: m.sector,
      description: m.description || "",
      parameters: (m.parameters as Record<string, unknown>) || {},
    });
    const params = (m.parameters as Record<string, unknown>) || {};
    setParamEntries(
      Object.entries(params).map(([key, value]) => ({
        key,
        value: String(value),
      })),
    );
    setCreateStep(0);
    setCreateOpen(true);
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      // Build parameters from entries
      const parameters: Record<string, unknown> = {};
      paramEntries.forEach((e) => {
        if (e.key.trim()) {
          const num = Number(e.value);
          parameters[e.key.trim()] = isNaN(num) ? e.value : num;
        }
      });

      const payload = { ...formData, parameters };

      if (editingMethodology) {
        await updateMethodology(editingMethodology.id, payload);
        toast.success(t("methodology.update_success"));
      } else {
        await createMethodology(payload);
        toast.success(t("methodology.create_success"));
      }
      setCreateOpen(false);
      fetchMethodologies(pagination.page);
    } catch (error) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Operation failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Status actions ───────────────────────────────────────────────────────

  const handleStatusAction = async (action: string, id: string) => {
    try {
      switch (action) {
        case "submit":
          await submitMethodology(id);
          toast.success(t("methodology.submit_success"));
          break;
        case "approve":
          await approveMethodology(id);
          toast.success(t("methodology.approve_success"));
          break;
        case "deploy":
          await deployMethodology(id);
          toast.success(t("methodology.deploy_success"));
          break;
        case "deprecate":
          await deprecateMethodology(id);
          toast.success(t("methodology.deprecate_success"));
          break;
      }
      setConfirmAction(null);
      fetchMethodologies(pagination.page);
      if (expandedId === id) {
        const result = await getMethodologyById(id);
        setExpandedData(result.data);
      }
    } catch (error) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Action failed";
      toast.error(msg);
    }
  };

  // ─── Document upload ──────────────────────────────────────────────────────

  const handleDocUpload = async (id: string, file: File) => {
    try {
      await uploadMethodologyDocument(id, file);
      toast.success(t("methodology.upload_doc_success"));
      if (expandedId === id) {
        const result = await getMethodologyById(id);
        setExpandedData(result.data);
      }
      fetchMethodologies(pagination.page);
    } catch {
      toast.error("Failed to upload document");
    }
  };

  // ─── Emission Factor CRUD ─────────────────────────────────────────────────

  const openAddEf = () => {
    setEditingEf(null);
    setEfForm({
      name: "",
      key: "",
      value: 0,
      unit: "",
      year: new Date().getFullYear(),
      source: "",
    });
    setEfDialogOpen(true);
  };

  const openEditEf = (ef: EmissionFactor) => {
    setEditingEf(ef);
    setEfForm({
      name: ef.name,
      key: ef.key,
      value: ef.value,
      unit: ef.unit,
      year: ef.year,
      source: ef.source || "",
    });
    setEfDialogOpen(true);
  };

  const handleSaveEf = async () => {
    if (!expandedData) return;
    setSubmitting(true);
    try {
      if (editingEf) {
        await updateEmissionFactor(editingEf.id, efForm);
        toast.success(t("methodology.update_ef_success"));
      } else {
        await createEmissionFactor(expandedData.id, efForm);
        toast.success(t("methodology.create_ef_success"));
      }
      setEfDialogOpen(false);
      const result = await getMethodologyById(expandedData.id);
      setExpandedData(result.data);
      fetchMethodologies(pagination.page);
    } catch (error) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Operation failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEf = async (efId: string) => {
    if (!expandedData) return;
    try {
      await deleteEmissionFactor(efId);
      toast.success(t("methodology.delete_ef_success"));
      const result = await getMethodologyById(expandedData.id);
      setExpandedData(result.data);
      fetchMethodologies(pagination.page);
    } catch (error) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Delete failed";
      toast.error(msg);
    }
  };

  // ─── Pagination ───────────────────────────────────────────────────────────

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchMethodologies(newPage);
  };

  // ─── Status action buttons per row ────────────────────────────────────────

  const getActionButtons = (m: Methodology) => {
    const buttons: { action: string; label: string; confirmMsg: string }[] = [];
    switch (m.status) {
      case "DRAFT":
        buttons.push({
          action: "submit",
          label: t("methodology.submit_for_review"),
          confirmMsg: t("methodology.confirm_submit"),
        });
        break;
      case "UNDER_REVIEW":
        buttons.push({
          action: "approve",
          label: t("methodology.approve"),
          confirmMsg: t("methodology.confirm_approve"),
        });
        break;
      case "APPROVED":
        buttons.push({
          action: "deploy",
          label: t("methodology.deploy"),
          confirmMsg: t("methodology.confirm_deploy"),
        });
        break;
      case "DEPLOYED":
        buttons.push({
          action: "deprecate",
          label: t("methodology.deprecate"),
          confirmMsg: t("methodology.confirm_deprecate"),
        });
        break;
    }
    return buttons;
  };

  const isEditable = (status: MethodologyStatus) =>
    status === "DRAFT" || status === "UNDER_REVIEW";

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <FlaskConical className="h-6 w-6 text-blue-600" />
              {t("methodology.title")}
            </CardTitle>
            <CardDescription>{t("methodology.subtitle")}</CardDescription>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("methodology.new_methodology")}
          </Button>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("methodology.filter_all_statuses")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("methodology.filter_all_statuses")}
                  </SelectItem>
                  <SelectItem value="DRAFT">
                    {t("methodology.status_draft")}
                  </SelectItem>
                  <SelectItem value="UNDER_REVIEW">
                    {t("methodology.status_under_review")}
                  </SelectItem>
                  <SelectItem value="APPROVED">
                    {t("methodology.status_approved")}
                  </SelectItem>
                  <SelectItem value="DEPLOYED">
                    {t("methodology.status_deployed")}
                  </SelectItem>
                  <SelectItem value="DEPRECATED">
                    {t("methodology.status_deprecated")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-56">
              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("methodology.filter_all_sectors")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("methodology.filter_all_sectors")}
                  </SelectItem>
                  {Object.entries(SECTOR_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                {t("methodology.loading")}
              </span>
            </div>
          ) : methodologies.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FlaskConical className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>{t("methodology.no_methodologies")}</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8" />
                      <TableHead>{t("methodology.name")}</TableHead>
                      <TableHead>{t("methodology.code")}</TableHead>
                      <TableHead>{t("methodology.sector")}</TableHead>
                      <TableHead>{t("methodology.version")}</TableHead>
                      <TableHead>{t("methodology.status")}</TableHead>
                      <TableHead>
                        {t("methodology.emission_factors_count")}
                      </TableHead>
                      <TableHead>{t("methodology.created")}</TableHead>
                      <TableHead>{t("methodology.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {methodologies.map((m) => (
                      <React.Fragment key={m.id}>
                        <TableRow
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => toggleExpand(m.id)}
                        >
                          <TableCell>
                            {expandedId === m.id ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {m.name}
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                              {m.code}
                            </code>
                          </TableCell>
                          <TableCell>
                            {SECTOR_LABELS[m.sector] || m.sector}
                          </TableCell>
                          <TableCell>{m.version}</TableCell>
                          <TableCell>
                            <StatusBadge status={m.status} t={t} />
                          </TableCell>
                          <TableCell>
                            {m._count?.emissionFactors ?? 0}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(m.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <div className="flex gap-1 flex-wrap">
                              {isEditable(m.status) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEdit(m)}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              {getActionButtons(m).map((btn) => (
                                <Button
                                  key={btn.action}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() =>
                                    setConfirmAction({
                                      action: btn.action,
                                      methodologyId: m.id,
                                      message: btn.confirmMsg,
                                    })
                                  }
                                >
                                  {btn.label}
                                </Button>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>

                        {/* Expanded detail row */}
                        {expandedId === m.id && (
                          <TableRow>
                            <TableCell colSpan={9} className="p-0">
                              <ExpandedMethodologyDetail
                                data={expandedData}
                                loading={expandedLoading}
                                t={t}
                                onAddEf={openAddEf}
                                onEditEf={openEditEf}
                                onDeleteEf={handleDeleteEf}
                                onDocUpload={(file) =>
                                  handleDocUpload(m.id, file)
                                }
                                isEditable={isEditable(m.status)}
                              />
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-4">
                {methodologies.map((m) => (
                  <Collapsible key={m.id}>
                    <Card>
                      <CollapsibleTrigger asChild>
                        <CardContent
                          className="p-4 cursor-pointer"
                          onClick={() => toggleExpand(m.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <p className="font-semibold">{m.name}</p>
                              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                {m.code}
                              </code>
                              <div className="flex gap-2 items-center mt-1">
                                <StatusBadge status={m.status} t={t} />
                                <span className="text-xs text-muted-foreground">
                                  {SECTOR_LABELS[m.sector] || m.sector}
                                </span>
                              </div>
                            </div>
                            {expandedId === m.id ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex gap-1 mt-3 flex-wrap">
                            {isEditable(m.status) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEdit(m);
                                }}
                              >
                                <Pencil className="h-3.5 w-3.5 mr-1" />
                                {t("methodology.edit_methodology")}
                              </Button>
                            )}
                            {getActionButtons(m).map((btn) => (
                              <Button
                                key={btn.action}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmAction({
                                    action: btn.action,
                                    methodologyId: m.id,
                                    message: btn.confirmMsg,
                                  });
                                }}
                              >
                                {btn.label}
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        {expandedId === m.id && (
                          <div className="border-t px-4 pb-4">
                            <ExpandedMethodologyDetail
                              data={expandedData}
                              loading={expandedLoading}
                              t={t}
                              onAddEf={openAddEf}
                              onEditEf={openEditEf}
                              onDeleteEf={handleDeleteEf}
                              onDocUpload={(file) =>
                                handleDocUpload(m.id, file)
                              }
                              isEditable={isEditable(m.status)}
                            />
                          </div>
                        )}
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    {t("methodology.status")}: {pagination.total}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={pagination.page === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="flex items-center px-3 text-sm text-muted-foreground">
                      {pagination.page} / {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.totalPages)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* ─── Create/Edit Dialog ───────────────────────────────────────────── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMethodology
                ? t("methodology.edit_methodology")
                : t("methodology.new_methodology")}
            </DialogTitle>
            <DialogDescription>
              {/* Step indicators */}
              <div className="flex gap-2 mt-2">
                {[
                  t("methodology.step_basic_info"),
                  t("methodology.step_parameters"),
                ].map((label, i) => (
                  <button
                    key={label}
                    onClick={() => setCreateStep(i)}
                    className={`text-xs px-3 py-1 rounded-full border transition ${
                      createStep === i
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </DialogDescription>
          </DialogHeader>

          {createStep === 0 && (
            <div className="space-y-4">
              <div>
                <Label>{t("methodology.name")}</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Rwanda Clean Cookstove Standard"
                />
              </div>
              <div>
                <Label>{t("methodology.code")}</Label>
                <Input
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="RW-STOVE-001"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t("methodology.code_hint")}
                </p>
              </div>
              <div>
                <Label>{t("methodology.version")}</Label>
                <Input
                  value={formData.version}
                  onChange={(e) =>
                    setFormData({ ...formData, version: e.target.value })
                  }
                  placeholder="1.0"
                />
              </div>
              <div>
                <Label>{t("methodology.sector")}</Label>
                <Select
                  value={formData.sector}
                  onValueChange={(v) => setFormData({ ...formData, sector: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("methodology.sector")} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SECTOR_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("methodology.description")}</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Carbon accounting methodology description..."
                />
              </div>
            </div>
          )}

          {createStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>{t("methodology.parameters")}</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setParamEntries([...paramEntries, { key: "", value: "" }])
                  }
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  {t("methodology.add_parameter")}
                </Button>
              </div>
              {paramEntries.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t("methodology.no_parameters")}
                </p>
              ) : (
                <div className="space-y-2">
                  {paramEntries.map((entry, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Input
                        value={entry.key}
                        onChange={(e) => {
                          const updated = [...paramEntries];
                          updated[i].key = e.target.value;
                          setParamEntries(updated);
                        }}
                        placeholder={t("methodology.param_key")}
                        className="flex-1"
                      />
                      <Input
                        value={entry.value}
                        onChange={(e) => {
                          const updated = [...paramEntries];
                          updated[i].value = e.target.value;
                          setParamEntries(updated);
                        }}
                        placeholder={t("methodology.param_value")}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setParamEntries(
                            paramEntries.filter((_, idx) => idx !== i),
                          )
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={submitting}
            >
              {t("general.cancel")}
            </Button>
            {createStep === 0 ? (
              <Button onClick={() => setCreateStep(1)}>
                {t("methodology.step_parameters")} →
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setCreateStep(0)}
                  disabled={submitting}
                >
                  ← {t("methodology.step_basic_info")}
                </Button>
                <Button onClick={handleSave} disabled={submitting}>
                  {submitting && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  {t("general.save")}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Emission Factor Dialog ───────────────────────────────────────── */}
      <Dialog open={efDialogOpen} onOpenChange={setEfDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingEf
                ? t("methodology.edit_emission_factor")
                : t("methodology.add_emission_factor")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t("methodology.ef_name")}</Label>
              <Input
                value={efForm.name}
                onChange={(e) => setEfForm({ ...efForm, name: e.target.value })}
                placeholder="Grid Emission Factor"
              />
            </div>
            <div>
              <Label>{t("methodology.ef_key")}</Label>
              <Input
                value={efForm.key}
                onChange={(e) => setEfForm({ ...efForm, key: e.target.value })}
                placeholder="grid_ef"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t("methodology.ef_key_hint")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t("methodology.ef_value")}</Label>
                <Input
                  type="number"
                  step="any"
                  value={efForm.value}
                  onChange={(e) =>
                    setEfForm({
                      ...efForm,
                      value: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label>{t("methodology.ef_unit")}</Label>
                <Input
                  value={efForm.unit}
                  onChange={(e) =>
                    setEfForm({ ...efForm, unit: e.target.value })
                  }
                  placeholder="kgCO2/kWh"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t("methodology.ef_year")}</Label>
                <Input
                  type="number"
                  value={efForm.year}
                  onChange={(e) =>
                    setEfForm({
                      ...efForm,
                      year:
                        parseInt(e.target.value) || new Date().getFullYear(),
                    })
                  }
                />
              </div>
              <div>
                <Label>{t("methodology.ef_source")}</Label>
                <Input
                  value={efForm.source}
                  onChange={(e) =>
                    setEfForm({ ...efForm, source: e.target.value })
                  }
                  placeholder="RURA 2023"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEfDialogOpen(false)}
              disabled={submitting}
            >
              {t("general.cancel")}
            </Button>
            <Button onClick={handleSaveEf} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {t("general.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Confirm Action Dialog ────────────────────────────────────────── */}
      <Dialog
        open={!!confirmAction}
        onOpenChange={() => setConfirmAction(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {confirmAction?.action === "submit"
                ? t("methodology.submit_for_review")
                : confirmAction?.action === "approve"
                  ? t("methodology.approve")
                  : confirmAction?.action === "deploy"
                    ? t("methodology.deploy")
                    : t("methodology.deprecate")}
            </DialogTitle>
            <DialogDescription>{confirmAction?.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              {t("general.cancel")}
            </Button>
            <Button
              onClick={() =>
                confirmAction &&
                handleStatusAction(
                  confirmAction.action,
                  confirmAction.methodologyId,
                )
              }
            >
              {confirmAction?.action === "deprecate"
                ? t("methodology.deprecate")
                : confirmAction?.action === "deploy"
                  ? t("methodology.deploy")
                  : confirmAction?.action === "approve"
                    ? t("methodology.approve")
                    : t("methodology.submit_for_review")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Expanded Detail Component ──────────────────────────────────────────────

function ExpandedMethodologyDetail({
  data,
  loading,
  t,
  onAddEf,
  onEditEf,
  onDeleteEf,
  onDocUpload,
  isEditable,
}: {
  data: Methodology | null;
  loading: boolean;
  t: (key: string) => string;
  onAddEf: () => void;
  onEditEf: (ef: EmissionFactor) => void;
  onDeleteEf: (id: string) => void;
  onDocUpload: (file: File) => void;
  isEditable: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  const params = (data.parameters as Record<string, unknown>) || {};
  const paramKeys = Object.keys(params);

  return (
    <div className="p-4 bg-muted/30 space-y-6">
      {/* Description */}
      {data.description && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
            {t("methodology.description")}
          </p>
          <p className="text-sm">{data.description}</p>
        </div>
      )}

      {/* Meta */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">
            {t("methodology.created_by")}
          </p>
          <p className="font-medium">
            {data.creator.firstName} {data.creator.lastName}
          </p>
        </div>
        {data.approver && (
          <div>
            <p className="text-xs text-muted-foreground">
              {t("methodology.approved_by")}
            </p>
            <p className="font-medium">
              {data.approver.firstName} {data.approver.lastName}
            </p>
          </div>
        )}
        {data.approvedAt && (
          <div>
            <p className="text-xs text-muted-foreground">
              {t("methodology.approved_at")}
            </p>
            <p className="font-medium">
              {new Date(data.approvedAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Document */}
      <div className="flex items-center gap-3">
        {data.documentUrl ? (
          <a
            href={data.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            <FileText className="h-4 w-4" />
            {t("methodology.view_document")}
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">
            {t("methodology.document")}: —
          </span>
        )}
        {isEditable && (
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="h-3.5 w-3.5 mr-1" />
                {t("methodology.upload_document")}
              </span>
            </Button>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onDocUpload(file);
              }}
            />
          </label>
        )}
      </div>

      {/* Parameters */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
          {t("methodology.parameters")}
        </p>
        {paramKeys.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("methodology.no_parameters")}
          </p>
        ) : (
          <div className="rounded border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">
                    {t("methodology.param_key")}
                  </TableHead>
                  <TableHead className="text-xs">
                    {t("methodology.param_value")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paramKeys.map((key) => (
                  <TableRow key={key}>
                    <TableCell className="font-mono text-xs">{key}</TableCell>
                    <TableCell className="text-xs">
                      {String(params[key])}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Emission Factors */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            {t("methodology.emission_factors")}
          </p>
          {isEditable && (
            <Button variant="outline" size="sm" onClick={onAddEf}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              {t("methodology.add_emission_factor")}
            </Button>
          )}
        </div>
        {!data.emissionFactors || data.emissionFactors.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("methodology.no_emission_factors")}
          </p>
        ) : (
          <div className="rounded border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">
                    {t("methodology.ef_name")}
                  </TableHead>
                  <TableHead className="text-xs">
                    {t("methodology.ef_key")}
                  </TableHead>
                  <TableHead className="text-xs">
                    {t("methodology.ef_value")}
                  </TableHead>
                  <TableHead className="text-xs">
                    {t("methodology.ef_unit")}
                  </TableHead>
                  <TableHead className="text-xs">
                    {t("methodology.ef_year")}
                  </TableHead>
                  <TableHead className="text-xs">
                    {t("methodology.ef_source")}
                  </TableHead>
                  {isEditable && (
                    <TableHead className="text-xs">
                      {t("methodology.actions")}
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.emissionFactors.map((ef) => (
                  <TableRow key={ef.id}>
                    <TableCell className="text-xs">{ef.name}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {ef.key}
                    </TableCell>
                    <TableCell className="text-xs">{ef.value}</TableCell>
                    <TableCell className="text-xs">{ef.unit}</TableCell>
                    <TableCell className="text-xs">{ef.year}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {ef.source || "—"}
                    </TableCell>
                    {isEditable && (
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditEf(ef)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => onDeleteEf(ef.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
