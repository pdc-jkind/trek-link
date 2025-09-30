// src/app/(dashboard)/reception/page.tsx
"use client";

import React, { useState } from "react";
import {
  Package,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  ContentWrapper,
  Card,
  PageHeader,
  Table,
  Button,
  Badge,
  MetricCard,
} from "@/fe/components/index";

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

  // Filter data
  const filteredItems = receptionItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate stats
  const stats = {
    received: receptionItems.filter((i) => i.status === "received").length,
    pending: receptionItems.filter((i) => i.status === "pending").length,
    rejected: receptionItems.filter((i) => i.status === "rejected").length,
    total: receptionItems.length,
  };

  // Table columns - menggunakan format yang benar sesuai TableColumn interface
  const columns = [
    {
      key: "id",
      title: "ID Barang",
      sortable: true,
      render: (value: string) => (
        <span className="font-mono text-sm">{value}</span>
      ),
    },
    {
      key: "name",
      title: "Nama Barang",
      sortable: true,
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      key: "category",
      title: "Kategori",
      sortable: true,
    },
    {
      key: "quantity",
      title: "Quantity",
      align: "right" as const,
      sortable: true,
      render: (value: number, record: ReceptionItem) => (
        <span className="font-semibold">{`${value} ${record.unit}`}</span>
      ),
    },
    {
      key: "supplier",
      title: "Supplier",
      sortable: true,
    },
    {
      key: "receivedDate",
      title: "Tanggal Terima",
      sortable: true,
      render: (value: string) => (
        <span>{new Date(value).toLocaleDateString("id-ID")}</span>
      ),
    },
    {
      key: "status",
      title: "Status",
      align: "center" as const,
      render: (value: ReceptionItem["status"]) => (
        <Badge variant={getStatusVariant(value)} dot>
          {getStatusText(value)}
        </Badge>
      ),
    },
    {
      key: "actions",
      title: "Aksi",
      align: "center" as const,
      render: (_: any, row: ReceptionItem) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewItem(row.id)}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditItem(row.id)}
            title="Edit Item"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteItem(row.id)}
            title="Delete Item"
            className="text-error hover:bg-error-container"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
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
      rejected: "danger" as const,
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
    <ContentWrapper maxWidth="full" padding="md">
      <div className="space-y-6">
        <PageHeader
          title="Penerimaan Barang"
          actions={
            <Button variant="primary" onClick={handleAddItem}>
              <Plus className="w-5 h-5" />
              <span>Tambah Barang</span>
            </Button>
          }
        />

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari barang atau supplier..."
              className="w-full px-4 py-2 rounded-lg border-2 border-outline bg-surface text-on-surface focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-outline bg-surface text-on-surface focus:border-primary focus:outline-none transition-colors min-w-[180px]"
            >
              <option value="">Semua Kategori</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Stationery">Stationery</option>
            </select>
            {(searchTerm || selectedCategory) && (
              <Button variant="secondary" onClick={handleResetFilters}>
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Table - Menggunakan Table component dengan props yang benar */}
        <Table
          columns={columns}
          data={filteredItems}
          searchable={false}
          striped={true}
          hoverable={true}
          size="md"
          emptyText={
            searchTerm || selectedCategory
              ? "Tidak ada barang yang sesuai dengan filter."
              : "Belum ada data penerimaan barang."
          }
        />

        {/* Stats Grid - Menggunakan MetricCard dengan props yang benar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Diterima"
            value={stats.received}
            icon={CheckCircle2}
            color="success"
            trend={{ value: 12, direction: "up" }}
            change="Meningkat dari bulan lalu"
          />
          <MetricCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            color="warning"
            trend={{ value: 5, direction: "down" }}
            change="Menurun dari bulan lalu"
          />
          <MetricCard
            title="Ditolak"
            value={stats.rejected}
            icon={AlertCircle}
            color="danger"
            change="Perlu ditindaklanjuti"
          />
          <MetricCard
            title="Total Items"
            value={stats.total}
            icon={Package}
            color="info"
            trend={{ value: 8, direction: "up" }}
            change="Total semua items"
          />
        </div>
      </div>
    </ContentWrapper>
  );
};

export default ReceptionPage;
