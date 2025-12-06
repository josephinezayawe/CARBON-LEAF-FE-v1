import { RegisterData } from "@/lib/dataSchemas";
import { success, z } from "zod";
import api from "./api";

export const SettingsAPI = {
  addSectors: async (sector: any) => {
    try {
      const result = await api.post("/api/addSector", {
        sector,
      });
      console.log(result.data);
      
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
};
