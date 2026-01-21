import api from "./api";

export const settingsApi = {
  getFee: async () => {
    const response = await api.get("/api/getfee");
    return response.data;
  },

  calculateFeeAndNet: async (grossCredits: number) => {
    const response = await api.post("/api/calculate-fee", {
      grossCredits,
    });
    return response.data;
  },

  updateFee: async (percentage: number, settingId: string) => {
    const response = await api.put("/api/updatefee", {
      percentage,
      settingId,
    });
    return response.data;
  },
};
