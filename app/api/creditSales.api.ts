import api from "./api";

export const creditSalesApi = {
  // Get current system-wide available credits and user-wise breakdown
  getAvailableCredits: async () => {
    const response = await api.get("/api/credit-sales/available");
    return response.data;
  },

  // Preview how a specific amount of credits will be allocated (FIFO)
  previewSaleAllocation: async (creditsToSell: number) => {
    const response = await api.post("/api/credit-sales/preview", {
      creditsToSell,
    });
    return response.data;
  },

  // Execute a new credit sale
  createSale: async (saleData: {
    buyerName: string;
    buyerContact: string;
    buyerEmail: string;
    purpose: string;
    creditsToSell: number;
    pricePerCredit: number;
  }) => {
    const response = await api.post("/api/credit-sales", saleData);
    return response.data;
  },

  // Get a history of all credit sales
  getAllSales: async (page = 1, limit = 20) => {
    const response = await api.get("/api/credit-sales", {
      params: { page, limit },
    });
    return response.data;
  },

  // Get detailed information of a specific sale by its ID
  getSaleById: async (saleId: string) => {
    const response = await api.get(`/api/credit-sales/${saleId}`);
    return response.data;
  },
};
