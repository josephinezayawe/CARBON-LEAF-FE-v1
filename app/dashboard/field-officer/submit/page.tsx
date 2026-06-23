"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Upload,
  Camera,
  Loader2,
  CheckCircle2,
  X,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  BarChart2,
  FileText,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  submitFieldData,
  getFieldDataByWorkspace,
  type FieldDataEntry,
} from "@/app/api/fieldData.api";
import { Workspace } from "@/app/api/workspace";
import type { AssignableWorkspace } from "@/lib/workspaceSchemas";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/global/language-provider";

// ─── Sector-Aware Dynamic Fields ────────────────────────────────

interface FieldDef {
  key: string;
  label: string;
  type: "integer" | "decimal" | "boolean";
  required: boolean;
  description?: string;
}

interface PerUnitFieldDef {
  key: string;
  label: string;
  type: "integer" | "decimal" | "text";
  required: boolean;
  placeholder?: string;
  visibleModes?: MonitoringMode[];
}

interface PerUnitSectorConfig {
  activeCountKey: string;
  unitLabel: string;
  maxUnits: number;
  recordKey: string;
  fields: PerUnitFieldDef[];
  derivedMeasurementKey?: string;
}

type PerUnitRecordInput = Record<string, string>;

type MonitoringMode = "START" | "END";

interface WorkspaceAsset {
  id: string;
  sector?: string;
  carplate?: string | null;
  carPlate?: string | null;
  carPlateNumber?: string | null;
  stoveSerialNumber?: string | null;
  stoveSerial?: string | null;
  name?: string | null;
}

const PER_UNIT_SECTOR_CONFIG: Record<string, PerUnitSectorConfig> = {
  HYBRID_CAR_OWNER: {
    activeCountKey: "vehicles_active",
    unitLabel: "Vehicle",
    maxUnits: 50,
    recordKey: "active_vehicle_records",
    derivedMeasurementKey: "avg_annual_km_driven",
    fields: [
      {
        key: "unit_identifier",
        label: "Vehicle Identifier (plate/asset ID)",
        type: "text",
        required: false,
        placeholder: "e.g., RAB123C",
      },
      {
        key: "odometer_start",
        label: "Odometer Start (km)",
        type: "integer",
        required: false,
        placeholder: "e.g., 10000",
        visibleModes: ["START"],
      },
      {
        key: "odometer_end",
        label: "Odometer End (km)",
        type: "integer",
        required: false,
        placeholder: "e.g., 12000",
        visibleModes: ["END"],
      },
    ],
  },
  ECO_FRIENDLY_STOVES: {
    activeCountKey: "stoves_active",
    unitLabel: "Stove",
    maxUnits: 50,
    recordKey: "active_stove_records",
    derivedMeasurementKey: "avg_daily_fuel_kg",
    fields: [
      {
        key: "unit_identifier",
        label: "Stove Identifier (serial/asset ID)",
        type: "text",
        required: false,
        placeholder: "e.g., STV-001",
      },
      {
        key: "daily_fuel_kg",
        label: "Daily Fuel Use (kg)",
        type: "decimal",
        required: true,
        placeholder: "e.g., 1.8",
      },
    ],
  },
};

const REDUNDANT_MEASUREMENT_KEYS_BY_SECTOR: Record<string, string[]> = {
  HYBRID_CAR_OWNER: [
    "odometer_reading_start",
    "odometer_reading_end",
    "avg_annual_km_driven",
  ],
  ECO_FRIENDLY_STOVES: ["avg_daily_fuel_kg"],
};

const SECTOR_FIELDS: Record<string, FieldDef[]> = {
  ECO_FRIENDLY_STOVES: [
    {
      key: "stoves_distributed",
      label: "Stoves Distributed",
      type: "integer",
      required: true,
      description:
        "Total number of improved cookstoves distributed this period",
    },
    {
      key: "stoves_active",
      label: "Stoves Confirmed Active",
      type: "integer",
      required: true,
      description:
        "Number of stoves confirmed still in active use during monitoring",
    },
    {
      key: "avg_daily_fuel_kg",
      label: "Avg Daily Fuel per Stove (kg)",
      type: "decimal",
      required: true,
      description: "Average daily fuel consumption per stove in kilograms",
    },
  ],
  FARMER: [
    {
      key: "land_area_ha",
      label: "Land Area (hectares)",
      type: "decimal",
      required: true,
      description: "Total land area covered by the project in hectares",
    },
    {
      key: "land_authority_document_photo_captured",
      label: "Land Authority Document Photo Captured",
      type: "boolean",
      required: true,
      description:
        "Confirm that one uploaded image clearly shows the official land authority document",
    },
    {
      key: "trees_planted",
      label: "Trees Planted This Period",
      type: "integer",
      required: true,
      description: "Number of trees planted during this monitoring period",
    },
    {
      key: "trees_surviving",
      label: "Trees Surviving (counted)",
      type: "integer",
      required: true,
      description: "Number of previously planted trees that survived",
    },
    {
      key: "avg_tree_height_m",
      label: "Avg Tree Height (metres)",
      type: "decimal",
      required: false,
      description: "Average height of surviving trees in metres",
    },
    {
      key: "avg_canopy_diameter_m",
      label: "Avg Canopy Diameter (metres)",
      type: "decimal",
      required: false,
      description: "Average canopy diameter of surviving trees in metres",
    },
  ],
  HYBRID_CAR_OWNER: [
    {
      key: "vehicles_registered",
      label: "Vehicles Registered",
      type: "integer",
      required: true,
      description: "Total number of hybrid/electric vehicles registered",
    },
    {
      key: "vehicles_active",
      label: "Vehicles Active/Operational",
      type: "integer",
      required: true,
      description: "Number of vehicles actively operational",
    },
    {
      key: "odometer_reading_start",
      label: "Odometer Start (km)",
      type: "integer",
      required: false,
      description: "Odometer reading at start of monitoring period",
    },
    {
      key: "odometer_reading_end",
      label: "Odometer End (km)",
      type: "integer",
      required: false,
      description: "Odometer reading at end of monitoring period",
    },
    {
      key: "avg_annual_km_driven",
      label: "Avg Annual km Driven",
      type: "decimal",
      required: false,
      description: "Average annual kilometers driven per vehicle",
    },
  ],
  COMMERCIAL_BUILDING: [
    {
      key: "baseline_monthly_kwh",
      label: "Baseline Monthly kWh",
      type: "decimal",
      required: true,
      description: "Monthly energy consumption before efficiency measures",
    },
    {
      key: "project_monthly_kwh",
      label: "Current Monthly kWh",
      type: "decimal",
      required: true,
      description: "Current monthly energy consumption after measures",
    },
    {
      key: "building_floor_area_sqm",
      label: "Building Floor Area (m²)",
      type: "decimal",
      required: false,
      description: "Total floor area of the building in square metres",
    },
    {
      key: "solar_capacity_kw",
      label: "Solar Capacity (kW)",
      type: "decimal",
      required: false,
      description: "Installed solar panel capacity in kilowatts",
    },
    {
      key: "solar_monthly_generation_kwh",
      label: "Solar Monthly Generation kWh",
      type: "decimal",
      required: false,
      description: "Monthly electricity generated by solar panels",
    },
    {
      key: "energy_audit_done",
      label: "Energy Audit Completed?",
      type: "boolean",
      required: false,
      description: "Whether a professional energy audit has been completed",
    },
  ],
};

