import api from "./api";

export interface AuditLogEntry {
  id: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  before: any;
  after: any;
  reason: string | null;
  ipAddress: string | null;
  createdAt: string;
  actor: {
    id: string;
    firstName: string;
    lastName: string;
    contact: string;
  };
}

export interface AuditLogResponse {
  data: AuditLogEntry[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  actorId?: string;
  action?: string;
  targetType?: string;
  startDate?: string;
  endDate?: string;
}

export const getAuditLogs = async (
  filters: AuditLogFilters = {},
): Promise<AuditLogResponse> => {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.actorId) params.set("actorId", filters.actorId);
  if (filters.action) params.set("action", filters.action);
  if (filters.targetType) params.set("targetType", filters.targetType);
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);

  const response = await api.get(`/api/admin/audit-logs?${params.toString()}`);
  return response.data;
};
