import api from "./api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CarbonEngineResult {
  sector: string;
  baselineEmissions_kgCO2e: number;
  projectEmissions_kgCO2e: number;
  netReduction_kgCO2e: number;
  credits: number;
  calculationBreakdown: Record<string, number | string>;
  appliedParameters: Record<string, number>;
  warnings: string[];
  isValid: boolean;
  invalidReason?: string;
}

export interface CarbonEngineRequest {
  workspaceId: string;
  monitoringCycleId: string;
  overrides?: Record<string, number>;
}

// ─── Sector field definitions for dynamic forms ───────────────────────────────

export interface SectorField {
  key: string;
  label: string;
  type: "integer" | "decimal" | "boolean";
  required: boolean;
  description: string;
}

export const SECTOR_FIELDS: Record<string, SectorField[]> = {
  ECO_FRIENDLY_STOVES: [
    {
      key: "stoves_distributed",
      label: "Stoves Distributed",
      type: "integer",
      required: true,
      description: "Total number of improved stoves given out",
    },
    {
      key: "stoves_active",
      label: "Stoves Confirmed Active",
      type: "integer",
      required: true,
      description:
        "Stoves confirmed still in use during this monitoring period",
    },
    {
      key: "avg_daily_fuel_kg",
      label: "Avg Daily Fuel per Stove (kg)",
      type: "decimal",
      required: true,
      description: "Average daily fuel consumption per active improved stove",
    },
  ],
  FARMER: [
    {
      key: "land_area_ha",
      label: "Land Area (hectares)",
      type: "decimal",
      required: true,
      description:
        "Verified project land area — must match the validated GIS layer area",
    },
    {
      key: "trees_planted",
      label: "Trees Planted This Period",
      type: "integer",
      required: true,
      description: "Total trees planted in this monitoring period",
    },
    {
      key: "trees_surviving",
      label: "Trees Surviving (counted)",
      type: "integer",
      required: true,
      description: "Trees confirmed alive and healthy during field visit",
    },
    {
      key: "avg_tree_height_m",
      label: "Avg Tree Height (metres)",
      type: "decimal",
      required: false,
      description: "Average measured tree height (sample measurement)",
    },
    {
      key: "avg_canopy_diameter_m",
      label: "Avg Canopy Diameter (metres)",
      type: "decimal",
      required: false,
      description: "Average canopy diameter (sample measurement)",
    },
  ],
  HYBRID_CAR_OWNER: [
    {
      key: "vehicles_registered",
      label: "Vehicles Registered",
      type: "integer",
      required: true,
      description: "Total hybrid/EV vehicles registered in this project",
    },
    {
      key: "vehicles_active",
      label: "Vehicles Active/Operational",
      type: "integer",
      required: true,
      description:
        "Vehicles confirmed operational during this monitoring period",
    },
    {
      key: "odometer_reading_start",
      label: "Odometer Start (km)",
      type: "integer",
      required: false,
      description: "Odometer at start of monitoring period (for verification)",
    },
    {
      key: "odometer_reading_end",
      label: "Odometer End (km)",
      type: "integer",
      required: false,
      description: "Odometer at end of monitoring period (for verification)",
    },
    {
      key: "avg_annual_km_driven",
      label: "Avg Annual km Driven",
      type: "decimal",
      required: false,
      description:
        "Average annual kilometres driven per vehicle (from odometer readings)",
    },
  ],
  COMMERCIAL_BUILDING: [
    {
      key: "baseline_monthly_kwh",
      label: "Baseline Monthly kWh",
      type: "decimal",
      required: true,
      description:
        "Average monthly electricity consumption BEFORE the energy improvement (from bills)",
    },
    {
      key: "project_monthly_kwh",
      label: "Current Monthly kWh",
      type: "decimal",
      required: true,
      description:
        "Average monthly electricity consumption AFTER the improvement (from current bills)",
    },
    {
      key: "building_floor_area_sqm",
      label: "Building Floor Area (m²)",
      type: "decimal",
      required: false,
      description: "Total floor area of the building",
    },
    {
      key: "solar_capacity_kw",
      label: "Solar Capacity (kW)",
      type: "decimal",
      required: false,
      description:
        "If solar panels installed: total installed capacity (0 if none)",
    },
    {
      key: "solar_monthly_generation_kwh",
      label: "Solar Monthly Generation kWh",
      type: "decimal",
      required: false,
      description: "Actual monthly generation from solar (0 if none)",
    },
    {
      key: "energy_audit_done",
      label: "Energy Audit Completed?",
      type: "boolean",
      required: false,
      description:
        "Whether a certified energy audit was completed (true/false)",
    },
  ],
};

// ─── API Functions ────────────────────────────────────────────────────────────

export async function simulateCredits(
  data: CarbonEngineRequest,
): Promise<CarbonEngineResult> {
  const res = await api.post("/carbon-engine/simulate", data);
  return res.data.data;
}

export async function finalizeCredits(
  data: CarbonEngineRequest,
): Promise<CarbonEngineResult> {
  const res = await api.post("/carbon-engine/finalize", data);
  return res.data.data;
}
