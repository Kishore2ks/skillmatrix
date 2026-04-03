export interface LoginFormData {
  userName: string; // Supports email, mobile, or employee ID
  password: string;
  subDomainName?: string;
}

// Legacy support - can be removed if not needed
export interface LegacyLoginFormData {
  email: string;
  password: string;
  tenantId?: string;
}

export interface LoginResponse {
  statusCode: string;
  statusMessage: string;
  saResult: {
    result: {
      user: {
        id: number;
        employeeId: string;
        name: string;
        email: string;
        mobile?: string;
        businessUnit?: string;
        designation?: string;
        orgRole?: string;
        systemRole: string;
        status: string;
        photoUrl?: string;
      };
      accessToken: string;
    };
  };
}
