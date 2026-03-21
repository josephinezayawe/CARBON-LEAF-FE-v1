import api from "./api";

export const getAllUsers = async (page = 1, limit = 20) => {
  try {
    const response = await api.get("/api/allUsers", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const changeUserRole = async (
  userId: string,
  role: string,
  reason?: string,
) => {
  const response = await api.put(`/api/admin/users/${userId}/role`, {
    role,
    reason,
  });
  return response.data;
};
