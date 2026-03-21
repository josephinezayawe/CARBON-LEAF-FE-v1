import { AssignableWorkspace, CreateWorkspace } from "@/lib/workspaceSchemas";
import api from "./api";

export const Workspace = {
  create: async (payload: CreateWorkspace) => {
    try {
      const result = await api.post("/api/workspaces", payload);
      return {
        success: true,
        message: result.data.message ?? "Done successfully",
        data: result.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message ??
          error?.message ??
          "Failed to create workspace",
        data: null,
      };
    }
  },
  get: async () => {
    try {
      const result = await api.get(`/api/user/workspace/`);
      return {
        success: true,
        message: "Done successfully",
        data: result.data as any,
      };
    } catch (error) {
      return {
        success: false,
        message: error as string,
      };
    }
  },
  addAsset: async (data: any) => {
    try {
      const result = await api.post(`/api/createAsset`, data);
      const responseBody = result.data ?? {};
      return {
        success: responseBody.success ?? true,
        message: responseBody.message ?? "Done successfully",
        data: responseBody.data ?? null,
      };
    } catch (error) {
      return {
        success: false,
        message: error as string,
        data: null,
      };
    }
  },
  getAssets: async (sector?: string) => {
    try {
      const result = await api.get(`/api/userAssets`, {
        params: sector ? { sector } : undefined,
      });
      return {
        success: result.data.success ?? true,
        message: result.data.message ?? "Done successfully",
        data: result.data.data as any,
      };
    } catch (error) {
      console.error("Error fetching assets:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch assets",
        data: [],
      };
    }
  },

  getAssignable: async () => {
    try {
      const result = await api.get("/api/workspaces/assignable");
      return {
        success: true,
        message:
          result.data.message ?? "Assignable workspaces retrieved successfully",
        data: (result.data.data ?? []) as AssignableWorkspace[],
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message ??
          error?.message ??
          "Failed to load workspaces",
        data: [] as AssignableWorkspace[],
      };
    }
  },

  linkMethodology: async (workspaceId: string, methodologyId: string) => {
    try {
      const result = await api.put(
        `/api/workspaces/${workspaceId}/methodology`,
        {
          methodologyId,
        },
      );
      return {
        success: true,
        message: result.data.message ?? "Methodology linked successfully",
        data: result.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message ?? "Failed to link methodology",
        data: null,
      };
    }
  },

  approveForVerification: async (workspaceId: string) => {
    try {
      const result = await api.put(
        `/api/workspaces/${workspaceId}/approve-for-verification`,
      );
      return {
        success: true,
        message: result.data.message ?? "Workspace approved for verification",
        data: result.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message ??
          "Failed to approve workspace for verification",
        data: null,
      };
    }
  },

  toggleMarketplaceListing: async (workspaceId: string) => {
    try {
      const result = await api.put(
        `/api/workspaces/${workspaceId}/marketplace-listing`,
      );
      return {
        success: true,
        message: result.data.message ?? "Marketplace listing updated",
        data: result.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message ??
          "Failed to update marketplace listing",
        data: null,
      };
    }
  },
};
