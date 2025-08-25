// src/app/(dashboard)/users/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

const UsersPage: React.FC = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Manager",
      status: "active",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Staff",
      status: "inactive",
    },
  ]);

  // Filtered users based on search
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Event handlers
  const handleAddUser = () => {
    console.log("Add user clicked");
    // TODO: Implement add user modal/form
  };

  const handleEditUser = (userId: string) => {
    console.log("Edit user:", userId);
    // TODO: Implement edit user functionality
  };

  const handleDeleteUser = (userId: string) => {
    console.log("Delete user:", userId);
    // TODO: Implement delete user functionality
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Main Content Card */}
      <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-40 shadow-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-gray-900 text-xl font-semibold">Data User</h2>
          <button
            onClick={handleAddUser}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah User</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari user..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-gray-700 font-medium text-sm uppercase tracking-wider">
                  Nama
                </th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium text-sm uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium text-sm uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium text-sm uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium text-sm uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-4 px-6 text-gray-900 font-medium">
                      {user.name}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                    <td className="py-4 px-6 text-gray-600">{user.role}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status === "active" ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEditUser(user.id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-1 hover:bg-blue-50 rounded"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200 p-1 hover:bg-red-50 rounded"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 px-6 text-center text-gray-500"
                  >
                    {searchTerm
                      ? "Tidak ada user yang ditemukan"
                      : "Belum ada data user"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Results Info */}
        {searchTerm && (
          <div className="mt-4 text-sm text-gray-600">
            Menampilkan {filteredUsers.length} dari {users.length} user
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
