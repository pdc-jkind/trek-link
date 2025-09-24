// src/app/(frontend)/(dashboard)/items/page.tsx
"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Package,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  Search,
  ChevronDown,
  ChevronRight,
  Grid,
  List,
  Layers,
  Tag,
} from "lucide-react";
import { ItemModal } from "./components/ItemModal";
import { ItemMasterModal } from "./components/ItemMasterModal";
import { ItemVariantModal } from "./components/ItemVariantModal";
import {
  useItemsPage,
  useItemMasters,
  useItemVariants,
  useItems,
} from "./useItems";
import type { Tables } from "@/types/database";

// Type definitions based on database schema
type ViewItemsFull = Tables<"view_items_full">;
type Office = Tables<"offices">;
type ItemMaster = Tables<"item_masters">;
type ItemVariant = Tables<"item_variants">;
type Item = Tables<"items">;

// View modes
type ViewMode = "items" | "masters" | "variants";

// UI Components
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div
    className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
  >
    {children}
  </div>
);

const ActionButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  variant?: "blue" | "purple" | "green" | "red";
  disabled?: boolean;
  active?: boolean;
  toggleStyle?: boolean;
}> = ({
  onClick,
  children,
  variant = "blue",
  disabled = false,
  active = false,
  toggleStyle = false,
}) => {
  // Toggle style for view mode buttons
  if (toggleStyle) {
    const toggleVariantClasses = {
      blue: active
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-transparent text-blue-600 border-blue-300 hover:bg-blue-50",
      purple: active
        ? "bg-purple-600 text-white border-purple-600"
        : "bg-transparent text-purple-600 border-purple-300 hover:bg-purple-50",
      green: active
        ? "bg-green-600 text-white border-green-600"
        : "bg-transparent text-green-600 border-green-300 hover:bg-green-50",
      red: active
        ? "bg-red-600 text-white border-red-600"
        : "bg-transparent text-red-600 border-red-300 hover:bg-red-50",
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all disabled:opacity-50 border ${toggleVariantClasses[variant]}`}
      >
        {children}
      </button>
    );
  }

  // Default style for regular action buttons
  const variantClasses = {
    blue: active
      ? "bg-blue-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white",
    purple: active
      ? "bg-purple-700 text-white"
      : "bg-purple-600 hover:bg-purple-700 text-white",
    green: active
      ? "bg-green-700 text-white"
      : "bg-green-600 hover:bg-green-700 text-white",
    red: active
      ? "bg-red-700 text-white"
      : "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors disabled:opacity-50 ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
};

const StatsCard: React.FC<{
  title: string;
  value: string;
  color: string;
}> = ({ title, value, color }) => (
  <div className={`bg-gradient-to-r ${color} p-6 rounded-lg text-white`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <Package className="w-8 h-8 text-white/60" />
    </div>
  </div>
);

// Main Component
const ItemsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedOffice, setSelectedOffice] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>("items");

  // Modal states
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ViewItemsFull | null>(null);
  const [editingMaster, setEditingMaster] = useState<ItemMaster | null>(null);
  const [editingVariant, setEditingVariant] = useState<ItemVariant | null>(
    null
  );
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Main hook for page data
  const {
    items,
    itemsCount,
    itemsLoading,
    itemsError,
    updateItemsFilters,
    refetchItems,
    offices,
    statistics,
    generateItemCode,
    getAvailableUnits,
    loading: mainLoading,
    error: mainError,
  } = useItemsPage({
    search: searchTerm,
    item_master_id: selectedCategory || undefined,
    office_id: selectedOffice || undefined,
    page: 1,
    limit: 50,
  });

  // Separate hooks for CRUD operations
  const itemMastersHook = useItemMasters();
  const itemVariantsHook = useItemVariants();
  const itemsHook = useItems();

  // Update filters when search/filter changes
  React.useEffect(() => {
    const filters: any = {
      page: 1,
      limit: 50,
    };

    if (searchTerm) filters.search = searchTerm;
    if (selectedCategory) filters.item_master_id = selectedCategory;
    if (selectedOffice) filters.office_id = selectedOffice;

    updateItemsFilters(filters);
  }, [searchTerm, selectedCategory, selectedOffice]);

  // Group items by category (item_master)
  const groupedItems = useMemo(() => {
    const groups: {
      [key: string]: {
        master: {
          id: string;
          name: string | null;
          type: string | null;
          img_url: string | null;
        };
        items: ViewItemsFull[];
        office: {
          id: string | null;
          name: string | null;
          location?: string | null;
        };
      };
    } = {};

    items.forEach((item) => {
      const masterId = item.item_master_id;
      if (masterId && !groups[masterId]) {
        groups[masterId] = {
          master: {
            id: masterId,
            name: item.item_master_name,
            type: item.item_master_type,
            img_url: item.item_master_img_url,
          },
          items: [],
          office: {
            id: item.office_id,
            name: item.office_name,
          },
        };
      }
      if (masterId) {
        groups[masterId].items.push(item);
      }
    });

    // Enrich office data with location from offices array
    Object.values(groups).forEach((group) => {
      if (group.office.id) {
        const office = offices.find((o) => o.id === group.office.id);
        if (office) {
          group.office.location = office.location;
        }
      }
    });

    return Object.values(groups);
  }, [items, offices]);

  // Stats calculation
  const stats = useMemo(() => {
    const totalItems = statistics.totalItems || 0;
    const totalMasters = statistics.totalItemMasters || 0;
    const regularItems =
      statistics.itemsByType.find((t) => t.type === "regular")?.count || 0;
    const inventoryItems =
      statistics.itemsByType.find((t) => t.type === "inventory")?.count || 0;

    return [
      {
        title: "Total Items",
        value: totalItems.toString(),
        color: "from-blue-500 to-blue-600",
      },
      {
        title: "Regular Items",
        value: regularItems.toString(),
        color: "from-green-500 to-green-600",
      },
      {
        title: "Inventory Items",
        value: inventoryItems.toString(),
        color: "from-yellow-500 to-yellow-600",
      },
      {
        title: "Categories",
        value: totalMasters.toString(),
        color: "from-purple-500 to-purple-600",
      },
    ];
  }, [statistics]);

  // Toggle expand/collapse for group
  const toggleGroupExpansion = (masterId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(masterId)) {
      newExpanded.delete(masterId);
    } else {
      newExpanded.add(masterId);
    }
    setExpandedGroups(newExpanded);
  };

  // Generate sequential item codes for multiple items
  const generateSequentialCodes = async (
    baseCode: string,
    count: number
  ): Promise<string[]> => {
    const codes: string[] = [];

    // Extract prefix and number from base code (e.g., "ITM-001" -> "ITM" and 1)
    const parts = baseCode.split("-");
    const prefix = parts.slice(0, -1).join("-");
    const startNumber = parseInt(parts[parts.length - 1]) || 1;

    for (let i = 0; i < count; i++) {
      const number = startNumber + i;
      const paddedNumber = number.toString().padStart(3, "0");
      codes.push(`${prefix}-${paddedNumber}`);
    }

    return codes;
  };

  // Handlers
  const handleAddItem = () => {
    setEditingItem(null);
    setModalMode("create");
    setIsItemModalOpen(true);
  };

  const handleAddMaster = () => {
    setEditingMaster(null);
    setModalMode("create");
    setIsMasterModalOpen(true);
  };

  const handleAddVariant = () => {
    setEditingVariant(null);
    setModalMode("create");
    setIsVariantModalOpen(true);
  };

  const handleViewItem = (item: ViewItemsFull) => {
    console.log("Viewing item:", item);
    // TODO: Implement view item details
  };

  const handleEditItem = (item: ViewItemsFull) => {
    setEditingItem(item);
    setModalMode("edit");
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = async (item: ViewItemsFull) => {
    if (item.item_id && window.confirm(`Hapus item ${item.item_name}?`)) {
      const success = await itemsHook.deleteItem(item.item_id);
      if (success) {
        refetchItems();
      }
    }
  };

  const handleEditMaster = (master: ItemMaster) => {
    setEditingMaster(master);
    setModalMode("edit");
    setIsMasterModalOpen(true);
  };

  const handleDeleteMaster = async (master: ItemMaster) => {
    if (window.confirm(`Hapus kategori ${master.name}?`)) {
      const success = await itemMastersHook.deleteItemMaster(master.id);
      if (success) {
        refetchItems();
      }
    }
  };

  const handleEditVariant = (variant: ItemVariant) => {
    setEditingVariant(variant);
    setModalMode("edit");
    setIsVariantModalOpen(true);
  };

  const handleDeleteVariant = async (variant: ItemVariant) => {
    if (window.confirm(`Hapus variant ${variant.name}?`)) {
      const success = await itemVariantsHook.deleteItemVariant(variant.id);
      if (success) {
        refetchItems();
      }
    }
  };

  // Modal handlers
  const handleSaveItem = async (data: any) => {
    try {
      let result;

      if (modalMode === "edit" && editingItem && editingItem.item_id) {
        // Edit single item
        result = await itemsHook.updateItem({
          id: editingItem.item_id,
          ...data,
        });
      } else {
        // Create new item(s)
        if (data.items && Array.isArray(data.items)) {
          // Multiple items - generate sequential codes
          const baseCode = data.baseItemCode || (await generateItemCode());
          const sequentialCodes = await generateSequentialCodes(
            baseCode,
            data.items.length
          );

          const results = await Promise.all(
            data.items.map((itemData: any, index: number) =>
              itemsHook.createItem({
                ...itemData,
                item_code: sequentialCodes[index],
                item_master_id: data.item_master_id, // ✅ Make sure item_master_id is included
              })
            )
          );
          result = results.every((r) => r !== null);
        } else {
          // Single item
          result = await itemsHook.createItem({
            ...data,
            // ✅ Ensure item_master_id is explicitly included for single item creation
            item_master_id: data.item_master_id,
          });
        }
      }

      if (result) {
        setIsItemModalOpen(false);
        refetchItems();
        return { success: true };
      } else {
        return { success: false, error: "Gagal menyimpan item" };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Terjadi kesalahan",
      };
    }
  };

  const handleSaveMaster = async (data: any) => {
    try {
      let result;

      if (modalMode === "edit" && editingMaster) {
        result = await itemMastersHook.updateItemMaster(data);
      } else {
        result = await itemMastersHook.createItemMaster(data);
      }

      if (result) {
        setIsMasterModalOpen(false);
        refetchItems();
        return { success: true };
      } else {
        return { success: false, error: "Gagal menyimpan kategori" };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Terjadi kesalahan",
      };
    }
  };

  const handleSaveVariant = async (data: any) => {
    try {
      let result;

      if (modalMode === "edit" && editingVariant) {
        result = await itemVariantsHook.updateItemVariant(data);
      } else {
        result = await itemVariantsHook.createItemVariant(data);
      }

      if (result) {
        setIsVariantModalOpen(false);
        refetchItems();
        return { success: true };
      } else {
        return { success: false, error: "Gagal menyimpan variant" };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Terjadi kesalahan",
      };
    }
  };

  // Helper function untuk display name mapping
  const getDisplayName = (itemName: string | null): string => {
    if (!itemName) return "";

    const nameMap: { [key: string]: string } = {
      BD: "Backdoor",
      FD: "Full Depan",
    };

    return nameMap[itemName] || itemName;
  };

  // Render different views based on viewMode
  const renderTableContent = () => {
    if (viewMode === "masters") {
      return (
        <tbody className="divide-y divide-gray-200">
          {itemMastersHook.data.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-10">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada data kategori.</p>
              </td>
            </tr>
          ) : (
            itemMastersHook.data.map((master) => (
              <tr
                key={master.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <img
                    src={master.img_url || "/img/mobil.webp"}
                    alt={master.name || "Item Master"}
                    className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">{master.name}</div>
                  <div className="text-xs text-gray-500">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        master.type === "regular"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {master.type}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-600">
                    {new Date(master.created_at || "").toLocaleDateString(
                      "id-ID"
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-600">
                    {new Date(master.updated_at || "").toLocaleDateString(
                      "id-ID"
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center space-x-1">
                    <button
                      onClick={() => handleEditMaster(master)}
                      className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                      title="Edit Kategori"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMaster(master)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                      title="Delete Kategori"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      );
    }

    if (viewMode === "variants") {
      return (
        <tbody className="divide-y divide-gray-200">
          {itemVariantsHook.data.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-10">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada data variant.</p>
              </td>
            </tr>
          ) : (
            itemVariantsHook.data.map((variant) => (
              <tr
                key={variant.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                    <Tag className="w-6 h-6 text-gray-400" />
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">
                    {variant.name}
                  </div>
                  <div className="text-xs text-gray-500">Variant</div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-600">
                    {new Date(variant.created_at || "").toLocaleDateString(
                      "id-ID"
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-600">
                    {new Date(variant.updated_at || "").toLocaleDateString(
                      "id-ID"
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center space-x-1">
                    <button
                      onClick={() => handleEditVariant(variant)}
                      className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                      title="Edit Variant"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteVariant(variant)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                      title="Delete Variant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      );
    }

    // Default items view
    return (
      <tbody className="divide-y divide-gray-200">
        {groupedItems.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center py-10">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || selectedCategory || selectedOffice
                  ? "Tidak ada barang yang sesuai dengan filter."
                  : "Belum ada data barang."}
              </p>
            </td>
          </tr>
        ) : (
          groupedItems.map((group) => (
            <tr
              key={group.master.id}
              className={`hover:bg-gray-50 transition-colors ${
                group.items.length > 1 ? "cursor-pointer" : ""
              }`}
              onClick={() => {
                if (group.items.length > 1) {
                  toggleGroupExpansion(group.master.id);
                }
              }}
            >
              {/* Image */}
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={group.master.img_url || "/img/mobil.webp"}
                    alt={group.master.name || "Item"}
                    className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                  />
                  {group.items.length > 1 && (
                    <div className="text-gray-400">
                      {expandedGroups.has(group.master.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </div>
              </td>

              {/* PDC */}
              <td className="py-3 px-4">
                {group.office && (
                  <div>
                    <div className="font-medium text-gray-900">
                      {group.office.name}
                    </div>
                    {group.office.location && (
                      <div className="text-xs text-gray-500">
                        {group.office.location}
                      </div>
                    )}
                  </div>
                )}
              </td>

              {/* Kategori */}
              <td className="py-3 px-4">
                <div className="font-medium text-gray-900">
                  {group.master.name}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      group.master.type === "regular"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {group.master.type}
                  </span>
                </div>
              </td>

              {/* Nama Barang */}
              <td className="py-3 px-4">
                <div className="space-y-2">
                  {/* First item is always shown */}
                  {group.items.slice(0, 1).map((item) => (
                    <div
                      key={item.item_id}
                      className="border-l-2 border-blue-400 pl-3"
                    >
                      <div className="font-medium text-gray-900 text-sm">
                        {getDisplayName(item.item_name)}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        {item.variant_name && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {item.variant_name}
                          </span>
                        )}
                        <span>{item.unit}</span>
                        {item.alt_unit && item.conversion_to_base && (
                          <span className="text-gray-400">
                            • {item.alt_unit} ({item.conversion_to_base}
                            :1)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Show remaining items if expanded */}
                  {group.items.length > 1 &&
                    expandedGroups.has(group.master.id) &&
                    group.items.slice(1).map((item) => (
                      <div
                        key={item.item_id}
                        className="border-l-2 border-gray-300 pl-3"
                      >
                        <div className="font-medium text-gray-900 text-sm">
                          {getDisplayName(item.item_name)}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          {item.variant_name && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {item.variant_name}
                            </span>
                          )}
                          <span>{item.unit}</span>
                          {item.alt_unit && item.conversion_to_base && (
                            <span className="text-gray-400">
                              • {item.alt_unit} ({item.conversion_to_base}
                              :1)
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                  {/* Show count if collapsed and more than 1 item */}
                  {group.items.length > 1 &&
                    !expandedGroups.has(group.master.id) && (
                      <div className="text-xs text-blue-600 font-medium cursor-pointer hover:text-blue-800">
                        +{group.items.length - 1} item lainnya (klik untuk
                        expand)
                      </div>
                    )}
                </div>
              </td>

              {/* Actions */}
              <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                <div className="space-y-2">
                  {/* First item actions */}
                  <div className="flex items-center justify-center space-x-1">
                    <button
                      onClick={() => handleEditItem(group.items[0])}
                      className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                      title="Edit Item"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(group.items[0])}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Actions for remaining items if expanded */}
                  {group.items.length > 1 &&
                    expandedGroups.has(group.master.id) &&
                    group.items.slice(1).map((item) => (
                      <div
                        key={item.item_id}
                        className="flex items-center justify-center space-x-1 pt-1 border-t border-gray-100"
                      >
                        <button
                          onClick={() => handleEditItem(item)}
                          className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                          title="Edit Item"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    );
  };

  // Get table headers based on view mode
  const getTableHeaders = () => {
    if (viewMode === "masters") {
      return [
        "Image",
        "Nama Kategori",
        "Tanggal Dibuat",
        "Tanggal DiUpdate",
        "Aksi",
      ];
    } else if (viewMode === "variants") {
      return [
        "Icon",
        "Nama Variant",
        "Tanggal Dibuat",
        "Tanggal DiUpdate",
        "Aksi",
      ];
    } else {
      return ["Image", "PDC", "Kategori (KF/INV)", "Nama Barang", "Aksi"];
    }
  };

  // Show loading state
  if (mainLoading && items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (mainError && items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Gagal memuat data: {mainError}</p>
          <ActionButton onClick={() => refetchItems()} variant="blue">
            Coba Lagi
          </ActionButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
              <Package className="w-8 h-8 text-blue-600" />
              <span>Pengelolaan Barang</span>
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola data barang dan kategori
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <ActionButton onClick={() => console.log("Filter")} variant="blue">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </ActionButton>
            {viewMode === "items" && (
              <ActionButton onClick={handleAddItem} variant="purple">
                <Plus className="w-4 h-4" />
                <span>Tambah Barang</span>
              </ActionButton>
            )}
            {viewMode === "masters" && (
              <ActionButton onClick={handleAddMaster} variant="green">
                <Plus className="w-4 h-4" />
                <span>Tambah Kategori</span>
              </ActionButton>
            )}
            {viewMode === "variants" && (
              <ActionButton onClick={handleAddVariant} variant="blue">
                <Plus className="w-4 h-4" />
                <span>Tambah Variant</span>
              </ActionButton>
            )}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                Tampilan:
              </span>
              <div className="flex items-center space-x-1">
                <ActionButton
                  onClick={() => setViewMode("items")}
                  variant="blue"
                  active={viewMode === "items"}
                  toggleStyle={true}
                >
                  <Grid className="w-4 h-4" />
                  <span>Items</span>
                </ActionButton>
                <ActionButton
                  onClick={() => setViewMode("masters")}
                  variant="green"
                  active={viewMode === "masters"}
                  toggleStyle={true}
                >
                  <Layers className="w-4 h-4" />
                  <span>Kategori</span>
                </ActionButton>
                <ActionButton
                  onClick={() => setViewMode("variants")}
                  variant="purple"
                  active={viewMode === "variants"}
                  toggleStyle={true}
                >
                  <Tag className="w-4 h-4" />
                  <span>Variant</span>
                </ActionButton>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={
                  viewMode === "items"
                    ? "Cari kode barang, nama barang..."
                    : viewMode === "masters"
                    ? "Cari nama kategori..."
                    : "Cari nama variant..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            {viewMode === "items" && (
              <>
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="">Semua Kategori</option>
                  {itemMastersHook.data.map((master) => (
                    <option key={master.id} value={master.id}>
                      {master.name}
                    </option>
                  ))}
                </select>

                {/* Office Filter */}
                <select
                  value={selectedOffice}
                  onChange={(e) => setSelectedOffice(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="">Semua Office</option>
                  {offices.map((office) => (
                    <option key={office.id} value={office.id}>
                      {office.name}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>

        {/* Loading overlay for table */}
        {itemsLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto relative">
          <table className="min-w-full bg-white border-collapse table-fixed">
            <colgroup>
              <col className="w-40" />
              <col className="w-36" />
              <col className="w-58" />
              <col />
              <col className="w-24" />
            </colgroup>
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {getTableHeaders().map((header, index) => (
                  <th
                    key={index}
                    className="text-left py-3 px-4 font-semibold text-gray-900"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            {renderTableContent()}
          </table>
        </div>

        {/* Footer with additional actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {viewMode === "items" &&
                `Menampilkan ${items.length} dari ${itemsCount} barang`}
              {viewMode === "masters" &&
                `Menampilkan ${itemMastersHook.data.length} dari ${itemMastersHook.count} kategori`}
              {viewMode === "variants" &&
                `Menampilkan ${itemVariantsHook.data.length} dari ${itemVariantsHook.count} variant`}
            </div>
            <div className="flex items-center space-x-3">
              {viewMode === "items" && (
                <>
                  <ActionButton onClick={handleAddMaster} variant="green">
                    <Plus className="w-4 h-4" />
                    <span>Tambah Kategori</span>
                  </ActionButton>
                  <ActionButton onClick={handleAddVariant} variant="blue">
                    <Plus className="w-4 h-4" />
                    <span>Tambah Variant</span>
                  </ActionButton>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Card - Moved to bottom */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Statistik Data
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </Card>

      {/* Modals */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        onCreateMaster={handleAddMaster}
        onCreateVariant={handleAddVariant}
        item={editingItem}
        itemMasters={itemMastersHook.data}
        itemVariants={itemVariantsHook.data}
        mode={modalMode}
        checkItemCodeExists={itemsHook.checkItemCodeExists}
        generateItemCode={generateItemCode}
        generateSequentialCodes={generateSequentialCodes}
      />

      <ItemMasterModal
        isOpen={isMasterModalOpen}
        onClose={() => setIsMasterModalOpen(false)}
        onSave={handleSaveMaster}
        itemMaster={editingMaster}
        mode={modalMode}
        checkNameExists={itemMastersHook.checkNameExists}
        offices={offices}
        officesLoading={false}
      />

      <ItemVariantModal
        isOpen={isVariantModalOpen}
        onClose={() => setIsVariantModalOpen(false)}
        onSave={handleSaveVariant}
        itemVariant={editingVariant}
        mode={modalMode}
        checkNameExists={itemVariantsHook.checkNameExists}
      />
    </div>
  );
};

export default ItemsPage;
