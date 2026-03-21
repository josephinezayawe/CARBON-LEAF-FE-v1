import api from "./api";

export interface FieldDataEntry {
  id: string;
  workspaceId: string;
  submittedBy: string;
  gpsLat: number | null;
  gpsLng: number | null;
  measurements: Record<string, unknown> | null;
  notes: string | null;
  imageUrls: string[];
  status: "PENDING" | "REVIEWED" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  workspace: {
    id: string;
    sector: string;
    status: string;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface FieldDataStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  reviewed: number;
  assignedWorkspaces: number;
}

/**
 * Submit field data with images
 */
export const submitFieldData = async (
  formData: FormData,
): Promise<FieldDataEntry> => {
  const response = await api.post("/api/field-data", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};

/**
 * Get own submissions
 */
export const getOwnFieldData = async (): Promise<FieldDataEntry[]> => {
  const response = await api.get("/api/field-data");
  return response.data.data;
};

/**
 * Get a single field data record by ID
 */
export const getFieldDataById = async (id: string): Promise<FieldDataEntry> => {
  const response = await api.get(`/api/field-data/${id}`);
  return response.data.data;
};

/**
 * Get all field data for a workspace
 */
export const getFieldDataByWorkspace = async (
  workspaceId: string,
): Promise<FieldDataEntry[]> => {
  const response = await api.get(`/api/field-data/workspace/${workspaceId}`);
  return response.data.data;
};

/**
 * Get dashboard stats for field officer
 */
export const getFieldDataStats = async (): Promise<FieldDataStats> => {
  const response = await api.get("/api/field-data/stats");
  return response.data.data;
};
