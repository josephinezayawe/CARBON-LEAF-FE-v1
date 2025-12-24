/**
 * Asset Form Configuration
 * Defines sector-specific fields and their metadata
 */

export type SectorType = 
  | "FARMER"
  | "HYBRID CAR OWNER"
  | "ECO FRIENDLY STOVES"
  | "COMMERCIAL BUILDING";

export type FieldType = "text" | "textarea" | "email" | "number" | "date";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  helperText?: string;
}

export interface SectorConfig {
  commonFields: Field[];
  optionalFields: Record<SectorType, Field[]>;
}

// Auto-set values based on sector
export const SECTOR_AUTO_VALUES: Record<SectorType, { assetType: string }> = {
  FARMER: { assetType: "Land Parcel" },
  "HYBRID CAR OWNER": { assetType: "Vehicle" },
  "ECO FRIENDLY STOVES": { assetType: "Stove" },
  "COMMERCIAL BUILDING": { assetType: "Building" },
};

// Common fields required for all sectors (auto-set fields excluded)
const COMMON_FIELDS: Field[] = [
  {
    name: "name",
    label: "Asset Name",
    type: "text",
    placeholder: "Give your asset a descriptive name",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Describe your asset in detail",
    required: true,
  },
  {
    name: "province",
    label: "Province",
    type: "text",
    placeholder: "Enter province",
    required: true,
  },
  {
    name: "district",
    label: "District",
    type: "text",
    placeholder: "Enter district",
    required: true,
  },
  {
    name: "sectorArea",
    label: "Sector Area",
    type: "text",
    placeholder: "Enter sector area",
    required: true,
  },
  {
    name: "cell",
    label: "Cell",
    type: "text",
    placeholder: "Enter cell",
    required: true,
  },
  {
    name: "village",
    label: "Village",
    type: "text",
    placeholder: "Enter village",
    required: true,
  },
];

// Sector-specific optional fields
const OPTIONAL_FIELDS: Record<SectorType, Field[]> = {
  FARMER: [
    {
      name: "landUPI",
      label: "Land UPI",
      type: "text",
      placeholder: "e.g., 1/23/45/67",
      required: true,
      helperText: "Unique Property Identifier",
    },
  ],
  "HYBRID CAR OWNER": [
    {
      name: "carPlate",
      label: "Car Registration Plate",
      type: "text",
      placeholder: "e.g., RAJ-1234",
      required: true,
    },
    {
      name: "carSerialNumber",
      label: "Car Serial Number",
      type: "text",
      placeholder: "Vehicle Identification Number (VIN)",
      required: true,
    },
  ],
  "ECO FRIENDLY STOVES": [
    {
      name: "stoveSerialNumber",
      label: "Stove Serial Number",
      type: "text",
      placeholder: "Enter the stove's serial number",
      required: true,
    },
  ],
  "COMMERCIAL BUILDING": [
    {
      name: "buildingReg",
      label: "Building Registration Number",
      type: "text",
      placeholder: "Enter building registration/permit number",
      required: true,
    },
  ],
};

export const ASSET_CONFIG: SectorConfig = {
  commonFields: COMMON_FIELDS,
  optionalFields: OPTIONAL_FIELDS,
};

/**
 * Get all fields (common + optional) for a specific sector
 */
export function getFieldsForSector(sector: SectorType): Field[] {
  return [
    ...ASSET_CONFIG.commonFields,
    ...(ASSET_CONFIG.optionalFields[sector] || []),
  ];
}

/**
 * Get only optional fields for a specific sector
 */
export function getOptionalFieldsForSector(sector: SectorType): Field[] {
  return ASSET_CONFIG.optionalFields[sector] || [];
}

/**
 * Get field names (common + optional) for a sector
 * Useful for filtering payload
 */
export function getFieldNamesForSector(sector: SectorType): string[] {
  const fields = getFieldsForSector(sector);
  return fields.map((f) => f.name);
}

/**
 * Check if a field is optional for a sector
 */
export function isFieldOptionalForSector(
  fieldName: string,
  sector: SectorType
): boolean {
  const optionalFields = ASSET_CONFIG.optionalFields[sector] || [];
  return optionalFields.some((f) => f.name === fieldName);
}

/**
 * Get common field names only
 */
export function getCommonFieldNames(): string[] {
  return ASSET_CONFIG.commonFields.map((f) => f.name);
}
