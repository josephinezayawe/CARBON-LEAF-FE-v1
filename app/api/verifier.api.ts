import api from "./api";

// ─── Types ──────────────────────────────────────────────────

export interface VerifierWorkspace {
  id: string;
  userId: string;
  sector: string;
  status: string;
  uploadDate: string;
  imageAssets: string[];
  creditsAwarded: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    contact: string;
  };
  asset: {
    id: string;
    name: string | null;
    assetType: string;
    sector: string;
  } | null;
  verificationRecords: VerificationRecord[];
  _count: {
    fieldData: number;
    submissions: number;
    clarificationRequests: number;
  };
}

export interface VerificationRecord {
  id: string;
  workspaceId: string;
  verifierId: string;
  status: "PENDING" | "VERIFIED" | "REJECTED" | "REVISION_REQUIRED";
  notes: string | null;
  auditReportUrl: string | null;
  createdAt: string;
  updatedAt: string;
  verifier?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface ClarificationRequest {
  id: string;
  workspaceId: string;
  fromId: string;
  toId: string;
  message: string;
  response: string | null;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
  from: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  to: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface WorkspaceHistory {
  id: string;
  userId: string;
  sector: string;
  status: string;
  uploadDate: string;
  imageAssets: string[];
  reviewResponse: string | null;
  creditsAwarded: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    contact: string;
    province: string;
    district: string;
    sector: string;
  };
  asset: Record<string, unknown> | null;
  submissions: {
    id: string;
    createdAt: string;
    images: {
      id: string;
      imageUrl: string;
      isDuplicate: boolean;
    }[];
  }[];
  fieldData: {
    id: string;
    gpsLat: number | null;
    gpsLng: number | null;
    measurements: Record<string, unknown> | null;
    notes: string | null;
    imageUrls: string[];
    status: string;
    createdAt: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }[];
  verificationRecords: VerificationRecord[];
  clarificationRequests: ClarificationRequest[];
  systemFees: {
    id: string;
    feeAmount: string;
    feePercentage: string;
    deductedAt: string;
  }[];
}

export interface VerifierStats {
  totalVerifications: number;
  pendingWorkspaces: number;
  verified: number;
  rejected: number;
  revisionRequired: number;
  openClarifications: number;
}

// ─── API Functions ──────────────────────────────────────────

/**
 * Get verifier dashboard stats
 */
export const getVerifierStats = async (): Promise<VerifierStats> => {
  const response = await api.get("/api/verifier/stats");
  return response.data.data;
};

/**
 * List workspaces for the verifier queue
 */
export const getVerifierWorkspaces = async (
  status?: string,
): Promise<VerifierWorkspace[]> => {
  const params = status && status !== "ALL" ? { status } : {};
  const response = await api.get("/api/verifier/workspaces", { params });
  return response.data.data;
};

/**
 * Get full workspace history (read-only)
 */
export const getWorkspaceHistory = async (
  id: string,
): Promise<WorkspaceHistory> => {
  const response = await api.get(`/api/verifier/workspaces/${id}/history`);
  return response.data.data;
};

/**
 * Update verification status
 */
export const updateVerificationStatus = async (
  workspaceId: string,
  status: "VERIFIED" | "REJECTED" | "REVISION_REQUIRED",
  notes?: string,
): Promise<VerificationRecord> => {
  const response = await api.post(
    `/api/verifier/workspaces/${workspaceId}/status`,
    { status, notes },
  );
  return response.data.data;
};

/**
 * Send a clarification request
 */
export const sendClarification = async (
  workspaceId: string,
  message: string,
): Promise<ClarificationRequest> => {
  const response = await api.post(
    `/api/verifier/workspaces/${workspaceId}/clarification`,
    { message },
  );
  return response.data.data;
};

/**
 * Get clarifications for a workspace
 */
export const getClarifications = async (
  workspaceId: string,
): Promise<ClarificationRequest[]> => {
  const response = await api.get(
    `/api/verifier/workspaces/${workspaceId}/clarifications`,
  );
  return response.data.data;
};

/**
 * Upload audit report for a workspace
 */
export const uploadAuditReport = async (
  workspaceId: string,
  file: File,
): Promise<VerificationRecord> => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await api.post(
    `/api/verifier/workspaces/${workspaceId}/audit-report`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data.data;
};

// ─── Credit Issuance Types ──────────────────────────────────
export interface VerifierCreditIssuance {
  id: string;
  workspaceId: string;
  workspace: {
    id: string;
    sector: string;
    asset: { name: string } | null;
  };
  vintageYear: number;
  totalCredits: number;
  serialStart: string;
  serialEnd: string;
  issuedBy: string;
  issuer: { id: string; firstName: string; lastName: string };
  issuedAt: string;
  serializationConfirmed: boolean;
  verifierConfirmedBy: string | null;
  verifierConfirmer: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  verifierConfirmedAt: string | null;
}

/**
 * Get credit issuances for this verifier's workspaces
 */
export const getVerifierCreditIssuances = async (): Promise<
  VerifierCreditIssuance[]
> => {
  const response = await api.get("/api/verifier/credit-issuances");
  return response.data.data;
};

/**
 * Confirm serialization of a credit issuance
 */
export const confirmSerialization = async (
  issuanceId: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await api.put(
    `/api/verifier/credit-issuances/${issuanceId}/confirm-serialization`,
  );
  return response.data;
};

// ─── Retirement Validation Types ──────────────────────────────────
export interface VerifierRetirement {
  id: string;
  buyerId: string;
  buyer: { id: string; firstName: string; lastName: string };
  purchaseId: string;
  quantityRetired: number;
  retirementReason: string | null;
  certificateUrl: string | null;
  certificateId: string;
  retiredAt: string;
  isValidated: boolean;
  verifierValidatedBy: string | null;
  verifierValidator: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  verifierValidatedAt: string | null;
}

/**
 * Get retirement records for this verifier's workspaces
 */
export const getVerifierRetirements = async (): Promise<
  VerifierRetirement[]
> => {
  const response = await api.get("/api/verifier/retirements");
  return response.data.data;
};

/**
 * Validate a retirement record
 */
export const validateRetirement = async (
  retirementId: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await api.put(
    `/api/verifier/retirements/${retirementId}/validate`,
  );
  return response.data;
};
