import api from "./api";

export const loginUser = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  // Transform backend response to match frontend expectations
  return {
    user: data.data,
    token: data.token
  };
};

export const registerUser = async (userInfo) => {
  const { data } = await api.post("/auth/register", userInfo);
  // Return the response data for registration
  return data;
};

export const logoutUser = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

export const getUserProfile = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};

export const changePassword = async (passwordData) => {
  const { data } = await api.post("/auth/change-password", passwordData);
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (resetData) => {
  const { data } = await api.post("/auth/reset-password", resetData);
  return data;
};
