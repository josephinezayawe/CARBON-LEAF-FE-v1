import api from "./api";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Methodology {
  id: string;
  name: string;
  code: string;
  description: string | null;
  version: string;
  sector: string;
  parameters: Record<string, unknown> | null;
  documentUrl: string | null;
  status: MethodologyStatus;
  approvedBy: string | null;
  approver: { id: string; firstName: string; lastName: string } | null;
  approvedAt: string | null;
  createdBy: string;
  creator: { id: string; firstName: string; lastName: string };
  createdAt: string;
  updatedAt: string;
  emissionFactors?: EmissionFactor[];
  _count?: { emissionFactors: number };
}

export type MethodologyStatus =
  | "DRAFT"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "DEPLOYED"
  | "DEPRECATED";

export interface EmissionFactor {
  id: string;
  methodologyId: string;
  name: string;
  key: string;
  value: number;
  unit: string;
  year: number;
  source: string | null;
  createdBy: string;
  creator: { id: string; firstName: string; lastName: string };
  createdAt: string;
  updatedAt: string;
}

export interface MethodologyListResponse {
  success: boolean;
  message: string;
  data: Methodology[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MethodologyFilters {
  page?: number;
  limit?: number;
  status?: MethodologyStatus;
  sector?: string;
}

export interface CreateMethodologyData {
  name: string;
  code: string;
  description?: string;
  version: string;
  sector: string;
  parameters?: Record<string, unknown>;
}

export interface CreateEmissionFactorData {
  name: string;
  key: string;
  value: number;
  unit: string;
  year: number;
  source?: string;
}

// ─── API Functions ──────────────────────────────────────────────────────────

export const getMethodologies = async (
  filters: MethodologyFilters = {},
): Promise<MethodologyListResponse> => {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.status) params.set("status", filters.status);
  if (filters.sector) params.set("sector", filters.sector);

  const response = await api.get(
    `/api/admin/methodologies?${params.toString()}`,
  );
  return response.data;
};

export const getMethodologyById = async (
  id: string,
): Promise<{ success: boolean; data: Methodology }> => {
  const response = await api.get(`/api/admin/methodologies/${id}`);
  return response.data;
};

export const createMethodology = async (
  data: CreateMethodologyData,
): Promise<{ success: boolean; data: Methodology }> => {
  const response = await api.post("/api/admin/methodologies", data);
  return response.data;
};

export const updateMethodology = async (
  id: string,
  data: Partial<CreateMethodologyData>,
): Promise<{ success: boolean; data: Methodology }> => {
  const response = await api.put(`/api/admin/methodologies/${id}`, data);
  return response.data;
};

export const submitMethodology = async (
  id: string,
): Promise<{ success: boolean; data: Methodology }> => {
  const response = await api.put(`/api/admin/methodologies/${id}/submit`);
  return response.data;
};

export const approveMethodology = async (
  id: string,
): Promise<{ success: boolean; data: Methodology }> => {
  const response = await api.put(`/api/admin/methodologies/${id}/approve`);
  return response.data;
};

export const deployMethodology = async (
  id: string,
): Promise<{ success: boolean; data: Methodology }> => {
  const response = await api.put(`/api/admin/methodologies/${id}/deploy`);
  return response.data;
};

export const deprecateMethodology = async (
  id: string,
): Promise<{ success: boolean; data: Methodology }> => {
  const response = await api.put(`/api/admin/methodologies/${id}/deprecate`);
  return response.data;
};

export const uploadMethodologyDocument = async (
  id: string,
  file: File,
): Promise<{ success: boolean; data: Methodology }> => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await api.post(
    `/api/admin/methodologies/${id}/document`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};

// ─── Emission Factor API ────────────────────────────────────────────────────

export const getEmissionFactors = async (
  methodologyId: string,
): Promise<{ success: boolean; data: EmissionFactor[] }> => {
  const response = await api.get(
    `/api/admin/methodologies/${methodologyId}/emission-factors`,
  );
  return response.data;
};

export const createEmissionFactor = async (
  methodologyId: string,
  data: CreateEmissionFactorData,
): Promise<{ success: boolean; data: EmissionFactor }> => {
  const response = await api.post(
    `/api/admin/methodologies/${methodologyId}/emission-factors`,
    data,
  );
  return response.data;
};

export const updateEmissionFactor = async (
  id: string,
  data: Partial<CreateEmissionFactorData>,
): Promise<{ success: boolean; data: EmissionFactor }> => {
  const response = await api.put(`/api/admin/emission-factors/${id}`, data);
  return response.data;
};

export const deleteEmissionFactor = async (
  id: string,
): Promise<{ success: boolean }> => {
  const response = await api.delete(`/api/admin/emission-factors/${id}`);
  return response.data;
};

export const getDeployedMethodologies = async (
  sector: string,
): Promise<{ success: boolean; data: Methodology[] }> => {
  const response = await api.get(`/api/methodologies/deployed/${sector}`);
  return response.data;
};
