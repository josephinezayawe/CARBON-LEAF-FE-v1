import api from "./api";

export const creditIssuanceApi = {
  // Issue credits for an approved monitoring cycle
  issueCredits: async (data: {
    workspaceId: string;
    monitoringCycleId: string;
  }) => {
    const response = await api.post("/api/admin/credit-issuances", data);
    return response.data;
  },

  // List all issuances with pagination
  listIssuances: async (params?: {
    page?: number;
    limit?: number;
    workspaceId?: string;
    vintageYear?: number;
  }) => {
    const response = await api.get("/api/admin/credit-issuances", { params });
    return response.data;
  },

  // Get a single issuance by ID
  getIssuanceById: async (id: string) => {
    const response = await api.get(`/api/admin/credit-issuances/${id}`);
    return response.data;
  },

  // Get all issuances for a workspace
  getIssuancesByWorkspace: async (workspaceId: string) => {
    const response = await api.get(
      `/api/admin/credit-issuances/workspace/${workspaceId}`,
    );
    return response.data;
  },
};
