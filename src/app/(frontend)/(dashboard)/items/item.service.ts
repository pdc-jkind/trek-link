// src/app/(frontend)/(dashboard)/items/item.service.ts

import { createClient } from '@/fe/lib/client';
import { Tables, TablesInsert, TablesUpdate } from '@/types/database';

// Type aliases for better readability
type Office = Tables<'offices'>;
type ItemMaster = Tables<'item_masters'>;
type ItemVariant = Tables<'item_variants'>;
type Item = Tables<'items'>;
type ViewItemsFull = Tables<'view_items_full'>;

type CreateItemMasterPayload = TablesInsert<'item_masters'>;
type UpdateItemMasterPayload = TablesUpdate<'item_masters'> & { id: string };
type CreateItemVariantPayload = TablesInsert<'item_variants'>;
type UpdateItemVariantPayload = TablesUpdate<'item_variants'> & { id: string };
type CreateItemPayload = TablesInsert<'items'>;
type UpdateItemPayload = TablesUpdate<'items'> & { id: string };

// Filter types
interface ItemMasterFilters {
  search?: string;
  type?: string;
  office_id?: string;
  page?: number;
  limit?: number;
}

interface ItemVariantFilters {
  search?: string;
  page?: number;
  limit?: number;
}

interface ItemFilters {
  search?: string;
  item_master_id?: string;
  variant_id?: string;
  unit?: string;
  page?: number;
  limit?: number;
}

interface ViewItemsFullFilters {
  search?: string;
  item_master_id?: string;
  variant_id?: string;
  office_id?: string;
  item_master_type?: string;
  unit?: string;
  page?: number;
  limit?: number;
}

// Response types
interface PaginatedResponse<T> {
  data: T[];
  count: number;
  error?: string;
}

type ItemMastersResponse = PaginatedResponse<ItemMaster>;
type ItemVariantsResponse = PaginatedResponse<ItemVariant>;
type ItemsResponse = PaginatedResponse<Item>;
type ViewItemsFullResponse = PaginatedResponse<ViewItemsFull>;

class ItemService {
  private supabase = createClient();

  // ================================
  // OFFICES - READ ONLY
  // ================================
  