const SECTOR_OPTIONS = [
  { value: "FARMER", label: "Farmer / Agroforestry" },
  { value: "HYBRID_CAR_OWNER", label: "Hybrid / Electric Vehicle" },
  { value: "ECO_FRIENDLY_STOVES", label: "Eco-Friendly Stoves" },
  { value: "COMMERCIAL_BUILDING", label: "Commercial Building" },
];

// ─── Step config ─────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Workspace", icon: Briefcase },
  { id: 2, label: "Location", icon: MapPin },
  { id: 3, label: "Photos", icon: Camera },
  { id: 4, label: "Measurements", icon: BarChart2 },
  { id: 5, label: "Notes", icon: FileText },
  { id: 6, label: "Review", icon: Send },
];

export default function SubmitFieldDataPage() {
  const router = useRouter();
  const { t } = useLanguage();

  // wizard
  const [currentStep, setCurrentStep] = useState(1);

  // form data
  const [sector, setSector] = useState("");
  const [workspaceId, setWorkspaceId] = useState("");
  const [assignableWorkspaces, setAssignableWorkspaces] = useState<
    AssignableWorkspace[]
  >([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);
  const [gpsLat, setGpsLat] = useState("");
  const [gpsLng, setGpsLng] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(false);
  const [notes, setNotes] = useState("");
  const [measurements, setMeasurements] = useState<
    Record<string, string | boolean>
  >({});
  const [perUnitRecords, setPerUnitRecords] = useState<PerUnitRecordInput[]>(
    [],
  );
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [landAuthorityDocuments, setLandAuthorityDocuments] = useState<File[]>(
    [],
  );
  const [landAuthorityDocumentPreviews, setLandAuthorityDocumentPreviews] =
    useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [monitoringMode, setMonitoringMode] = useState<MonitoringMode>("START");
  const [workspaceAssets, setWorkspaceAssets] = useState<WorkspaceAsset[]>([]);
  const [workspaceFieldHistory, setWorkspaceFieldHistory] = useState<
    FieldDataEntry[]
  >([]);

  // load workspaces on mount
  useEffect(() => {
    (async () => {
      setLoadingWorkspaces(true);
      const result = await Workspace.getAssignable();
      if (!result.success) {
        toast.error(result.message || t("field_officer.submit_error"));
        setAssignableWorkspaces([]);
      } else {
        setAssignableWorkspaces(result.data);
      }
      setLoadingWorkspaces(false);
    })();
  }, [t]);

  const selectedWorkspace = useMemo(
    () => assignableWorkspaces.find((w) => w.id === workspaceId),
    [assignableWorkspaces, workspaceId],
  );

  const formatWorkspaceOption = useCallback(
    (workspace: AssignableWorkspace) => {
      if (workspace.label?.trim()) return workspace.label;

      const parts = [
        workspace.workspaceName,
        workspace.assetIdentifier ?? "No asset linked",
        workspace.sector,
        workspace.status,
      ].filter(Boolean);

      return parts.join(" - ");
    },
    [],
  );

  const getAssetIdentifier = useCallback(
    (asset: WorkspaceAsset, selectedSector: string): string => {
      if (selectedSector === "HYBRID_CAR_OWNER") {
        return (
          asset.carplate ??
          asset.carPlate ??
          asset.carPlateNumber ??
          asset.name ??
          asset.id
        );
      }
      if (selectedSector === "ECO_FRIENDLY_STOVES") {
        return (
          asset.stoveSerialNumber ?? asset.stoveSerial ?? asset.name ?? asset.id
        );
      }
      return asset.name ?? asset.id;
    },
    [],
  );

  // auto-fill sector from selected workspace
  useEffect(() => {
    if (selectedWorkspace?.sector) setSector(selectedWorkspace.sector);
  }, [selectedWorkspace]);

  useEffect(() => {
    if (sector !== "FARMER") {
      setLandAuthorityDocuments([]);
      setLandAuthorityDocumentPreviews([]);
    }
  }, [sector]);

  useEffect(() => {
    if (!workspaceId || !selectedWorkspace?.sector) {
      setWorkspaceAssets([]);
      setWorkspaceFieldHistory([]);
      return;
    }

    let active = true;

    (async () => {
      const [assetsResult, historyResult] = await Promise.allSettled([
        Workspace.getAssets(selectedWorkspace.sector),
        getFieldDataByWorkspace(workspaceId),
      ]);

      if (!active) return;

      if (assetsResult.status === "fulfilled" && assetsResult.value.success) {
        const allAssets = Array.isArray(assetsResult.value.data)
          ? (assetsResult.value.data as WorkspaceAsset[])
          : [];

        if (selectedWorkspace.assetId) {
          const prioritized = allAssets
            .filter((asset) => asset.id === selectedWorkspace.assetId)
            .concat(
              allAssets.filter(
                (asset) => asset.id !== selectedWorkspace.assetId,
              ),
            );
          setWorkspaceAssets(prioritized);
        } else {
          setWorkspaceAssets(allAssets);
        }
      } else {
        setWorkspaceAssets([]);
      }

      if (historyResult.status === "fulfilled") {
        setWorkspaceFieldHistory(historyResult.value);
      } else {
        setWorkspaceFieldHistory([]);
      }
    })();

    return () => {
      active = false;
    };
  }, [workspaceId, selectedWorkspace]);

  const sectorFields = useMemo(() => {
    return sector ? (SECTOR_FIELDS[sector] ?? []) : [];
  }, [sector]);
  const perUnitConfig = sector
    ? (PER_UNIT_SECTOR_CONFIG[sector] ?? null)
    : null;

  const assignableWorkspaceIdentifier = useMemo(() => {
    return (selectedWorkspace?.assetIdentifier ?? "").trim();
  }, [selectedWorkspace]);

  const availableUnitIdentifiers = useMemo(() => {
    if (!perUnitConfig || !sector) return [];

    const dbAssetIdentifiers = workspaceAssets
      .map((asset) => getAssetIdentifier(asset, sector))
      .map((value) => value.trim())
      .filter(
        (value, index, arr) => value.length > 0 && arr.indexOf(value) === index,
      );

    const merged = [...dbAssetIdentifiers];
    if (
      assignableWorkspaceIdentifier &&
      !merged.some(
        (identifier) =>
          identifier.toLowerCase() ===
          assignableWorkspaceIdentifier.toLowerCase(),
      )
    ) {
      merged.unshift(assignableWorkspaceIdentifier);
    }

    return merged;
  }, [
    perUnitConfig,
    sector,
    workspaceAssets,
    getAssetIdentifier,
    assignableWorkspaceIdentifier,
  ]);

  const hiddenMeasurementKeys = useMemo(
    () => new Set(REDUNDANT_MEASUREMENT_KEYS_BY_SECTOR[sector] ?? []),
    [sector],
  );
  const visibleSectorFields = useMemo(
    () => sectorFields.filter((field) => !hiddenMeasurementKeys.has(field.key)),
    [sectorFields, hiddenMeasurementKeys],
  );
  const visiblePerUnitFields = useMemo(() => {
    if (!perUnitConfig) return [];
    return perUnitConfig.fields.filter(
      (field) =>
        !field.visibleModes || field.visibleModes.includes(monitoringMode),
    );
  }, [perUnitConfig, monitoringMode]);
  const measurementPlaceholders: Record<string, string> = {
    vehicles_registered: "Enter total registered vehicles (e.g., 5)",
    vehicles_active: "Enter active/operational vehicles (e.g., 5)",
  };

  // hide "Measurements" step when sector has no fields
  const visibleSteps = useMemo(
    () => (sectorFields.length === 0 ? STEPS.filter((s) => s.id !== 4) : STEPS),
    [sectorFields.length],
  );
  const totalSteps = visibleSteps.length;
  const currentIndex = visibleSteps.findIndex((s) => s.id === currentStep);

  const activeUnitsCount = useMemo(() => {
    if (!perUnitConfig) return 0;
    const value = Number(measurements[perUnitConfig.activeCountKey]);
    if (!Number.isInteger(value) || value <= 0) return 0;
    return value;
  }, [perUnitConfig, measurements]);

  const renderedUnitsCount = useMemo(() => {
    if (!perUnitConfig) return 0;
    return Math.min(activeUnitsCount, perUnitConfig.maxUnits);
  }, [perUnitConfig, activeUnitsCount]);

  useEffect(() => {
    if (!perUnitConfig) {
      setPerUnitRecords([]);
      return;
    }

    setPerUnitRecords((prev) => {
      const next = Array.from({ length: renderedUnitsCount }, (_, index) => {
        const existing = prev[index];
        if (existing) return existing;
        const baseRecord = perUnitConfig.fields.reduce<PerUnitRecordInput>(
          (acc, field) => {
            acc[field.key] = "";
            return acc;
          },
          {},
        );
        const suggestedIdentifier = availableUnitIdentifiers[index];
        if (suggestedIdentifier && "unit_identifier" in baseRecord) {
          baseRecord.unit_identifier = suggestedIdentifier;
        }
        return baseRecord;
      });

      const patched = next.map((record, index) => {
        const suggestedIdentifier = availableUnitIdentifiers[index];
        if (!suggestedIdentifier) return record;
        if (record.unit_identifier === suggestedIdentifier) return record;
        return {
          ...record,
          unit_identifier: suggestedIdentifier,
        };
      });

      return patched;
    });
  }, [perUnitConfig, renderedUnitsCount, availableUnitIdentifiers]);

  const priorSubmissionStatsByIdentifier = useMemo(() => {
    const stats: Record<
      string,
      {
        starts: number;
        ends: number;
        latestStartRecord: Record<string, unknown> | null;
      }
    > = {};

    if (!perUnitConfig || workspaceFieldHistory.length === 0) return stats;

    const sortedHistory = [...workspaceFieldHistory].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    sortedHistory.forEach((entry) => {
      const measurementsMap =
        (entry.measurements as Record<string, unknown> | null) ?? {};
      const modeValue =
        typeof measurementsMap.monitoring_mode === "string"
          ? (measurementsMap.monitoring_mode as string).toUpperCase()
          : "START";
      const historyMode: MonitoringMode = modeValue === "END" ? "END" : "START";

      const recordsRaw = measurementsMap[perUnitConfig.recordKey];
      if (!Array.isArray(recordsRaw)) return;

      recordsRaw.forEach((rawRecord) => {
        const parsedRecord = rawRecord as Record<string, unknown>;
        const identifier = String(parsedRecord.unit_identifier ?? "")
          .trim()
          .toLowerCase();
        if (!identifier) return;

        const current = stats[identifier] ?? {
          starts: 0,
          ends: 0,
          latestStartRecord: null,
        };
        if (historyMode === "START") {
          current.starts += 1;
          current.latestStartRecord = parsedRecord;
        } else {
          current.ends += 1;
        }
        stats[identifier] = current;
      });
    });

    return stats;
  }, [perUnitConfig, workspaceFieldHistory]);

  const workspaceMonitoringStats = useMemo(() => {
    const stats = { starts: 0, ends: 0 };

    workspaceFieldHistory.forEach((entry) => {
      const measurementsMap =
        (entry.measurements as Record<string, unknown> | null) ?? {};
      const modeValue =
        typeof measurementsMap.monitoring_mode === "string"
          ? (measurementsMap.monitoring_mode as string).toUpperCase()
          : "START";
      if (modeValue === "END") stats.ends += 1;
      else stats.starts += 1;
    });

    return stats;
  }, [workspaceFieldHistory]);

  const latestWorkspaceStartMeasurements = useMemo(() => {
    const sortedStarts = [...workspaceFieldHistory]
      .filter((entry) => {
        const measurementsMap =
          (entry.measurements as Record<string, unknown> | null) ?? {};
        const modeValue =
          typeof measurementsMap.monitoring_mode === "string"
            ? (measurementsMap.monitoring_mode as string).toUpperCase()
            : "START";
        return modeValue === "START";
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    if (sortedStarts.length === 0) return null;
    return (
      (sortedStarts[0].measurements as Record<string, unknown> | null) ?? null
    );
  }, [workspaceFieldHistory]);

  const endModeFieldMismatches = useMemo(() => {
    if (monitoringMode !== "END" || !latestWorkspaceStartMeasurements) {
      return [] as Array<{
        key: string;
        label: string;
        previous: string;
        current: string;
      }>;
    }

    const mismatches: Array<{
      key: string;
      label: string;
      previous: string;
      current: string;
    }> = [];

    for (const field of visibleSectorFields) {
      const previousRaw = latestWorkspaceStartMeasurements[field.key];
      const currentRaw = measurements[field.key];

      if (
        previousRaw === undefined ||
        previousRaw === null ||
        previousRaw === "" ||
        currentRaw === undefined ||
        currentRaw === null ||
        currentRaw === ""
      ) {
        continue;
      }

      if (field.type === "boolean") {
        const previousBool =
          previousRaw === true || String(previousRaw).toLowerCase() === "true";
        const currentBool =
          currentRaw === true || String(currentRaw).toLowerCase() === "true";
        if (previousBool !== currentBool) {
          mismatches.push({
            key: field.key,
            label: field.label,
            previous: previousBool ? "Yes" : "No",
            current: currentBool ? "Yes" : "No",
          });
        }
        continue;
      }

      const previousNumber = Number(previousRaw);
      const currentNumber = Number(currentRaw);
      if (Number.isNaN(previousNumber) || Number.isNaN(currentNumber)) {
        continue;
      }

      if (previousNumber !== currentNumber) {
        mismatches.push({
          key: field.key,
          label: field.label,
          previous: String(previousRaw),
          current: String(currentRaw),
        });
      }
    }

    return mismatches;
  }, [
    monitoringMode,
    latestWorkspaceStartMeasurements,
    visibleSectorFields,
    measurements,
  ]);

  const allowedMonitoringModes = useMemo<MonitoringMode[]>(
    () => ["START", "END"],
    [],
  );

  const monitoringModeValidationError = useMemo(() => {
    if (monitoringMode === "END") {
      if (workspaceMonitoringStats.starts <= workspaceMonitoringStats.ends) {
        return "No pending START found for this workspace. Submit START first.";
      }
    }

    if (!perUnitConfig || renderedUnitsCount === 0) return null;

    for (let index = 0; index < renderedUnitsCount; index += 1) {
      const record = perUnitRecords[index] ?? {};
      const identifier = (record.unit_identifier ?? "").trim().toLowerCase();
      if (monitoringMode === "END" && !identifier) {
        return `${perUnitConfig.unitLabel} ${index + 1}: identifier is required for END to match existing START data.`;
      }
      if (!identifier) continue;

      const history = priorSubmissionStatsByIdentifier[identifier] ?? {
        starts: 0,
        ends: 0,
        latestStartRecord: null,
      };

      if (monitoringMode === "END" && history.starts <= history.ends) {
        return `${perUnitConfig.unitLabel} ${index + 1}: no START data exists for "${record.unit_identifier}". Submit START for this asset first.`;
      }
    }

    return null;
  }, [
    workspaceMonitoringStats,
    perUnitConfig,
    renderedUnitsCount,
    perUnitRecords,
    priorSubmissionStatsByIdentifier,
    monitoringMode,
    allowedMonitoringModes,
  ]);

  useEffect(() => {
    if (!sector) {
      setMonitoringMode("START");
      return;
    }
  }, [sector]);

  const handlePerUnitRecordChange = (
    index: number,
    key: string,
    value: string,
  ) => {
    if (key === "unit_identifier" && availableUnitIdentifiers.length > 0) {
      return;
    }

    setPerUnitRecords((prev) => {
      if (key === "unit_identifier") {
        const normalizedValue = value.trim().toLowerCase();
        if (normalizedValue !== "") {
          const isDuplicate = prev.some((record, recordIndex) => {
            if (recordIndex === index) return false;
            return (
              (record.unit_identifier ?? "").trim().toLowerCase() ===
              normalizedValue
            );
          });

          if (isDuplicate) {
            toast.error("Duplicate identifier is not allowed");
            return prev;
          }
        }
      }

      const next = [...prev];
      const current = next[index] ?? {};
      next[index] = {
        ...current,
        [key]: value,
      };
      return next;
    });
  };

  const derivedMeasurementValues = useMemo<Record<string, number>>(() => {
    if (!perUnitConfig?.derivedMeasurementKey || perUnitRecords.length === 0) {
      return {};
    }

    if (sector === "HYBRID_CAR_OWNER") {
      const deltas = perUnitRecords
        .map((record) => {
          const identifier = (record.unit_identifier ?? "")
            .trim()
            .toLowerCase();
          const history = identifier
            ? priorSubmissionStatsByIdentifier[identifier]
            : null;
          const historicalStart =
            history?.latestStartRecord?.odometer_start ?? undefined;
          const startValue = Number(
            record.odometer_start !== "" && record.odometer_start !== undefined
              ? record.odometer_start
              : historicalStart,
          );
          const endValue = Number(record.odometer_end);
          if (Number.isNaN(startValue) || Number.isNaN(endValue)) return null;
          return Math.max(0, endValue - startValue);
        })
        .filter((value): value is number => value !== null);

      if (deltas.length === 0) return {};
      const average =
        deltas.reduce((sum, value) => sum + value, 0) / deltas.length;
      return {
        [perUnitConfig.derivedMeasurementKey]: Number(average.toFixed(2)),
      };
    }

    if (sector === "ECO_FRIENDLY_STOVES") {
      const dailyFuelValues = perUnitRecords
        .map((record) => Number(record.daily_fuel_kg))
        .filter((value) => !Number.isNaN(value));

      if (dailyFuelValues.length === 0) return {};
      const average =
        dailyFuelValues.reduce((sum, value) => sum + value, 0) /
        dailyFuelValues.length;
      return {
        [perUnitConfig.derivedMeasurementKey]: Number(average.toFixed(3)),
      };
    }

    return {};
  }, [perUnitConfig, perUnitRecords, sector, priorSubmissionStatsByIdentifier]);

  const perUnitRecordsValidationError = useMemo(() => {
    if (!perUnitConfig || renderedUnitsCount === 0) return null;

    if (
      availableUnitIdentifiers.length > 0 &&
      renderedUnitsCount > availableUnitIdentifiers.length
    ) {
      return `Active ${perUnitConfig.unitLabel.toLowerCase()} count exceeds assets available in database`;
    }

    if (activeUnitsCount > perUnitConfig.maxUnits) {
      return `Maximum ${perUnitConfig.maxUnits} ${perUnitConfig.unitLabel.toLowerCase()} records are supported in one submission.`;
    }

    const seenIdentifiers = new Set<string>();

    for (let index = 0; index < renderedUnitsCount; index += 1) {
      const record = perUnitRecords[index] ?? {};
      const normalizedIdentifier = (record.unit_identifier ?? "")
        .trim()
        .toLowerCase();
      if (normalizedIdentifier !== "") {
        if (seenIdentifiers.has(normalizedIdentifier)) {
          return `${perUnitConfig.unitLabel} identifiers must be unique`;
        }
        seenIdentifiers.add(normalizedIdentifier);
      }

      for (const field of visiblePerUnitFields) {
        const rawValue = record[field.key] ?? "";
        if (field.required && rawValue.trim() === "") {
          return `${perUnitConfig.unitLabel} ${index + 1}: ${field.label} is required`;
        }
        if (rawValue.trim() === "" || field.type === "text") continue;

        const numericValue = Number(rawValue);
        if (Number.isNaN(numericValue) || numericValue < 0) {
          return `${perUnitConfig.unitLabel} ${index + 1}: ${field.label} must be zero or greater`;
        }
        if (field.type === "integer" && !Number.isInteger(numericValue)) {
          return `${perUnitConfig.unitLabel} ${index + 1}: ${field.label} must be a whole number`;
        }
      }
    }

    return null;
  }, [
    perUnitConfig,
    renderedUnitsCount,
    activeUnitsCount,
    perUnitRecords,
    availableUnitIdentifiers,
    visiblePerUnitFields,
  ]);

  const goNext = () => {
    const next = visibleSteps[currentIndex + 1];
    if (next) setCurrentStep(next.id);
  };
  const goPrev = () => {
    const prev = visibleSteps[currentIndex - 1];
    if (prev) setCurrentStep(prev.id);
  };

  // per-step Next button enabled rule
  const canGoNext = useMemo(() => {
    if (currentStep === 1) return !!workspaceId;
    if (currentStep === 2) return !!gpsLat && !!gpsLng;
    if (currentStep === 3) {
      if (images.length === 0) return false;
      if (sector === "FARMER" && landAuthorityDocuments.length === 0) {
        return false;
      }
      return true;
    }
    if (currentStep === 4) {
      const requiredFieldsAreValid = sectorFields
        .filter((f) => f.required && f.type !== "boolean")
        .every((f) => {
          if (hiddenMeasurementKeys.has(f.key)) {
            if (perUnitConfig?.derivedMeasurementKey === f.key) {
              return derivedMeasurementValues[f.key] !== undefined;
            }
            return true;
          }

          const value = measurements[f.key];
          if (value === undefined || value === "") return false;
          const numericValue = Number(value);
          if (Number.isNaN(numericValue) || numericValue < 0) return false;
          if (f.type === "integer" && !Number.isInteger(numericValue)) {
            return false;
          }
          return true;
        });

      if (!requiredFieldsAreValid) return false;
      if (perUnitRecordsValidationError) return false;
      if (monitoringModeValidationError) return false;

      if (sector === "HYBRID_CAR_OWNER") {
        const registeredValue = Number(measurements["vehicles_registered"]);
        const activeValue = Number(measurements["vehicles_active"]);
        if (
          !Number.isNaN(registeredValue) &&
          !Number.isNaN(activeValue) &&
          activeValue > registeredValue
        ) {
          return false;
        }
      }

      if (
        sector === "FARMER" &&
        measurements["land_authority_document_photo_captured"] !== true
      ) {
        return false;
      }

      return true;
    }
    return true;
  }, [
    currentStep,
    sector,
    workspaceId,
    gpsLat,
    gpsLng,
    images.length,
    landAuthorityDocuments.length,
    sectorFields,
    hiddenMeasurementKeys,
    perUnitConfig,
    derivedMeasurementValues,
    perUnitRecordsValidationError,
    monitoringModeValidationError,
    measurements,
  ]);

  // GPS
  const captureGPS = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error(t("field_officer.geolocation_not_supported"));
      setGpsError(true);
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLat(pos.coords.latitude.toFixed(6));
        setGpsLng(pos.coords.longitude.toFixed(6));
        setGpsLoading(false);
        setGpsError(false);
        toast.success(t("field_officer.gps_captured"));
      },
      (err) => {
        setGpsLoading(false);
        setGpsError(true);
        toast.error(`GPS error: ${err.message}. Please enter coordinates manually.`);
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }, [t]);

  // images
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const merged = [...images, ...Array.from(e.target.files ?? [])];
    setImages(merged);
    setImagePreviews(merged.map((f) => URL.createObjectURL(f)));
  };
  const removeImage = (i: number) => {
    const ni = images.filter((_, idx) => idx !== i);
    setImages(ni);
    setImagePreviews(ni.map((f) => URL.createObjectURL(f)));
  };

  const handleLandAuthorityDocumentChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const merged = [
      ...landAuthorityDocuments,
      ...Array.from(e.target.files ?? []),
    ];
    setLandAuthorityDocuments(merged);
    setLandAuthorityDocumentPreviews(merged.map((f) => URL.createObjectURL(f)));
  };

  const removeLandAuthorityDocument = (i: number) => {
    const next = landAuthorityDocuments.filter((_, idx) => idx !== i);
    setLandAuthorityDocuments(next);
    setLandAuthorityDocumentPreviews(next.map((f) => URL.createObjectURL(f)));
  };

  // measurements
  const handleMeasurement = (key: string, value: string | boolean) =>
    setMeasurements((prev) => ({ ...prev, [key]: value }));

  const applyPreviousStartMeasurements = () => {
    if (!latestWorkspaceStartMeasurements) return;

    setMeasurements((prev) => {
      const next = { ...prev };

      for (const field of visibleSectorFields) {
        const previousValue = latestWorkspaceStartMeasurements[field.key];
        if (
          previousValue === undefined ||
          previousValue === null ||
          previousValue === ""
        ) {
          continue;
        }

        if (field.type === "boolean") {
          next[field.key] =
            previousValue === true ||
            String(previousValue).toLowerCase() === "true";
        } else {
          next[field.key] = String(previousValue);
        }
      }

      return next;
    });

    toast.success("Copied previous START values into current inputs");
  };

  // final submit — called from Review step
  const handleSubmit = async () => {
    if (!workspaceId.trim()) {
      toast.error(t("field_officer.workspace_id_required"));
      return;
    }
    if (!gpsLat || !gpsLng) {
      toast.error(t("field_officer.location_required"));
      return;
    }
    if (images.length === 0) {
      toast.error(t("field_officer.at_least_one_image"));
      return;
    }
    if (sector) {
      for (const f of sectorFields) {
        if (f.required && f.type !== "boolean") {
          if (hiddenMeasurementKeys.has(f.key)) {
            if (
              perUnitConfig?.derivedMeasurementKey === f.key &&
              derivedMeasurementValues[f.key] === undefined
            ) {
              toast.error(`${f.label} ${t("field_officer.is_required")}`);
              return;
            }
            continue;
          }

          const v = measurements[f.key];
          if (!v || v === "") {
            toast.error(`${f.label} ${t("field_officer.is_required")}`);
            return;
          }
          const numericValue = Number(v);
          if (Number.isNaN(numericValue)) {
            toast.error(`${f.label} ${t("field_officer.must_be_number")}`);
            return;
          }
          if (numericValue < 0) {
            toast.error(
              `${f.label} ${t("field_officer.must_be_non_negative")}`,
            );
            return;
          }
          if (f.type === "integer" && !Number.isInteger(numericValue)) {
            toast.error(`${f.label} ${t("field_officer.must_be_integer")}`);
            return;
          }
        }
      }

      if (sector === "HYBRID_CAR_OWNER") {
        const registeredValue = Number(measurements["vehicles_registered"]);
        const activeValue = Number(measurements["vehicles_active"]);

        if (
          !Number.isNaN(registeredValue) &&
          !Number.isNaN(activeValue) &&
          activeValue > registeredValue
        ) {
          toast.error(t("field_officer.active_cannot_exceed_registered"));
          return;
        }
      }

      if (
        sector === "FARMER" &&
        measurements["land_authority_document_photo_captured"] !== true
      ) {
        toast.error(
          "Please confirm that a photo of the land authority document is included.",
        );
        return;
      }

      if (sector === "FARMER" && landAuthorityDocuments.length === 0) {
        toast.error(
          "Please upload at least one land authority document photo in the dedicated section.",
        );
        return;
      }

      if (perUnitRecordsValidationError) {
        toast.error(perUnitRecordsValidationError);
        return;
      }

      if (monitoringModeValidationError) {
        toast.error(monitoringModeValidationError);
        return;
      }
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("workspaceId", workspaceId.trim());
      if (gpsLat) fd.append("gpsLat", gpsLat);
      if (gpsLng) fd.append("gpsLng", gpsLng);
      if (notes.trim()) fd.append("notes", notes.trim());
      const pm: Record<string, unknown> = {};
      for (const f of sectorFields) {
        if (hiddenMeasurementKeys.has(f.key)) continue;
        const v = measurements[f.key];
        if (v !== undefined && v !== "") {
          if (f.type === "boolean") pm[f.key] = v === true || v === "true";
          else if (f.type === "integer") pm[f.key] = parseInt(String(v), 10);
          else pm[f.key] = parseFloat(String(v));
        }
      }
      Object.entries(derivedMeasurementValues).forEach(([key, value]) => {
        pm[key] = value;
      });
      if (sector) {
        pm.monitoring_mode = monitoringMode;
      }
      if (perUnitConfig && perUnitRecords.length > 0) {
        pm[perUnitConfig.recordKey] = perUnitRecords.map((record, index) => {
          const parsedRecord: Record<string, unknown> = {
            index: index + 1,
            unitLabel: `${perUnitConfig.unitLabel} ${index + 1}`,
          };

          perUnitConfig.fields.forEach((field) => {
            const rawValue = record[field.key] ?? "";
            if (rawValue.trim() === "") {
              parsedRecord[field.key] = null;
              return;
            }
            if (field.type === "text") {
              parsedRecord[field.key] = rawValue.trim();
            } else {
              parsedRecord[field.key] = Number(rawValue);
            }
          });

          return parsedRecord;
        });
      }
      if (Object.keys(pm).length) fd.append("measurements", JSON.stringify(pm));
      for (const img of images) fd.append("images", img);
      for (const document of landAuthorityDocuments) {
        fd.append("landAuthorityDocuments", document);
      }
      await submitFieldData(fd);
      toast.success(t("field_officer.submit_success"));
      router.push("/dashboard/field-officer/history");
    } catch (err: unknown) {
      const apiMessage =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response
          ?.data?.message === "string"
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : null;
      toast.error(apiMessage || t("field_officer.submit_error"));
    } finally {
      setSubmitting(false);
    }
  };

  const sectorLabel =
    SECTOR_OPTIONS.find((s) => s.value === sector)?.label ?? sector;

  // ─────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {t("field_officer.submit_title")}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t("field_officer.submit_subtitle")}
        </p>
      </div>

      {/* ── Step progress bar ── */}
      <div className="mb-8">
        <div className="flex items-center w-full">
          {visibleSteps.map((step, idx) => {
            const Icon = step.icon;
            const done = currentIndex > idx;
            const active = currentStep === step.id;
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                      done
                        ? "bg-green-600 border-green-600 text-white"
                        : active
                          ? "border-green-600 text-green-600 bg-green-50 dark:bg-green-950/30"
                          : "border-muted-foreground/25 text-muted-foreground/40",
                    )}
                  >
                    {done ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[11px] font-medium leading-none",
                      active
                        ? "text-green-600"
                        : done
                          ? "text-green-600/70"
                          : "text-muted-foreground/40",
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < visibleSteps.length - 1 && (
                  <div
                    className="flex-1 h-0.5 mx-1 mb-5 rounded-full transition-colors duration-500"
                    style={{
                      background: done ? "rgb(22 163 74)" : "hsl(var(--muted))",
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Step {currentIndex + 1} of {totalSteps} —{" "}
          <span className="font-semibold text-foreground">
            {visibleSteps[currentIndex]?.label}
          </span>
        </p>
      </div>

      {/* ── Step panels ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* STEP 1 — Workspace Details */}
          {currentStep === 1 && (
            <Card>
              <CardHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-950/40 flex items-center justify-center shrink-0">
                    <Briefcase className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {t("field_officer.workspace_details")}
                    </CardTitle>
                    <CardDescription className="mt-0.5 text-xs">
                      {t("field_officer.workspace_details_desc")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="space-y-2 min-w-0">
                  <Label className="font-semibold text-sm">
                    {t("field_officer.workspace_id")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select value={workspaceId} onValueChange={setWorkspaceId}>
                    <SelectTrigger className="w-full min-w-0 h-11 [&>span]:block [&>span]:truncate [&>span]:max-w-[calc(100%-1.5rem)]">
                      <SelectValue
                        placeholder={
                          loadingWorkspaces
                            ? t("field_officer.loading_workspaces")
                            : t("field_officer.workspace_id_placeholder")
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {assignableWorkspaces.length === 0 ? (
                        <div className="p-3 text-sm text-muted-foreground">
                          {t("field_officer.no_workspaces_available")}
                        </div>
                      ) : (
                        assignableWorkspaces.map((ws) => (
                          <SelectItem
                            key={ws.id}
                            value={ws.id}
                            className="whitespace-normal break-words leading-snug py-2"
                          >
                            {formatWorkspaceOption(ws)}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>

                  {selectedWorkspace && (
                    <div className="rounded-md border bg-muted/20 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                        Selected workspace details
                      </p>
                      <p className="text-sm leading-relaxed break-words">
                        {formatWorkspaceOption(selectedWorkspace)}
                      </p>
                    </div>
                  )}
                </div>

                {sector && (
                  <div className="space-y-2">
                    <Label className="font-semibold text-sm">
                      {t("field_officer.sector_label")}
                    </Label>
                    <div className="flex items-center h-11 px-3 rounded-md border bg-muted/30 gap-2">
                      <Badge variant="secondary" className="text-[11px]">
                        Auto-filled
                      </Badge>
                      <span className="text-sm">{sectorLabel}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* STEP 2 — GPS Location */}
          {currentStep === 2 && (
            <Card>
              <CardHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {t("field_officer.gps_location")}
                    </CardTitle>
                    <CardDescription className="mt-0.5 text-xs">
                      {t("field_officer.gps_desc")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <Button
                  type="button"
                  variant={gpsLat && gpsLng ? "default" : "outline"}
                  onClick={captureGPS}
                  disabled={gpsLoading}
                  className={cn(
                    "w-full h-12 gap-2",
                    gpsLat && gpsLng && "bg-green-600 hover:bg-green-700",
                  )}
                >
                  {gpsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : gpsLat && gpsLng ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  {gpsLat && gpsLng
                    ? t("field_officer.update_location")
                    : t("field_officer.capture_location")}
                </Button>

                {gpsError && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-300">
                    <p className="font-semibold mb-2">GPS Capture Failed</p>
                    <p className="text-xs mb-3">Please enter the coordinates manually below:</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                          Latitude
                        </Label>
                        <Input 
                          type="number" 
                          step="any" 
                          placeholder="e.g. -1.9403" 
                          value={gpsLat} 
                          onChange={(e) => setGpsLat(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                          Longitude
                        </Label>
                        <Input 
                          type="number" 
                          step="any" 
                          placeholder="e.g. 29.8739" 
                          value={gpsLng} 
                          onChange={(e) => setGpsLng(e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {gpsLat && gpsLng && !gpsError ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                        {t("field_officer.latitude")}
                      </Label>
                      <Input
                        value={gpsLat}
                        readOnly
                        className="bg-muted/40 font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                        {t("field_officer.longitude")}
                      </Label>
                      <Input
                        value={gpsLng}
                        readOnly
                        className="bg-muted/40 font-mono text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-center text-muted-foreground py-2">
                    {t("field_officer.location_required_step")}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* STEP 3 — Photos */}
          {currentStep === 3 && (
            <Card>
              <CardHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center shrink-0">
                    <Camera className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {t("field_officer.photos")}
                    </CardTitle>
                    <CardDescription className="mt-0.5 text-xs">
                      {t("field_officer.photos_desc")}
                    </CardDescription>
                    {sector === "FARMER" && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        For farmer workspaces, include at least one clear photo
                        of the land authority document.
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <label
                  htmlFor="photo-upload"
                  className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50/20 dark:hover:bg-green-950/20 transition-all gap-2"
                >
                  <Upload className="h-7 w-7 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-medium">
                    {t("field_officer.tap_to_upload")}
                  </span>
                  {images.length > 0 && (
                    <Badge variant="secondary">
                      {images.length} {t("field_officer.selected_count")}
                    </Badge>
                  )}
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {sector === "FARMER" && (
                  <>
                    <Label className="text-sm font-medium">
                      Land Authority Document Photo(s)
                    </Label>
                    <label
                      htmlFor="land-authority-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all gap-2"
                    >
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground font-medium text-center px-2">
                        Upload land authority document photo(s)
                      </span>
                      {landAuthorityDocuments.length > 0 && (
                        <Badge variant="secondary">
                          {landAuthorityDocuments.length}{" "}
                          {t("field_officer.selected_count")}
                        </Badge>
                      )}
                      <input
                        id="land-authority-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        multiple
                        onChange={handleLandAuthorityDocumentChange}
                        className="hidden"
                      />
                    </label>

                    {landAuthorityDocumentPreviews.length > 0 && (
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                        {landAuthorityDocumentPreviews.map((src, i) => (
                          <div
                            key={`land-doc-${i}`}
                            className="relative aspect-square rounded-lg overflow-hidden border"
                          >
                            <img
                              src={src}
                              alt={`Land authority document ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeLandAuthorityDocument(i)}
                              className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {imagePreviews.map((src, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-lg overflow-hidden border"
                      >
                        <img
                          src={src}
                          alt={`Photo ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* STEP 4 — Measurements (hidden when sector has no fields) */}
          {currentStep === 4 && sectorFields.length > 0 && (
            <Card>
              <CardHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center shrink-0">
                    <BarChart2 className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {t("field_officer.measurements")}
                    </CardTitle>
                    <CardDescription className="mt-0.5 text-xs">
                      {t("field_officer.measurements_desc")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                {sector && (
                  <div className="space-y-2">
                    <Label className="font-semibold text-sm">
                      Monitoring Entry Type
                    </Label>
                    <Select
                      value={monitoringMode}
                      onValueChange={(value) =>
                        setMonitoringMode(value as MonitoringMode)
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select entry type" />
                      </SelectTrigger>
                      <SelectContent>
                        {allowedMonitoringModes.map((mode) => (
                          <SelectItem key={mode} value={mode}>
                            {mode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Credits are tracked per asset/unit. START captures opening
                      values and refreshes any existing open START for the same
                      asset; END closes the active START record.
                    </p>
                    {monitoringModeValidationError && (
                      <p className="text-xs text-red-600">
                        {monitoringModeValidationError}
                      </p>
                    )}
                  </div>
                )}

                {visibleSectorFields.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <Label
                      htmlFor={field.key}
                      className="font-semibold text-sm flex items-center gap-1.5"
                    >
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 text-xs">*</span>
                      )}
                    </Label>
                    {field.description && (
                      <p className="text-xs text-muted-foreground">
                        {field.description}
                      </p>
                    )}
                    {field.type === "boolean" ? (
                      <div className="flex items-center gap-3 h-11 px-3 rounded-md border bg-muted/20">
                        <Switch
                          id={field.key}
                          checked={measurements[field.key] === true}
                          onCheckedChange={(v) =>
                            handleMeasurement(field.key, v)
                          }
                        />
                        <span className="text-sm text-muted-foreground">
                          {measurements[field.key] === true ? "Yes" : "No"}
                        </span>
                      </div>
                    ) : (
                      <Input
                        id={field.key}
                        type="number"
                        step={field.type === "decimal" ? "0.01" : "1"}
                        min="0"
                        inputMode={
                          field.type === "decimal" ? "decimal" : "numeric"
                        }
                        placeholder={
                          measurementPlaceholders[field.key] ??
                          `Enter ${field.label.toLowerCase()}`
                        }
                        value={
                          measurements[field.key] !== undefined
                            ? String(measurements[field.key])
                            : ""
                        }
                        onChange={(e) =>
                          handleMeasurement(field.key, e.target.value)
                        }
                        className="h-11"
                      />
                    )}
                  </div>
                ))}

                {monitoringMode === "END" &&
                  !perUnitConfig &&
                  latestWorkspaceStartMeasurements && (
                    <div className="rounded-md border bg-muted/30 p-3 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Previous START data
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={applyPreviousStartMeasurements}
                          className="h-7 text-[11px]"
                        >
                          Use previous values
                        </Button>
                      </div>
                      {visibleSectorFields
                        .map((field) => {
                          const previousValue =
                            latestWorkspaceStartMeasurements[field.key];
                          if (
                            previousValue === undefined ||
                            previousValue === null ||
                            previousValue === ""
                          ) {
                            return null;
                          }

                          return (
                            <div
                              key={`start-${field.key}`}
                              className="text-xs flex justify-between"
                            >
                              <span className="text-muted-foreground">
                                {field.label}
                              </span>
                              <span className="font-medium">
                                {String(previousValue)}
                              </span>
                            </div>
                          );
                        })
                        .filter(Boolean)}

                      {endModeFieldMismatches.length > 0 && (
                        <div className="mt-2 rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-2.5">
                          <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                            Current values differ from previous START data
                          </p>
                          <div className="mt-1.5 space-y-1">
                            {endModeFieldMismatches.slice(0, 4).map((item) => (
                              <p
                                key={`mismatch-${item.key}`}
                                className="text-[11px] text-amber-800 dark:text-amber-200"
                              >
                                {item.label}: previous {item.previous} → current{" "}
                                {item.current}
                              </p>
                            ))}
                            {endModeFieldMismatches.length > 4 && (
                              <p className="text-[11px] text-amber-800 dark:text-amber-200">
                                +{endModeFieldMismatches.length - 4} more
                                differences
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                {perUnitConfig && renderedUnitsCount > 0 && (
                  <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
                    <div>
                      <p className="text-sm font-semibold">
                        Active {perUnitConfig.unitLabel} Inputs (
                        {renderedUnitsCount})
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add details for each active{" "}
                        {perUnitConfig.unitLabel.toLowerCase()} listed above.
                      </p>
                      {availableUnitIdentifiers.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Unit identifiers are auto-filled from registered
                          database assets.
                        </p>
                      )}
                      {activeUnitsCount > perUnitConfig.maxUnits && (
                        <p className="text-xs text-amber-600 mt-1.5">
                          Showing first {perUnitConfig.maxUnits} records only.
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      {perUnitRecords.map((record, index) => (
                        <div
                          key={`active-unit-${index + 1}`}
                          className="rounded-md border bg-background p-3 space-y-3"
                        >
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            {perUnitConfig.unitLabel} {index + 1}
                          </p>

                          <div
                            className={cn(
                              "grid gap-3",
                              visiblePerUnitFields.length > 1
                                ? "grid-cols-1 md:grid-cols-2"
                                : "grid-cols-1",
                            )}
                          >
                            {monitoringMode === "END" &&
                              sector === "HYBRID_CAR_OWNER" &&
                              (() => {
                                const identifier = (
                                  record.unit_identifier ?? ""
                                )
                                  .trim()
                                  .toLowerCase();
                                const history =
                                  identifier !== ""
                                    ? priorSubmissionStatsByIdentifier[
                                        identifier
                                      ]
                                    : null;
                                const priorStartValue =
                                  history?.latestStartRecord?.odometer_start;

                                return (
                                  <div className="md:col-span-2 rounded-md border bg-muted/30 px-3 py-2 text-xs">
                                    <span className="text-muted-foreground">
                                      Previous START odometer:
                                    </span>{" "}
                                    <span className="font-semibold">
                                      {typeof priorStartValue === "number"
                                        ? `${priorStartValue} km`
                                        : "Not found for this identifier"}
                                    </span>
                                  </div>
                                );
                              })()}

                            {visiblePerUnitFields.map((unitField) => (
                              <div
                                key={`${unitField.key}-${index + 1}`}
                                className="space-y-1.5"
                              >
                                <Label
                                  htmlFor={`${unitField.key}-${index + 1}`}
                                >
                                  {unitField.label}
                                  {unitField.required && (
                                    <span className="text-red-500 text-xs ml-1">
                                      *
                                    </span>
                                  )}
                                </Label>
                                <Input
                                  id={`${unitField.key}-${index + 1}`}
                                  type={
                                    unitField.type === "text"
                                      ? "text"
                                      : "number"
                                  }
                                  readOnly={
                                    unitField.key === "unit_identifier" &&
                                    availableUnitIdentifiers.length > 0
                                  }
                                  min={
                                    unitField.type === "text" ? undefined : "0"
                                  }
                                  step={
                                    unitField.type === "decimal" ? "0.01" : "1"
                                  }
                                  placeholder={unitField.placeholder}
                                  value={record[unitField.key] ?? ""}
                                  onChange={(e) =>
                                    handlePerUnitRecordChange(
                                      index,
                                      unitField.key,
                                      e.target.value,
                                    )
                                  }
                                  className={cn(
                                    "h-10",
                                    unitField.key === "unit_identifier" &&
                                      availableUnitIdentifiers.length > 0 &&
                                      "bg-muted/40",
                                  )}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {perUnitConfig.derivedMeasurementKey &&
                      derivedMeasurementValues[
                        perUnitConfig.derivedMeasurementKey
                      ] !== undefined && (
                        <div className="rounded-md border bg-background px-3 py-2 text-sm flex justify-between">
                          <span className="text-muted-foreground">
                            Auto-calculated{" "}
                            {perUnitConfig.derivedMeasurementKey}
                          </span>
                          <span className="font-semibold">
                            {
                              derivedMeasurementValues[
                                perUnitConfig.derivedMeasurementKey
                              ]
                            }
                          </span>
                        </div>
                      )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* STEP 5 — Notes */}
          {currentStep === 5 && (
            <Card>
              <CardHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-950/40 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {t("field_officer.notes")}
                    </CardTitle>
                    <CardDescription className="mt-0.5 text-xs">
                      {t("field_officer.notes_desc")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Textarea
                  placeholder={t("field_officer.notes_placeholder")}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[180px] text-sm resize-none"
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground text-right mt-1.5">
                  {notes.length} / 2000
                </p>
              </CardContent>
            </Card>
          )}

          {/* STEP 6 — Review & Submit */}
          {currentStep === 6 && (
            <Card>
              <CardHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-950/40 flex items-center justify-center shrink-0">
                    <Send className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      Review &amp; Submit
                    </CardTitle>
                    <CardDescription className="mt-0.5 text-xs">
                      Confirm all details before submitting.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-1">
                {[
                  {
                    label: "Workspace",
                    value: selectedWorkspace?.label ?? "—",
                    ok: !!workspaceId,
                  },
                  {
                    label: "Sector",
                    value: sectorLabel || "—",
                    ok: !!sector,
                  },
                  {
                    label: "Mode",
                    value: sector ? monitoringMode : "—",
                    ok: true,
                  },
                  {
                    label: "GPS",
                    value:
                      gpsLat && gpsLng
                        ? `${gpsLat}, ${gpsLng}`
                        : "Not captured",
                    ok: true,
                  },
                  {
                    label: "Photos",
                    value:
                      images.length > 0 ? `${images.length} selected` : "None",
                    ok: images.length > 0,
                  },
                  {
                    label: "Notes",
                    value: notes.trim() ? `${notes.length} chars` : "None",
                    ok: true,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start gap-3 py-3 border-b last:border-0"
                  >
                    <span className="text-sm text-muted-foreground w-24 shrink-0 pt-0.5">
                      {row.label}
                    </span>
                    <span className="text-sm font-medium flex-1 break-all">
                      {row.value}
                    </span>
                    {row.ok ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    )}
                  </div>
                ))}

                {sectorFields.length > 0 &&
                  sectorFields.some(
                    (f) =>
                      measurements[f.key] !== undefined &&
                      measurements[f.key] !== "",
                  ) && (
                    <div className="rounded-lg border bg-muted/20 p-4 mt-3 space-y-2">
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                        Measurements
                      </p>
                      {sectorFields.map((f) => {
                        const v = measurements[f.key];
                        if (v === undefined || v === "") return null;
                        return (
                          <div
                            key={f.key}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-muted-foreground">
                              {f.label}
                            </span>
                            <span className="font-medium">
                              {f.type === "boolean"
                                ? v
                                  ? "Yes"
                                  : "No"
                                : String(v)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                {perUnitConfig && renderedUnitsCount > 0 && (
                  <div className="rounded-lg border bg-muted/20 p-4 mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Active {perUnitConfig.unitLabel.toLowerCase()} records
                      </span>
                      <span className="font-medium">
                        {
                          perUnitRecords.filter((record) =>
                            perUnitConfig.fields.some((field) => {
                              const rawValue = record[field.key] ?? "";
                              return rawValue.trim() !== "";
                            }),
                          ).length
                        }
                        /{renderedUnitsCount}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-muted-foreground">
                        Monitoring mode
                      </span>
                      <span className="font-medium">{monitoringMode}</span>
                    </div>

                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-muted-foreground">
                        Crediting basis
                      </span>
                      <span className="font-medium">
                        Per {perUnitConfig.unitLabel.toLowerCase()} (owner total
                        aggregated)
                      </span>
                    </div>

                    {perUnitConfig.derivedMeasurementKey &&
                      derivedMeasurementValues[
                        perUnitConfig.derivedMeasurementKey
                      ] !== undefined && (
                        <div className="flex justify-between text-sm mt-2">
                          <span className="text-muted-foreground">
                            {perUnitConfig.derivedMeasurementKey}
                          </span>
                          <span className="font-medium">
                            {
                              derivedMeasurementValues[
                                perUnitConfig.derivedMeasurementKey
                              ]
                            }
                          </span>
                        </div>
                      )}
                  </div>
                )}

                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !workspaceId || images.length === 0}
                  className="w-full h-12 mt-6 bg-green-600 hover:bg-green-700 gap-2 font-semibold"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("field_officer.submitting")}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {t("field_officer.submit_button")}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between mt-6 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="gap-1.5 min-w-[100px]"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {/* dot indicators */}
        <div className="flex items-center gap-1.5">
          {visibleSteps.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "rounded-full transition-all duration-300",
                i === currentIndex
                  ? "w-5 h-2 bg-green-600"
                  : i < currentIndex
                    ? "w-2 h-2 bg-green-400"
                    : "w-2 h-2 bg-muted-foreground/20",
              )}
            />
          ))}
        </div>

        {currentStep !== 6 ? (
          <Button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            className={cn(
              "gap-1.5 min-w-[100px]",
              canGoNext && "bg-green-600 hover:bg-green-700",
            )}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <div className="min-w-[100px]" />
        )}
      </div>
    </motion.div>
  );
}
