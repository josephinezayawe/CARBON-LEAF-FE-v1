"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  uploadGisFile,
  getGisLayer,
  validateGisLayer,
  updateGisLayer,
  GisLayer,
} from "@/app/api/gisLayer.api";
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  MapPin,
  Upload,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  ExternalLink,
  Loader2,
  Search,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useLanguage } from "@/components/global/language-provider";

interface Workspace {
  workspaceId: string;
  userName: string;
  sector: string;
  status: string;
}

const SECTOR_LABELS: Record<string, string> = {
  FARMER: "Agriculture / Agroforestry",
  HYBRID_CAR_OWNER: "Hybrid Vehicles",
  CLEAN_COOKING: "Clean Cooking",
  BUILDING_OWNER: "Green Buildings",
};

export default function GisLayersPage() {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");
  const [gisLayer, setGisLayer] = useState<GisLayer | null>(null);
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true);
  const [isLoadingLayer, setIsLoadingLayer] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");

  // Dialog states
  const [validateDialogOpen, setValidateDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);

  // Form states
  const [validateArea, setValidateArea] = useState<string>("");
  const [validateNotes, setValidateNotes] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      setIsLoadingWorkspaces(true);
      try {
        const response = await getAllSubmissions();
        const data = response.data || response;
        if (Array.isArray(data)) {
          setWorkspaces(
            data.map((s: Workspace) => ({
              workspaceId: s.workspaceId,
              userName: s.userName,
              sector: s.sector,
              status: s.status,
            })),
          );
        }
      } catch {
        toast.error("Failed to load workspaces");
      } finally {
        setIsLoadingWorkspaces(false);
      }
    };
    fetchWorkspaces();
  }, []);

  // Fetch GIS layer when workspace changes
  const fetchGisLayer = useCallback(async (wsId: string) => {
    if (!wsId) return;
    setIsLoadingLayer(true);
    try {
      const layer = await getGisLayer(wsId);
      setGisLayer(layer);
    } catch {
      setGisLayer(null);
    } finally {
      setIsLoadingLayer(false);
    }
  }, []);

  useEffect(() => {
    if (selectedWorkspaceId) {
      fetchGisLayer(selectedWorkspaceId);
    } else {
      setGisLayer(null);
    }
  }, [selectedWorkspaceId, fetchGisLayer]);

  // Filter workspaces
  const filteredWorkspaces = workspaces.filter((ws) => {
    const matchesSearch =
      ws.workspaceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = sectorFilter === "all" || ws.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  // Handlers
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedWorkspaceId) return;

    setIsUploading(true);
    try {
      const layer = await uploadGisFile(selectedWorkspaceId, file);
      setGisLayer(layer);
      toast.success(t("gis.upload_success"));
    } catch {
      toast.error(t("gis.upload_error"));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleValidate = async (isValid: boolean) => {
    if (!selectedWorkspaceId) return;
    const area = parseFloat(validateArea);
    if (isNaN(area) || area <= 0) {
      toast.error("Please enter a valid area");
      return;
    }

    setIsSubmitting(true);
    try {
      const layer = await validateGisLayer(selectedWorkspaceId, {
        areaSqKm: area,
        isValid,
        notes: validateNotes || undefined,
      });
      setGisLayer(layer);
      setValidateDialogOpen(false);
      setValidateArea("");
      setValidateNotes("");
      toast.success(t("gis.validate_success"));
    } catch {
      toast.error(t("gis.validate_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateNotes = async () => {
    if (!selectedWorkspaceId) return;
    setIsSubmitting(true);
    try {
      const layer = await updateGisLayer(selectedWorkspaceId, {
        notes: editNotes,
      });
      setGisLayer(layer);
      setNotesDialogOpen(false);
      toast.success(t("gis.notes_success"));
    } catch {
      toast.error(t("gis.notes_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openValidateDialog = () => {
    setValidateArea(gisLayer?.areaSqKm?.toString() || "");
    setValidateNotes(gisLayer?.notes || "");
    setValidateDialogOpen(true);
  };

  const openNotesDialog = () => {
    setEditNotes(gisLayer?.notes || "");
    setNotesDialogOpen(true);
  };

  // Validation status badge
  const renderValidationBadge = (layer: GisLayer) => {
    if (!layer.validatedAt) {
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
        >
          <Clock className="h-3 w-3 mr-1" />
          {t("gis.not_validated")}
        </Badge>
      );
    }
    if (layer.isValid) {
      return (
        <Badge
          variant="outline"
          className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
        >
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {t("gis.validated")}
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
      >
        <XCircle className="h-3 w-3 mr-1" />
        {t("gis.invalid")}
      </Badge>
    );
  };

  const selectedWorkspace = workspaces.find(
    (ws) => ws.workspaceId === selectedWorkspaceId,
  );

  return (
    <div className="space-y-6 w-full text-foreground bg-background">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <MapPin className="h-8 w-8 text-emerald-600" />
          {t("gis.page_title")}
        </h1>
        <p className="text-muted-foreground">{t("gis.page_description")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel — Workspace selector */}
        <Card className="border-0 shadow-sm bg-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">
              {t("gis.select_workspace")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("gis.search_workspaces")}
                className="pl-8 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sector filter */}
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {Object.entries(SECTOR_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Workspace list */}
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {isLoadingWorkspaces ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                </div>
              ) : filteredWorkspaces.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  {t("gis.no_workspaces")}
                </p>
              ) : (
                filteredWorkspaces.map((ws) => (
                  <button
                    key={ws.workspaceId}
                    onClick={() => setSelectedWorkspaceId(ws.workspaceId)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedWorkspaceId === ws.workspaceId
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="font-medium text-sm truncate">
                      {ws.userName}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                      <span className="truncate">
                        {ws.workspaceId.slice(0, 8)}...
                      </span>
                      <Badge variant="outline" className="text-[10px] ml-2">
                        {SECTOR_LABELS[ws.sector] || ws.sector}
                      </Badge>
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right panel — GIS Layer detail */}
        <Card className="border-0 shadow-sm bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t("gis.upload_title")}
            </CardTitle>
            {selectedWorkspace && (
              <CardDescription>
                {t("gis.workspace_label")}: {selectedWorkspace.userName} (
                {SECTOR_LABELS[selectedWorkspace.sector] ||
                  selectedWorkspace.sector}
                )
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {!selectedWorkspaceId ? (
              <div className="text-center py-16 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>{t("gis.select_workspace")}</p>
              </div>
            ) : isLoadingLayer ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <span className="ml-2 text-muted-foreground">
                  {t("gis.loading")}
                </span>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Upload section */}
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".geojson,.json,.kml,.zip"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="gis-file-upload"
                  />
                  <label
                    htmlFor="gis-file-upload"
                    className="cursor-pointer block"
                  >
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {gisLayer ? t("gis.reupload") : t("gis.drop_file")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("gis.accepted_formats")}
                    </p>
                    {gisLayer && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center justify-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {t("gis.reupload_warning")}
                      </p>
                    )}
                  </label>
                  {isUploading && (
                    <div className="mt-3 flex items-center justify-center gap-2 text-emerald-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">{t("gis.uploading")}</span>
                    </div>
                  )}
                </div>

                {/* Layer details */}
                {gisLayer ? (
                  <div className="space-y-4">
                    {/* File info */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {t("gis.file_info")}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            {t("gis.file_type")}:
                          </span>{" "}
                          <Badge variant="outline" className="ml-1">
                            {gisLayer.fileType.toUpperCase()}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {t("gis.area_sqkm")}:
                          </span>{" "}
                          <span className="font-medium">
                            {gisLayer.areaSqKm
                              ? `${gisLayer.areaSqKm.toLocaleString()} km²`
                              : t("gis.area_not_set")}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {t("gis.uploaded_at")}:
                          </span>{" "}
                          <span>
                            {new Date(gisLayer.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {t("gis.updated_at")}:
                          </span>{" "}
                          <span>
                            {new Date(gisLayer.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {gisLayer.fileUrl && (
                          <div className="sm:col-span-2">
                            <a
                              href={gisLayer.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:underline inline-flex items-center gap-1 text-sm"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {t("gis.view_file")}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Validation section */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          {t("gis.validation_status")}
                        </h4>
                        {renderValidationBadge(gisLayer)}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {gisLayer.validator && (
                          <div>
                            <span className="text-muted-foreground">
                              {t("gis.validated_by")}:
                            </span>{" "}
                            <span>
                              {gisLayer.validator.firstName}{" "}
                              {gisLayer.validator.lastName}
                            </span>
                          </div>
                        )}
                        {gisLayer.validatedAt && (
                          <div>
                            <span className="text-muted-foreground">
                              {t("gis.validated_at")}:
                            </span>{" "}
                            <span>
                              {new Date(
                                gisLayer.validatedAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          onClick={openValidateDialog}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          {t("gis.validate_button")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => fetchGisLayer(selectedWorkspaceId)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Refresh
                        </Button>
                      </div>
                    </div>

                    {/* Notes section */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">
                          {t("gis.notes_title")}
                        </h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={openNotesDialog}
                        >
                          {t("gis.notes_update")}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {gisLayer.notes || "—"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <MapPin className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>{t("gis.no_layer")}</p>
                    <p className="text-xs mt-1">
                      {t("gis.upload_description")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─── Validate Dialog ──────────────────────────────────────────── */}
      <Dialog open={validateDialogOpen} onOpenChange={setValidateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("gis.validate_title")}</DialogTitle>
            <DialogDescription>
              {t("gis.validate_description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="area-input">{t("gis.area_input_label")}</Label>
              <Input
                id="area-input"
                type="number"
                step="0.01"
                min="0"
                placeholder={t("gis.area_input_placeholder")}
                value={validateArea}
                onChange={(e) => setValidateArea(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="validate-notes">
                {t("gis.validation_notes")}
              </Label>
              <Textarea
                id="validate-notes"
                placeholder={t("gis.notes_placeholder")}
                value={validateNotes}
                onChange={(e) => setValidateNotes(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="destructive"
              onClick={() => handleValidate(false)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <XCircle className="h-4 w-4 mr-1" />
              )}
              {t("gis.mark_invalid")}
            </Button>
            <Button
              onClick={() => handleValidate(true)}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-1" />
              )}
              {t("gis.mark_valid")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Notes Dialog ──────────────────────────────────────────── */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("gis.notes_update")}</DialogTitle>
          </DialogHeader>
          <div>
            <Textarea
              placeholder={t("gis.notes_placeholder")}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateNotes}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              )}
              {t("gis.notes_save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
