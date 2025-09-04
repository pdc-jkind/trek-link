// src/types/office.types.ts

export interface Office {
  id: string;
  name: string;
  type: "pdc" | "distributor" | "grb" | "unset";
  location: string;
  created_at: string; // ISO timestamp
}

export type OfficeResponse = Office[];

// src/types/role.types.ts

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  created_at: string; // ISO timestamp
}

export type RoleResponse = Role[];

// src/types/office-user.types.ts

export interface OfficeUser {
  id: string;
  user_id: string;
  office_id: string;
  role_id: string;
  assigned_at: string; // ISO timestamp
}

export interface UpdateOfficeUserRequest {
  office_id?: string;
  role_id?: string;
}

export interface CreateOfficeUserRequest {
  user_id: string;
  office_id: string;
  role_id: string;
}