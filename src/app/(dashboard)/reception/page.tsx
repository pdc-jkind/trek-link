// src/app/(dashboard)/inventory/page.tsx
"use client";

import React, { useState } from "react";
import { Package, Plus, Filter, Search, Eye, Edit, Trash2 } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  receivedDate: string;
  supplier: string;
  status: "received" | "pending" | "rejected";
}

const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Dummy data
  const inventoryItems: InventoryItem[] = [
    {
      id: "INV-001",
      name: "Laptop Dell Inspiron 15",
      category: "Electronics",
      quantity: 25,
      unit: "pcs",
      receivedDate: "2024-01-15",
      supplier: "PT Tech Solutions",
      status: "received",
    },
    {
      id: "INV-002",
      name: "Office Chair Ergonomic",
      category: "Furniture",
      quantity: 50,
      unit: "pcs",
      receivedDate: "2024-01-14",
      supplier: "PT Furniture Prima",
      status: "received",
    },
    {
      id: "INV-003",
      name: "Printer Canon G3010",
      category: "Electronics",
      quantity: 10,
      unit: "pcs",
      receivedDate: "2024-01-13",
      supplier: "PT Office Equipment",
      status: "pending",
    },
    {
      id: "INV-004",
      name: "Kertas A4 80gsm",
      category: "Stationery",
      quantity: 100,
      unit: "ream",
      receivedDate: "2024-01-12",
      supplier: "PT Paper Supply",
      status: "received",
    },
    {
      id: "INV-005",
      name: "Monitor LG 24 inch",
      category: "Electronics",
      quantity: 15,
      unit: "pcs",
      receivedDate: "2024-01-11",
      supplier: "PT Display Tech",
      status: "rejected",
    },
  ];

  const categories = ["All", "Electronics", "Furniture", "Stationery"];

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" ||
      selectedCategory === "All" ||
      item.category === selectedCategory;
    return matchesSearch && matchesCategory;
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

  const getStatusBadge = (status: InventoryItem["status"]) => {
    switch (status) {
      case "received":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: InventoryItem["status"]) => {
    switch (status) {
      case "received":
        return "Diterima";
      case "pending":
        return "Pending";
      case "rejected":
        return "Ditolak";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-40 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-gray-900 text-xl font-semibold">
            Penerimaan Barang
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
              placeholder="Cari barang atau supplier..."
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium opacity-90">Total Diterima</h3>
            <p className="text-2xl font-bold">
              {
                inventoryItems.filter((item) => item.status === "received")
                  .length
              }
            </p>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium opacity-90">Pending</h3>
            <p className="text-2xl font-bold">
              {
                inventoryItems.filter((item) => item.status === "pending")
                  .length
              }
            </p>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium opacity-90">Ditolak</h3>
            <p className="text-2xl font-bold">
              {
                inventoryItems.filter((item) => item.status === "rejected")
                  .length
              }
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium opacity-90">Total Items</h3>
            <p className="text-2xl font-bold">{inventoryItems.length}</p>
          </div>
        </div>

        {/* Inventory Table */}
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
                    <th className="text-right py-3 px-4 font-medium">
                      Quantity
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Supplier
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Tanggal Terima
                    </th>
                    <th className="text-center py-3 px-4 font-medium">
                      Status
                    </th>
                    <th className="text-center py-3 px-4 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-sm">{item.id}</td>
                      <td className="py-3 px-4 font-medium">{item.name}</td>
                      <td className="py-3 px-4">{item.category}</td>
                      <td className="py-3 px-4 text-right">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-3 px-4">{item.supplier}</td>
                      <td className="py-3 px-4">
                        {new Date(item.receivedDate).toLocaleDateString(
                          "id-ID"
                        )}
                      </td>
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">
              {searchTerm || selectedCategory
                ? "Tidak ada barang yang sesuai dengan filter."
                : "Belum ada data penerimaan barang."}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
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

export default InventoryPage;
