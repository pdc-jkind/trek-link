// src/app/(dashboard)/items/items.type.ts

export interface ItemMaster {
  id: string;
  name: string;
  type: 'regular' | 'inventory';
  office_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  item_code: string;
  item_name: string;
  unit: string;
  alt_unit: string | null;
  conversion_to_base: number | null;
  item_master_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined data from item_master
  item_master?: ItemMaster;
}

// Extended Item with calculated fields for UI
export interface ItemWithDetails extends Item {
  category: string; // from item_master.name
  status: 'active' | 'inactive' | 'discontinued';
  currentStock: number;
  minStock: number;
  price: number;
  supplier: string;
  description: string;
}

// Form types
export interface CreateItemMasterPayload {
  name: string;
  type: 'regular' | 'inventory';
  office_id: string;
}

export interface UpdateItemMasterPayload extends Partial<CreateItemMasterPayload> {
  id: string;
}

export interface CreateItemPayload {
  item_code: string;
  item_name: string;
  unit?: string;
  alt_unit?: string | null;
  conversion_to_base?: number | null;
  item_master_id?: string | null;
}

export interface UpdateItemPayload extends Partial<CreateItemPayload> {
  id: string;
}

// API Response types
export interface ItemsResponse {
  data: Item[];
  count: number;
  error?: string;
}

export interface ItemMastersResponse {
  data: ItemMaster[];
  count: number;
  error?: string;
}

// Filter and pagination types
export interface ItemFilters {
  search?: string;
  item_master_id?: string;
  unit?: string;
  page?: number;
  limit?: number;
}

export interface ItemMasterFilters {
  search?: string;
  type?: 'regular' | 'inventory';
  office_id?: string;
  page?: number;
  limit?: number;
}