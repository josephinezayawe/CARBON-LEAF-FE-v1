/**
 * Rwanda Administrative Divisions Data
 * Hierarchical structure: Province → District → Sector → Cell → Village
 */

export interface RwandaCell {
  name: string;
}

export interface RwandaSector {
  name: string;
  cells: RwandaCell[];
}

export interface RwandaDistrict {
  name: string;
  sectors: RwandaSector[];
}

export interface RwandaProvince {
  name: string;
  districts: RwandaDistrict[];
}

export const RWANDA_ADMINISTRATIVE_DIVISIONS: RwandaProvince[] = [
  {
    name: "Kigali City",
    districts: [
      {
        name: "Gasabo",
        sectors: [
          {
            name: "Kacyiru",
            cells: [
              { name: "Kabeza" },
              { name: "Gatsata" },
              { name: "Kigobe" },
              { name: "Nyagahanga" },
            ],
          },
          {
            name: "Kimihurura",
            cells: [
              { name: "Biryogo" },
              { name: "Kacyiru" },
              { name: "Gisozi" },
            ],
          },
        ],
      },
      {
        name: "Nyarugenge",
        sectors: [
          {
            name: "Nyamirambo",
            cells: [
              { name: "Gikondo" },
              { name: "Nyamirambo" },
              { name: "Rwezamenyo" },
            ],
          },
          {
            name: "Kigali",
            cells: [
              { name: "Gitega" },
              { name: "Kigali" },
              { name: "Muhima" },
            ],
          },
        ],
      },
      {
        name: "Kicukiro",
        sectors: [
          {
            name: "Gahanga",
            cells: [
              { name: "Gahanga" },
              { name: "Niboye" },
              { name: "Kigarama" },
            ],
          },
          {
            name: "Kagarama",
            cells: [
              { name: "Kigarama" },
              { name: "Kagarama" },
              { name: "Nyarutarama" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Northern Province",
    districts: [
      {
        name: "Musanze",
        sectors: [
          {
            name: "Musanze",
            cells: [
              { name: "Muhoza" },
              { name: "Buhunga" },
              { name: "Busogo" },
            ],
          },
          {
            name: "Kinigi",
            cells: [
              { name: "Kinigi" },
              { name: "Kundara" },
              { name: "Cyuve" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Southern Province",
    districts: [
      {
        name: "Huye",
        sectors: [
          {
            name: "Ngoma",
            cells: [
              { name: "Ngoma" },
              { name: "Muganza" },
              { name: "Gikundamvura" },
            ],
          },
          {
            name: "Huye",
            cells: [
              { name: "Cyangugu" },
              { name: "Huye" },
              { name: "Ngoma" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Eastern Province",
    districts: [
      {
        name: "Rwamagana",
        sectors: [
          {
            name: "Mwurire",
            cells: [
              { name: "Mwurire" },
              { name: "Gishari" },
              { name: "Nyarurama" },
            ],
          },
          {
            name: "Nyakariro",
            cells: [
              { name: "Nyakariro" },
              { name: "Gasharu" },
              { name: "Rurenge" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Western Province",
    districts: [
      {
        name: "Rubavu",
        sectors: [
          {
            name: "Gisenyi",
            cells: [
              { name: "Gisenyi" },
              { name: "Kamuha" },
              { name: "Busasamana" },
            ],
          },
          {
            name: "Nyundo",
            cells: [
              { name: "Nyundo" },
              { name: "Mugongi" },
              { name: "Mabayi" },
            ],
          },
        ],
      },
    ],
  },
];

/**
 * Get all provinces
 */
export function getProvinces(): string[] {
  return RWANDA_ADMINISTRATIVE_DIVISIONS.map((p) => p.name);
}

/**
 * Get districts for a given province
 */
export function getDistrictsByProvince(province: string): string[] {
  const prov = RWANDA_ADMINISTRATIVE_DIVISIONS.find((p) => p.name === province);
  return prov?.districts.map((d) => d.name) || [];
}

/**
 * Get sectors for a given district (within a province)
 */
export function getSectorsByDistrict(
  province: string,
  district: string
): string[] {
  const prov = RWANDA_ADMINISTRATIVE_DIVISIONS.find((p) => p.name === province);
  const dist = prov?.districts.find((d) => d.name === district);
  return dist?.sectors.map((s) => s.name) || [];
}

/**
 * Get cells for a given sector (within a district and province)
 */
export function getCellsBySector(
  province: string,
  district: string,
  sector: string
): string[] {
  const prov = RWANDA_ADMINISTRATIVE_DIVISIONS.find((p) => p.name === province);
  const dist = prov?.districts.find((d) => d.name === district);
  const sect = dist?.sectors.find((s) => s.name === sector);
  return sect?.cells.map((c) => c.name) || [];
}

/**
 * Get villages for a given cell (villages are the cells themselves)
 * In the Rwanda administrative hierarchy, cells serve as the smallest unit
 */
export function getVillagesByCell(
  province: string,
  district: string,
  sector: string,
  cell: string
): string[] {
  // In this system, each cell is treated as a village
  // Return the cell name as a single village option
  const cells = getCellsBySector(province, district, sector);
  return cells.includes(cell) ? [cell] : [];
}
