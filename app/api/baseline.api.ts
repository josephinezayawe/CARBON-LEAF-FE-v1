import api from "./api";

// ─── Types ──────────────────────────────────────────────────────────────────

export type BaselineStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "FROZEN"
  | "REJECTED";

export interface Baseline {
  id: string;
  workspaceId: string;
  baselineYear: number;
  baselineEmissions: number;
  measurementMethod: string;
  dataSource: string | null;
  notes: string | null;
  status: BaselineStatus;
  frozenAt: string | null;
  frozenBy: string | null;
  freezer: { id: string; firstName: string; lastName: string } | null;
  approvedBy: string | null;
  approver: { id: string; firstName: string; lastName: string } | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  createdBy: string;
  creator: { id: string; firstName: string; lastName: string };
  createdAt: string;
  updatedAt: string;
  workspace?: {
    id: string;
    sector: string;
    userId: string;
    user?: { firstName: string; lastName: string };
  };
}

export interface CreateBaselineData {
  workspaceId: string;
  baselineYear: number;
  measurementMethod: string;
  dataSource?: string;
  notes?: string;
}

export interface UpdateBaselineData {
  baselineYear?: number;
  measurementMethod?: string;
  dataSource?: string;
  notes?: string;
}

// ─── API Functions ──────────────────────────────────────────────────────────

export const createBaseline = async (
  data: CreateBaselineData,
): Promise<Baseline> => {
  const response = await api.post("/api/baselines", data);
  return response.data.data;
};

export const getBaseline = async (
  workspaceId: string,
): Promise<Baseline | null> => {
  try {
    const response = await api.get(`/api/baselines/${workspaceId}`);
    return response.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } };
    if (err.response?.status === 404) return null;
    throw error;
  }
};

export const updateBaseline = async (
  workspaceId: string,
  data: UpdateBaselineData,
): Promise<Baseline> => {
  const response = await api.put(`/api/baselines/${workspaceId}`, data);
  return response.data.data;
};

export const submitBaseline = async (
  workspaceId: string,
): Promise<Baseline> => {
  const response = await api.put(`/api/baselines/${workspaceId}/submit`);
  return response.data.data;
};

export const reviseBaseline = async (
  workspaceId: string,
): Promise<Baseline> => {
  const response = await api.put(`/api/baselines/${workspaceId}/revise`);
  return response.data.data;
};

// ─── Admin API Functions ────────────────────────────────────────────────────

export const approveBaseline = async (
  workspaceId: string,
): Promise<Baseline> => {
  const response = await api.put(`/api/admin/baselines/${workspaceId}/approve`);
  return response.data.data;
};

export const freezeBaseline = async (
  workspaceId: string,
): Promise<Baseline> => {
  const response = await api.put(`/api/admin/baselines/${workspaceId}/freeze`);
  return response.data.data;
};

export const rejectBaseline = async (
  workspaceId: string,
  reason: string,
): Promise<Baseline> => {
  const response = await api.put(`/api/admin/baselines/${workspaceId}/reject`, {
    reason,
  });
  return response.data.data;
};
