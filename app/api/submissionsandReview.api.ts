// src/services/api/workspace.api.ts (or wherever your FE api calls are stored)
import api from "./api";

/**
 * Admin: Fetch all submissions for the dashboard table
 */
export const getAllSubmissions = async (page = 1, limit = 20) => {
  const response = await api.get("/api/admin/submissions", {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Admin: Approve a workspace and award credits
 * @param workspaceId string
 * @param credits number (The gross credits amount)
 */
export const approveWorkspace = async (
  workspaceId: string,
  credits: number,
) => {
  const response = await api.patch(
    `/api/admin/workspace/${workspaceId}/approve`,
    {
      credits,
    },
  );
  return response.data;
};

/**
 * Admin: Reject a workspace with a reason
 * @param workspaceId string
 * @param reason string (Rejection note)
 */
export const rejectWorkspace = async (workspaceId: string, reason: string) => {
  const response = await api.patch(
    `/api/admin/workspace/${workspaceId}/reject`,
    {
      reason,
    },
  );
  return response.data;
};

/**
 * Admin: Mark workspace as insufficient data
 * @param workspaceId string
 * @param reason string (Explanation of what's missing)
 */
export const markInsufficientData = async (
  workspaceId: string,
  reason: string,
) => {
  const response = await api.patch(
    `/api/admin/workspace/${workspaceId}/insufficient`,
    {
      reason,
    },
  );
  return response.data;
};

export const getAllDuplicates = async () => {
  const response = await api.get("/api/allsystemDuplicates");
  return response.data;
};

/**
 * Admin: Confirm that a flagged image is indeed a duplicate.
 * This usually triggers a rejection of the duplicate workspace.
 */
export const confirmDuplicateStatus = async (duplicateId: string) => {
  // Assuming the backend uses a PATCH or POST to update the flag status
  const response = await api.patch(
    `/api/admin/duplicates/${duplicateId}/confirm`,
  );
  return response.data;
};

/**
 * Admin: Mark a flagged duplicate as a False Positive.
 * This clears the flag and allows the submission to proceed.
 */
export const markAsFalsePositive = async (duplicateId: string) => {
  const response = await api.patch(
    `/api/admin/duplicates/${duplicateId}/false-positive`,
  );
  return response.data;
};

/**
 * Admin: Fetch duplicates specifically for a specific user/admin view
 * (Matches your /api/useradminduplicates route)
 */
export const getAdminUserDuplicates = async () => {
  const response = await api.get("/api/useradminduplicates");
  return response.data;
};
