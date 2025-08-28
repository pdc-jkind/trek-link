// src\app\(dashboard)\items\components\ItemMasterModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import {
  ItemMaster,
  CreateItemMasterPayload,
  UpdateItemMasterPayload,
} from "../items.type";

interface ItemMasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: CreateItemMasterPayload | UpdateItemMasterPayload
  ) => Promise<{ success: boolean; error?: string }>;
  itemMaster?: ItemMaster | null;
  mode: "create" | "edit";
  checkNameExists?: (name: string, excludeId?: string) => Promise<boolean>;
}

export const ItemMasterModal: React.FC<ItemMasterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemMaster,
  mode,
  checkNameExists,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "regular" as "regular" | "inventory",
    office_id: "",
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
          type: itemMaster.type,
          office_id: itemMaster.office_id || "",
        });
      } else {
        setFormData({
          name: "",
          type: "regular",
          office_id: "",
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
      newErrors.name = "Nama kategori harus diisi";
    } else if (nameExists) {
      newErrors.name = "Nama kategori sudah ada";
    }

    if (!formData.office_id.trim()) {
      newErrors.office_id = "Office ID harus diisi";
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
        mode === "edit" && itemMaster
          ? { id: itemMaster.id, ...formData }
          : formData;

      const result = await onSave(payload);

      if (result.success) {
        onClose();
      } else {
        setErrors({ submit: result.error || "Terjadi kesalahan" });
      }
    } catch (error) {
      setErrors({ submit: "Terjadi kesalahan tidak terduga" });
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">
            {mode === "create"
              ? "Tambah Kategori Barang"
              : "Edit Kategori Barang"}
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 text-sm">{errors.submit}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Kategori *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name || nameExists
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Masukkan nama kategori"
              disabled={isSubmitting}
            />
            {(errors.name || nameExists) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name || (nameExists ? "Nama kategori sudah ada" : "")}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipe Kategori *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              <option value="regular">Regular</option>
              <option value="inventory">Inventory</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Office ID *
            </label>
            <input
              type="text"
              value={formData.office_id}
              onChange={(e) => handleInputChange("office_id", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.office_id
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Masukkan Office ID"
              disabled={isSubmitting}
            />
            {errors.office_id && (
              <p className="mt-1 text-sm text-red-600">{errors.office_id}</p>
            )}
          </div>
        </form>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || nameExists}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center space-x-2"
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