  async getOffices(): Promise<Office[]> {
    console.log('Office service: Getting all offices');
    
    try {
      const { data, error } = await this.supabase
        .from('offices')
        .select('*')
        .order('name');

      console.log('Office query result:', { 
        count: data?.length || 0, 
        hasError: !!error 
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching offices:', error);
      return [];
    }
  }

  async getOfficeById(id: string): Promise<Office | null> {
    console.log('Office service: Getting office by ID:', id);
    
    try {
      const { data, error } = await this.supabase
        .from('offices')
        .select('*')
        .eq('id', id)
        .single();

      console.log('Office by ID result:', { 
        found: !!data, 
        hasError: !!error 
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching office by ID:', error);
      return null;
    }
  }

  // ================================
  // VIEW_ITEMS_FULL - READ ONLY
  // ================================
  
  async getViewItemsFull(filters: ViewItemsFullFilters = {}): Promise<ViewItemsFullResponse> {
    console.log('View Items Full service: Getting items with filters:', filters);
    
    try {
      let query = this.supabase
        .from('view_items_full')
        .select('*', { count: 'exact' })
        .order('item_code', { ascending: true });

      // Apply filters
      if (filters.search) {
        console.log('Applying search filter:', filters.search);
        query = query.or(
          `item_name.ilike.%${filters.search}%,item_code.ilike.%${filters.search}%,item_master_name.ilike.%${filters.search}%`
        );
      }

      if (filters.item_master_id) {
        query = query.eq('item_master_id', filters.item_master_id);
      }

      if (filters.variant_id) {
        query = query.eq('variant_id', filters.variant_id);
      }

      if (filters.office_id) {
        query = query.eq('office_id', filters.office_id);
      }

      if (filters.item_master_type) {
        query = query.eq('item_master_type', filters.item_master_type);
      }

      if (filters.unit) {
        query = query.eq('unit', filters.unit);
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);
      
      const startTime = performance.now();
      const { data, error, count } = await query;
      const endTime = performance.now();

      console.log(`View Items Full query executed in ${(endTime - startTime).toFixed(2)}ms`);
      console.log('Query result:', {
        count: data?.length || 0,
        totalCount: count,
        hasError: !!error
      });

      if (error) {
        console.error('Supabase error in getViewItemsFull:', error);
        throw error;
      }
      
      return {
        data: data || [],
        count: count || 0,
      };
      
    } catch (error) {
      console.error('Exception in getViewItemsFull:', error);
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getViewItemsFullById(itemId: string): Promise<ViewItemsFull | null> {
    console.log('View Items Full service: Getting item by ID:', itemId);
    
    try {
      const { data, error } = await this.supabase
        .from('view_items_full')
        .select('*')
        .eq('item_id', itemId)
        .single();

      console.log('View Items Full by ID result:', { 
        found: !!data, 
        hasError: !!error 
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching view_items_full by id:', error);
      return null;
    }
  }

  async getViewItemsFullByCode(itemCode: string): Promise<ViewItemsFull | null> {
    console.log('View Items Full service: Getting item by code:', itemCode);
    
    try {
      const { data, error } = await this.supabase
        .from('view_items_full')
        .select('*')
        .eq('item_code', itemCode)
        .single();

      console.log('View Items Full by code result:', { 
        found: !!data, 
        hasError: !!error 
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching view_items_full by code:', error);
      return null;
    }
  }

  // ================================
  // ITEM_MASTERS CRUD
  // ================================

  async getItemMasters(filters: ItemMasterFilters = {}): Promise<ItemMastersResponse> {
    console.log('Item Masters service: Getting masters with filters:', filters);
    
    try {
      let query = this.supabase
        .from('item_masters')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.search) {
        console.log('Applying search filter:', filters.search);
        query = query.ilike('name', `%${filters.search}%`);
      }

      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      if (filters.office_id) {
        query = query.eq('office_id', filters.office_id);
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);
      
      const startTime = performance.now();
      const { data, error, count } = await query;
      const endTime = performance.now();

      console.log(`Item Masters query executed in ${(endTime - startTime).toFixed(2)}ms`);
      console.log('Query result:', {
        count: data?.length || 0,
        totalCount: count,
        hasError: !!error
      });

      if (error) {
        console.error('Supabase error in getItemMasters:', error);
        throw error;
      }
      
      return {
        data: data || [],
        count: count || 0,
      };
      
    } catch (error) {
      console.error('Exception in getItemMasters:', error);
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getItemMasterById(id: string): Promise<ItemMaster | null> {
    console.log('Item Masters service: Getting master by ID:', id);
    
    try {
      const { data, error } = await this.supabase
        .from('item_masters')
        .select('*')
        .eq('id', id)
        .single();

      console.log('Item Master by ID result:', { 
        found: !!data, 
        hasError: !!error 
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching item master:', error);
      return null;
    }
  }

  async createItemMaster(payload: CreateItemMasterPayload): Promise<ItemMaster | null> {
    console.log('Item Masters service: Creating new master');
    
    try {
      const { data, error } = await this.supabase
        .from('item_masters')
        .insert([payload])
        .select()
        .single();

      console.log('Create Item Master result:', { 
        success: !!data, 
        hasError: !!error 
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating item master:', error);
      return null;
    }
  }

  async updateItemMaster(payload: UpdateItemMasterPayload): Promise<ItemMaster | null> {
    console.log('Item Masters service: Updating master:', payload.id);
    
    try {
      const { id, ...updateData } = payload;
      const { data, error } = await this.supabase
        .from('item_masters')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      console.log('Update Item Master result:', { 
        success: !!data, 
        hasError: !!error 
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating item master:', error);
      return null;
    }
  }

  async deleteItemMaster(id: string): Promise<boolean> {
    console.log('Item Masters service: Deleting master:', id);
    
    try {
      const { error } = await this.supabase
        .from('item_masters')
        .delete()
        .eq('id', id);

      console.log('Delete Item Master result:', { 
        hasError: !!error 
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting item master:', error);
      return false;
    }
  }

  async checkItemMasterNameExists(name: string, excludeId?: string): Promise<boolean> {
    console.log('Item Masters service: Checking name exists:', { name, excludeId });
    
    try {
      let query = this.supabase
        .from('item_masters')
        .select('id')
        .eq('name', name);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      console.log('Name exists check result:', { 
        found: (data?.length || 0) > 0, 
        hasError: !!error 
      });

      if (error) throw error;
      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Error checking item master name:', error);
      return false;
    }
  }

  // ================================
  // ITEM_VARIANTS CRUD
  // ================================

  async getItemVariants(filters: ItemVariantFilters = {}): Promise<ItemVariantsResponse> {
    console.log('Item Variants service: Getting variants with filters:', filters);
    
    try {
      let query = this.supabase
        .from('item_variants')
        .select('*', { count: 'exact' })
        .order('name', { ascending: true });

      // Apply filters
      if (filters.search) {
        console.log('Applying search filter:', filters.search);
        query = query.ilike('name', `%${filters.search}%`);
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);
      
      const startTime = performance.now();
      const { data, error, count } = await query;
      const endTime = performance.now();

      console.log(`Item Variants query executed in ${(endTime - startTime).toFixed(2)}ms`);
      console.log('Query result:', {
        count: data?.length || 0,
        totalCount: count,
        hasError: !!error
      });

      if (error) {
        console.error('Supabase error in getItemVariants:', error);
        throw error;
      }
      
      return {
        data: data || [],
        count: count || 0,
      };
      
    } catch (error) {
      console.error('Exception in getItemVariants:', error);
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getItemVariantById(id: string): Promise<ItemVariant | null> {
    console.log('Item Variants service: Getting variant by ID:', id);
    
    try {
      const { data, error } = await this.supabase
        .from('item_variants')
        .select('*')
        .eq('id', id)
        .single();

      console.log('Item Variant by ID result:', { 
        found: !!data, 
        hasError: !!error 
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching item variant:', error);
      return null;
    }
  }

  async createItemVariant(payload: CreateItemVariantPayload): Promise<ItemVariant | null> {
    console.log('Item Variants service: Creating new variant');
    
    try {
      const { data, error } = await this.supabase
        .from('item_variants')
        .insert([payload])
        .select()
        .single();

      console.log('Create Item Variant result:', { 
        success: !!data, 
        hasError: !!error 
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating item variant:', error);
      return null;
    }
  }

  async updateItemVariant(payload: UpdateItemVariantPayload): Promise<ItemVariant | null> {
    console.log('Item Variants service: Updating variant:', payload.id);
    
    try {
      const { id, ...updateData } = payload;
      const { data, error } = await this.supabase
        .from('item_variants')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      console.log('Update Item Variant result:', { 
        success: !!data, 
        hasError: !!error 
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating item variant:', error);
      return null;
    }
  }

  async deleteItemVariant(id: string): Promise<boolean> {
    console.log('Item Variants service: Deleting variant:', id);
    
    try {
      const { error } = await this.supabase
        .from('item_variants')
        .delete()
        .eq('id', id);

      console.log('Delete Item Variant result:', { 
        hasError: !!error 
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting item variant:', error);
      return false;
    }
  }

  async checkItemVariantNameExists(name: string, excludeId?: string): Promise<boolean> {
    console.log('Item Variants service: Checking name exists:', { name, excludeId });
    
    try {
      let query = this.supabase
        .from('item_variants')
        .select('id')
        .eq('name', name);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      console.log('Variant name exists check result:', { 
        found: (data?.length || 0) > 0, 
        hasError: !!error 
      });

      if (error) throw error;
      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Error checking item variant name:', error);
      return false;
    }
  }

  // ================================
  // ITEMS CRUD
  // ================================

  async getItems(filters: ItemFilters = {}): Promise<ItemsResponse> {
    console.log('Items service: Getting items with filters:', filters);
    
    try {
      let query = this.supabase
        .from('items')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.search) {
        console.log('Applying search filter:', filters.search);
        query = query.or(
          `item_name.ilike.%${filters.search}%,item_code.ilike.%${filters.search}%`
        );
      }

      if (filters.item_master_id) {
        query = query.eq('item_master_id', filters.item_master_id);
      }

      if (filters.variant_id) {
        query = query.eq('variant_id', filters.variant_id);
      }

      if (filters.unit) {
        query = query.eq('unit', filters.unit);
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);

      const startTime = performance.now();
      const { data, error, count } = await query;
      const endTime = performance.now();

      console.log(`Items query executed in ${(endTime - startTime).toFixed(2)}ms`);
      console.log('Items query result:', {
        count: data?.length || 0,
        totalCount: count,
        hasError: !!error
      });

      if (error) {
        console.error('Supabase error in getItems:', error);
        throw error;
      }

      return {
        data: data || [],
        count: count || 0,
      };
      
    } catch (error) {
      console.error('Exception in getItems:', error);
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getItemById(id: string): Promise<Item | null> {
    console.log('Items service: Getting item by ID:', id);
    
    try {
      const { data, error } = await this.supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();

      console.log('Item by ID result:', { 
        found: !!data, 
        hasError: !!error 
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching item:', error);
      return null;
    }
  }

  async getItemByCode(itemCode: string): Promise<Item | null> {
    console.log('Items service: Getting item by code:', itemCode);
    
    try {
      const { data, error } = await this.supabase
        .from('items')
        .select('*')
        .eq('item_code', itemCode)
        .single();

      console.log('Item by code result:', { 
        found: !!data, 
        hasError: !!error 
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching item by code:', error);
      return null;
    }
  }

  async createItem(payload: CreateItemPayload): Promise<Item | null> {
    console.log('Items service: Creating new item');
    
    try {
      const { data, error } = await this.supabase
        .from('items')
        .insert([{
          ...payload,
          unit: payload.unit || 'pcs',
        }])
        .select()
        .single();

      console.log('Create Item result:', { 
        success: !!data, 
        hasError: !!error 
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating item:', error);
      return null;
    }
  }

  async updateItem(payload: UpdateItemPayload): Promise<Item | null> {
    console.log('Items service: Updating item:', payload.id);
    
    try {
      const { id, ...updateData } = payload;
      const { data, error } = await this.supabase
        .from('items')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      console.log('Update Item result:', { 
        success: !!data, 
        hasError: !!error 
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating item:', error);
      return null;
    }
  }

  async deleteItem(id: string): Promise<boolean> {
    console.log('Items service: Deleting item:', id);
    
    try {
      const { error } = await this.supabase
        .from('items')
        .delete()
        .eq('id', id);

      console.log('Delete Item result:', { 
        hasError: !!error 
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      return false;
    }
  }

  async checkItemCodeExists(itemCode: string, excludeId?: string): Promise<boolean> {
    console.log('Items service: Checking item code exists:', { itemCode, excludeId });
    
    try {
      let query = this.supabase
        .from('items')
        .select('id')
        .eq('item_code', itemCode);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      console.log('Item code exists check result:', { 
        found: (data?.length || 0) > 0, 
        hasError: !!error 
      });

      if (error) throw error;
      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Error checking item code:', error);
      return false;
    }
  }

  // ================================
  // UTILITY METHODS
  // ================================

  async getItemsByMaster(itemMasterId: string): Promise<Item[]> {
    console.log('Items service: Getting items by master ID:', itemMasterId);
    
    try {
      const { data, error } = await this.supabase
        .from('items')
        .select('*')
        .eq('item_master_id', itemMasterId)
        .order('item_name');

      console.log('Items by master result:', { 
        count: data?.length || 0, 
        hasError: !!error 
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching items by master:', error);
      return [];
    }
  }

  async getItemsByVariant(variantId: string): Promise<Item[]> {
    console.log('Items service: Getting items by variant ID:', variantId);
    
    try {
      const { data, error } = await this.supabase
        .from('items')
        .select('*')
        .eq('variant_id', variantId)
        .order('item_name');

      console.log('Items by variant result:', { 
        count: data?.length || 0, 
        hasError: !!error 
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching items by variant:', error);
      return [];
    }
  }

  // Generate unique item code
  async generateItemCode(prefix: string = 'ITM'): Promise<string> {
    console.log('Items service: Generating item code with prefix:', prefix);
    
    try {
      const { data, error } = await this.supabase
        .from('items')
        .select('item_code')
        .like('item_code', `${prefix}-%`)
        .order('item_code', { ascending: false })
        .limit(1);

      console.log('Generate item code query result:', { 
        count: data?.length || 0, 
        lastCode: data?.[0]?.item_code,
        hasError: !!error 
      });

      if (error) throw error;

      let nextNumber = 1;
      if (data && data.length > 0) {
        const lastCode = data[0].item_code;
        const matches = lastCode.match(/(\d+)$/);
        if (matches) {
          nextNumber = parseInt(matches[1]) + 1;
        }
      }

      const generatedCode = `${prefix}-${nextNumber.toString().padStart(3, '0')}`;
      console.log('Generated item code:', generatedCode);
      
      return generatedCode;
    } catch (error) {
      console.error('Error generating item code:', error);
      const fallbackCode = `${prefix}-001`;
      console.log('Using fallback code:', fallbackCode);
      return fallbackCode;
    }
  }

  // Get all available units from items
  async getAvailableUnits(): Promise<string[]> {
    console.log('Items service: Getting available units');
    
    try {
      const { data, error } = await this.supabase
        .from('items')
        .select('unit')
        .not('unit', 'is', null);

      console.log('Available units query result:', { 
        count: data?.length || 0, 
        hasError: !!error 
      });

      if (error) throw error;

      // Extract unique units
      const units = Array.from(new Set(data?.map(item => item.unit).filter(Boolean) || []));
      console.log('Available units:', units);
      
      return units;
    } catch (error) {
      console.error('Error fetching available units:', error);
      return ['pcs', 'kg', 'ltr', 'box']; // Default units
    }
  }

  // Get item master types
  async getItemMasterTypes(): Promise<string[]> {
    console.log('Item Masters service: Getting available types');
    
    try {
      const { data, error } = await this.supabase
        .from('item_masters')
        .select('type')
        .not('type', 'is', null);

      console.log('Item master types query result:', { 
        count: data?.length || 0, 
        hasError: !!error 
      });

      if (error) throw error;

      // Extract unique types
      const types = Array.from(new Set(data?.map(master => master.type).filter(Boolean) || []));
      console.log('Available item master types:', types);
      
      return types;
    } catch (error) {
      console.error('Error fetching item master types:', error);
      return ['consumable', 'equipment', 'material', 'service']; // Default types
    }
  }

  // Statistics methods
  async getItemStatistics(): Promise<{
    totalItems: number;
    totalItemMasters: number;
    totalVariants: number;
    itemsByOffice: Array<{ office_id: string; office_name: string; count: number }>;
    itemsByType: Array<{ type: string; count: number }>;
  }> {
    console.log('Service: Getting item statistics');
    
    try {
      // Get total counts
      const [itemsResult, mastersResult, variantsResult] = await Promise.all([
        this.supabase.from('items').select('*', { count: 'exact', head: true }),
        this.supabase.from('item_masters').select('*', { count: 'exact', head: true }),
        this.supabase.from('item_variants').select('*', { count: 'exact', head: true })
      ]);

      // Get items by office
      const itemsByOfficeResult = await this.supabase
        .from('view_items_full')
        .select('office_id, office_name')
        .not('office_id', 'is', null);

      // Get items by type  
      const itemsByTypeResult = await this.supabase
        .from('view_items_full')
        .select('item_master_type')
        .not('item_master_type', 'is', null);

      const totalItems = itemsResult.count || 0;
      const totalItemMasters = mastersResult.count || 0;
      const totalVariants = variantsResult.count || 0;

      // Process items by office
      const officeMap = new Map();
      itemsByOfficeResult.data?.forEach(item => {
        if (item.office_id && item.office_name) {
          const key = `${item.office_id}-${item.office_name}`;
          if (officeMap.has(key)) {
            officeMap.set(key, officeMap.get(key) + 1);
          } else {
            officeMap.set(key, 1);
          }
        }
      });

      const itemsByOffice = Array.from(officeMap.entries()).map(([key, count]) => {
        const [office_id, office_name] = key.split('-');
        return { office_id, office_name, count };
      });

      // Process items by type
      const typeMap = new Map();
      itemsByTypeResult.data?.forEach(item => {
        if (item.item_master_type) {
          const type = item.item_master_type;
          if (typeMap.has(type)) {
            typeMap.set(type, typeMap.get(type) + 1);
          } else {
            typeMap.set(type, 1);
          }
        }
      });

      const itemsByType = Array.from(typeMap.entries()).map(([type, count]) => ({
        type,
        count
      }));

      const statistics = {
        totalItems,
        totalItemMasters,
        totalVariants,
        itemsByOffice,
        itemsByType
      };

      console.log('Item statistics result:', statistics);
      return statistics;

    } catch (error) {
      console.error('Error fetching item statistics:', error);
      return {
        totalItems: 0,
        totalItemMasters: 0,
        totalVariants: 0,
        itemsByOffice: [],
        itemsByType: []
      };
    }
  }
}

// Export singleton instance
export const itemService = new ItemService();

// Export types for use in other files
export type {
  Office,
  ItemMaster,
  ItemVariant,
  Item,
  ViewItemsFull,
  CreateItemMasterPayload,
  UpdateItemMasterPayload,
  CreateItemVariantPayload,
  UpdateItemVariantPayload,
  CreateItemPayload,
  UpdateItemPayload,
  ItemMasterFilters,
  ItemVariantFilters,
  ItemFilters,
  ViewItemsFullFilters,
  ItemMastersResponse,
  ItemVariantsResponse,
  ItemsResponse,
  ViewItemsFullResponse,
  PaginatedResponse
};