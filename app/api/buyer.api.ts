import api from "./api";

// ─── Types ──────────────────────────────────────────────────

export interface MarketplaceListing {
  id: string;
  saleNumber: string;
  totalCredits: number;
  availableQuantity: number;
  pricePerCredit: number;
  sectors: string[];
  description: string | null;
  soldAt: string | null;
  projectCount: number;
}

export interface BuyerPurchase {
  id: string;
  buyerId: string;
  creditSaleId: string;
  quantityPurchased: number;
  pricePerCredit: number;
  totalAmount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  creditSale: {
    saleNumber: string;
    description: string | null;
  };
}

export interface CreditRetirementRecord {
  id: string;
  buyerId: string;
  purchaseId: string;
  quantityRetired: number;
  retirementReason: string | null;
  certificateUrl: string | null;
  certificateId: string;
  retiredAt: string;
  purchase?: {
    creditSale: { saleNumber: string };
  };
}

export interface PortfolioItem {
  id: string;
  saleNumber: string;
  description: string | null;
  quantityPurchased: number;
  pricePerCredit: number;
  totalAmount: number;
  totalRetired: number;
  remainingCredits: number;
  sectors: string[];
  purchasedAt: string;
  retirements: {
    quantityRetired: number;
    retiredAt: string;
    certificateUrl: string | null;
    certificateId: string;
  }[];
}

export interface BuyerStats {
  totalCreditsOwned: number;
  activeCredits: number;
  totalRetired: number;
  totalSpent: number;
  totalPurchases: number;
  totalRetirements: number;
}

// ─── API Functions ──────────────────────────────────────────

export async function getBuyerStats(): Promise<BuyerStats> {
  const res = await api.get("/api/buyer/stats");
  return res.data.data;
}

export async function getMarketplace(
  page = 1,
  limit = 20,
): Promise<{
  data: MarketplaceListing[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const res = await api.get("/api/marketplace", {
    params: { page, limit },
  });
  return res.data;
}

export async function purchaseCredits(
  creditSaleId: string,
  quantity: number,
): Promise<BuyerPurchase> {
  const res = await api.post("/api/marketplace/purchase", {
    creditSaleId,
    quantity,
  });
  return res.data.data;
}

export async function retireCredits(
  purchaseId: string,
  quantity: number,
  retirementReason?: string,
): Promise<CreditRetirementRecord> {
  const res = await api.post("/api/marketplace/retire", {
    purchaseId,
    quantity,
    retirementReason,
  });
  return res.data.data;
}

export async function getPortfolio(): Promise<PortfolioItem[]> {
  const res = await api.get("/api/buyer/portfolio");
  return res.data.data;
}

export async function getTransactions(
  page = 1,
  limit = 20,
): Promise<{
  purchases: {
    data: BuyerPurchase[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  retirements: {
    data: CreditRetirementRecord[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> {
  const res = await api.get("/api/buyer/transactions", {
    params: { page, limit },
  });
  return res.data;
}

export async function getCertificate(
  id: string,
): Promise<CreditRetirementRecord> {
  const res = await api.get(`/api/buyer/certificates/${id}`);
  return res.data.data;
}

export async function downloadCertificate(url: string): Promise<Blob> {
  const res = await api.get(url, { responseType: "blob" });
  return res.data;
}
