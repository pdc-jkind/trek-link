// src/app/(frontend)/(dashboard)/items/components/ItemVariantModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Save, AlertCircle } from "lucide-react";
import { TablesInsert, TablesUpdate } from "@/types/database";
import {
  Modal,
  ModalContent,
  ModalFooter,
  Input,
  Button,
} from "@/fe/components/index";

type ItemVariant = {
  id: string;
  name: string;
  created_at: string | null;
  updated_at: string | null;
};

interface ItemVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: TablesInsert<"item_variants"> | TablesUpdate<"item_variants">
  ) => Promise<{ success: boolean; error?: string }>;
  itemVariant?: ItemVariant | null;
  mode: "create" | "edit";
  checkNameExists?: (name: string, excludeId?: string) => Promise<boolean>;
}

export const ItemVariantModal: React.FC<ItemVariantModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemVariant,
  mode,
  checkNameExists,
}) => {
  const [formData, setFormData] = useState({
    name: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameExists, setNameExists] = useState(false);

  // Reset form when modal opens/closes or itemVariant changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && itemVariant) {
        setFormData({
          name: itemVariant.name,
        });
      } else {
        setFormData({
          name: "",
        });
      }
      setErrors({});
      setNameExists(false);
    }
  }, [isOpen, itemVariant, mode]);

  // Check name uniqueness
  const handleNameChange = async (value: string) => {
    setFormData((prev) => ({ ...prev, name: value }));
    setErrors((prev) => ({ ...prev, name: "" }));

    if (value && checkNameExists) {
      const exists = await checkNameExists(
        value,
        mode === "edit" && itemVariant ? itemVariant.id : undefined
      );
      setNameExists(exists);
    } else {
      setNameExists(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama variant harus diisi";
    } else if (nameExists) {
      newErrors.name = "Nama variant sudah ada";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload =
        mode === "edit" && itemVariant
          ? { id: itemVariant.id, name: formData.name }
          : { name: formData.name };

      const result = await onSave(payload);

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === "create" ? "Tambah Variant" : "Edit Variant"}
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

          {/* Nama Variant */}
          <Input
            label="Nama Variant *"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Contoh: Premium, Standard, Deluxe"
            disabled={isSubmitting}
            error={errors.name || (nameExists ? "Nama variant sudah ada" : "")}
            inputSize="lg"
            clearable
            onClear={() => handleNameChange("")}
          />
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
          disabled={isSubmitting || nameExists}
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
