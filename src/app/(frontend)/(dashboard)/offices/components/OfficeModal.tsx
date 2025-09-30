// src/app/(dashboard)/offices/components/OfficeModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Save, AlertCircle, Building } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalFooter,
  Button,
  Input,
  Select,
  Badge,
} from "@/fe/components/index";
import type { Office, OfficeType } from "../office.type";

interface CreateOfficePayload {
  name: string;
  type: OfficeType;
  location: string;
}

interface UpdateOfficePayload extends CreateOfficePayload {
  id: string;
}

interface OfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: CreateOfficePayload | UpdateOfficePayload
  ) => Promise<{ success: boolean; error?: string }>;
  office?: Office | null;
  mode: "create" | "edit";
  checkOfficeNameExists?: (
    officeName: string,
    excludeId?: string
  ) => Promise<boolean>;
}

export const OfficeModal: React.FC<OfficeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  office,
  mode,
  checkOfficeNameExists,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "unset" as OfficeType,
    location: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameExists, setNameExists] = useState(false);

  // Office type options
  const officeTypeOptions = [
    { value: "pdc", label: "PDC - Primary Distribution Center" },
    { value: "distributor", label: "Distributor - Distributor Office" },
    { value: "grb", label: "GRB - Gudang Regional Branch" },
    { value: "unset", label: "Unassigned - Belum ditentukan" },
  ];

  // Common locations for dropdown with custom option
  const commonLocations = [
    { value: "Jakarta", label: "Jakarta" },
    { value: "Surabaya", label: "Surabaya" },
    { value: "Bandung", label: "Bandung" },
    { value: "Medan", label: "Medan" },
    { value: "Semarang", label: "Semarang" },
    { value: "Makassar", label: "Makassar" },
    { value: "Palembang", label: "Palembang" },
    { value: "Tangerang", label: "Tangerang" },
    { value: "Depok", label: "Depok" },
    { value: "Bekasi", label: "Bekasi" },
    { value: "Bogor", label: "Bogor" },
    { value: "Yogyakarta", label: "Yogyakarta" },
    { value: "Malang", label: "Malang" },
    { value: "Solo", label: "Solo" },
    { value: "Balikpapan", label: "Balikpapan" },
    { value: "Manado", label: "Manado" },
    { value: "Denpasar", label: "Denpasar" },
    { value: "Pontianak", label: "Pontianak" },
    { value: "Pekanbaru", label: "Pekanbaru" },
    { value: "Banjarmasin", label: "Banjarmasin" },
  ];

  // Reset form when modal opens/closes or office changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && office) {
        setFormData({
          name: office.name,
          type: office.type,
          location: office.location,
        });
      } else {
        setFormData({
          name: "",
          type: "unset",
          location: "",
        });
      }
      setErrors({});
      setNameExists(false);
    }
  }, [isOpen, office, mode]);

  // Check name uniqueness
  const handleNameChange = async (value: string) => {
    setFormData((prev) => ({ ...prev, name: value }));
    setErrors((prev) => ({ ...prev, name: "" }));

    if (value && checkOfficeNameExists) {
      const exists = await checkOfficeNameExists(
        value,
        mode === "edit" && office ? office.id : undefined
      );
      setNameExists(exists);
    } else {
      setNameExists(false);
    }
  };

  const handleInputChange = (field: string, value: string | OfficeType) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama office harus diisi";
    } else if (nameExists) {
      newErrors.name = "Nama office sudah ada";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Lokasi harus diisi";
    }

    if (!formData.type) {
      newErrors.type = "Tipe office harus dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        type: formData.type,
        location: formData.location.trim(),
      };

      const finalPayload =
        mode === "edit" && office ? { id: office.id, ...payload } : payload;

      const result = await onSave(finalPayload);

      if (result.success) {
        onClose();
      } else {
        setErrors({ submit: result.error || "Terjadi kesalahan" });
      }
    } catch (error) {
      setErrors({ submit: `Terjadi kesalahan tidak terduga, error: ${error}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get office type badge variant
  const getOfficeTypeBadge = (type: OfficeType) => {
    const variants = {
      pdc: "primary",
      distributor: "success",
      grb: "warning",
      unset: "default",
    };
    return variants[type] || "default";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      closable={!isSubmitting}
      closeOnOverlayClick={!isSubmitting}
      title={mode === "create" ? "Tambah Office" : "Edit Office"}
    >
      <ModalContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {errors.submit && (
            <div className="flex items-start gap-3 p-4 bg-error-container rounded-lg border-2 border-error/20">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <span className="text-error-container-foreground text-sm font-medium">
                {errors.submit}
              </span>
            </div>
          )}

          {/* Office Name Input */}
          <Input
            variant="search"
            label="Nama Office"
            placeholder="Masukkan nama office"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            error={errors.name || (nameExists ? "Nama office sudah ada" : "")}
            disabled={isSubmitting}
            inputSize="lg"
            clearable
            onClear={() => handleNameChange("")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Office Type Select */}
            <Select
              label="Tipe Office"
              options={officeTypeOptions}
              value={formData.type}
              onValueChange={(value) =>
                handleInputChange("type", value as OfficeType)
              }
              placeholder="Pilih tipe office"
              error={errors.type}
              disabled={isSubmitting}
              size="lg"
              searchable
            />

            {/* Location Input with Suggestions */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Lokasi
              </label>
              <Input
                list="location-suggestions"
                placeholder="Pilih atau ketik lokasi"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                error={errors.location}
                disabled={isSubmitting}
                inputSize="lg"
                clearable
                onClear={() => handleInputChange("location", "")}
              />
              <datalist id="location-suggestions">
                {commonLocations.map((loc) => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </datalist>
              {!errors.location && (
                <p className="text-xs text-surface-variant-foreground">
                  Pilih dari daftar atau ketik lokasi baru
                </p>
              )}
            </div>
          </div>

          {/* Preview Card */}
          {formData.name && formData.location && (
            <div className="surface rounded-lg p-4 border-2 border-outline-variant">
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Preview:
              </h4>
              <div className="flex items-center justify-between p-4 bg-elevation-1 border-2 border-outline rounded-lg transition-all hover:shadow-elevation-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {formData.name}
                    </div>
                    <div className="text-sm text-surface-variant-foreground">
                      {formData.location}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={getOfficeTypeBadge(formData.type) as any}
                  size="md"
                >
                  {
                    officeTypeOptions
                      .find((opt) => opt.value === formData.type)
                      ?.label.split(" - ")[0]
                  }
                </Badge>
              </div>
            </div>
          )}
        </form>
      </ModalContent>

      <ModalFooter>
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={isSubmitting}
          size="lg"
        >
          Batal
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            nameExists ||
            !formData.name.trim() ||
            !formData.location.trim()
          }
          isLoading={isSubmitting}
          leftIcon={<Save className="w-4 h-4" />}
          size="lg"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
