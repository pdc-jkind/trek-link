// src/app/(dashboard)/reception/page.tsx
"use client";

import React, { useState } from "react";
import { Package, Plus, Eye, Edit, Trash2 } from "lucide-react";
import {
  Card,
  PageHeader,
  SearchFilter,
  StatsGrid,
  Table,
  ActionButton,
  StatusBadge,
} from "../components/ui";

interface ReceptionItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  receivedDate: string;
  supplier: string;
  status: "received" | "pending" | "rejected";
}

// Dummy data
const dummyReceptionItems: ReceptionItem[] = [
  {
    id: "REC-001",
    name: "Laptop Dell Inspiron 15",
    category: "Electronics",
    quantity: 25,
    unit: "pcs",
    receivedDate: "2024-01-15",
    supplier: "PT Tech Solutions",
    status: "received",
  },
  {
    id: "REC-002",
    name: "Office Chair Ergonomic",
    category: "Furniture",
    quantity: 50,
    unit: "pcs",
    receivedDate: "2024-01-14",
    supplier: "PT Furniture Prima",
    status: "received",
  },
  {
    id: "REC-003",
    name: "Printer Canon G3010",
    category: "Electronics",
    quantity: 10,
    unit: "pcs",
    receivedDate: "2024-01-13",
    supplier: "PT Office Equipment",
    status: "pending",
  },
  {
    id: "REC-004",
    name: "Kertas A4 80gsm",
    category: "Stationery",
    quantity: 100,
    unit: "ream",
    receivedDate: "2024-01-12",
    supplier: "PT Paper Supply",
    status: "received",
  },
  {
    id: "REC-005",
    name: "Monitor LG 24 inch",
    category: "Electronics",
    quantity: 15,
    unit: "pcs",
    receivedDate: "2024-01-11",
    supplier: "PT Display Tech",
    status: "rejected",
  },
];

const ReceptionPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [receptionItems] = useState<ReceptionItem[]>(dummyReceptionItems);

  // Filter options
  const categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "Electronics", label: "Electronics" },
    { value: "Furniture", label: "Furniture" },
    { value: "Stationery", label: "Stationery" },
  ];

  // Filter data
  const filteredItems = receptionItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Stats data
  const stats = [
    {
      title: "Total Diterima",
      value: receptionItems.filter((item) => item.status === "received").length,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Pending",
      value: receptionItems.filter((item) => item.status === "pending").length,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Ditolak",
      value: receptionItems.filter((item) => item.status === "rejected").length,
      color: "from-red-500 to-red-600",
    },
    {
      title: "Total Items",
      value: receptionItems.length,
      color: "from-blue-500 to-blue-600",
    },
  ];

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
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      key: "category",
      label: "Kategori",
    },
    {
      key: "quantity",
      label: "Quantity",
      className: "text-right",
      render: (value: string, row: ReceptionItem) => `${value} ${row.unit}`,
    },
    {
      key: "supplier",
      label: "Supplier",
    },
    {
      key: "receivedDate",
      label: "Tanggal Terima",
      render: (value: string) => new Date(value).toLocaleDateString("id-ID"),
    },
    {
      key: "status",
      label: "Status",
      className: "text-center",
      render: (value: ReceptionItem["status"]) => (
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
      render: (_: any, row: ReceptionItem) => (
        <ActionButton
          mode="multiple"
          actions={[
            {
              label: "View Details",
              onClick: () => handleViewItem(row.id),
              icon: Eye,
              variant: "view",
            },
            {
              label: "Edit Item",
              onClick: () => handleEditItem(row.id),
              icon: Edit,
              variant: "edit",
            },
            {
              label: "Delete Item",
              onClick: () => handleDeleteItem(row.id),
              icon: Trash2,
              variant: "delete",
            },
          ]}
        />
      ),
    },
  ];

  // Helper functions
  const getStatusText = (status: ReceptionItem["status"]) => {
    const statusMap = {
      received: "Diterima",
      pending: "Pending",
      rejected: "Ditolak",
    };
    return statusMap[status];
  };

  const getStatusVariant = (status: ReceptionItem["status"]) => {
    const variantMap = {
      received: "success" as const,
      pending: "warning" as const,
      rejected: "error" as const,
    };
    return variantMap[status];
  };

  // Event handlers
  const handleAddItem = () => {
    console.log("Opening add item modal");
  };

  const handleViewItem = (id: string) => {
    console.log("Viewing item:", id);
  };

  const handleEditItem = (id: string) => {
    console.log("Editing item:", id);
  };

  const handleDeleteItem = (id: string) => {
    console.log("Deleting item:", id);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <PageHeader
          title="Penerimaan Barang"
          actions={
            <>
              {/* <ActionButton variant="blue">Filter</ActionButton> */}
              <ActionButton variant="purple" onClick={handleAddItem}>
                <Plus className="w-5 h-5" />
                <span>Tambah Barang</span>
              </ActionButton>
            </>
          }
        />

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Cari barang atau supplier..."
          filters={[
            {
              value: selectedCategory,
              onChange: setSelectedCategory,
              options: categoryOptions,
            },
          ]}
        />

        <StatsGrid stats={stats} columns={4} />

        <Table
          columns={columns}
          data={filteredItems}
          emptyMessage={
            searchTerm || selectedCategory
              ? "Tidak ada barang yang sesuai dengan filter."
              : "Belum ada data penerimaan barang."
          }
          emptyIcon={Package}
        />

        {(searchTerm || selectedCategory) && filteredItems.length === 0 && (
          <div className="text-center py-4">
            <ActionButton variant="blue" onClick={handleResetFilters}>
              Reset Filter
            </ActionButton>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ReceptionPage;
