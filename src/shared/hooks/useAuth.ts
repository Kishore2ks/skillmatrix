import { useAuthStore } from "@/shared/stores/authStore";
import { SystemRole } from "@/shared/types/common.types";

export const useAuth = () => {
  const { user, isAuthenticated, accessToken, setAuth, clearAuth, updateUser } =
    useAuthStore();

  return {
    user,
    isAuthenticated,
    accessToken,
    setAuth,
    clearAuth,
    updateUser,
  };
};

export const useHasRole = (role: SystemRole) => {
  const hasRole = useAuthStore((state) => state.hasRole);
  return hasRole(role);
};

export const useIsSuperAdmin = () => {
  const isSuperAdmin = useAuthStore((state) => state.isSuperAdmin);
  return isSuperAdmin();
};

export const useIsTenantAdmin = () => {
  const isTenantAdmin = useAuthStore((state) => state.isTenantAdmin);
  return isTenantAdmin();
};
