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
  Search,
} from "lucide-react";
import {
  Card,
  PageHeader,
  Table,
  Badge,
  Button,
  Input,
  Select,
  Spinner,
  Modal,
  ModalContent,
  ModalFooter,
  ContentWrapper,
} from "@/fe/components/index";
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DeduplicatedUser | null>(
    null
  );
  const [userToDelete, setUserToDelete] = useState<DeduplicatedUser | null>(
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
        const newUser: DeduplicatedUser = {
          id: user.id,
          email: user.email,
          phone: user.phone,
          email_confirmed_at: user.email_confirmed_at,
          created_at: user.created_at,
          offices: [],
        };

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
      unset: { label: "Unassigned", variant: "danger" as const },
    };

    const config = typeMap[type as keyof typeof typeMap] || {
      label: type,
      variant: "default" as const,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
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

  const handleDeleteClick = (user: DeduplicatedUser) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    const success = await deleteAllUserOfficeAssignments(userToDelete.id);

    if (success) {
      console.log("All user assignments deleted successfully");
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } else {
      alert("Gagal menghapus assignment. Silakan coba lagi.");
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
      title: "Email",
      render: (value: string, row: DeduplicatedUser) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{value}</span>
          {row.phone && (
            <span className="text-sm text-foreground-subtle">{row.phone}</span>
          )}
          <Badge
            variant={row.email_confirmed_at ? "success" : "danger"}
            size="sm"
            className="mt-1 w-fit"
          >
            {row.email_confirmed_at
              ? "Email Terkonfirmasi"
              : "Email Belum Terkonfirmasi"}
          </Badge>
        </div>
      ),
    },
    {
      key: "offices",
      title: "Office",
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
                  <span className="font-medium text-foreground text-sm">
                    {office.office_name}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2">
              {getOfficeTypeBadge("unset")}
              <span className="text-sm text-foreground-subtle italic">
                Belum ada assignment
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "roles",
      title: "Role",
      render: (_: any, row: DeduplicatedUser) => (
        <div className="space-y-2">
          {row.offices.length > 0 ? (
            row.offices.map((office, index) => (
              <div
                key={`${office.office_id}-${office.role_id}-${index}`}
                className="flex flex-col py-1"
              >
                <span className="text-sm font-medium text-foreground">
                  {office.role_name}
                </span>
                {office.role_description && (
                  <span className="text-xs text-foreground-subtle mt-1">
                    {office.role_description}
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="py-1">
              <span className="text-sm text-foreground-subtle italic">
                Belum ada role
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "assigned_dates",
      title: "Tanggal Assign",
      render: (_: any, row: DeduplicatedUser) => (
        <div className="space-y-2">
          {row.offices.length > 0 ? (
            row.offices.map((office, index) => (
              <div
                key={`${office.office_id}-${office.role_id}-${index}`}
                className="text-sm text-foreground-subtle py-1"
              >
                {formatDate(office.assigned_at)}
              </div>
            ))
          ) : (
            <div className="py-1">
              <span className="text-sm text-foreground-subtle italic">-</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      title: "Aksi",
      render: (_: any, row: DeduplicatedUser) => (
        <div className="flex items-center gap-2">
          <Button
            variant={row.offices.length > 0 ? "warning" : "info"}
            size="sm"
            onClick={() => handleEditUser(row)}
            leftIcon={
              row.offices.length > 0 ? (
                <Edit className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )
            }
          >
            {row.offices.length > 0 ? "Edit" : "Assign"}
          </Button>

          {row.offices.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDeleteClick(row)}
              leftIcon={<Trash2 className="w-4 h-4" />}
            ></Button>
          )}
        </div>
      ),
    },
  ];

  // Loading state
  if (loading) {
    return (
      <ContentWrapper maxWidth="full">
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="lg" text="Memuat data users..." />
        </div>
      </ContentWrapper>
    );
  }

  // Error state
  if (error) {
    return (
      <ContentWrapper maxWidth="full">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Terjadi Kesalahan
          </h3>
          <p className="text-foreground-subtle mb-4">{error}</p>
          <Button
            onClick={handleRefresh}
            variant="primary"
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Coba Lagi
          </Button>
        </div>
      </ContentWrapper>
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
    <ContentWrapper maxWidth="full">
      <PageHeader
        title={`Data User`}
        actions={
          <Button
            onClick={handleRefresh}
            variant="success"
            disabled={refreshing}
            leftIcon={
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
            }
          >
            Refresh
          </Button>
        }
      />

      {/* User Statistics */}
      <div className="mb-4 text-sm text-foreground-subtle">
        Total {deduplicatedUsers.length} unique users dengan {users.length}{" "}
        total assignments
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <Input
          variant="search"
          placeholder="Cari email, phone, role, atau office..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          clearable
          onClear={() => setSearchTerm("")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            options={statusOptions}
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as string)}
            placeholder="Pilih Status"
          />
          <Select
            options={roleOptions}
            value={roleFilter}
            onValueChange={(value) => setRoleFilter(value as string)}
            placeholder="Pilih Role"
            searchable
          />
          <Select
            options={officeOptions}
            value={officeFilter}
            onValueChange={(value) => setOfficeFilter(value as string)}
            placeholder="Pilih Office"
            searchable
          />
        </div>
      </div>

      <Table columns={columns} data={filteredUsers} emptyText={emptyMessage} />

      {/* Results Info */}
      {hasActiveFilters && (
        <div className="mt-4 text-sm text-foreground-subtle">
          Menampilkan {filteredUsers.length} dari {deduplicatedUsers.length}{" "}
          user
        </div>
      )}

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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Konfirmasi Hapus Assignment"
        size="md"
      >
        <ModalContent>
          <div className="space-y-4">
            <p className="text-foreground">
              {userToDelete && userToDelete.offices.length > 1
                ? `Apakah Anda yakin ingin menghapus semua ${userToDelete.offices.length} office assignment untuk user ${userToDelete.email}?`
                : `Apakah Anda yakin ingin menghapus office assignment untuk user ${userToDelete?.email}?`}
            </p>
            <div className="bg-warning-container border-2 border-warning/40 rounded-lg p-4">
              <p className="text-sm text-on-warning-container font-medium">
                Peringatan: Tindakan ini tidak dapat dibatalkan!
              </p>
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Hapus
          </Button>
        </ModalFooter>
      </Modal>
    </ContentWrapper>
  );
};

export default UsersPage;
