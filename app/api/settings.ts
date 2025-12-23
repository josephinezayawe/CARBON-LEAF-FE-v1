import { RegisterData } from "@/lib/dataSchemas";
import { success, z } from "zod";
import api from "./api";

export const SettingsAPI = {
  addSectors: async (sector: any) => {
    try {
      const result = await api.post("/api/addSector", {
        sector,
      });

      if (result.data.success !== true) {
        return {
          success: false,
          message: result.data.message,
          data: null,
        };
      }
      return {
        success: true,
        message: result.data.message,
        data: result.data.data,
      };
    } catch (error) {}
    return {
      success: false,
      message: `${sector} Added to your sectors`,
      data: null,
    };
  },
  changePassword: async (password: string) => {
    const response = await api.post("api/changepassword", { password });
    if (!response.data.success) {
      return {
        success: false,
        message: `Failed to change password`,
        data: null,
      };
    }
    return {
      success: true,
      message: response.data.message || `Password changed successfully`,
      data: null,
    };
  },
  getUserSectors: async () => {
    const response = await api.get("api/user-sectors");
    if (!response.data.success) {
      return {
        success: false,
        message: `Failed to bring User sectors`,
        data: null,
      };
    }
    
    return {
      success: true,
      message: response.data.message || `Sectors retrieved successfully`,
      data: response.data.data,
    };
  },
};
