// src/app/(frontend)/(dashboard)/items/components/ItemVariantModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { TablesInsert, TablesUpdate } from "@/types/database";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Enhanced backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal content */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 border border-gray-200/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === "create" ? "Tambah Variant" : "Edit Variant"}
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-800 text-sm font-medium">
                {errors.submit}
              </span>
            </div>
          )}

          {/* Nama Variant */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Nama Variant *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-900 font-medium placeholder-gray-500 ${
                errors.name || nameExists
                  ? "border-red-300 focus:ring-red-500 bg-red-50"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white"
              }`}
              placeholder="Contoh: Premium, Standard, Deluxe"
              disabled={isSubmitting}
            />
            {(errors.name || nameExists) && (
              <p className="mt-2 text-sm text-red-700 font-medium">
                {errors.name || (nameExists ? "Nama variant sudah ada" : "")}
              </p>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50/50 rounded-b-xl">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-gray-700 font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 transition-all"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || nameExists}
            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center space-x-2 transition-all shadow-lg"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSubmitting ? "Menyimpan..." : "Simpan"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
