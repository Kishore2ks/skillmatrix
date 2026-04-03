import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type User, SystemRole } from "@/shared/types/common.types";

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
  hasRole: (role: SystemRole) => boolean;
  isSuperAdmin: () => boolean;
  isTenantAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user: User, accessToken: string) => {
        set({
          user,
          accessToken,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      hasRole: (role: SystemRole) => {
        const state = get();
        return state.user?.systemRole === role;
      },

      isSuperAdmin: () => {
        const state = get();
        return state.user?.systemRole === SystemRole.SUPER_ADMIN;
      },

      isTenantAdmin: () => {
        const state = get();
        return state.user?.systemRole === SystemRole.TENANT_ADMIN;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
