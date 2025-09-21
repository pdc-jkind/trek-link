// src/app/(dashboard)/items/item.service.ts

import { createClient } from '@/app/(frontend)/lib/client';
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
import { Office } from "../offices/office.type";

class ItemService {
  private supabase = createClient();

  // Office methods
  async getOffices(): Promise<Office[]> {
    console.log('🏢 ItemService.getOffices called');
    
    try {
      const { data, error } = await this.supabase
        .from('offices')
        .select('*')
        .order('name');

      console.log('📊 getOffices response:', JSON.stringify({ 
        dataLength: data?.length || 0, 
        error: error?.message,
        data: data || []
      }, null, 2));

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching offices:', error);
      return [];
    }
  }

  async getOfficeById(id: string): Promise<Office | null> {
    console.log('🔍 ItemService.getOfficeById called with id:', id);
    
    try {
      const { data, error } = await this.supabase
        .from('offices')
        .select('*')
        .eq('id', id)
        .single();

      console.log('📊 getOfficeById response:', JSON.stringify({ data, error: error?.message }, null, 2));

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error fetching office:', error);
      return null;
    }
  }

  // Item Masters CRUD
  async getItemMasters(filters: ItemMasterFilters = {}): Promise<ItemMastersResponse> {
    console.log('🚀 ItemService.getItemMasters called with filters:', JSON.stringify(filters, null, 2));
    
    try {
      let query = this.supabase
        .from('item_masters')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      console.log('📋 Base query created for item_masters');

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
      
      console.log('📄 Executing item masters query...');
      const startTime = performance.now();
      const { data, error, count } = await query;
      const endTime = performance.now();

      console.log(`⏱️ Query executed in ${(endTime - startTime).toFixed(2)}ms`);
      console.log('📊 Raw Supabase response:', JSON.stringify({
        dataLength: data?.length || 0,
        count,
        error: error?.message || null,
        data: data || []
      }, null, 2));

      if (error) {
        console.error('❌ Supabase error in getItemMasters:', error);
        throw error;
      }
      
      const response = {
        data: data || [],
        count: count || 0,
      };

      console.log('✅ Returning item masters response:', JSON.stringify(response, null, 2));
      return response;
      
    } catch (error) {
      console.error('💥 Exception in getItemMasters:', error);
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getItemMasterById(id: string): Promise<ItemMaster | null> {
    console.log('🔍 ItemService.getItemMasterById called with id:', id);
    
    try {
      const { data, error } = await this.supabase
        .from('item_masters')
        .select('*')
        .eq('id', id)
        .single();

      console.log('📊 getItemMasterById response:', JSON.stringify({ data, error: error?.message }, null, 2));

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error fetching item master:', error);
      return null;
    }
  }

  async createItemMaster(payload: CreateItemMasterPayload): Promise<ItemMaster | null> {
    console.log('🆕 ItemService.createItemMaster called with payload:', JSON.stringify(payload, null, 2));
    
    try {
      const { data, error } = await this.supabase
        .from('item_masters')
        .insert([payload])
        .select()
        .single();

      console.log('📊 createItemMaster response:', JSON.stringify({ data, error: error?.message }, null, 2));

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error creating item master:', error);
      return null;
    }
  }

  async updateItemMaster(payload: UpdateItemMasterPayload): Promise<ItemMaster | null> {
    console.log('📝 ItemService.updateItemMaster called with payload:', JSON.stringify(payload, null, 2));
    
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

      console.log('📊 updateItemMaster response:', JSON.stringify({ data, error: error?.message }, null, 2));

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error updating item master:', error);
      return null;
    }
  }

  async deleteItemMaster(id: string): Promise<boolean> {
    console.log('🗑️ ItemService.deleteItemMaster called with id:', id);
    
    try {
      const { error } = await this.supabase
        .from('item_masters')
        .delete()
        .eq('id', id);

      console.log('📊 deleteItemMaster response:', JSON.stringify({ error: error?.message }, null, 2));

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('❌ Error deleting item master:', error);
      return false;
    }
  }

  // Items CRUD
  async getItems(filters: ItemFilters = {}): Promise<ItemsResponse> {
    console.log('🚀 ItemService.getItems called with filters:', JSON.stringify(filters, null, 2));
    
    try {
      let query = this.supabase
        .from('items')
        .select(`
          *,
          item_master:item_masters(*)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      console.log('📋 Base query created for items with item_master join');

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
        console.log('📦 Applying unit filter:', filters.unit);
        query = query.eq('unit', filters.unit);
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      console.log('📄 Applying pagination:', { page, limit, from, to });
      query = query.range(from, to);

      console.log('📄 Executing items query...');
      const startTime = performance.now();
      const { data, error, count } = await query;
      const endTime = performance.now();

      console.log(`⏱️ Items query executed in ${(endTime - startTime).toFixed(2)}ms`);
      console.log('📊 Raw Supabase items response:', JSON.stringify({
        dataLength: data?.length || 0,
        count,
        error: error?.message || null,
        sampleData: data?.slice(0, 2) || [] // First 2 items for debugging
      }, null, 2));

      if (error) {
        console.error('❌ Supabase error in getItems:', error);
        throw error;
      }

      const response = {
        data: data || [],
        count: count || 0,
      };

      console.log('✅ Returning items response:', JSON.stringify({
        dataLength: response.data.length,
        count: response.count
      }, null, 2));
      
      return response;
      
    } catch (error) {
      console.error('💥 Exception in getItems:', error);
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getItemById(id: string): Promise<Item | null> {
    console.log('🔍 ItemService.getItemById called with id:', id);
    
    try {
      const { data, error } = await this.supabase
        .from('items')
        .select(`
          *,
          item_master:item_masters(*)
        `)
        .eq('id', id)
        .single();

      console.log('📊 getItemById response:', JSON.stringify({ data, error: error?.message }, null, 2));

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error fetching item:', error);
      return null;
    }
  }

  async getItemByCode(itemCode: string): Promise<Item | null> {
    console.log('🔍 ItemService.getItemByCode called with code:', itemCode);
    
    try {
      const { data, error } = await this.supabase
        .from('items')
        .select(`
          *,
          item_master:item_masters(*)
        `)
        .eq('item_code', itemCode)
        .single();

      console.log('📊 getItemByCode response:', JSON.stringify({ data, error: error?.message }, null, 2));

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error fetching item by code:', error);
      return null;
    }
  }

  async createItem(payload: CreateItemPayload): Promise<Item | null> {
    console.log('🆕 ItemService.createItem called with payload:', JSON.stringify(payload, null, 2));
    
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

      console.log('📊 createItem response:', JSON.stringify({ data, error: error?.message }, null, 2));

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error creating item:', error);
      return null;
    }
  }

  async updateItem(payload: UpdateItemPayload): Promise<Item | null> {
    console.log('📝 ItemService.updateItem called with payload:', JSON.stringify(payload, null, 2));
    
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

      console.log('📊 updateItem response:', JSON.stringify({ data, error: error?.message }, null, 2));

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error updating item:', error);
      return null;
    }
  }

  async deleteItem(id: string): Promise<boolean> {
    console.log('🗑️ ItemService.deleteItem called with id:', id);
    
    try {
      const { error } = await this.supabase
        .from('items')
        .delete()
        .eq('id', id);

      console.log('📊 deleteItem response:', JSON.stringify({ error: error?.message }, null, 2));

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('❌ Error deleting item:', error);
      return false;
    }
  }

  // Utility methods
  async checkItemCodeExists(itemCode: string, excludeId?: string): Promise<boolean> {
    console.log('🔍 ItemService.checkItemCodeExists called:', { itemCode, excludeId });
    
    try {
      let query = this.supabase
        .from('items')
        .select('id')
        .eq('item_code', itemCode);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      console.log('📊 checkItemCodeExists response:', JSON.stringify({ 
        dataLength: data?.length || 0, 
        error: error?.message,
        exists: (data?.length || 0) > 0
      }, null, 2));

      if (error) throw error;
      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('❌ Error checking item code:', error);
      return false;
    }
  }

  async checkItemMasterNameExists(name: string, excludeId?: string): Promise<boolean> {
    console.log('🔍 ItemService.checkItemMasterNameExists called:', { name, excludeId });
    
    try {
      let query = this.supabase
        .from('item_masters')
        .select('id')
        .eq('name', name);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      console.log('📊 checkItemMasterNameExists response:', JSON.stringify({ 
        dataLength: data?.length || 0, 
        error: error?.message,
        exists: (data?.length || 0) > 0
      }, null, 2));

      if (error) throw error;
      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('❌ Error checking item master name:', error);
      return false;
    }
  }

  async getItemsByMaster(itemMasterId: string): Promise<Item[]> {
    console.log('🔍 ItemService.getItemsByMaster called with masterId:', itemMasterId);
    
    try {
      const { data, error } = await this.supabase
        .from('items')
        .select(`
          *,
          item_master:item_masters(*)
        `)
        .eq('item_master_id', itemMasterId)
        .order('item_name');

      console.log('📊 getItemsByMaster response:', JSON.stringify({ 
        dataLength: data?.length || 0, 
        error: error?.message,
        data: data || []
      }, null, 2));

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching items by master:', error);
      return [];
    }
  }

  // Generate unique item code
  async generateItemCode(prefix: string = 'ITM'): Promise<string> {
    console.log('🆔 ItemService.generateItemCode called with prefix:', prefix);
    
    try {
      const { data, error } = await this.supabase
        .from('items')
        .select('item_code')
        .like('item_code', `${prefix}-%`)
        .order('item_code', { ascending: false })
        .limit(1);

      console.log('📊 generateItemCode query response:', JSON.stringify({ 
        dataLength: data?.length || 0, 
        error: error?.message,
        lastCode: data?.[0]?.item_code
      }, null, 2));

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
      console.log('✅ Generated item code:', generatedCode);
      
      return generatedCode;
    } catch (error) {
      console.error('❌ Error generating item code:', error);
      const fallbackCode = `${prefix}-001`;
      console.log('⚠️ Using fallback code:', fallbackCode);
      return fallbackCode;
    }
  }
}

export const itemService = new ItemService();
