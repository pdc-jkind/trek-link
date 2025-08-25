// src\types\user.types.ts

export interface User {
  id: string;
  email: string;
  phone: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  phone_confirmed_at: string | null;

  office_user_id: string;
  office_id: string;
  role_id: string;
  assigned_at: string; // ISO timestamp

  office_name: string;
  office_type: "pdc" | "distributor" | "grb"; // kalau mau lebih strict
  office_location: string;

  role_name: string;
  role_description: string;
  role_permissions: string[];
}

// Kalau response berupa array
export type UserResponse = User[];
