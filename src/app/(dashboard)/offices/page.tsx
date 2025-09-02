// src/app/(dashboard)/offices/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Building,
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
import { useOffice } from "./useOffice";
import { OfficeModal } from "./components/OfficeModal";
import type { Office, OfficeType } from "./office.type";

interface CreateOfficePayload {
  name: string;
  type: OfficeType;
  location: string;
}

interface UpdateOfficePayload extends CreateOfficePayload {
  id: string;
}

const OfficesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);

  // Use office hook
  const {
    offices,
    loading,
    refreshing,
    error,
    createOffice,
    updateOffice,
    deleteOffice,
    refreshOffices,
    checkOfficeNameExists,
    getOfficeStats,
  } = useOffice();

  // Get office statistics
  const stats = getOfficeStats();

  // Filter options for office type
  const typeOptions = [
    { value: "all", label: "Semua Tipe" },
    { value: "pdc", label: "PDC" },
    { value: "distributor", label: "Distributor" },
    { value: "grb", label: "GRB" },
    { value: "unset", label: "Unassigned" },
  ];

  // Filter options for status
  const statusOptions = [
    { value: "all", label: "Semua Status" },
    { value: "active", label: "Aktif" },
    { value: "inactive", label: "Non-Aktif" },
  ];

  // Location filter options from data
  const locationOptions = useMemo(
    () => [
      { value: "all", label: "Semua Lokasi" },
      ...Array.from(new Set(offices.map((office) => office.location))).map(
        (location) => ({
          value: location,
          label: location,
        })
      ),
    ],
    [offices]
  );

  // Filtered offices
  const filteredOffices = useMemo(() => {
    return offices.filter((office) => {
      const matchesSearch =
        office.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        office.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === "all" || office.type === typeFilter;

      const matchesLocation =
        locationFilter === "all" || office.location === locationFilter;

      return matchesSearch && matchesType && matchesLocation;
    });
  }, [offices, searchTerm, typeFilter, locationFilter]);

  // Format office type badge
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

  // Format date
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Table columns
  const columns = [
    {
      key: "name",
      label: "Nama Office",
      render: (value: string, row: Office) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{value}</span>
          <span className="text-sm text-gray-500">{row.location}</span>
        </div>
      ),
    },
    {
      key: "type",
      label: "Tipe",
      render: (value: string) => getOfficeTypeBadge(value),
    },
    {
      key: "created_at",
      label: "Dibuat",
      render: (value: Date) => (
        <span className="text-sm text-gray-600">{formatDate(value)}</span>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      render: (_: any, row: Office) => (
        <ActionButton
          mode="multiple"
          actions={[
            {
              label: "Edit Office",
              onClick: () => handleEditOffice(row),
              icon: Edit,
              variant: "edit",
            },
            {
              label: "Delete Office",
              onClick: () => handleDeleteOffice(row),
              icon: Trash2,
              variant: "delete",
            },
          ]}
        />
      ),
    },
  ];

  // Modal event handlers
  const handleAddOffice = () => {
    setSelectedOffice(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEditOffice = (office: Office) => {
    setSelectedOffice(office);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOffice(null);
  };

  const handleSaveOffice = async (
    data: CreateOfficePayload | UpdateOfficePayload
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (modalMode === "create") {
        const result = await createOffice(data as CreateOfficePayload);
        if (result) {
          return { success: true };
        } else {
          return { success: false, error: "Gagal membuat office" };
        }
      } else {
        const updateData = data as UpdateOfficePayload;
        const result = await updateOffice(updateData.id, {
          name: updateData.name,
          type: updateData.type,
          location: updateData.location,
        });
        if (result) {
          return { success: true };
        } else {
          return { success: false, error: "Gagal mengupdate office" };
        }
      }
    } catch (error) {
      console.error("Error saving office:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan tidak terduga",
      };
    }
  };

  const handleDeleteOffice = async (office: Office) => {
    const confirmMessage = `Apakah Anda yakin ingin menghapus office "${office.name}"?`;

    if (window.confirm(confirmMessage)) {
      const success = await deleteOffice(office.id);
      if (success) {
        console.log("Office deleted successfully");
      } else {
        console.error("Failed to delete office");
      }
    }
  };

  const handleRefresh = async () => {
    await refreshOffices();
    console.log("Refreshing offices data");
  };

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Error Loading Offices
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <ActionButton onClick={handleRefresh} variant="blue">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </ActionButton>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Memuat data offices...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <PageHeader
          title={`Data Office (${offices.length})`}
          actions={
            <div className="flex gap-2">
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
              <ActionButton onClick={handleAddOffice} variant="purple">
                <Plus className="w-5 h-5" />
                <span>Tambah Office</span>
              </ActionButton>
            </div>
          }
        />

        {/* Office Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-800">PDC</span>
            </div>
            <div className="text-2xl font-bold text-blue-900 mt-1">
              {stats.pdcCount}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">
                Distributor
              </span>
            </div>
            <div className="text-2xl font-bold text-green-900 mt-1">
              {stats.distributorCount}
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-yellow-800">GRB</span>
            </div>
            <div className="text-2xl font-bold text-yellow-900 mt-1">
              {stats.grbCount}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-800">
                Unassigned
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {stats.unsetCount}
            </div>
          </div>
        </div>

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Cari nama office atau lokasi..."
          filters={[
            {
              value: typeFilter,
              onChange: setTypeFilter,
              options: typeOptions,
            },
            {
              value: locationFilter,
              onChange: setLocationFilter,
              options: locationOptions,
            },
          ]}
        />

        <Table
          columns={columns}
          data={filteredOffices}
          emptyMessage={
            searchTerm || typeFilter !== "all" || locationFilter !== "all"
              ? "Tidak ada office yang ditemukan dengan filter tersebut"
              : "Belum ada data office"
          }
          emptyIcon={Building}
        />

        {/* Results Info */}
        {(searchTerm || typeFilter !== "all" || locationFilter !== "all") && (
          <div className="mt-4 text-sm text-gray-600">
            Menampilkan {filteredOffices.length} dari {offices.length} office
          </div>
        )}
      </Card>

      {/* Office Modal */}
      <OfficeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveOffice}
        office={selectedOffice}
        mode={modalMode}
        checkOfficeNameExists={checkOfficeNameExists}
      />
    </div>
  );
};

export default OfficesPage;
