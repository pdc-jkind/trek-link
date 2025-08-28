// src/app/(dashboard)/items/page.tsx
"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Package, Plus, Filter, Eye, Edit, Trash2 } from "lucide-react";
import {
  Card,
  ActionButton,
  PageHeader,
  SearchFilter,
  StatsGrid,
  Table,
  StatusBadge,
} from "@/app/(dashboard)/components/ui";
import { useItems, useItemMasters } from "./useItems";
import { Item, ItemFilters, ItemMaster } from "./items.type";
import { ItemModal } from "./components/ItemModal";
import { ItemMasterModal } from "./components/ItemMasterModal";

const ItemsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Modal states
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editingMaster, setEditingMaster] = useState<ItemMaster | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Initialize with default filters only
  const defaultFilters: ItemFilters = {
    page: 1,
    limit: 50,
  };

  console.log("🎬 ItemsPage component rendering");

  // Use the custom hooks for items and masters management
  const {
    items,
    loading,
    error,
    totalCount,
    filters,
    createItem,
    updateItem,
    deleteItem,
    getItem,
    updateFilters,
    resetFilters,
    refetch,
    checkItemCodeExists,
    generateItemCode,
  } = useItems(defaultFilters);

  const {
    itemMasters,
    loading: mastersLoading,
    createItemMaster,
    updateItemMaster,
    deleteItemMaster,
    checkItemMasterNameExists,
    refetch: refetchMasters,
  } = useItemMasters();

  // Use refs to track filter updates and prevent unnecessary calls
  const isUpdatingFiltersRef = useRef(false);

  console.log("🔍 ItemsPage current state:", {
    loading,
    error,
    itemsCount: items.length,
    totalCount,
    searchTerm,
    selectedCategory,
    currentFilters: filters,
    mastersLoading,
    mastersCount: itemMasters.length,
  });

  // Debounced filter update function
  const updateFiltersDebounced = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;

      return (newFilters: Partial<ItemFilters>) => {
        if (isUpdatingFiltersRef.current) {
          console.log("🚫 Filter update already in progress, skipping");
          return;
        }

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          console.log("⏰ Debounced filter update executing:", newFilters);
          isUpdatingFiltersRef.current = true;

          updateFilters(newFilters);

          // Reset flag after a short delay
          setTimeout(() => {
            isUpdatingFiltersRef.current = false;
          }, 100);
        }, 300);
      };
    })(),
    [updateFilters]
  );

  // Effect to handle search term changes
  useEffect(() => {
    console.log("🔍 Search term effect triggered:", searchTerm);

    const trimmedSearch = searchTerm.trim();
    const filterUpdate: Partial<ItemFilters> = {};

    if (trimmedSearch) {
      filterUpdate.search = trimmedSearch;
    } else {
      // Remove search filter if empty
      filterUpdate.search = undefined;
    }

    updateFiltersDebounced(filterUpdate);
  }, [searchTerm, updateFiltersDebounced]);

  // Effect to handle category changes
  useEffect(() => {
    console.log("🏷️ Category effect triggered:", selectedCategory);

    const filterUpdate: Partial<ItemFilters> = {};

    if (selectedCategory) {
      filterUpdate.item_master_id = selectedCategory;
    } else {
      // Remove category filter if empty
      filterUpdate.item_master_id = undefined;
    }

    updateFiltersDebounced(filterUpdate);
  }, [selectedCategory, updateFiltersDebounced]);

  // Categories options from item masters
  const categories = useMemo(() => {
    console.log(
      "🏷️ Rebuilding categories options from masters:",
      itemMasters.length
    );
    return [
      { value: "", label: "Semua Kategori" },
      ...itemMasters.map((master) => ({
        value: master.id,
        label: `${master.name} (${master.type})`,
      })),
    ];
  }, [itemMasters]);

  const statuses = [
    { value: "", label: "Semua Status" },
    { value: "active", label: "Aktif" },
    { value: "inactive", label: "Tidak Aktif" },
    { value: "discontinued", label: "Dihentikan" },
  ];

  // Memoized stats calculation
  const statsData = useMemo(() => {
    console.log("📊 Calculating stats from items:", items.length);
    return [
      {
        title: "Total Items",
        value: totalCount.toString(),
        color: "from-blue-500 to-blue-600",
      },
      {
        title: "Regular Items",
        value: items
          .filter((item) => item.item_master?.type === "regular")
          .length.toString(),
        color: "from-green-500 to-green-600",
      },
      {
        title: "Inventory Items",
        value: items
          .filter((item) => item.item_master?.type === "inventory")
          .length.toString(),
        color: "from-yellow-500 to-yellow-600",
      },
      {
        title: "With Alt Unit",
        value: items.filter((item) => item.alt_unit).length.toString(),
        color: "from-purple-500 to-purple-600",
      },
    ];
  }, [items, totalCount]);

  // Modal handlers
  const handleAddItem = useCallback(() => {
    console.log("➕ Adding new item");
    setEditingItem(null);
    setModalMode("create");
    setIsItemModalOpen(true);
  }, []);

  const handleAddMaster = useCallback(() => {
    console.log("➕ Adding new master");
    setEditingMaster(null);
    setModalMode("create");
    setIsMasterModalOpen(true);
  }, []);

  const handleCreateMasterFromItemModal = useCallback(() => {
    console.log("🔄 Creating master from item modal");
    setIsItemModalOpen(false);
    handleAddMaster();
  }, [handleAddMaster]);

  const handleViewItem = useCallback(
    async (id: string) => {
      console.log("👁️ Viewing item:", id);
      const item = await getItem(id);
      if (item) {
        console.log("📋 Item details:", item);
      }
    },
    [getItem]
  );

  const handleEditItem = useCallback(
    async (id: string) => {
      console.log("✏️ Editing item:", id);
      const item = await getItem(id);
      if (item) {
        setEditingItem(item);
        setModalMode("edit");
        setIsItemModalOpen(true);
      }
    },
    [getItem]
  );

  const handleDeleteItem = useCallback(
    async (id: string) => {
      console.log("🗑️ Attempting to delete item:", id);
      if (window.confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
        const result = await deleteItem(id);
        if (result.success) {
          console.log("✅ Item deleted successfully");
        } else {
          console.error("❌ Failed to delete item:", result.error);
        }
      }
    },
    [deleteItem]
  );

  // Save handlers
  const handleSaveItem = useCallback(
    async (data: any) => {
      console.log("💾 Saving item:", modalMode, data);
      if (modalMode === "create") {
        const result = await createItem(data);
        return result;
      } else {
        const result = await updateItem(data);
        return result;
      }
    },
    [modalMode, createItem, updateItem]
  );

  const handleSaveMaster = useCallback(
    async (data: any) => {
      console.log("💾 Saving master:", modalMode, data);
      if (modalMode === "create") {
        const result = await createItemMaster(data);
        if (result.success) {
          refetchMasters();
        }
        return result;
      } else {
        const result = await updateItemMaster(data);
        if (result.success) {
          refetchMasters();
        }
        return result;
      }
    },
    [modalMode, createItemMaster, updateItemMaster, refetchMasters]
  );

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  const handleResetFilters = useCallback(() => {
    console.log("🔄 Resetting all filters");
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedStatus("");
    resetFilters();
  }, [resetFilters]);

  // Table columns - Updated to match actual Item interface
  const columns = [
    {
      key: "item_code",
      label: "Kode Barang",
      render: (value: string) => (
        <span className="font-mono text-sm">{value}</span>
      ),
    },
    {
      key: "item_name",
      label: "Nama Barang",
      render: (value: string, row: Item) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500">
            {row.item_master?.name || "No Category"}
          </div>
        </div>
      ),
    },
    {
      key: "unit",
      label: "Unit",
      render: (value: string, row: Item) => (
        <div>
          <div className="font-medium">{value}</div>
          {row.alt_unit && (
            <div className="text-xs text-gray-500">
              Alt: {row.alt_unit}
              {row.conversion_to_base && ` (${row.conversion_to_base}:1)`}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "item_master",
      label: "Kategori",
      render: (value: ItemMaster | undefined) => (
        <div>
          <div className="font-medium">{value?.name || "No Category"}</div>
          <div className="text-xs text-gray-500 capitalize">{value?.type}</div>
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Dibuat",
      render: (value: string) => (
        <span className="text-sm">
          {new Date(value).toLocaleDateString("id-ID")}
        </span>
      ),
    },
    {
      key: "updated_at",
      label: "Diperbarui",
      render: (value: string) => (
        <span className="text-sm">
          {new Date(value).toLocaleDateString("id-ID")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      className: "text-center",
      render: (value: any, row: Item) => (
        <div className="flex items-center justify-center space-x-1">
          <button
            onClick={() => handleViewItem(row.id)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEditItem(row.id)}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
            title="Edit Item"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteItem(row.id)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
            title="Delete Item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Page actions
  const headerActions = (
    <>
      <ActionButton
        onClick={() => console.log("Opening filters")}
        variant="blue"
      >
        <Filter className="w-4 h-4" />
        <span>Filter</span>
      </ActionButton>

      <ActionButton
        onClick={handleAddMaster}
        variant="green"
        disabled={mastersLoading}
      >
        <Plus className="w-4 h-4" />
        <span>Tambah Kategori</span>
      </ActionButton>

      <ActionButton onClick={handleAddItem} variant="purple" disabled={loading}>
        <Plus className="w-4 h-4" />
        <span>Tambah Barang</span>
      </ActionButton>
    </>
  );

  const filterOptions = [
    {
      value: selectedCategory,
      onChange: setSelectedCategory,
      options: categories,
      placeholder: "Pilih Kategori",
    },
    {
      value: selectedStatus,
      onChange: setSelectedStatus,
      options: statuses,
      placeholder: "Pilih Status",
    },
  ];

  console.log("🎭 About to render - Final state check:", {
    loading,
    error,
    itemsLength: items.length,
    showLoadingSpinner: loading,
  });

  // Show error state if there's an error
  if (error) {
    console.log("❌ Rendering error state:", error);
    return (
      <div className="space-y-6">
        <Card>
          <div className="p-6 text-center">
            <div className="text-red-600 mb-4">
              <Package className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Error Loading Items</h3>
              <p className="text-sm">{error}</p>
            </div>
            <ActionButton onClick={refetch} variant="blue">
              Try Again
            </ActionButton>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <PageHeader title="Pengelolaan Barang" actions={headerActions} />

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filterOptions}
          searchPlaceholder="Cari kode barang, nama barang..."
        />

        <StatsGrid stats={statsData} />

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading items...</p>
            <p className="mt-1 text-xs text-gray-500">
              Debug: Loading state = {loading.toString()}
            </p>
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              data={items}
              emptyMessage={
                searchTerm || selectedCategory
                  ? "Tidak ada barang yang sesuai dengan filter."
                  : "Belum ada data barang."
              }
              emptyIcon={Package}
            />
            <div className="text-xs text-gray-400 text-center mt-2">
              Debug: Showing table with {items.length} items (loading ={" "}
              {loading.toString()})
            </div>
          </>
        )}

        {items.length === 0 && !loading && (searchTerm || selectedCategory) && (
          <div className="text-center mt-4">
            <ActionButton onClick={handleResetFilters} variant="blue">
              Reset Filter
            </ActionButton>
          </div>
        )}
      </Card>

      {/* Item Modal */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        onCreateMaster={handleCreateMasterFromItemModal}
        item={editingItem}
        itemMasters={itemMasters}
        mode={modalMode}
        checkItemCodeExists={checkItemCodeExists}
        generateItemCode={generateItemCode}
      />

      {/* Item Master Modal */}
      <ItemMasterModal
        isOpen={isMasterModalOpen}
        onClose={() => {
          setIsMasterModalOpen(false);
          setEditingMaster(null);
          // Reopen item modal if it was previously open
          if (editingItem || modalMode === "create") {
            setIsItemModalOpen(true);
          }
        }}
        onSave={handleSaveMaster}
        itemMaster={editingMaster}
        mode={modalMode}
        checkNameExists={checkItemMasterNameExists}
      />
    </div>
  );
};

export default ItemsPage;
