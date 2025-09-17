export type OfficeType = "distributor" | "unset" | "grb" | "pdc";

export interface Office {
  id: string;
  name: string;
  type: OfficeType;
  location: string;
  created_at: Date; // bisa juga Date kalau di-parse
}