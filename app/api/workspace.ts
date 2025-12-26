import { CreateWorkspace } from "@/lib/workspaceSchemas";
import api from "./api";

export const Workspace = {
  create: async (uploadData: any) => {
    try {
      const result = await api.post("/api/uploadmultiple", uploadData);
      return {
        success: true,
        message: "Done successfully",
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error as string,
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
  getAssets: async (sector?: string) => {
    try {
      const result = await api.get(`/api/userAssets?sector=FARMER`);
      // The API returns { success, message, data: [...assets] }
      return {
        success: result.data.success ?? true,
        message: result.data.message ?? "Done successfully",
        data: result.data.data as any, // This is the array of assets
      };
    } catch (error) {
      console.error("Error fetching assets:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch assets",
        data: [],
      };
    }
  },
};
