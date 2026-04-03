import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/authStore';
import { SystemRole } from '@/shared/types/common.types';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: SystemRole[];
}

export const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.systemRole)) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};
