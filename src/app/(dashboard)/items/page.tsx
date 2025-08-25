// src/app/(dashboard)/items/page.tsx
"use client";

import React, { useState } from "react";
import {
  Package,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Archive,
} from "lucide-react";

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

  const categories = ["All", "Electronics", "Furniture", "Stationery"];
  const statuses = ["All", "active", "inactive", "discontinued"];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" ||
      selectedCategory === "All" ||
      item.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "" ||
      selectedStatus === "All" ||
      item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddItem = () => {
    setIsAddingItem(true);
    console.log("Opening add item modal");
    // You can add modal logic here
    setTimeout(() => setIsAddingItem(false), 1000);
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

  const getStatusBadge = (status: Item["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "discontinued":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  return (
    <div className="space-y-6">
      <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-40 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-gray-900 text-xl font-semibold">
            Pengelolaan Barang
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
              onClick={handleAddItem}
              disabled={isAddingItem}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus
                className={`w-5 h-5 ${isAddingItem ? "animate-spin" : ""}`}
              />
              <span>{isAddingItem ? "Adding..." : "Tambah Barang"}</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari barang, deskripsi, atau supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {categories.map((category) => (
              <option key={category} value={category === "All" ? "" : category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {statuses.map((status) => (
              <option key={status} value={status === "All" ? "" : status}>
                {status === "All"
                  ? "Semua Status"
                  : getStatusText(status as Item["status"])}
              </option>
            ))}
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium opacity-90">Total Aktif</h3>
            <p className="text-2xl font-bold">
              {items.filter((item) => item.status === "active").length}
            </p>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium opacity-90">Stok Rendah</h3>
            <p className="text-2xl font-bold">
              {
                items.filter(
                  (item) =>
                    item.currentStock <= item.minStock && item.currentStock > 0
                ).length
              }
            </p>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium opacity-90">Stok Habis</h3>
            <p className="text-2xl font-bold">
              {items.filter((item) => item.currentStock === 0).length}
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium opacity-90">Total Barang</h3>
            <p className="text-2xl font-bold">{items.length}</p>
          </div>
        </div>

        {/* Items Table */}
        {filteredItems.length > 0 ? (
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">
                      ID Barang
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Nama Barang
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Kategori
                    </th>
                    <th className="text-right py-3 px-4 font-medium">Stok</th>
                    <th className="text-right py-3 px-4 font-medium">Harga</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Supplier
                    </th>
                    <th className="text-center py-3 px-4 font-medium">
                      Status
                    </th>
                    <th className="text-center py-3 px-4 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, index) => {
                    const stockStatus = getStockStatus(
                      item.currentStock,
                      item.minStock
                    );
                    return (
                      <tr
                        key={item.id}
                        className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-25"
                        }`}
                      >
                        <td className="py-3 px-4 font-mono text-sm">
                          {item.id}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {item.description}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{item.category}</td>
                        <td className="py-3 px-4 text-right">
                          <div>
                            <span className={stockStatus.color}>
                              {item.currentStock} {item.unit}
                            </span>
                            <div className="text-xs text-gray-500">
                              Min: {item.minStock}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="py-3 px-4">{item.supplier}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                              item.status
                            )}`}
                          >
                            {getStatusText(item.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              onClick={() => handleViewItem(item.id)}
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditItem(item.id)}
                              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                              title="Edit Item"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">
              {searchTerm || selectedCategory || selectedStatus
                ? "Tidak ada barang yang sesuai dengan filter."
                : "Belum ada data barang."}
            </p>
            {(searchTerm || selectedCategory || selectedStatus) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setSelectedStatus("");
                }}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Reset Filter
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemsPage;
