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

// Hook for managing items
export const useItems = (initialFilters: ItemFilters = {}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<ItemFilters>(initialFilters);
  
  // Use ref to track if component is mounted to prevent state updates after unmount
  const mountedRef = useRef(true);
  
  // Separate the actual fetch logic from the callback
  const fetchItems = useCallback(async (filtersToUse: ItemFilters) => {
    if (!mountedRef.current) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await itemService.getItems(filtersToUse);
      
      if (!mountedRef.current) return;
      
      if (response.error) {
        setError(response.error);
      } else {
        setItems(response.data);
        setTotalCount(response.count);
      }
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []); // No dependencies to prevent infinite loops

  const createItem = useCallback(async (payload: CreateItemPayload) => {
    try {
      const newItem = await itemService.createItem(payload);
      if (newItem && mountedRef.current) {
        setItems(prev => [newItem, ...prev]);
        setTotalCount(prev => prev + 1);
        return { success: true, data: newItem };
      }
      return { success: false, error: 'Failed to create item' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create item';
      if (mountedRef.current) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateItem = useCallback(async (payload: UpdateItemPayload) => {
    try {
      const updatedItem = await itemService.updateItem(payload);
      if (updatedItem && mountedRef.current) {
        setItems(prev => 
          prev.map(item => item.id === payload.id ? updatedItem : item)
        );
        return { success: true, data: updatedItem };
      }
      return { success: false, error: 'Failed to update item' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
      if (mountedRef.current) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    try {
      const success = await itemService.deleteItem(id);
      if (success && mountedRef.current) {
        setItems(prev => prev.filter(item => item.id !== id));
        setTotalCount(prev => prev - 1);
        return { success: true };
      }
      return { success: false, error: 'Failed to delete item' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
      if (mountedRef.current) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const getItem = useCallback(async (id: string) => {
    try {
      const item = await itemService.getItemById(id);
      return item;
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch item');
      }
      return null;
    }
  }, []);

  const checkItemCodeExists = useCallback(async (itemCode: string, excludeId?: string) => {
    return await itemService.checkItemCodeExists(itemCode, excludeId);
  }, []);

  const generateItemCode = useCallback(async (prefix?: string) => {
    return await itemService.generateItemCode(prefix);
  }, []);

  const updateFilters = useCallback((newFilters: Partial<ItemFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }; // Reset to page 1 when filtering
    setFilters(updatedFilters);
  }, [filters]);

  const resetFilters = useCallback(() => {
    const defaultFilters: ItemFilters = {};
    setFilters(defaultFilters);
  }, []);

  const refetch = useCallback(() => {
    fetchItems(filters);
  }, [fetchItems, filters]);

  // Effect to fetch items when filters change
  useEffect(() => {
    fetchItems(filters);
  }, [fetchItems, filters]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

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
  const [filters, setFilters] = useState<ItemMasterFilters>(initialFilters);
  
  const mountedRef = useRef(true);

  const fetchItemMasters = useCallback(async (filtersToUse: ItemMasterFilters) => {
    if (!mountedRef.current) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await itemService.getItemMasters(filtersToUse);
      
      if (!mountedRef.current) return;
      
      if (response.error) {
        setError(response.error);
      } else {
        setItemMasters(response.data);
        setTotalCount(response.count);
      }
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err.message : 'Failed to fetch item masters');
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const createItemMaster = useCallback(async (payload: CreateItemMasterPayload) => {
    try {
      const newItemMaster = await itemService.createItemMaster(payload);
      if (newItemMaster && mountedRef.current) {
        setItemMasters(prev => [newItemMaster, ...prev]);
        setTotalCount(prev => prev + 1);
        return { success: true, data: newItemMaster };
      }
      return { success: false, error: 'Failed to create item master' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create item master';
      if (mountedRef.current) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateItemMaster = useCallback(async (payload: UpdateItemMasterPayload) => {
    try {
      const updatedItemMaster = await itemService.updateItemMaster(payload);
      if (updatedItemMaster && mountedRef.current) {
        setItemMasters(prev => 
          prev.map(master => master.id === payload.id ? updatedItemMaster : master)
        );
        return { success: true, data: updatedItemMaster };
      }
      return { success: false, error: 'Failed to update item master' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item master';
      if (mountedRef.current) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteItemMaster = useCallback(async (id: string) => {
    try {
      const success = await itemService.deleteItemMaster(id);
      if (success && mountedRef.current) {
        setItemMasters(prev => prev.filter(master => master.id !== id));
        setTotalCount(prev => prev - 1);
        return { success: true };
      }
      return { success: false, error: 'Failed to delete item master' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item master';
      if (mountedRef.current) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const getItemMaster = useCallback(async (id: string) => {
    try {
      const itemMaster = await itemService.getItemMasterById(id);
      return itemMaster;
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch item master');
      }
      return null;
    }
  }, []);

  const checkItemMasterNameExists = useCallback(async (name: string, excludeId?: string) => {
    return await itemService.checkItemMasterNameExists(name, excludeId);
  }, []);

  const getItemsByMaster = useCallback(async (itemMasterId: string) => {
    return await itemService.getItemsByMaster(itemMasterId);
  }, []);

  const updateFilters = useCallback((newFilters: Partial<ItemMasterFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
  }, [filters]);

  const resetFilters = useCallback(() => {
    const defaultFilters: ItemMasterFilters = {};
    setFilters(defaultFilters);
  }, []);

  const refetch = useCallback(() => {
    fetchItemMasters(filters);
  }, [fetchItemMasters, filters]);

  // Effect to fetch item masters when filters change
  useEffect(() => {
    fetchItemMasters(filters);
  }, [fetchItemMasters, filters]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

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

// Combined hook for both items and item masters
export const useItemsWithMasters = () => {
  const itemsHook = useItems();
  const mastersHook = useItemMasters();

  return {
    items: itemsHook,
    masters: mastersHook,
  };
};