// src/app/(dashboard)/items/useItems.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { itemService } from './item.service';
import {
  Item,
  ItemMaster,
  CreateItemPayload,
  UpdateItemPayload,
  CreateItemMasterPayload,
  UpdateItemMasterPayload,
  ItemFilters,
  ItemMasterFilters,
} from './items.type';
import { Office } from "../offices/office.type";

// Hook for managing offices
export const useOffices = () => {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const mountedRef = useRef(true);

  const fetchOffices = useCallback(async () => {
    if (!mountedRef.current) return;
    
    console.log('🏢 Starting to fetch offices');
    setLoading(true);
    setError(null);

    try {
      const startTime = performance.now();
      const data = await itemService.getOffices();
      const endTime = performance.now();
      
      console.log(`✅ Offices fetch completed in ${(endTime - startTime).toFixed(2)}ms`);
      console.log('📊 Offices response data:', JSON.stringify({
        dataLength: data.length,
        data: data
      }, null, 2));
      
      if (!mountedRef.current) {
        console.log('⚠️ Component unmounted during offices fetch, skipping state update');
        return;
      }
      
      console.log('✅ Setting offices state:', {
        officesCount: data.length
      });
      setOffices(data);
    } catch (err) {
      console.error('💥 Exception during offices fetch:', err);
      if (!mountedRef.current) return;
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch offices';
      setError(errorMessage);
      setOffices([]);
    } finally {
      if (mountedRef.current) {
        console.log('🏁 Setting offices loading to false');
        setLoading(false);
      }
    }
  }, []);

  const getOffice = useCallback(async (id: string) => {
    console.log('🔍 Fetching single office:', id);
    
    try {
      const office = await itemService.getOfficeById(id);
      console.log('✅ Single office fetched:', JSON.stringify(office, null, 2));
      return office;
    } catch (err) {
      console.error('❌ Error fetching single office:', err);
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch office');
      }
      return null;
    }
  }, []);

  const refetch = useCallback(() => {
    console.log('🔄 Manual refetch offices requested');
    fetchOffices();
  }, [fetchOffices]);

  // Effect to fetch offices on mount
  useEffect(() => {
    console.log('🎯 useOffices effect triggered - initial fetch');
    fetchOffices();
  }, [fetchOffices]);

  // Cleanup effect
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      console.log('🧹 useOffices hook cleanup');
      mountedRef.current = false;
    };
  }, []);

  return {
    offices,
    loading,
    error,
    getOffice,
    refetch,
  };
};

