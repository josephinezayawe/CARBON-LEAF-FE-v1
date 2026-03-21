import api from "./api";

export interface SystemFeeSummary {
  totalFeeCredits: number;
  totalAvailableCredits: number;
  totalSoldCredits: number;
  totalRevenue: number;
  sectorBreakdown: SectorFeeBreakdown[];
  recentFees: RecentFee[];
}

export interface SectorFeeBreakdown {
  sector: string;
  totalFees: number;
  availableFees: number;
  soldFees: number;
  userCount: number;
}

export interface RecentFee {
  id: string;
  workspaceId: string;
  userId: string;
  userName: string;
  sector: string;
  grossCredits: number;
  feeAmount: number;
  feePercentage: number;
  deductedAt: string;
  isSold: boolean;
}

export interface SystemFeeDetail {
  id: string;
  workspaceId: string;
  userId: string;
  userName: string;
  sector: string;
  grossCredits: number;
  feeAmount: number;
  feePercentage: number;
  isSold: boolean;
  soldAt?: string;
  salePrice?: number;
  saleRevenue?: number;
  deductedAt: string;
}

export interface CreateSystemFeeSaleDto {
  feeCredits: number;
  pricePerCredit: number;
  buyerName?: string;
  buyerCompany?: string;
  buyerContact?: string;
  buyerEmail?: string;
  description?: string;
  notes?: string;
}

export interface SystemFeeSale {
  id: string;
  saleNumber: string;
  totalFeeCredits: number;
  pricePerCredit: number;
  totalRevenue: number;
  buyerName?: string;
  buyerCompany?: string;
  buyerContact?: string;
  buyerEmail?: string;
  description?: string;
  status: string;
  paymentStatus: string;
  soldBy: string;
  soldAt?: string;
  createdAt: string;
  notes?: string;
}

export const SystemFeeAPI = {
  /**
   * Get system fee summary
   */
  getSystemFeeSummary: async (): Promise<SystemFeeSummary> => {
    const response = await api.get("/api/system-fees/summary");
    return response.data.data;
  },

  /**
   * Get system fee details with optional filters
   */
  getSystemFeeDetails: async (filters?: {
    sector?: string;
    isSold?: boolean;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: SystemFeeDetail[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const params = new URLSearchParams();

    if (filters?.sector) params.append("sector", filters.sector);
    if (filters?.isSold !== undefined)
      params.append("isSold", String(filters.isSold));
    if (filters?.fromDate) params.append("fromDate", filters.fromDate);
    if (filters?.toDate) params.append("toDate", filters.toDate);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));

    const response = await api.get(
      `/api/system-fees/details?${params.toString()}`,
    );
    return response.data;
  },

  /**
   * Create a system fee sale
   */
  createSystemFeeSale: async (saleData: CreateSystemFeeSaleDto) => {
    const response = await api.post("/api/system-fees/sales", saleData);
    return response.data.data;
  },

  /**
   * Get all system fee sales
   */
  getSystemFeeSales: async (): Promise<SystemFeeSale[]> => {
    const response = await api.get("/api/system-fees/sales");
    return response.data.data;
  },
};
