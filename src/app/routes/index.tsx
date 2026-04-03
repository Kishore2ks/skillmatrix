import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { RoleProtectedRoute } from "@/shared/components/RoleProtectedRoute";
import { SystemRole } from "@/shared/types/common.types";
import MainLayout from "@/shared/components/layout/MainLayout";
import LandingLayout from "@/shared/components/layout/LandingLayout";

// Lazy load pages for better code splitting
const Login = lazy(() => import("@/features/auth/Login"));
const Index = lazy(() => import("@/app/Index"));
const LandingPage = lazy(() => import("@/features/auth/LandingPage"));
// const UserList = lazy(() => import("@/features/user/UserList"));
// const UserManagement = lazy(() => import("@/features/user/UserManagement"));
const SkillMatrix = lazy(() => import("@/features/skill-matrix/SkillMatrix"));
// const CareerPath = lazy(() => import("@/features/career-path/CareerPath"));
// const OrgUnitList = lazy(() => import("@/features/organization-unit/pages/OrgUnitListPage"));
// const OrgUnitManagement = lazy(() => import("@/features/organization-unit/pages/OrgUnitManagement"));
// const OrgUnitForm = lazy(() => import("@/features/organization-unit/pages/OrgUnitForm"));
// const OrganizationsDashboard = lazy(() => import("@/features/organization/pages/OrganizationsDashboard"));
// const CreateOrganization = lazy(() => import("@/features/organization/pages/CreateOrganization"));
// const EditOrganization = lazy(() => import("@/features/organization/pages/EditOrganization"));
// const GenerateLicense = lazy(() => import("@/features/organization/pages/GenerateLicense"));
// const OrgRolesList = lazy(() => import("@/features/organization-roles/pages/OrgRolesListPage"));
// const OrgRolesManagement = lazy(() => import("@/features/organization-roles/pages/OrgRolesManagement"));
const NotFound = lazy(() => import("@/app/routes/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/demo" replace />} />
        <Route
          path="/setup/skill-matrix"
          element={
            <ProtectedRoute>
              <SkillMatrix />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="/demo"
        element={
          <LandingLayout>
            <SkillMatrix />
          </LandingLayout>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);
