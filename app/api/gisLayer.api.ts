import api from "./api";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface GisLayer {
  id: string;
  workspaceId: string;
  fileUrl: string;
  fileType: string;
  areaSqKm: number | null;
  coordinates: unknown | null;
  validatedBy: string | null;
  validator: { id: string; firstName: string; lastName: string } | null;
  validatedAt: string | null;
  isValid: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  workspace?: {
    id: string;
    sector: string;
    user?: { firstName: string; lastName: string };
  };
}

export interface ValidateGisLayerData {
  areaSqKm: number;
  isValid: boolean;
  notes?: string;
}

export interface UpdateGisLayerData {
  notes?: string;
}

// ─── API Functions ──────────────────────────────────────────────────────────

export const uploadGisFile = async (
  workspaceId: string,
  file: File,
): Promise<GisLayer> => {
  const formData = new FormData();
  formData.append("gisFile", file);
  const response = await api.post(
    `/api/admin/gis/upload/${workspaceId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data.data;
};

export const getGisLayer = async (
  workspaceId: string,
): Promise<GisLayer | null> => {
  try {
    const response = await api.get(`/api/admin/gis/${workspaceId}`);
    return response.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } };
    if (err.response?.status === 404) return null;
    throw error;
  }
};

export const validateGisLayer = async (
  workspaceId: string,
  data: ValidateGisLayerData,
): Promise<GisLayer> => {
  const response = await api.put(
    `/api/admin/gis/${workspaceId}/validate`,
    data,
  );
  return response.data.data;
};

export const updateGisLayer = async (
  workspaceId: string,
  data: UpdateGisLayerData,
): Promise<GisLayer> => {
  const response = await api.put(`/api/admin/gis/${workspaceId}`, data);
  return response.data.data;
};
