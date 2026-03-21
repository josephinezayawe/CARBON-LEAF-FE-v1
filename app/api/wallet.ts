import { RegisterData } from "@/lib/dataSchemas";
import { z } from "zod";
import api from "./api";

export interface FinancialSummary {
  totalCreditsEarned: number;
  totalCreditsSold: number;
  totalCreditsAvailable: number;
  totalGrossRevenue: number;
  totalFeeDeducted: number;
  totalNetRevenue: number;
  pendingPayments: number;
  paidPayments: number;
  revenueByWorkspace: Array<{
    workspaceId: string;
    workspaceName: string;
    grossRevenue: number;
    netRevenue: number;
    creditsAvailable: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    grossRevenue: number;
  }>;
}

export interface SaleAllocationItem {
  id: string;
  saleNumber: string;
  credits: number;
  amountOwed: number;
  netAmount: number;
  pricePerCredit: number;
  soldAt: string | null;
  status: string;
  sector: string;
  assetName: string | null;
  serialStart: string | null;
  serialEnd: string | null;
  certificateUrl: string | null;
}

export const WalletAPI = {
  getWallet: async () => {
    try {
      const result = await api.get("/api/wallet");
      return result.data;
    } catch (error) {
      throw new Error(error as string);
    }
  },

  getFinancialSummary: async (): Promise<{
    success: boolean;
    message: string;
    data: FinancialSummary | null;
  }> => {
    try {
      const result = await api.get("/api/users/financial-summary");
      return {
        success: true,
        message: result.data.message ?? "Financial summary retrieved",
        data: result.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message ?? "Failed to get financial summary",
        data: null,
      };
    }
  },

  getSaleAllocations: async (
    page = 1,
    limit = 20,
  ): Promise<{
    data: SaleAllocationItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const result = await api.get("/api/wallet/sale-allocations", {
      params: { page, limit },
    });
    return result.data;
  },

  getCertificate: async (saleAllocationId: string) => {
    const result = await api.get(`/api/users/certificates/${saleAllocationId}`);
    return result.data;
  },
};
