/**
 * Rwanda Administrative Divisions Data
 * Wraps the rwanda-geo-structure npm package to provide complete location data.
 * All inputs are normalized to exact casing required by the underlying library.
 */

import * as rwandaGeo from 'rwanda-geo-structure';

// ─── Province mapping ────────────────────────────────────────────────────────
// Library returns: ['East', 'Kigali', 'North', 'South', 'West']
// We display:      ['Eastern Province', 'Kigali City', 'Northern Province', 'Southern Province', 'Western Province']

const DISPLAY_TO_LIB_PROVINCE: Record<string, string> = {
  'eastern province': 'East',
  'kigali city': 'Kigali',
  'northern province': 'North',
  'southern province': 'South',
  'western province': 'West',
  // Also accept the library's own short names
  'east': 'East',
  'kigali': 'Kigali',
  'north': 'North',
  'south': 'South',
  'west': 'West',
};

const LIB_TO_DISPLAY_PROVINCE: Record<string, string> = {
  'East': 'Eastern Province',
  'Kigali': 'Kigali City',
  'North': 'Northern Province',
  'South': 'Southern Province',
  'West': 'Western Province',
};

// ─── Build case-insensitive lookup caches ────────────────────────────────────
// Because the library is strictly case-sensitive at EVERY level we cache exact
// names once on first use and match against lower-cased keys.

type DistrictCache = Record<string, string[]>;           // libProvince → exact district names
type SectorCache   = Record<string, string[]>;           // libProvince|district → exact sector names
type CellCache     = Record<string, string[]>;           // libProvince|district|sector → exact cell names
type VillageCache  = Record<string, string[]>;           // libProvince|district|sector|cell → exact village names

// Maps from lowercased name → exact cased name
type NameMap = Record<string, string>;

const districtNameMap: Record<string, NameMap> = {};    // libProvince → { lower → exact }
const sectorNameMap: Record<string, NameMap>   = {};    // libProvince|district → { lower → exact }
const cellNameMap: Record<string, NameMap>     = {};    // libProvince|district|sector → { lower → exact }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toLibProvince(province: string): string {
  if (!province) return '';
  return DISPLAY_TO_LIB_PROVINCE[province.trim().toLowerCase()] || province.trim();
}

/** Return the exact district name as stored in the library, case-insensitively. */
function resolveDistrict(libProvince: string, district: string): string {
  if (!district) return '';
  const key = libProvince;
  if (!districtNameMap[key]) {
    const exact = (rwandaGeo.getDistrictsByProvince(libProvince) as string[]) || [];
    districtNameMap[key] = {};
    for (const d of exact) districtNameMap[key][d.toLowerCase()] = d;
  }
  return districtNameMap[key][district.trim().toLowerCase()] || district.trim();
}

/** Return the exact sector name as stored in the library, case-insensitively. */
function resolveSector(libProvince: string, exactDistrict: string, sector: string): string {
  if (!sector) return '';
  const key = `${libProvince}|${exactDistrict}`;
  if (!sectorNameMap[key]) {
    const exact = (rwandaGeo.getSectorsByDistrict(libProvince, exactDistrict) as string[]) || [];
    sectorNameMap[key] = {};
    for (const s of exact) sectorNameMap[key][s.toLowerCase()] = s;
  }
  return sectorNameMap[key][sector.trim().toLowerCase()] || sector.trim();
}

/** Return the exact cell name as stored in the library, case-insensitively. */
function resolveCell(libProvince: string, exactDistrict: string, exactSector: string, cell: string): string {
  if (!cell) return '';
  const key = `${libProvince}|${exactDistrict}|${exactSector}`;
  if (!cellNameMap[key]) {
    const exact = (rwandaGeo.getCellsBySector(libProvince, exactDistrict, exactSector) as string[]) || [];
    cellNameMap[key] = {};
    for (const c of exact) cellNameMap[key][c.toLowerCase()] = c;
  }
  return cellNameMap[key][cell.trim().toLowerCase()] || cell.trim();
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Get all provinces (display names)
 */
export function getProvinces(): string[] {
  return (rwandaGeo.getProvinces() as string[]).map((p: string) => LIB_TO_DISPLAY_PROVINCE[p] || p);
}

/**
 * Get districts for a given province
 */
export function getDistrictsByProvince(province: string): string[] {
  const libProvince = toLibProvince(province);
  if (!libProvince) return [];
  return (rwandaGeo.getDistrictsByProvince(libProvince) as string[]) || [];
}

/**
 * Get sectors for a given district (within a province)
 */
export function getSectorsByDistrict(province: string, district: string): string[] {
  const libProvince    = toLibProvince(province);
  const exactDistrict  = resolveDistrict(libProvince, district);
  if (!libProvince || !exactDistrict) return [];
  return (rwandaGeo.getSectorsByDistrict(libProvince, exactDistrict) as string[]) || [];
}

/**
 * Get cells for a given sector (within a district and province)
 */
export function getCellsBySector(province: string, district: string, sector: string): string[] {
  const libProvince   = toLibProvince(province);
  const exactDistrict = resolveDistrict(libProvince, district);
  const exactSector   = resolveSector(libProvince, exactDistrict, sector);
  if (!libProvince || !exactDistrict || !exactSector) return [];
  return (rwandaGeo.getCellsBySector(libProvince, exactDistrict, exactSector) as string[]) || [];
}

/**
 * Get villages for a given cell
 */
export function getVillagesByCell(province: string, district: string, sector: string, cell: string): string[] {
  const libProvince   = toLibProvince(province);
  const exactDistrict = resolveDistrict(libProvince, district);
  const exactSector   = resolveSector(libProvince, exactDistrict, sector);
  const exactCell     = resolveCell(libProvince, exactDistrict, exactSector, cell);
  if (!libProvince || !exactDistrict || !exactSector || !exactCell) return [];
  return (rwandaGeo.getVillagesByCell(libProvince, exactDistrict, exactSector, exactCell) as string[]) || [];
}