// Hook for managing items
export const useItems = (initialFilters: ItemFilters = {}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<ItemFilters>({
    page: 1,
    limit: 50,
    ...initialFilters
  });
  
  const mountedRef = useRef(true);
  const filtersRef = useRef(filters);
  const initialLoadDoneRef = useRef(false); // FIXED: Added missing ref
  
  // Update filters ref when filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchItems = useCallback(async () => {
    if (!mountedRef.current) return;
    
    console.log('🔄 Starting to fetch items with filters:', JSON.stringify(filtersRef.current, null, 2));
    setLoading(true);
    setError(null);

    try {
      const startTime = performance.now();
      const response = await itemService.getItems(filtersRef.current);
      const endTime = performance.now();
      
      console.log(`✅ Items fetch completed in ${(endTime - startTime).toFixed(2)}ms`);
      console.log('📊 Items response data:', JSON.stringify({
        count: response.count,
        dataLength: response.data?.length || 0,
        hasError: !!response.error,
        error: response.error,
        sampleData: response.data?.slice(0, 2) // First 2 items for debugging
      }, null, 2));
      
      if (!mountedRef.current) {
        console.log('⚠️ Component unmounted during fetch, skipping state update');
        return;
      }
      
      if (response.error) {
        console.error('❌ Error in response:', response.error);
        setError(response.error);
        setItems([]);
        setTotalCount(0);
      } else {
        console.log('✅ Setting items state:', {
          itemsCount: response.data.length,
          totalCount: response.count
        });
        setItems(response.data);
        setTotalCount(response.count);
        setError(null);
      }
    } catch (err) {
      console.error('💥 Exception during fetch:', err);
      if (!mountedRef.current) return;
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch items';
      setError(errorMessage);
      setItems([]);
      setTotalCount(0);
    } finally {
      if (mountedRef.current) {
        console.log('🏁 Setting loading to false');
        setLoading(false);
        initialLoadDoneRef.current = true; // FIXED: Now this ref exists
      }
    }
  }, []); // Remove filters dependency to prevent infinite loops

  const createItem = useCallback(async (payload: CreateItemPayload) => {
    console.log('🆕 Creating item:', JSON.stringify(payload, null, 2));
    
    try {
      const newItem = await itemService.createItem(payload);
      
      console.log('✅ Item created:', JSON.stringify(newItem, null, 2));
      
      if (newItem && mountedRef.current) {
        setItems(prev => {
          const updated = [newItem, ...prev];
          console.log('📝 Updated items state, new count:', updated.length);
          return updated;
        });
        setTotalCount(prev => prev + 1);
        return { success: true, data: newItem };
      }
      return { success: false, error: 'Failed to create item' };
    } catch (err) {
      console.error('❌ Error creating item:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create item';
      if (mountedRef.current) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateItem = useCallback(async (payload: UpdateItemPayload) => {
    console.log('📝 Updating item:', JSON.stringify(payload, null, 2));
    
    try {
      const updatedItem = await itemService.updateItem(payload);
      
      console.log('✅ Item updated:', JSON.stringify(updatedItem, null, 2));
      
      if (updatedItem && mountedRef.current) {
        setItems(prev => {
          const updated = prev.map(item => item.id === payload.id ? updatedItem : item);
          console.log('📝 Updated items state after edit');
          return updated;
        });
        return { success: true, data: updatedItem };
      }
      return { success: false, error: 'Failed to update item' };
    } catch (err) {
      console.error('❌ Error updating item:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
      if (mountedRef.current) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    console.log('🗑️ Deleting item:', id);
    
    try {
      const success = await itemService.deleteItem(id);
      
      console.log('✅ Item deletion result:', success);
      
      if (success && mountedRef.current) {
        setItems(prev => {
          const updated = prev.filter(item => item.id !== id);
          console.log('📝 Updated items state after delete, new count:', updated.length);
          return updated;
        });
        setTotalCount(prev => prev - 1);
        return { success: true };
      }
      return { success: false, error: 'Failed to delete item' };
    } catch (err) {
      console.error('❌ Error deleting item:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
      if (mountedRef.current) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const getItem = useCallback(async (id: string) => {
    console.log('🔍 Fetching single item:', id);
    
    try {
      const item = await itemService.getItemById(id);
      console.log('✅ Single item fetched:', JSON.stringify(item, null, 2));
      return item;
    } catch (err) {
      console.error('❌ Error fetching single item:', err);
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch item');
      }
      return null;
    }
  }, []);

  const checkItemCodeExists = useCallback(async (itemCode: string, excludeId?: string) => {
    console.log('🔍 Checking if item code exists:', { itemCode, excludeId });
    
    try {
      const exists = await itemService.checkItemCodeExists(itemCode, excludeId);
      console.log('✅ Code existence check result:', exists);
      return exists;
    } catch (err) {
      console.error('❌ Error checking item code:', err);
      return false;
    }
  }, []);

  const generateItemCode = useCallback(async (prefix?: string) => {
    console.log('🆔 Generating item code with prefix:', prefix);
    
    try {
      const code = await itemService.generateItemCode(prefix);
      console.log('✅ Generated item code:', code);
      return code;
    } catch (err) {
      console.error('❌ Error generating item code:', err);
      return `ITM-001`;
    }
  }, []);

  // Fixed updateFilters function - handle empty values properly
  const updateFilters = useCallback((newFilters: Partial<ItemFilters>) => {
    console.log('🔧 Updating filters:', JSON.stringify(newFilters, null, 2));
    
    setFilters(prev => {
      const updated = { ...prev, ...newFilters, page: 1 };
      console.log('📝 New filters state:', JSON.stringify(updated, null, 2));
      return updated;
    });
  }, []);

  const resetFilters = useCallback(() => {
    console.log('🔄 Resetting filters');
    setFilters({
      page: 1,
      limit: 50,
    });
  }, []);

  // Stable refetch function that uses current filters
  const refetch = useCallback(() => {
    console.log('🔄 Manual refetch requested');
    fetchItems();
  }, [fetchItems]);

  // Main effect to fetch items when filters change
  useEffect(() => {
    console.log('🎯 useEffect triggered - filters changed:', JSON.stringify(filters, null, 2));
    fetchItems();
  }, [filters]); // Only depend on filters, not fetchItems

  // Cleanup effect
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      console.log('🧹 useItems hook cleanup');
      mountedRef.current = false;
    };
  }, []);

  console.log('📊 useItems current state:', {
    loading,
    error,
    itemsCount: items.length,
    totalCount,
    filters,
    initialLoadDone: initialLoadDoneRef.current
  });

  return {
    items,
    loading,
    error,
    totalCount,
    filters,
    createItem,
    updateItem,
    deleteItem,
    getItem,
    checkItemCodeExists,
    generateItemCode,
    updateFilters,
    resetFilters,
    refetch,
  };
};

// Hook for managing item masters
export const useItemMasters = (initialFilters: ItemMasterFilters = {}) => {
  const [itemMasters, setItemMasters] = useState<ItemMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<ItemMasterFilters>({
    page: 1,
    limit: 50,
    ...initialFilters
  });
  
  const mountedRef = useRef(true);
  const filtersRef = useRef(filters);
  const initialLoadDoneRef = useRef(false); // FIXED: Added missing ref

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchItemMasters = useCallback(async () => {
    if (!mountedRef.current) return;
    
    console.log('🔄 Starting to fetch item masters with filters:', JSON.stringify(filtersRef.current, null, 2));
    setLoading(true);
    setError(null);

    try {
      const startTime = performance.now();
      const response = await itemService.getItemMasters(filtersRef.current);
      const endTime = performance.now();
      
      console.log(`✅ Item masters fetch completed in ${(endTime - startTime).toFixed(2)}ms`);
      console.log('📊 Item masters response data:', JSON.stringify({
        count: response.count,
        dataLength: response.data?.length || 0,
        hasError: !!response.error,
        error: response.error,
        data: response.data // Log all masters since they're usually fewer
      }, null, 2));
      
      if (!mountedRef.current) {
        console.log('⚠️ Component unmounted during masters fetch, skipping state update');
        return;
      }
      
      if (response.error) {
        console.error('❌ Error in masters response:', response.error);
        setError(response.error);
        setItemMasters([]);
        setTotalCount(0);
      } else {
        console.log('✅ Setting item masters state:', {
          mastersCount: response.data.length,
          totalCount: response.count
        });
        setItemMasters(response.data);
        setTotalCount(response.count);
        setError(null);
      }
    } catch (err) {
      console.error('💥 Exception during masters fetch:', err);
      if (!mountedRef.current) return;
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch item masters';
      setError(errorMessage);
      setItemMasters([]);
      setTotalCount(0);
    } finally {
      if (mountedRef.current) {
        console.log('🏁 Setting masters loading to false');
        setLoading(false);
        initialLoadDoneRef.current = true; // FIXED: Now this ref exists
      }
    }
  }, []);

  const createItemMaster = useCallback(async (payload: CreateItemMasterPayload) => {
    console.log('🆕 Creating item master:', JSON.stringify(payload, null, 2));
    
    try {
      const newItemMaster = await itemService.createItemMaster(payload);
      
      console.log('✅ Item master created:', JSON.stringify(newItemMaster, null, 2));
      
      if (newItemMaster && mountedRef.current) {
        setItemMasters(prev => {
          const updated = [newItemMaster, ...prev];
          console.log('📝 Updated item masters state, new count:', updated.length);
          return updated;
        });
        setTotalCount(prev => prev + 1);
        return { success: true, data: newItemMaster };
      }
      return { success: false, error: 'Failed to create item master' };
    } catch (err) {
      console.error('❌ Error creating item master:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create item master';
      if (mountedRef.current) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateItemMaster = useCallback(async (payload: UpdateItemMasterPayload) => {
    console.log('📝 Updating item master:', JSON.stringify(payload, null, 2));
    
    try {
      const updatedItemMaster = await itemService.updateItemMaster(payload);
      
      console.log('✅ Item master updated:', JSON.stringify(updatedItemMaster, null, 2));
      
      if (updatedItemMaster && mountedRef.current) {
        setItemMasters(prev => {
          const updated = prev.map(master => master.id === payload.id ? updatedItemMaster : master);
          console.log('📝 Updated item masters state after edit');
          return updated;
        });
        return { success: true, data: updatedItemMaster };
      }
      return { success: false, error: 'Failed to update item master' };
    } catch (err) {
      console.error('❌ Error updating item master:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item master';
      if (mountedRef.current) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteItemMaster = useCallback(async (id: string) => {
    console.log('🗑️ Deleting item master:', id);
    
    try {
      const success = await itemService.deleteItemMaster(id);
      
      console.log('✅ Item master deletion result:', success);
      
      if (success && mountedRef.current) {
        setItemMasters(prev => {
          const updated = prev.filter(master => master.id !== id);
          console.log('📝 Updated item masters state after delete, new count:', updated.length);
          return updated;
        });
        setTotalCount(prev => prev - 1);
        return { success: true };
      }
      return { success: false, error: 'Failed to delete item master' };
    } catch (err) {
      console.error('❌ Error deleting item master:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item master';
      if (mountedRef.current) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const getItemMaster = useCallback(async (id: string) => {
    console.log('🔍 Fetching single item master:', id);
    
    try {
      const itemMaster = await itemService.getItemMasterById(id);
      console.log('✅ Single item master fetched:', JSON.stringify(itemMaster, null, 2));
      return itemMaster;
    } catch (err) {
      console.error('❌ Error fetching single item master:', err);
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch item master');
      }
      return null;
    }
  }, []);

  const checkItemMasterNameExists = useCallback(async (name: string, excludeId?: string) => {
    console.log('🔍 Checking if item master name exists:', { name, excludeId });
    
    try {
      const exists = await itemService.checkItemMasterNameExists(name, excludeId);
      console.log('✅ Name existence check result:', exists);
      return exists;
    } catch (err) {
      console.error('❌ Error checking item master name:', err);
      return false;
    }
  }, []);

  const getItemsByMaster = useCallback(async (itemMasterId: string) => {
    console.log('🔍 Fetching items by master:', itemMasterId);
    
    try {
      const items = await itemService.getItemsByMaster(itemMasterId);
      console.log('✅ Items by master fetched:', JSON.stringify({
        masterId: itemMasterId,
        itemsCount: items.length,
        items: items
      }, null, 2));
      return items;
    } catch (err) {
      console.error('❌ Error fetching items by master:', err);
      return [];
    }
  }, []);

  // Fixed updateFilters for ItemMasters too
  const updateFilters = useCallback((newFilters: Partial<ItemMasterFilters>) => {
    console.log('🔧 Updating item master filters:', JSON.stringify(newFilters, null, 2));
    
    setFilters(prev => {
      const updated = { ...prev, ...newFilters, page: 1 };
      console.log('📝 New item master filters state:', JSON.stringify(updated, null, 2));
      return updated;
    });
  }, []);

  const resetFilters = useCallback(() => {
    console.log('🔄 Resetting item master filters');
    setFilters({
      page: 1,
      limit: 50,
    });
  }, []);

  const refetch = useCallback(() => {
    console.log('🔄 Manual refetch item masters requested');
    fetchItemMasters();
  }, [fetchItemMasters]);

  // Main effect to fetch item masters when filters change
  useEffect(() => {
    console.log('🎯 useItemMasters effect triggered - filters changed:', JSON.stringify(filters, null, 2));
    fetchItemMasters();
  }, [filters]); // Only depend on filters

  // Cleanup effect
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      console.log('🧹 useItemMasters hook cleanup');
      mountedRef.current = false;
    };
  }, []);

  console.log('📊 useItemMasters current state:', {
    loading,
    error,
    itemMastersCount: itemMasters.length,
    totalCount,
    filters,
    initialLoadDone: initialLoadDoneRef.current
  });

  return {
    itemMasters,
    loading,
    error,
    totalCount,
    filters,
    createItemMaster,
    updateItemMaster,
    deleteItemMaster,
    getItemMaster,
    checkItemMasterNameExists,
    getItemsByMaster,
    updateFilters,
    resetFilters,
    refetch,
  };
};

// Combined hook for items, item masters, and offices
export const useItemsWithMasters = () => {
  const itemsHook = useItems();
  const mastersHook = useItemMasters();
  const officesHook = useOffices();

  return {
    items: itemsHook,
    masters: mastersHook,
    offices: officesHook,
  };
};