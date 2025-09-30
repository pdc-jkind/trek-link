// src/app/(dashboard)/orders/page.tsx
"use client";

import React, { useState } from "react";
import {
  ShoppingCart,
  Plus,
  Eye,
  Edit,
  Trash2,
  Package,
  Clock,
  CheckCircle,
  XCircle,
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

interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  supplier: string;
  orderDate: string;
  expectedDelivery: string;
  status:
    | "draft"
    | "pending"
    | "approved"
    | "shipped"
    | "delivered"
    | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  items: OrderItem[];
  totalAmount: number;
  notes: string;
  createdBy: string;
  approvedBy?: string;
  approvedDate?: string;
}

// Dummy data
const dummyOrders: Order[] = [
  {
    id: "ORD-001",
    orderNumber: "PO-2024-001",
    supplier: "PT Tech Solutions",
    orderDate: "2024-01-15",
    expectedDelivery: "2024-01-25",
    status: "approved",
    priority: "high",
    totalAmount: 25500000,
    notes: "Urgent untuk proyek baru",
    createdBy: "Admin User",
    approvedBy: "Manager IT",
    approvedDate: "2024-01-16",
    items: [
      {
        itemId: "ITM-001",
        itemName: "Laptop Dell Inspiron 15",
        quantity: 3,
        unit: "pcs",
        unitPrice: 8500000,
        totalPrice: 25500000,
      },
    ],
  },
  {
    id: "ORD-002",
    orderNumber: "PO-2024-002",
    supplier: "PT Furniture Prima",
    orderDate: "2024-01-14",
    expectedDelivery: "2024-01-28",
    status: "pending",
    priority: "medium",
    totalAmount: 12000000,
    notes: "Untuk ruang meeting baru",
    createdBy: "Admin User",
    items: [
      {
        itemId: "ITM-002",
        itemName: "Office Chair Ergonomic",
        quantity: 10,
        unit: "pcs",
        unitPrice: 1200000,
        totalPrice: 12000000,
      },
    ],
  },
  {
    id: "ORD-003",
    orderNumber: "PO-2024-003",
    supplier: "PT Office Equipment",
    orderDate: "2024-01-13",
    expectedDelivery: "2024-01-23",
    status: "delivered",
    priority: "low",
    totalAmount: 7500000,
    notes: "Printer untuk divisi marketing",
    createdBy: "Admin User",
    approvedBy: "Manager Procurement",
    approvedDate: "2024-01-14",
    items: [
      {
        itemId: "ITM-003",
        itemName: "Printer Canon G3010",
        quantity: 3,
        unit: "pcs",
        unitPrice: 2500000,
        totalPrice: 7500000,
      },
    ],
  },
  {
    id: "ORD-004",
    orderNumber: "PO-2024-004",
    supplier: "PT Paper Supply",
    orderDate: "2024-01-12",
    expectedDelivery: "2024-01-22",
    status: "shipped",
    priority: "low",
    totalAmount: 4500000,
    notes: "Stok bulanan ATK",
    createdBy: "Admin User",
    approvedBy: "Manager Procurement",
    approvedDate: "2024-01-13",
    items: [
      {
        itemId: "ITM-004",
        itemName: "Kertas A4 80gsm",
        quantity: 100,
        unit: "ream",
        unitPrice: 45000,
        totalPrice: 4500000,
      },
    ],
  },
  {
    id: "ORD-005",
    orderNumber: "PO-2024-005",
    supplier: "PT Display Tech",
    orderDate: "2024-01-11",
    expectedDelivery: "2024-01-21",
    status: "cancelled",
    priority: "medium",
    totalAmount: 18000000,
    notes: "Dibatalkan karena perubahan spesifikasi",
    createdBy: "Admin User",
    items: [
      {
        itemId: "ITM-005",
        itemName: "Monitor LG 24 inch",
        quantity: 10,
        unit: "pcs",
        unitPrice: 1800000,
        totalPrice: 18000000,
      },
    ],
  },
];

const OrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [orders] = useState<Order[]>(dummyOrders);

  // Filter data
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || order.status === selectedStatus;
    const matchesPriority =
      !selectedPriority || order.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate stats
  const stats = {
    pending: orders.filter((o) => o.status === "pending").length,
    approved: orders.filter((o) => o.status === "approved").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    total: orders.length,
    activeOrders: orders.filter((order) =>
      ["pending", "approved", "shipped"].includes(order.status)
    ).length,
    urgentOrders: orders.filter(
      (order) =>
        order.priority === "urgent" &&
        ["pending", "approved", "shipped"].includes(order.status)
    ).length,
    totalAmount: orders.reduce((sum, order) => sum + order.totalAmount, 0),
  };

  // Table columns
  const columns = [
    {
      key: "orderNumber",
      title: "No. Pesanan",
      sortable: true,
      render: (value: string, row: Order) => (
        <div>
          <div className="font-mono text-sm font-medium">{value}</div>
          <div className="text-xs opacity-60">oleh {row.createdBy}</div>
        </div>
      ),
    },
    {
      key: "supplier",
      title: "Supplier",
      sortable: true,
      render: (value: string, row: Order) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs opacity-60">{row.items.length} item(s)</div>
        </div>
      ),
    },
    {
      key: "orderDate",
      title: "Tanggal Pesan",
      sortable: true,
      render: (value: string) => (
        <span>{new Date(value).toLocaleDateString("id-ID")}</span>
      ),
    },
    {
      key: "expectedDelivery",
      title: "Target Kirim",
      sortable: true,
      render: (value: string) => (
        <span>{new Date(value).toLocaleDateString("id-ID")}</span>
      ),
    },
    {
      key: "totalAmount",
      title: "Total Nilai",
      sortable: true,
      align: "right" as const,
      render: (value: number) => (
        <span className="font-semibold">{formatCurrency(value)}</span>
      ),
    },
    {
      key: "priority",
      title: "Prioritas",
      sortable: true,
      align: "center" as const,
      render: (value: Order["priority"]) => (
        <Badge variant={getPriorityVariant(value)} size="md">
          {getPriorityText(value)}
        </Badge>
      ),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      align: "center" as const,
      render: (value: Order["status"]) => (
        <Badge variant={getStatusVariant(value)} size="md" dot>
          {getStatusText(value)}
        </Badge>
      ),
    },
    {
      key: "actions",
      title: "Aksi",
      align: "center" as const,
      render: (_: any, row: Order) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewOrder(row.id)}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {["draft", "pending"].includes(row.status) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditOrder(row.id)}
              title="Edit Order"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {row.status === "draft" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteOrder(row.id)}
              title="Delete Order"
              className="text-error hover:bg-error-container"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusText = (status: Order["status"]) => {
    const statusMap = {
      draft: "Draft",
      pending: "Pending",
      approved: "Disetujui",
      shipped: "Dikirim",
      delivered: "Diterima",
      cancelled: "Dibatalkan",
    };
    return statusMap[status];
  };

  const getStatusVariant = (status: Order["status"]) => {
    const variantMap = {
      draft: "default" as const,
      pending: "warning" as const,
      approved: "info" as const,
      shipped: "info" as const,
      delivered: "success" as const,
      cancelled: "danger" as const,
    };
    return variantMap[status];
  };

  const getPriorityText = (priority: Order["priority"]) => {
    const priorityMap = {
      low: "Rendah",
      medium: "Sedang",
      high: "Tinggi",
      urgent: "Mendesak",
    };
    return priorityMap[priority];
  };

  const getPriorityVariant = (priority: Order["priority"]) => {
    const variantMap = {
      low: "success" as const,
      medium: "warning" as const,
      high: "info" as const,
      urgent: "danger" as const,
    };
    return variantMap[priority];
  };

  // Event handlers
  const handleAddOrder = () => {
    console.log("Opening add order modal");
  };

  const handleViewOrder = (id: string) => {
    console.log("Viewing order:", id);
  };

  const handleEditOrder = (id: string) => {
    console.log("Editing order:", id);
  };

  const handleDeleteOrder = (id: string) => {
    console.log("Deleting order:", id);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
    setSelectedPriority("");
  };

  return (
    <ContentWrapper maxWidth="full" padding="md">
      <PageHeader
        title="Pengelolaan Pemesanan"
        actions={
          <Button variant="primary" onClick={handleAddOrder}>
            <Plus className="w-5 h-5" />
            <span>Buat Pesanan</span>
          </Button>
        }
      />

      {/* Stats Grid - Menggunakan MetricCard dengan props yang benar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 py-6">
        <MetricCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="warning"
          subtitle="orders"
        />
        <MetricCard
          title="Disetujui"
          value={stats.approved}
          icon={CheckCircle}
          color="info"
          subtitle="orders"
        />
        <MetricCard
          title="Dikirim"
          value={stats.shipped}
          icon={Package}
          color="primary"
          subtitle="orders"
        />
        <MetricCard
          title="Selesai"
          value={stats.delivered}
          icon={CheckCircle}
          color="success"
          subtitle="orders"
          trend={{ value: 12, direction: "up" }}
        />
        <MetricCard
          title="Total Pesanan"
          value={stats.total}
          icon={ShoppingCart}
          color="info"
          subtitle="all time"
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor pesanan, supplier, atau pembuat..."
            className="w-full px-4 py-2 rounded-lg border-2 border-outline bg-surface text-on-surface focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-outline bg-surface text-on-surface focus:border-primary focus:outline-none transition-colors min-w-[150px]"
          >
            <option value="">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="approved">Disetujui</option>
            <option value="shipped">Dikirim</option>
            <option value="delivered">Diterima</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-outline bg-surface text-on-surface focus:border-primary focus:outline-none transition-colors min-w-[150px]"
          >
            <option value="">Semua Prioritas</option>
            <option value="low">Rendah</option>
            <option value="medium">Sedang</option>
            <option value="high">Tinggi</option>
            <option value="urgent">Mendesak</option>
          </select>
          {(searchTerm || selectedStatus || selectedPriority) && (
            <Button variant="secondary" onClick={handleResetFilters}>
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="py-6">
        <Table
          columns={columns}
          data={filteredOrders}
          searchable={false}
          striped={true}
          hoverable={true}
          size="md"
          emptyText={
            searchTerm || selectedStatus || selectedPriority
              ? "Tidak ada pesanan yang sesuai dengan filter."
              : "Belum ada data pesanan."
          }
          rowKey="id"
        />
      </div>
    </ContentWrapper>
  );
};

export default OrdersPage;
