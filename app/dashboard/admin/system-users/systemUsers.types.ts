// @/types/systemUsers.ts

export interface UserSector {
  sector: string;
}

export interface SystemUser {
  id: string;
  firstName: string;
  lastName: string;
  nid: string;
  contact: string;
  role?: string;
  province: string;
  district: string;
  createdAt: string;
  wallet?: {
    totalCredits: number | string;
  } | null;
  _count?: {
    assets: number;
  };
  userSectors?: UserSector[];
}

export const sectors = [
  { key: "FARMER", label: "Farmer" },
  { key: "HYBRID_CAR_OWNER", label: "Hybrid Car Owner" },
  { key: "ECO_FRIENDLY_STOVES", label: "Eco Stoves" },
  { key: "COMMERCIAL_BUILDING", label: "Commercial Building" },
] as const;
