// src/app/(frontend)/(dashboard)/items/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
} from "lucide-react";
import { Tables, TablesInsert, TablesUpdate } from "@/types/database";
import { ItemModal } from "./components/ItemModal";
import { ItemMasterModal } from "./components/ItemMasterModal";
import { ItemVariantModal } from "./components/ItemVariantModal";

// Types from database
type Item = Tables<"items"> & {
  item_master?: Tables<"item_masters"> | null;
  item_variant?: Tables<"item_variants"> | null;
};

type ItemMaster = Tables<"item_masters">;
type ItemVariant = Tables<"item_variants">;
type Office = Tables<"offices">;

// Dummy data
const dummyOffices: Office[] = [
  {
    id: "office-1",
    name: "Jakarta PDC",
    location: "Jakarta Selatan",
    type: "pdc",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "office-2",
    name: "Surabaya PDC",
    location: "Surabaya Barat",
    type: "pdc",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "office-3",
    name: "Bandung GRB",
    location: "Bandung Utara",
    type: "grb",
    created_at: "2024-01-01T00:00:00Z",
  },
];

const dummyItemMasters: ItemMaster[] = [
  {
    id: "master-1",
    name: "Kaca Film Premium",
    type: "regular",
    office_id: "office-1",
    img_url: "https://via.placeholder.com/100x100?text=Premium",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "master-2",
    name: "Kaca Film Standard",
    type: "regular",
    office_id: "office-1",
    img_url: "https://via.placeholder.com/100x100?text=Standard",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "master-3",
    name: "Aksesoris Mobil",
    type: "inventory",
    office_id: "office-2",
    img_url: "https://via.placeholder.com/100x100?text=Aksesoris",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

const dummyItemVariants: ItemVariant[] = [
  {
    id: "variant-1",
    name: "Premium",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "variant-2",
    name: "Standard",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "variant-3",
    name: "Deluxe",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

const dummyItems: Item[] = [
  {
    id: "item-1",
    item_code: "KFP001",
    item_name: "3M Crystalline 70",
    unit: "roll",
    alt_unit: "meter",
    conversion_to_base: 30,
    item_master_id: "master-1",
    variant_id: "variant-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    item_master: dummyItemMasters[0],
    item_variant: dummyItemVariants[0],
  },
  {
    id: "item-2",
    item_code: "KFP002",
    item_name: "3M Crystalline 40",
    unit: "roll",
    alt_unit: "meter",
    conversion_to_base: 30,
    item_master_id: "master-1",
    variant_id: "variant-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    item_master: dummyItemMasters[0],
    item_variant: dummyItemVariants[0],
  },
  {
    id: "item-3",
    item_code: "KFP003",
    item_name: "LLumar CTX 70",
    unit: "roll",
    alt_unit: null,
    conversion_to_base: null,
    item_master_id: "master-1",
    variant_id: "variant-2",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    item_master: dummyItemMasters[0],
    item_variant: dummyItemVariants[1],
  },
  {
    id: "item-4",
    item_code: "KFS001",
    item_name: "Solar Gard HPQ 70",
    unit: "roll",
    alt_unit: null,
    conversion_to_base: null,
    item_master_id: "master-2",
    variant_id: "variant-2",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    item_master: dummyItemMasters[1],
    item_variant: dummyItemVariants[1],
  },
  {
    id: "item-5",
    item_code: "KFS002",
    item_name: "Solar Gard HPQ 40",
    unit: "roll",
    alt_unit: "meter",
    conversion_to_base: 25,
    item_master_id: "master-2",
    variant_id: "variant-2",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    item_master: dummyItemMasters[1],
    item_variant: dummyItemVariants[1],
  },
  {
    id: "item-6",
    item_code: "AKS001",
    item_name: "Sarung Jok Kulit",
    unit: "set",
    alt_unit: null,
    conversion_to_base: null,
    item_master_id: "master-3",
    variant_id: "variant-3",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    item_master: dummyItemMasters[2],
    item_variant: dummyItemVariants[2],
  },
];

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
}> = ({ onClick, children, variant = "blue", disabled = false }) => {
  const variantClasses = {
    blue: "bg-blue-600 hover:bg-blue-700 text-white",
    purple: "bg-purple-600 hover:bg-purple-700 text-white",
    green: "bg-green-600 hover:bg-green-700 text-white",
    red: "bg-red-600 hover:bg-red-700 text-white",
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
  const [loading, setLoading] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Modal states
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editingMaster, setEditingMaster] = useState<ItemMaster | null>(null);
  const [editingVariant, setEditingVariant] = useState<ItemVariant | null>(
    null
  );
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Filtered data
  const filteredItems = useMemo(() => {
    let filtered = dummyItems;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.item_code.toLowerCase().includes(term) ||
          item.item_name.toLowerCase().includes(term) ||
          item.item_master?.name.toLowerCase().includes(term)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (item) => item.item_master_id === selectedCategory
      );
    }

    return filtered;
  }, [searchTerm, selectedCategory]);

  // Group items by category (item_master)
  const groupedItems = useMemo(() => {
    const groups: {
      [key: string]: {
        master: ItemMaster;
        items: Item[];
        office: Office | undefined;
      };
    } = {};

    filteredItems.forEach((item) => {
      if (item.item_master) {
        const masterId = item.item_master.id;
        if (!groups[masterId]) {
          groups[masterId] = {
            master: item.item_master,
            items: [],
            office: dummyOffices.find(
              (o) => o.id === item.item_master?.office_id
            ),
          };
        }
        groups[masterId].items.push(item);
      }
    });

    return Object.values(groups);
  }, [filteredItems]);

  // Stats
  const stats = useMemo(
    () => [
      {
        title: "Total Items",
        value: dummyItems.length.toString(),
        color: "from-blue-500 to-blue-600",
      },
      {
        title: "Regular Items",
        value: dummyItems
          .filter((item) => item.item_master?.type === "regular")
          .length.toString(),
        color: "from-green-500 to-green-600",
      },
      {
        title: "Inventory Items",
        value: dummyItems
          .filter((item) => item.item_master?.type === "inventory")
          .length.toString(),
        color: "from-yellow-500 to-yellow-600",
      },
      {
        title: "Categories",
        value: dummyItemMasters.length.toString(),
        color: "from-purple-500 to-purple-600",
      },
    ],
    []
  );

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

  const handleViewItem = (item: Item) => {
    console.log("Viewing item:", item);
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setModalMode("edit");
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = (item: Item) => {
    if (window.confirm(`Hapus item ${item.item_name}?`)) {
      console.log("Deleting item:", item.id);
      // Implement delete logic
    }
  };

  // Modal handlers
  const handleSaveItem = async (data: any) => {
    console.log("Saving item:", data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsItemModalOpen(false);
    return { success: true };
  };

  const handleSaveMaster = async (data: any) => {
    console.log("Saving master:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsMasterModalOpen(false);
    return { success: true };
  };

  const handleSaveVariant = async (data: any) => {
    console.log("Saving variant:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsVariantModalOpen(false);
    return { success: true };
  };

  // Mock functions for modals
  const checkItemCodeExists = async (itemCode: string, excludeId?: string) => {
    // Mock implementation
    return dummyItems.some(
      (item) => item.item_code === itemCode && item.id !== excludeId
    );
  };

  const generateItemCode = async (prefix?: string) => {
    // Mock implementation
    const baseCode = prefix || "ITM";
    let counter = 1;
    let newCode = `${baseCode}${counter.toString().padStart(3, "0")}`;

    while (dummyItems.some((item) => item.item_code === newCode)) {
      counter++;
      newCode = `${baseCode}${counter.toString().padStart(3, "0")}`;
    }

    return newCode;
  };

  const checkMasterNameExists = async (name: string, excludeId?: string) => {
    return dummyItemMasters.some(
      (master) => master.name === name && master.id !== excludeId
    );
  };

  const checkVariantNameExists = async (name: string, excludeId?: string) => {
    return dummyItemVariants.some(
      (variant) => variant.name === name && variant.id !== excludeId
    );
  };

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
            <ActionButton onClick={handleAddItem} variant="purple">
              <Plus className="w-4 h-4" />
              <span>Tambah Barang</span>
            </ActionButton>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari kode barang, nama barang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="">Semua Kategori</option>
              {dummyItemMasters.map((master) => (
                <option key={master.id} value={master.id}>
                  {master.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Image
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Kategori
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Nama Barang
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  PDC
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {groupedItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm || selectedCategory
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
                          src={
                            group.master.img_url ||
                            "https://via.placeholder.com/50x50?text=No+Image"
                          }
                          alt={group.master.name}
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
                            key={item.id}
                            className="border-l-2 border-blue-400 pl-3"
                          >
                            <div className="font-medium text-gray-900 text-sm">
                              [{item.item_code}] {item.item_name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center space-x-2">
                              {item.item_variant && (
                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                  {item.item_variant.name}
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
                              key={item.id}
                              className="border-l-2 border-gray-300 pl-3"
                            >
                              <div className="font-medium text-gray-900 text-sm">
                                [{item.item_code}] {item.item_name}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center space-x-2">
                                {item.item_variant && (
                                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                    {item.item_variant.name}
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

                    {/* PDC */}
                    <td className="py-3 px-4">
                      {group.office && (
                        <div>
                          <div className="font-medium text-gray-900">
                            {group.office.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {group.office.location}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3 px-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="space-y-2">
                        {/* First item actions */}
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => handleViewItem(group.items[0])}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
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
                              key={item.id}
                              className="flex items-center justify-center space-x-1 pt-1 border-t border-gray-100"
                            >
                              <button
                                onClick={() => handleViewItem(item)}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
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
          </table>
        </div>

        {/* Footer with additional actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Menampilkan {filteredItems.length} dari {dummyItems.length} barang
            </div>
            <div className="flex items-center space-x-3">
              <ActionButton onClick={handleAddMaster} variant="green">
                <Plus className="w-4 h-4" />
                <span>Tambah Kategori</span>
              </ActionButton>
              <ActionButton onClick={handleAddVariant} variant="blue">
                <Plus className="w-4 h-4" />
                <span>Tambah Variant</span>
              </ActionButton>
            </div>
          </div>
        </div>
      </Card>

      {/* Actual Modals */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        onCreateMaster={handleAddMaster}
        onCreateVariant={handleAddVariant}
        item={editingItem}
        itemMasters={dummyItemMasters}
        itemVariants={dummyItemVariants}
        mode={modalMode}
        checkItemCodeExists={checkItemCodeExists}
        generateItemCode={generateItemCode}
      />

      <ItemMasterModal
        isOpen={isMasterModalOpen}
        onClose={() => setIsMasterModalOpen(false)}
        onSave={handleSaveMaster}
        itemMaster={editingMaster}
        mode={modalMode}
        checkNameExists={checkMasterNameExists}
        offices={dummyOffices}
        officesLoading={false}
      />

      <ItemVariantModal
        isOpen={isVariantModalOpen}
        onClose={() => setIsVariantModalOpen(false)}
        onSave={handleSaveVariant}
        itemVariant={editingVariant}
        mode={modalMode}
        checkNameExists={checkVariantNameExists}
      />
    </div>
  );
};

export default ItemsPage;
