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
  Search,
  Filter,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Input,
  Select,
  Spinner,
  Table,
} from "@/fe/components/index";
import { ContentWrapper } from "@/fe/components/layout/ContentWrapper";
import { PageHeader } from "@/fe/components/layout/PageHeader";
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
      pdc: { label: "PDC", variant: "primary" as const },
      distributor: { label: "Distributor", variant: "success" as const },
      grb: { label: "GRB", variant: "warning" as const },
      unset: { label: "Unassigned", variant: "default" as const },
    };

    const config = typeMap[type as keyof typeof typeMap] || {
      label: type,
      variant: "default" as const,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
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
      title: "Nama Office",
      sortable: true,
      render: (value: string, row: Office) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <Building className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-foreground">{value}</span>
            <span className="text-sm text-surface-variant-foreground">
              {row.location}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      title: "Tipe",
      sortable: true,
      align: "center" as const,
      render: (value: string) => getOfficeTypeBadge(value),
    },
    {
      key: "created_at",
      title: "Dibuat",
      sortable: true,
      render: (value: Date) => (
        <span className="text-sm text-surface-variant-foreground">
          {formatDate(value)}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Aksi",
      align: "center" as const,
      render: (_: any, row: Office) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="info"
            size="sm"
            onClick={() => handleEditOffice(row)}
            leftIcon={<Edit className="w-4 h-4" />}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteOffice(row)}
            leftIcon={<Trash2 className="w-4 h-4" />}
            className="text-error hover:text-error hover:bg-error/10"
          ></Button>
        </div>
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
  };

  const handleClearAllFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setLocationFilter("all");
  };

  // Show error state
  if (error) {
    return (
      <ContentWrapper maxWidth="full">
        <PageHeader
          title="Data Office"
          subtitle="Kelola data office dan informasinya"
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-error-container rounded-full">
                <AlertCircle className="w-12 h-12 text-error" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">
                Error Loading Offices
              </h3>
              <p className="text-surface-variant-foreground">{error}</p>
            </div>
            <Button
              onClick={handleRefresh}
              variant="primary"
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Try Again
            </Button>
          </div>
        </div>
      </ContentWrapper>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <ContentWrapper maxWidth="full">
        <PageHeader
          title="Data Office"
          subtitle="Kelola data office dan informasinya"
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="lg" color="primary" text="Memuat data offices..." />
        </div>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper maxWidth="full">
      {/* Page Header with Actions */}
      <PageHeader
        title="Data Office"
        subtitle={`Kelola data office dan informasinya (${offices.length} total)`}
        actions={
          <>
            <Button
              onClick={handleRefresh}
              variant="ghost"
              disabled={refreshing}
              leftIcon={
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
              }
            >
              Refresh
            </Button>
            <Button
              onClick={handleAddOffice}
              variant="primary"
              leftIcon={<Plus className="w-5 h-5" />}
            >
              Tambah Office
            </Button>
          </>
        }
      />

      <div className="space-y-6">
        {/* Office Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="surface rounded-xl p-5 border-2 border-primary/20 bg-primary-container hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-primary-container-foreground">
                  PDC
                </span>
              </div>
              <Building className="w-5 h-5 text-primary opacity-60" />
            </div>
            <div className="text-3xl font-bold text-primary-container-foreground">
              {stats.pdcCount}
            </div>
            <p className="text-xs text-primary-container-foreground/70 mt-1">
              Primary Distribution
            </p>
          </div>

          <div className="surface rounded-xl p-5 border-2 border-success/20 bg-success-container hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-success-container-foreground">
                  Distributor
                </span>
              </div>
              <Building className="w-5 h-5 text-success opacity-60" />
            </div>
            <div className="text-3xl font-bold text-success-container-foreground">
              {stats.distributorCount}
            </div>
            <p className="text-xs text-success-container-foreground/70 mt-1">
              Distribution Centers
            </p>
          </div>

          <div className="surface rounded-xl p-5 border-2 border-warning/20 bg-warning-container hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-warning-container-foreground">
                  GRB
                </span>
              </div>
              <Building className="w-5 h-5 text-warning opacity-60" />
            </div>
            <div className="text-3xl font-bold text-warning-container-foreground">
              {stats.grbCount}
            </div>
            <p className="text-xs text-warning-container-foreground/70 mt-1">
              GRB Offices
            </p>
          </div>

          <div className="surface rounded-xl p-5 border-2 border-outline bg-surface-variant hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-surface-variant-foreground rounded-full"></div>
                <span className="text-sm font-semibold text-surface-variant-foreground">
                  Unassigned
                </span>
              </div>
              <Building className="w-5 h-5 text-surface-variant-foreground opacity-60" />
            </div>
            <div className="text-3xl font-bold text-surface-variant-foreground">
              {stats.unsetCount}
            </div>
            <p className="text-xs text-surface-variant-foreground/70 mt-1">
              Pending Assignment
            </p>
          </div>
        </div>

        {/* Search and Filters Section */}
        <Card variant="default">
          <div className="flex items-center gap-2 mb-1">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Filter & Pencarian
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              variant="search"
              placeholder="Cari nama office atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              clearable
              onClear={() => setSearchTerm("")}
              inputSize="lg"
            />

            <Select
              options={typeOptions}
              value={typeFilter}
              onValueChange={(val) => setTypeFilter(val as string)}
              placeholder="Filter Tipe"
              size="lg"
              clearable
            />

            <Select
              options={locationOptions}
              value={locationFilter}
              onValueChange={(val) => setLocationFilter(val as string)}
              placeholder="Filter Lokasi"
              size="lg"
              clearable
            />
          </div>

          {/* Results Info */}
          {(searchTerm || typeFilter !== "all" || locationFilter !== "all") && (
            <div className="flex items-center justify-between pt-2 border-t border-outline">
              <Badge variant="outline" size="md">
                Menampilkan {filteredOffices.length} dari {offices.length}{" "}
                office
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleClearAllFilters}>
                Reset Semua Filter
              </Button>
            </div>
          )}
        </Card>

        {/* Table Section */}
        <div className="rounded-xl overflow-hidden">
          <Table
            columns={columns}
            data={filteredOffices}
            loading={false}
            size="md"
            striped
            hoverable
            emptyText={
              searchTerm || typeFilter !== "all" || locationFilter !== "all"
                ? "Tidak ada office yang ditemukan dengan filter tersebut"
                : "Belum ada data office. Klik tombol 'Tambah Office' untuk memulai."
            }
            rowKey="id"
          />
        </div>
      </div>

      {/* Office Modal */}
      <OfficeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveOffice}
        office={selectedOffice}
        mode={modalMode}
        checkOfficeNameExists={checkOfficeNameExists}
      />
    </ContentWrapper>
  );
};

export default OfficesPage;
