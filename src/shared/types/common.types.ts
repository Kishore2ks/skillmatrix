export enum SystemRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  TENANT_ADMIN = "TENANT_ADMIN",
  MANAGER = "MANAGER",
  USER = "USER",
}

export interface User {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  mobile?: string;
  businessUnit?: string;
  designation?: string;
  orgRole?: string;
  systemRole: SystemRole;
  status: "active" | "inactive";
  photoUrl?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface SearchCriteria {
  key: string;
  match: "EXACT" | "CONTAINS" | "STARTS_WITH" | "ENDS_WITH";
  value: string;
}

export interface DropdownOption {
  value: string | number;
  label: string;
}

export type ValidationRule = {
  required?: boolean;
  // extendable: add type, pattern, custom validator, etc.
};

export type ValidationConfig = Record<string, ValidationRule>;

export type ValidationResult = {
  valid: boolean;
  errors: string[];
  // annotated rows (each row may contain an `_errors` object mapping column -> error message/flag)
  rows?: Record<string, unknown>[];
};

// Lazy template query: fetch only when user requests download
export type TemplateResult = { blob: Blob; headers: Record<string, string> };
