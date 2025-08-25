// src/app/(dashboard)/orders/page.tsx
"use client";

import React, { useState } from "react";
import {
  ShoppingCart,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Package,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

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

const OrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [isAddingOrder, setIsAddingOrder] = useState(false);

  // Dummy data
  const orders: Order[] = [
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

  const statuses = [
    "All",
    "draft",
    "pending",
    "approved",
    "shipped",
    "delivered",
    "cancelled",
  ];
  const priorities = ["All", "low", "medium", "high", "urgent"];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "" ||
      selectedStatus === "All" ||
      order.status === selectedStatus;
    const matchesPriority =
      selectedPriority === "" ||
      selectedPriority === "All" ||
      order.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleAddOrder = () => {
    setIsAddingOrder(true);
    console.log("Opening add order modal");
    // You can add modal logic here
    setTimeout(() => setIsAddingOrder(false), 1000);
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

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "pending":
        return "Pending";
      case "approved":
        return "Disetujui";
      case "shipped":
        return "Dikirim";
      case "delivered":
        return "Diterima";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const getPriorityBadge = (priority: Order["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityText = (priority: Order["priority"]) => {
    switch (priority) {
      case "low":
        return "Rendah";
      case "medium":
        return "Sedang";
      case "high":
        return "Tinggi";
      case "urgent":
        return "Mendesak";
      default:
        return priority;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "draft":
        return <Edit className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "shipped":
        return <Package className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-40 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-gray-900 text-xl font-semibold">
            Pengelolaan Pemesanan
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={() => console.log("Opening filters")}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center space-x-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filter</span>
            </button>
            <button
              onClick={handleAddOrder}
              disabled={isAddingOrder}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus
                className={`w-5 h-5 ${isAddingOrder ? "animate-spin" : ""}`}
              />
              <span>{isAddingOrder ? "Adding..." : "Buat Pesanan"}</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari nomor pesanan, supplier, atau pembuat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {statuses.map((status) => (
              <option key={status} value={status === "All" ? "" : status}>
                {status === "All"
                  ? "Semua Status"
                  : getStatusText(status as Order["status"])}
              </option>
            ))}
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {priorities.map((priority) => (
              <option key={priority} value={priority === "All" ? "" : priority}>
                {priority === "All"
                  ? "Semua Prioritas"
                  : getPriorityText(priority as Order["priority"])}
              </option>
            ))}
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium opacity-90">Pending</h3>
            <p className="text-2xl font-bold">
              {orders.filter((order) => order.status === "pending").length}
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium opacity-90">Disetujui</h3>
            <p className="text-2xl font-bold">
              {orders.filter((order) => order.status === "approved").length}
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium opacity-90">Dikirim</h3>
            <p className="text-2xl font-bold">
              {orders.filter((order) => order.status === "shipped").length}
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium opacity-90">Selesai</h3>
            <p className="text-2xl font-bold">
              {orders.filter((order) => order.status === "delivered").length}
            </p>
          </div>
          <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium opacity-90">Total Pesanan</h3>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
        </div>

        {/* Orders Table */}
        {filteredOrders.length > 0 ? (
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">
                      No. Pesanan
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Supplier
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Tanggal Pesan
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Target Kirim
                    </th>
                    <th className="text-right py-3 px-4 font-medium">
                      Total Nilai
                    </th>
                    <th className="text-center py-3 px-4 font-medium">
                      Prioritas
                    </th>
                    <th className="text-center py-3 px-4 font-medium">
                      Status
                    </th>
                    <th className="text-center py-3 px-4 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-mono text-sm font-medium">
                            {order.orderNumber}
                          </div>
                          <div className="text-xs text-gray-500">
                            oleh {order.createdBy}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{order.supplier}</div>
                          <div className="text-xs text-gray-500">
                            {order.items.length} item(s)
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(order.orderDate).toLocaleDateString("id-ID")}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(order.expectedDelivery).toLocaleDateString(
                          "id-ID"
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(
                            order.priority
                          )}`}
                        >
                          {getPriorityText(order.priority)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => handleViewOrder(order.id)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {(order.status === "draft" ||
                            order.status === "pending") && (
                            <button
                              onClick={() => handleEditOrder(order.id)}
                              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                              title="Edit Order"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {order.status === "draft" && (
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">
              {searchTerm || selectedStatus || selectedPriority
                ? "Tidak ada pesanan yang sesuai dengan filter."
                : "Belum ada data pesanan."}
            </p>
            {(searchTerm || selectedStatus || selectedPriority) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("");
                  setSelectedPriority("");
                }}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Reset Filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Additional Order Summary Card */}
      <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-40 shadow-lg">
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
      </div>
    </div>
  );
};

export default OrdersPage;
