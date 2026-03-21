import api from "./api";

// ─── Types ──────────────────────────────────────────────────────────────────

export type MonitoringStatus =
  | "OPEN"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";

export interface MonitoringCycle {
  id: string;
  workspaceId: string;
  cycleNumber: number;
  startDate: string;
  endDate: string;
  activityData: Record<string, unknown> | null;
  calculatedCredits: number | null;
  reportUrl: string | null;
  status: MonitoringStatus;
  submittedBy: string | null;
  submitter: { id: string; firstName: string; lastName: string } | null;
  submittedAt: string | null;
  approvedBy: string | null;
  approver: { id: string; firstName: string; lastName: string } | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  workspace?: {
    id: string;
    sector: string;
    userId: string;
    user?: { firstName: string; lastName: string };
  };
}

export interface CreateMonitoringCycleData {
  workspaceId: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface UpdateMonitoringCycleData {
  activityData?: Record<string, unknown>;
  notes?: string;
}

// ─── API Functions ──────────────────────────────────────────────────────────

export const createMonitoringCycle = async (
  data: CreateMonitoringCycleData,
): Promise<MonitoringCycle> => {
  const response = await api.post("/api/monitoring-cycles", data);
  return response.data.data;
};

export const getMonitoringCycles = async (
  workspaceId: string,
): Promise<MonitoringCycle[]> => {
  const response = await api.get(`/api/monitoring-cycles/${workspaceId}`);
  return response.data.data;
};

export const updateMonitoringCycle = async (
  id: string,
  data: UpdateMonitoringCycleData,
): Promise<MonitoringCycle> => {
  const response = await api.put(`/api/monitoring-cycles/${id}`, data);
  return response.data.data;
};

export const submitMonitoringCycle = async (
  id: string,
): Promise<MonitoringCycle> => {
  const response = await api.put(`/api/monitoring-cycles/${id}/submit`);
  return response.data.data;
};

export const reviseMonitoringCycle = async (
  id: string,
): Promise<MonitoringCycle> => {
  const response = await api.put(`/api/monitoring-cycles/${id}/revise`);
  return response.data.data;
};

export const uploadMonitoringReport = async (
  id: string,
  file: File,
): Promise<MonitoringCycle> => {
  const formData = new FormData();
  formData.append("reportFile", file);
  const response = await api.post(
    `/api/monitoring-cycles/${id}/report`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data.data;
};

// ─── Admin API Functions ────────────────────────────────────────────────────

export const approveMonitoringCycle = async (
  id: string,
): Promise<MonitoringCycle> => {
  const response = await api.put(`/api/admin/monitoring-cycles/${id}/approve`);
  return response.data.data;
};

export const rejectMonitoringCycle = async (
  id: string,
  reason: string,
): Promise<MonitoringCycle> => {
  const response = await api.put(`/api/admin/monitoring-cycles/${id}/reject`, {
    reason,
  });
  return response.data.data;
};
