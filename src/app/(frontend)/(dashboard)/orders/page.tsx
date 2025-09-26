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
  Card,
  PageHeader,
  SearchFilter,
  StatsGrid,
  Table,
  ActionButton,
  StatusBadge,
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

  // Filter options
  const statusOptions = [
    { value: "", label: "Semua Status" },
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Disetujui" },
    { value: "shipped", label: "Dikirim" },
    { value: "delivered", label: "Diterima" },
    { value: "cancelled", label: "Dibatalkan" },
  ];

  const priorityOptions = [
    { value: "", label: "Semua Prioritas" },
    { value: "low", label: "Rendah" },
    { value: "medium", label: "Sedang" },
    { value: "high", label: "Tinggi" },
    { value: "urgent", label: "Mendesak" },
  ];

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

  // Stats data
  const stats = [
    {
      title: "Pending",
      value: orders.filter((order) => order.status === "pending").length,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Disetujui",
      value: orders.filter((order) => order.status === "approved").length,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Dikirim",
      value: orders.filter((order) => order.status === "shipped").length,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Selesai",
      value: orders.filter((order) => order.status === "delivered").length,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Total Pesanan",
      value: orders.length,
      color: "from-gray-500 to-gray-600",
    },
  ];

  // Table columns
  const columns = [
    {
      key: "orderNumber",
      label: "No. Pesanan",
      render: (value: string, row: Order) => (
        <div>
          <div className="font-mono text-sm font-medium">{value}</div>
          <div className="text-xs text-gray-500">oleh {row.createdBy}</div>
        </div>
      ),
    },
    {
      key: "supplier",
      label: "Supplier",
      render: (value: string, row: Order) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500">
            {row.items.length} item(s)
          </div>
        </div>
      ),
    },
    {
      key: "orderDate",
      label: "Tanggal Pesan",
      render: (value: string) => new Date(value).toLocaleDateString("id-ID"),
    },
    {
      key: "expectedDelivery",
      label: "Target Kirim",
      render: (value: string) => new Date(value).toLocaleDateString("id-ID"),
    },
    {
      key: "totalAmount",
      label: "Total Nilai",
      className: "text-right",
      render: (value: number) => formatCurrency(value),
    },
    {
      key: "priority",
      label: "Prioritas",
      className: "text-center",
      render: (value: Order["priority"]) => (
        <StatusBadge
          status={getPriorityText(value)}
          variant={getPriorityVariant(value)}
        />
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "text-center",
      render: (value: Order["status"]) => (
        <div className="flex items-center justify-center space-x-1">
          {getStatusIcon(value)}
          <StatusBadge
            status={getStatusText(value)}
            variant={getStatusVariant(value)}
          />
        </div>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      className: "text-center",
      render: (_: any, row: Order) => (
        <ActionButton
          mode="multiple"
          actions={[
            {
              label: "View Details",
              onClick: () => handleViewOrder(row.id),
              icon: Eye,
              variant: "view",
            },
            ...(["draft", "pending"].includes(row.status)
              ? [
                  {
                    label: "Edit Order",
                    onClick: () => handleEditOrder(row.id),
                    icon: Edit,
                    variant: "edit" as const,
                  },
                ]
              : []),
            ...(row.status === "draft"
              ? [
                  {
                    label: "Delete Order",
                    onClick: () => handleDeleteOrder(row.id),
                    icon: Trash2,
                    variant: "delete" as const,
                  },
                ]
              : []),
          ]}
        />
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
      cancelled: "error" as const,
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
      urgent: "error" as const,
    };
    return variantMap[priority];
  };

  const getStatusIcon = (status: Order["status"]) => {
    const iconMap = {
      draft: <Edit className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
      approved: <CheckCircle className="w-4 h-4" />,
      shipped: <Package className="w-4 h-4" />,
      delivered: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
    };
    return iconMap[status];
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
    <div className="space-y-6">
      <Card>
        <PageHeader
          title="Pengelolaan Pemesanan"
          actions={
            <>
              {/* <ActionButton variant="blue">Filter</ActionButton> */}
              <ActionButton variant="primary" onClick={handleAddOrder}>
                <Plus className="w-5 h-5" />
                <span>Buat Pesanan</span>
              </ActionButton>
            </>
          }
        />

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Cari nomor pesanan, supplier, atau pembuat..."
          filters={[
            {
              value: selectedStatus,
              onChange: setSelectedStatus,
              options: statusOptions,
            },
            {
              value: selectedPriority,
              onChange: setSelectedPriority,
              options: priorityOptions,
            },
          ]}
        />

        <StatsGrid stats={stats} columns={5} />

        <Table
          columns={columns}
          data={filteredOrders}
          emptyMessage={
            searchTerm || selectedStatus || selectedPriority
              ? "Tidak ada pesanan yang sesuai dengan filter."
              : "Belum ada data pesanan."
          }
          emptyIcon={ShoppingCart}
        />

        {(searchTerm || selectedStatus || selectedPriority) &&
          filteredOrders.length === 0 && (
            <div className="text-center py-4">
              <ActionButton variant="secondary" onClick={handleResetFilters}>
                Reset Filter
              </ActionButton>
            </div>
          )}
      </Card>

      {/* Summary Card */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ringkasan Pesanan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4">
            <h4 className="text-sm font-medium text-indigo-900 mb-2">
              Total Nilai Pesanan
            </h4>
            <p className="text-2xl font-bold text-indigo-600">
              {formatCurrency(
                orders.reduce((sum, order) => sum + order.totalAmount, 0)
              )}
            </p>
            <p className="text-xs text-indigo-700 mt-1">
              Dari {orders.length} pesanan
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
            <h4 className="text-sm font-medium text-emerald-900 mb-2">
              Pesanan Aktif
            </h4>
            <p className="text-2xl font-bold text-emerald-600">
              {
                orders.filter((order) =>
                  ["pending", "approved", "shipped"].includes(order.status)
                ).length
              }
            </p>
            <p className="text-xs text-emerald-700 mt-1">
              Menunggu penyelesaian
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
            <h4 className="text-sm font-medium text-amber-900 mb-2">
              Pesanan Mendesak
            </h4>
            <p className="text-2xl font-bold text-amber-600">
              {
                orders.filter(
                  (order) =>
                    order.priority === "urgent" &&
                    ["pending", "approved", "shipped"].includes(order.status)
                ).length
              }
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Perlu perhatian segera
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrdersPage;
