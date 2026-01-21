import api from "./api";

export const getUserAssets = async (sector?: string) => {
  const params = sector && sector !== "all" ? { sector } : {};
  return api.get("/api/userAssets", { params });
};

export const getAssetById = async (assetId: string) => {
  return api.get(`/api/specificAsset/${assetId}`);
};

export const createAsset = async (assetData: any) => {
  return api.post("/api/createAsset", assetData);
};

export const updateAsset = async (assetId: string, updateData: any) => {
  return api.put(`/api/updateAsset/${assetId}`, updateData);
};

export const deleteAsset = async (assetId: string) => {
  return api.delete(`/api/deleteAsset/${assetId}`);
};

// Fetch every asset in the system (Admin only)
export const getAllSystemAssets = async (sector?: string) => {
  const params = sector && sector !== "all" ? { sector } : {};
  return api.get("/api/admin/all-assets", { params });
};

export const approveAsset = async (assetId: string) => {
  return api.patch(`/api/${assetId}/approve`);
};
