// src/app/(dashboard)/items/page.tsx
"use client";

import React, { useState } from "react";
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

interface Item {
  id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  minStock: number;
  currentStock: number;
  price: number;
  supplier: string;
  status: "active" | "inactive" | "discontinued";
  createdDate: string;
  lastUpdated: string;
}

const ItemsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Dummy data
  const items: Item[] = [
    {
      id: "ITM-001",
      name: "Laptop Dell Inspiron 15",
      category: "Electronics",
      description: "Laptop dengan processor Intel i5, RAM 8GB, SSD 256GB",
      unit: "pcs",
      minStock: 5,
      currentStock: 25,
      price: 8500000,
      supplier: "PT Tech Solutions",
      status: "active",
      createdDate: "2024-01-01",
      lastUpdated: "2024-01-15",
    },
    {
      id: "ITM-002",
      name: "Office Chair Ergonomic",
      category: "Furniture",
      description: "Kursi kantor ergonomis dengan penyangga lumbar",
      unit: "pcs",
      minStock: 10,
      currentStock: 50,
      price: 1200000,
      supplier: "PT Furniture Prima",
      status: "active",
      createdDate: "2024-01-02",
      lastUpdated: "2024-01-14",
    },
    {
      id: "ITM-003",
      name: "Printer Canon G3010",
      category: "Electronics",
      description: "Printer multifungsi dengan sistem ink tank",
      unit: "pcs",
      minStock: 3,
      currentStock: 2,
      price: 2500000,
      supplier: "PT Office Equipment",
      status: "active",
      createdDate: "2024-01-03",
      lastUpdated: "2024-01-13",
    },
    {
      id: "ITM-004",
      name: "Kertas A4 80gsm",
      category: "Stationery",
      description: "Kertas A4 putih 80gsm untuk keperluan kantor",
      unit: "ream",
      minStock: 20,
      currentStock: 100,
      price: 45000,
      supplier: "PT Paper Supply",
      status: "active",
      createdDate: "2024-01-04",
      lastUpdated: "2024-01-12",
    },
    {
      id: "ITM-005",
      name: "Monitor LG 24 inch",
      category: "Electronics",
      description: "Monitor LCD 24 inch Full HD",
      unit: "pcs",
      minStock: 5,
      currentStock: 0,
      price: 1800000,
      supplier: "PT Display Tech",
      status: "inactive",
      createdDate: "2024-01-05",
      lastUpdated: "2024-01-11",
    },
  ];

  const categories = [
    { value: "", label: "Semua Kategori" },
    { value: "Electronics", label: "Electronics" },
    { value: "Furniture", label: "Furniture" },
    { value: "Stationery", label: "Stationery" },
  ];

  const statuses = [
    { value: "", label: "Semua Status" },
    { value: "active", label: "Aktif" },
    { value: "inactive", label: "Tidak Aktif" },
    { value: "discontinued", label: "Dihentikan" },
  ];

  // Stats data
  const statsData = [
    {
      title: "Total Aktif",
      value: items.filter((item) => item.status === "active").length.toString(),
      color: "from-green-500 to-green-600",
    },
    {
      title: "Stok Rendah",
      value: items
        .filter(
          (item) => item.currentStock <= item.minStock && item.currentStock > 0
        )
        .length.toString(),
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Stok Habis",
      value: items.filter((item) => item.currentStock === 0).length.toString(),
      color: "from-red-500 to-red-600",
    },
    {
      title: "Total Barang",
      value: items.length.toString(),
      color: "from-blue-500 to-blue-600",
    },
  ];

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    const matchesStatus = !selectedStatus || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Event handlers
  const handleAddItem = () => {
    setIsAddingItem(true);
    console.log("Opening add item modal");
    setTimeout(() => setIsAddingItem(false), 1000);
  };

  const handleViewItem = (id: string) => console.log("Viewing item:", id);
  const handleEditItem = (id: string) => console.log("Editing item:", id);
  const handleDeleteItem = (id: string) => console.log("Deleting item:", id);

  // Utility functions
  const getStatusVariant = (status: Item["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "warning";
      case "discontinued":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: Item["status"]) => {
    switch (status) {
      case "active":
        return "Aktif";
      case "inactive":
        return "Tidak Aktif";
      case "discontinued":
        return "Dihentikan";
      default:
        return status;
    }
  };

  const getStockStatus = (current: number, min: number) => {
    if (current === 0) return { color: "text-red-600", label: "Habis" };
    if (current <= min)
      return { color: "text-yellow-600", label: "Stok Rendah" };
    return { color: "text-green-600", label: "Normal" };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedStatus("");
  };

  // Table columns
  const columns = [
    {
      key: "id",
      label: "ID Barang",
      render: (value: string) => (
        <span className="font-mono text-sm">{value}</span>
      ),
    },
    {
      key: "name",
      label: "Nama Barang",
      render: (value: string, row: Item) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500 truncate max-w-xs">
            {row.description}
          </div>
        </div>
      ),
    },
    { key: "category", label: "Kategori" },
    {
      key: "currentStock",
      label: "Stok",
      className: "text-right",
      render: (value: number, row: Item) => {
        const stockStatus = getStockStatus(value, row.minStock);
        return (
          <div>
            <span className={stockStatus.color}>
              {value} {row.unit}
            </span>
            <div className="text-xs text-gray-500">Min: {row.minStock}</div>
          </div>
        );
      },
    },
    {
      key: "price",
      label: "Harga",
      className: "text-right font-medium",
      render: (value: number) => formatCurrency(value),
    },
    { key: "supplier", label: "Supplier" },
    {
      key: "status",
      label: "Status",
      className: "text-center",
      render: (value: Item["status"]) => (
        <StatusBadge
          status={getStatusText(value)}
          variant={getStatusVariant(value)}
        />
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
        onClick={handleAddItem}
        variant="purple"
        disabled={isAddingItem}
      >
        <Plus className={`w-4 h-4 ${isAddingItem ? "animate-spin" : ""}`} />
        <span>{isAddingItem ? "Adding..." : "Tambah Barang"}</span>
      </ActionButton>
    </>
  );

  const filters = [
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

  return (
    <div className="space-y-6">
      <Card>
        <PageHeader title="Pengelolaan Barang" actions={headerActions} />

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          searchPlaceholder="Cari barang, deskripsi, atau supplier..."
        />

        <StatsGrid stats={statsData} />

        <Table
          columns={columns}
          data={filteredItems}
          emptyMessage={
            searchTerm || selectedCategory || selectedStatus
              ? "Tidak ada barang yang sesuai dengan filter."
              : "Belum ada data barang."
          }
          emptyIcon={Package}
        />

        {filteredItems.length === 0 &&
          (searchTerm || selectedCategory || selectedStatus) && (
            <div className="text-center mt-4">
              <ActionButton onClick={resetFilters} variant="blue">
                Reset Filter
              </ActionButton>
            </div>
          )}
      </Card>
    </div>
  );
};

export default ItemsPage;
