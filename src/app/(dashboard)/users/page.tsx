// src/app/(dashboard)/users/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import {
  Card,
  PageHeader,
  SearchFilter,
  Table,
  StatusBadge,
  ActionButton,
} from "../components/ui";

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

// Dummy data
const dummyUsers: User[] = [
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
];

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users] = useState<User[]>(dummyUsers);

  // Filter options
  const statusOptions = [
    { value: "all", label: "Semua Status" },
    { value: "active", label: "Aktif" },
    { value: "inactive", label: "Tidak Aktif" },
  ];

  const roleOptions = [
    { value: "all", label: "Semua Role" },
    { value: "Admin", label: "Admin" },
    { value: "Manager", label: "Manager" },
    { value: "Staff", label: "Staff" },
  ];

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  // Table columns
  const columns = [
    {
      key: "name",
      label: "Nama",
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (value: string) => <span className="text-gray-600">{value}</span>,
    },
    {
      key: "role",
      label: "Role",
      render: (value: string) => <span className="text-gray-600">{value}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <StatusBadge
          status={value === "active" ? "Aktif" : "Tidak Aktif"}
          variant={value === "active" ? "success" : "error"}
        />
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      render: (_: any, row: User) => (
        <ActionButton
          mode="multiple"
          actions={[
            {
              label: "Edit User",
              onClick: () => handleEditUser(row.id),
              icon: Edit,
              variant: "edit",
            },
            {
              label: "Delete User",
              onClick: () => handleDeleteUser(row.id),
              icon: Trash2,
              variant: "delete",
            },
          ]}
        />
      ),
    },
  ];

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

  return (
    <div className="space-y-6">
      <Card>
        <PageHeader
          title="Data User"
          actions={
            <ActionButton onClick={handleAddUser} variant="purple">
              <Plus className="w-5 h-5" />
              <span>Tambah User</span>
            </ActionButton>
          }
        />

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Cari user..."
          filters={[
            {
              value: statusFilter,
              onChange: setStatusFilter,
              options: statusOptions,
            },
            {
              value: roleFilter,
              onChange: setRoleFilter,
              options: roleOptions,
            },
          ]}
        />

        <Table
          columns={columns}
          data={filteredUsers}
          emptyMessage={
            searchTerm || statusFilter !== "all" || roleFilter !== "all"
              ? "Tidak ada user yang ditemukan"
              : "Belum ada data user"
          }
          emptyIcon={Users}
        />

        {/* Results Info */}
        {(searchTerm || statusFilter !== "all" || roleFilter !== "all") && (
          <div className="mt-4 text-sm text-gray-600">
            Menampilkan {filteredUsers.length} dari {users.length} user
          </div>
        )}
      </Card>
    </div>
  );
};

export default UsersPage;
