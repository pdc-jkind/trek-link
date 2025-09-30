// src/app/(frontend)/(dashboard)/items/components/ItemMasterModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Save, AlertCircle } from "lucide-react";
import { Tables, TablesInsert, TablesUpdate } from "@/types/database";
import {
  Modal,
  ModalContent,
  ModalFooter,
  Input,
  Select,
  Button,
  Badge,
} from "@/fe/components/index";

type ItemMaster = Tables<"item_masters">;
type Office = Tables<"offices">;

interface ItemMasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: TablesInsert<"item_masters"> | TablesUpdate<"item_masters">
  ) => Promise<{ success: boolean; error?: string }>;
  itemMaster?: ItemMaster | null;
  mode: "create" | "edit";
  checkNameExists?: (name: string, excludeId?: string) => Promise<boolean>;
  offices: Office[];
  officesLoading: boolean;
}

export const ItemMasterModal: React.FC<ItemMasterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemMaster,
  mode,
  checkNameExists,
  offices,
  officesLoading,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "regular" as "regular" | "inventory",
    office_id: "",
    img_url: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameExists, setNameExists] = useState(false);

  // Reset form when modal opens/closes or itemMaster changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && itemMaster) {
        setFormData({
          name: itemMaster.name,
          type: itemMaster.type as "regular" | "inventory",
          office_id: itemMaster.office_id || "",
          img_url: itemMaster.img_url || "",
        });
      } else {
        setFormData({
          name: "",
          type: "regular",
          office_id: "",
          img_url: "",
        });
      }
      setErrors({});
      setNameExists(false);
    }
  }, [isOpen, itemMaster, mode]);

  // Check name uniqueness
  const handleNameChange = async (value: string) => {
    setFormData((prev) => ({ ...prev, name: value }));
    setErrors((prev) => ({ ...prev, name: "" }));

    if (value && checkNameExists) {
      const exists = await checkNameExists(
        value,
        mode === "edit" && itemMaster ? itemMaster.id : undefined
      );
      setNameExists(exists);
    } else {
      setNameExists(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Jenis mobil / Nama Barang harus diisi";
    } else if (nameExists) {
      newErrors.name = "Jenis mobil / Nama Barang sudah ada";
    }

    if (!formData.office_id.trim()) {
      newErrors.office_id = "Office harus dipilih";
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
        name: formData.name,
        type: formData.type,
        office_id: formData.office_id || null,
        img_url: formData.img_url || null,
      };

      const finalPayload =
        mode === "edit" && itemMaster
          ? { id: itemMaster.id, ...payload }
          : payload;

      const result = await onSave(finalPayload);

      if (result.success) {
        onClose();
      } else {
        setErrors({ submit: result.error || "Terjadi kesalahan" });
      }
    } catch (error) {
      setErrors({ submit: `Terjadi kesalahan tidak terduga: ${error}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // Get office type badge variant
  const getOfficeTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "distributor":
        return "primary";
      case "grb":
        return "success";
      case "pdc":
        return "warning";
      case "unset":
      default:
        return "default";
    }
  };

  // Transform offices to select options
  const officeOptions = offices.map((office) => ({
    value: office.id,
    label: `${office.name} - ${office.location} (${office.type.toUpperCase()})`,
  }));

  // Type options
  const typeOptions = [
    { value: "regular", label: "Regular (KF)" },
    { value: "inventory", label: "Inventory" },
  ];

  // Find selected office for preview
  const selectedOffice = offices.find(
    (office) => office.id === formData.office_id
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        mode === "create" ? "Tambah Kategori Barang" : "Edit Kategori Barang"
      }
      size="md"
      closable={!isSubmitting}
      closeOnOverlayClick={!isSubmitting}
    >
      <ModalContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Alert */}
          {errors.submit && (
            <div className="bg-error-container border-2 border-error/40 rounded-lg p-4 flex items-start space-x-3 animate-slide-down">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <span className="text-error-container-foreground text-sm font-medium">
                {errors.submit}
              </span>
            </div>
          )}

          {/* Nama Kategori */}
          <Input
            label="Jenis Mobil / Nama Barang *"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Masukkan nama mobil / Barang"
            disabled={isSubmitting}
            error={errors.name || (nameExists ? "Jenis mobil sudah ada" : "")}
            inputSize="lg"
            clearable
            onClear={() => handleNameChange("")}
          />

          {/* Image URL */}
          <div className="space-y-2">
            <Input
              label="URL Gambar"
              type="url"
              value={formData.img_url}
              onChange={(e) => handleInputChange("img_url", e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={isSubmitting}
              inputSize="lg"
              clearable
              onClear={() => handleInputChange("img_url", "")}
            />
            {formData.img_url && (
              <div className="flex justify-center animate-fade-in">
                <img
                  src={formData.img_url}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border-2 border-outline shadow-elevation-2"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Tipe Kategori */}
          <Select
            label="Tipe Kategori *"
            options={typeOptions}
            value={formData.type}
            onValueChange={(value) =>
              handleInputChange("type", value as string)
            }
            disabled={isSubmitting}
            size="lg"
          />

          {/* Office Dropdown */}
          <div className="space-y-3">
            <Select
              label="Office *"
              options={officeOptions}
              value={formData.office_id}
              onValueChange={(value) =>
                handleInputChange("office_id", value as string)
              }
              placeholder={officesLoading ? "Memuat office..." : "Pilih Office"}
              disabled={isSubmitting || officesLoading}
              error={errors.office_id}
              searchable
              clearable
              size="lg"
            />

            {/* Show selected office details */}
            {selectedOffice && !officesLoading && (
              <div className="p-4 bg-primary-container border-2 border-primary/40 rounded-lg animate-slide-down">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary-container-foreground">
                      {selectedOffice.name}
                    </p>
                    <p className="text-xs text-primary-container-foreground/80">
                      {selectedOffice.location}
                    </p>
                  </div>
                  <Badge
                    variant={getOfficeTypeBadgeVariant(selectedOffice.type)}
                    size="md"
                  >
                    {selectedOffice.type.toUpperCase()}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </form>
      </ModalContent>

      <ModalFooter>
        <Button
          variant="outline"
          onClick={handleClose}
          disabled={isSubmitting}
          size="md"
        >
          Batal
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting || nameExists || officesLoading}
          isLoading={isSubmitting}
          leftIcon={!isSubmitting && <Save className="w-4 h-4" />}
          size="md"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
