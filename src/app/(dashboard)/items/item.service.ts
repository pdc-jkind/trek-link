// src/app/(dashboard)/items/item.service.ts

import { createClient } from '@/lib/supabase/client';
import {
  Item,
  ItemMaster,
  CreateItemPayload,
  UpdateItemPayload,
  CreateItemMasterPayload,
  UpdateItemMasterPayload,
  ItemFilters,
  ItemMasterFilters,
  ItemsResponse,
  ItemMastersResponse,
} from './items.type';

class ItemService {
  private supabase = createClient();

  // Item Masters CRUD
  async getItemMasters(filters: ItemMasterFilters = {}): Promise<ItemMastersResponse> {
    console.log('🔍 ItemService.getItemMasters called with filters:', filters);
    
    try {
      let query = this.supabase
        .from('item_masters')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      console.log('📝 Base query created for item_masters');

      // Apply filters
      if (filters.search) {
        console.log('🔍 Applying search filter:', filters.search);
        query = query.ilike('name', `%${filters.search}%`);
      }

      if (filters.type) {
        console.log('🏷️ Applying type filter:', filters.type);
        query = query.eq('type', filters.type);
      }

      if (filters.office_id) {
        console.log('🏢 Applying office_id filter:', filters.office_id);
        query = query.eq('office_id', filters.office_id);
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      console.log('📄 Applying pagination:', { page, limit, from, to });
      query = query.range(from, to);

      console.log('🚀 Executing item_masters query...');
      const { data, error, count } = await query;

      if (error) {
        console.error('❌ Item masters query error:', error);
        throw error;
      }

      console.log('✅ Item masters query successful:', {
        dataLength: data?.length || 0,
        count: count || 0,
        data: data
      });

      return {
        data: data || [],
        count: count || 0,
      };
    } catch (error) {
      console.error('💥 Error in getItemMasters:', error);
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getItemMasterById(id: string): Promise<ItemMaster | null> {
    try {
      const { data, error } = await this.supabase
        .from('item_masters')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching item master:', error);
      return null;
    }
  }

  async createItemMaster(payload: CreateItemMasterPayload): Promise<ItemMaster | null> {
    try {
      const { data, error } = await this.supabase
        .from('item_masters')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating item master:', error);
      return null;
    }
  }

  async updateItemMaster(payload: UpdateItemMasterPayload): Promise<ItemMaster | null> {
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

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating item master:', error);
      return null;
    }
  }

  async deleteItemMaster(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('item_masters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting item master:', error);
      return false;
    }
  }

  // Items CRUD
  async getItems(filters: ItemFilters = {}): Promise<ItemsResponse> {
    console.log('🔍 ItemService.getItems called with filters:', filters);
    
    try {
      let query = this.supabase
        .from('items')
        .select(`
          *,
          item_master:item_masters(*)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      console.log('📝 Base query created for items');

      // Apply filters
      if (filters.search) {
        console.log('🔍 Applying search filter:', filters.search);
        query = query.or(
          `item_name.ilike.%${filters.search}%,item_code.ilike.%${filters.search}%`
        );
      }

      if (filters.item_master_id) {
        console.log('🏷️ Applying item_master_id filter:', filters.item_master_id);
        query = query.eq('item_master_id', filters.item_master_id);
      }

      if (filters.unit) {
        console.log('📏 Applying unit filter:', filters.unit);
        query = query.eq('unit', filters.unit);
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      console.log('📄 Applying pagination:', { page, limit, from, to });
      query = query.range(from, to);

      console.log('🚀 Executing items query...');
      const { data, error, count } = await query;

      if (error) {
        console.error('❌ Items query error:', error);
        throw error;
      }

      console.log('✅ Items query successful:', {
        dataLength: data?.length || 0,
        count: count || 0,
        sampleData: data?.[0] || 'No data'
      });

      return {
        data: data || [],
        count: count || 0,
      };
    } catch (error) {
      console.error('💥 Error in getItems:', error);
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getItemById(id: string): Promise<Item | null> {
    try {
      const { data, error } = await this.supabase
        .from('items')
        .select(`
          *,
          item_master:item_masters(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching item:', error);
      return null;
    }
  }

  async getItemByCode(itemCode: string): Promise<Item | null> {
    try {
      const { data, error } = await this.supabase
        .from('items')
        .select(`
          *,
          item_master:item_masters(*)
        `)
        .eq('item_code', itemCode)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching item by code:', error);
      return null;
    }
  }

  async createItem(payload: CreateItemPayload): Promise<Item | null> {
    try {
      const { data, error } = await this.supabase
        .from('items')
        .insert([{
          ...payload,
          unit: payload.unit || 'pcs',
        }])
        .select(`
          *,
          item_master:item_masters(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating item:', error);
      return null;
    }
  }

  async updateItem(payload: UpdateItemPayload): Promise<Item | null> {
    try {
      const { id, ...updateData } = payload;
      const { data, error } = await this.supabase
        .from('items')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select(`
          *,
          item_master:item_masters(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating item:', error);
      return null;
    }
  }

  async deleteItem(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      return false;
    }
  }

  // Utility methods
  async checkItemCodeExists(itemCode: string, excludeId?: string): Promise<boolean> {
    try {
      let query = this.supabase
        .from('items')
        .select('id')
        .eq('item_code', itemCode);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Error checking item code:', error);
      return false;
    }
  }

  async checkItemMasterNameExists(name: string, excludeId?: string): Promise<boolean> {
    try {
      let query = this.supabase
        .from('item_masters')
        .select('id')
        .eq('name', name);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Error checking item master name:', error);
      return false;
    }
  }

  async getItemsByMaster(itemMasterId: string): Promise<Item[]> {
    try {
      const { data, error } = await this.supabase
        .from('items')
        .select(`
          *,
          item_master:item_masters(*)
        `)
        .eq('item_master_id', itemMasterId)
        .order('item_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching items by master:', error);
      return [];
    }
  }

  // Generate unique item code
  async generateItemCode(prefix: string = 'ITM'): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from('items')
        .select('item_code')
        .like('item_code', `${prefix}-%`)
        .order('item_code', { ascending: false })
        .limit(1);

      if (error) throw error;

      let nextNumber = 1;
      if (data && data.length > 0) {
        const lastCode = data[0].item_code;
        const matches = lastCode.match(/(\d+)$/);
        if (matches) {
          nextNumber = parseInt(matches[1]) + 1;
        }
      }

      return `${prefix}-${nextNumber.toString().padStart(3, '0')}`;
    } catch (error) {
      console.error('Error generating item code:', error);
      return `${prefix}-001`;
    }
  }
}

export const itemService = new ItemService();