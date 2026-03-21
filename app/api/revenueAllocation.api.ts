import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4040",
  withCredentials: true,
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AllocationEntry {
  holderLabel: string;
  holderUserId?: string;
  percentage: number;
}

export interface RevenueAllocationRule {
  id: string;
  workspaceId: string;
  allocations: AllocationEntry[];
  locked: boolean;
  createdBy: string;
  creator: { id: string; firstName: string; lastName: string };
  createdAt: string;
  updatedAt: string;
}

// ─── API Calls ────────────────────────────────────────────────────────────────

export async function createAllocationRule(
  workspaceId: string,
  allocations: AllocationEntry[],
): Promise<RevenueAllocationRule> {
  const res = await API.post("/api/revenue-allocations", {
    workspaceId,
    allocations,
  });
  return res.data.data;
}

export async function getAllocationRule(
  workspaceId: string,
): Promise<RevenueAllocationRule | null> {
  try {
    const res = await API.get(`/api/revenue-allocations/${workspaceId}`);
    return res.data.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return null;
    }
    throw err;
  }
}

export async function updateAllocationRule(
  workspaceId: string,
  allocations: AllocationEntry[],
): Promise<RevenueAllocationRule> {
  const res = await API.put(`/api/revenue-allocations/${workspaceId}`, {
    allocations,
  });
  return res.data.data;
}
