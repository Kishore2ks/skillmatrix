import type { LoginFormData, LoginResponse } from "@/features/authentication/types/authentication.types";
import apiClient from "@/shared/config/axios";

export const authService = {
  login: async (payload: LoginFormData): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login", payload);
    return response.data;
  },

  getUserProfile: async () => {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  },

  forgotPassword: async (payload: { email: string; subDomain: string }) => {
    const response = await apiClient.post("/auth/forgot-password", payload);
    return response.data;
  },

  resetPassword: async (payload: { newPassword: string; token: string }) => {
    const response = await apiClient.post("/auth/reset-password", payload);
    return response.data;
  },

  changePassword: async (payload: {
    newPassword: string;
    oldPassword: string;
  }) => {
    const response = await apiClient.post("/auth/change-password", payload);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },
};
