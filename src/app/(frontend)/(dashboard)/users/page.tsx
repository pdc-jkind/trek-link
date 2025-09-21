// src/app/(dashboard)/users/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  PageHeader,
  SearchFilter,
  Table,
  StatusBadge,
  ActionButton,
} from "../components/ui";
import { UserAssignmentModal } from "./UserAssignmentModal";
import { useUser } from "./useUser";

// Interface for deduplicated user
interface DeduplicatedUser {
  id: string;
  email: string;
  phone: string | null;
  email_confirmed_at: string | null;
  created_at: string;
  offices: Array<{
    office_id: string;
    office_name: string;
    office_type: string;
    role_id: string;
    role_name: string;
    role_description: string;
    assigned_at: string;
    record_id?: string;
  }>;
}

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [officeFilter, setOfficeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DeduplicatedUser | null>(
    null
  );

  const {
    users,
    offices,
    roles,
    loading,
    error,
    refreshing,
    refreshUsers,
    refreshMasterData,
    deleteAllUserOfficeAssignments,
    bulkUpdateUserAssignments,
  } = useUser();

  // Deduplicate users by email
  const deduplicatedUsers = useMemo(() => {
    const userMap = new Map<string, DeduplicatedUser>();

    if (!users || users.length === 0) {
      return [];
    }

    users.forEach((user) => {
      const existingUser = userMap.get(user.email);

      if (existingUser) {
        // Add office assignment if it exists
        if (user.office_id && user.role_id) {
          existingUser.offices.push({
            office_id: user.office_id,
            office_name: user.office_name || "",
            office_type: user.office_type || "unset",
            role_id: user.role_id,
            role_name: user.role_name || "",
            role_description: user.role_description || "",
            assigned_at: user.assigned_at || user.created_at,
            record_id: user.id,
          });
        }
      } else {
        // Create new deduplicated user
        const newUser: DeduplicatedUser = {
          id: user.id,
          email: user.email,
          phone: user.phone,
          email_confirmed_at: user.email_confirmed_at,
          created_at: user.created_at,
          offices: [],
        };

        // Add office assignment if it exists
        if (user.office_id && user.role_id) {
          newUser.offices.push({
            office_id: user.office_id,
            office_name: user.office_name || "",
            office_type: user.office_type || "unset",
            role_id: user.role_id,
            role_name: user.role_name || "",
            role_description: user.role_description || "",
            assigned_at: user.assigned_at || user.created_at,
            record_id: user.id,
          });
        }

        userMap.set(user.email, newUser);
      }
    });

    return Array.from(userMap.values());
  }, [users]);

  // Filter options
  const statusOptions = [
    { value: "all", label: "Semua Status" },
    { value: "confirmed", label: "Email Terkonfirmasi" },
    { value: "unconfirmed", label: "Email Belum Terkonfirmasi" },
  ];

  const roleOptions = useMemo(
    () => [
      { value: "all", label: "Semua Role" },
      ...roles.map((role) => ({
        value: role.id,
        label: role.name,
      })),
    ],
    [roles]
  );

  const officeOptions = useMemo(
    () => [
      { value: "all", label: "Semua Office" },
      ...offices.map((office) => ({
        value: office.id,
        label: `${office.name} (${office.location})`,
      })),
    ],
    [offices]
  );

  // Filtered users
  const filteredUsers = useMemo(() => {
    return deduplicatedUsers.filter((user) => {
      const matchesSearch =
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone &&
          user.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.offices.some(
          (office) =>
            office.role_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            office.office_name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus = (() => {
        if (statusFilter === "all") return true;
        if (statusFilter === "confirmed") return !!user.email_confirmed_at;
        if (statusFilter === "unconfirmed") return !user.email_confirmed_at;
        return true;
      })();

      const matchesRole =
        roleFilter === "all" ||
        user.offices.some((office) => office.role_id === roleFilter);

      const matchesOffice =
        officeFilter === "all" ||
        user.offices.some((office) => office.office_id === officeFilter);

      return matchesSearch && matchesStatus && matchesRole && matchesOffice;
    });
  }, [deduplicatedUsers, searchTerm, statusFilter, roleFilter, officeFilter]);

  // Utility functions
  const getOfficeTypeBadge = (type: string) => {
    const typeMap = {
      pdc: { label: "PDC", variant: "info" as const },
      distributor: { label: "Distributor", variant: "success" as const },
      grb: { label: "GRB", variant: "warning" as const },
      unset: { label: "Unassigned", variant: "error" as const },
    };

    const config = typeMap[type as keyof typeof typeMap] || {
      label: type,
      variant: "default" as const,
    };
    return <StatusBadge status={config.label} variant={config.variant} />;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Event handlers
  const handleEditUser = (user: DeduplicatedUser) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDeleteAllUserAssignments = async (user: DeduplicatedUser) => {
    const officeCount = user.offices.length;
    const confirmMessage =
      officeCount > 1
        ? `Apakah Anda yakin ingin menghapus semua ${officeCount} office assignment untuk user ${user.email}?`
        : `Apakah Anda yakin ingin menghapus office assignment untuk user ${user.email}?`;

    if (window.confirm(confirmMessage)) {
      const success = await deleteAllUserOfficeAssignments(user.id);

      if (success) {
        console.log("All user assignments deleted successfully");
      } else {
        alert("Gagal menghapus assignment. Silakan coba lagi.");
      }
    }
  };

  const handleRefresh = async () => {
    await Promise.all([refreshUsers(), refreshMasterData()]);
  };

  const handleModalSave = async (
    assignments: Array<{ office_id: string; role_id: string }>
  ) => {
    if (!selectedUser) return false;

    try {
      const success = await bulkUpdateUserAssignments(
        selectedUser.id,
        assignments
      );

      if (success) {
        await refreshUsers();
      }

      return success;
    } catch (error) {
      console.error("Failed to save assignments:", error);
      return false;
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  // Table columns
  const columns = [
    {
      key: "email",
      label: "Email",
      render: (value: string, row: DeduplicatedUser) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{value}</span>
          {row.phone && (
            <span className="text-sm text-gray-500">{row.phone}</span>
          )}
          <span
            className={`text-xs ${
              row.email_confirmed_at ? "text-green-600" : "text-red-600"
            }`}
          >
            {row.email_confirmed_at
              ? "Email Terkonfirmasi"
              : "Email Belum Terkonfirmasi"}
          </span>
        </div>
      ),
    },
    {
      key: "offices",
      label: "Office",
      render: (_: any, row: DeduplicatedUser) => (
        <div className="space-y-2">
          {row.offices.length > 0 ? (
            row.offices.map((office, index) => (
              <div
                key={`${office.office_id}-${office.role_id}-${index}`}
                className="flex flex-col"
              >
                <div className="flex items-center gap-2">
                  {getOfficeTypeBadge(office.office_type)}
                  <span className="font-medium text-gray-900 text-sm">
                    {office.office_name}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2">
              {getOfficeTypeBadge("unset")}
              <span className="text-sm text-gray-500 italic">
                Belum ada assignment
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "roles",
      label: "Role",
      render: (_: any, row: DeduplicatedUser) => (
        <div className="space-y-2">
          {row.offices.length > 0 ? (
            row.offices.map((office, index) => (
              <div
                key={`${office.office_id}-${office.role_id}-${index}`}
                className="flex flex-col py-1"
              >
                <span className="text-sm font-medium text-gray-900">
                  {office.role_name}
                </span>
                {office.role_description && (
                  <span className="text-xs text-gray-500 mt-1">
                    {office.role_description}
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="py-1">
              <span className="text-sm text-gray-500 italic">
                Belum ada role
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "assigned_dates",
      label: "Tanggal Assign",
      render: (_: any, row: DeduplicatedUser) => (
        <div className="space-y-2">
          {row.offices.length > 0 ? (
            row.offices.map((office, index) => (
              <div
                key={`${office.office_id}-${office.role_id}-${index}`}
                className="text-sm text-gray-600 py-1"
              >
                {formatDate(office.assigned_at)}
              </div>
            ))
          ) : (
            <div className="py-1">
              <span className="text-sm text-gray-500 italic">-</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      render: (_: any, row: DeduplicatedUser) => {
        const actions: Array<{
          label: string;
          onClick: () => void;
          icon: React.ElementType;
          variant: "view" | "edit" | "delete";
        }> = [
          {
            label: row.offices.length > 0 ? "Edit Assignment" : "Assign Office",
            onClick: () => handleEditUser(row),
            icon: row.offices.length > 0 ? Edit : Plus,
            variant: row.offices.length > 0 ? "edit" : "view",
          },
        ];

        // Only show delete action if user has assignments
        if (row.offices.length > 0) {
          actions.push({
            label: "Delete All Assignments",
            onClick: () => handleDeleteAllUserAssignments(row),
            icon: Trash2,
            variant: "delete",
          });
        }

        return <ActionButton mode="multiple" actions={actions} />;
      },
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Memuat data users...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Terjadi Kesalahan
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <ActionButton onClick={handleRefresh} variant="purple">
                <RefreshCw className="w-4 h-4" />
                Coba Lagi
              </ActionButton>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Determine empty message based on filters
  const hasActiveFilters =
    searchTerm ||
    statusFilter !== "all" ||
    roleFilter !== "all" ||
    officeFilter !== "all";

  const emptyMessage = hasActiveFilters
    ? "Tidak ada user yang ditemukan dengan filter tersebut"
    : "Belum ada data user assignment";

  return (
    <div className="space-y-6">
      <Card>
        <PageHeader
          title={`Data User (${deduplicatedUsers.length})`}
          actions={
            <ActionButton
              onClick={handleRefresh}
              variant="blue"
              disabled={refreshing}
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </ActionButton>
          }
        />

        {/* User Statistics */}
        <div className="mb-4 text-sm text-gray-600">
          Total {deduplicatedUsers.length} unique users dengan {users.length}{" "}
          total assignments
        </div>

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Cari email, phone, role, atau office..."
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
            {
              value: officeFilter,
              onChange: setOfficeFilter,
              options: officeOptions,
            },
          ]}
        />

        <Table
          columns={columns}
          data={filteredUsers}
          emptyMessage={emptyMessage}
          emptyIcon={Users}
        />

        {/* Results Info */}
        {hasActiveFilters && (
          <div className="mt-4 text-sm text-gray-600">
            Menampilkan {filteredUsers.length} dari {deduplicatedUsers.length}{" "}
            user
          </div>
        )}
      </Card>

      {/* User Assignment Modal */}
      <UserAssignmentModal
        isOpen={modalOpen}
        onClose={closeModal}
        userEmail={selectedUser?.email || ""}
        userId={selectedUser?.id || ""}
        assignments={
          selectedUser?.offices.map((office) => ({
            office_id: office.office_id,
            office_name: office.office_name,
            office_type: office.office_type,
            role_id: office.role_id,
            role_name: office.role_name,
            assigned_at: office.assigned_at,
            record_id: office.record_id,
          })) || []
        }
        offices={offices}
        roles={roles}
        onSave={handleModalSave}
        loading={refreshing}
      />
    </div>
  );
};

export default UsersPage;
