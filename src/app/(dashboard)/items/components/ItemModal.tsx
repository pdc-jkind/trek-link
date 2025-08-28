// src\app\(dashboard)\items\components\ItemModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle, Plus } from "lucide-react";
import {
  Item,
  ItemMaster,
  CreateItemPayload,
  UpdateItemPayload,
} from "../items.type";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: CreateItemPayload | UpdateItemPayload
  ) => Promise<{ success: boolean; error?: string }>;
  onCreateMaster?: () => void;
  item?: Item | null;
  itemMasters: ItemMaster[];
  mode: "create" | "edit";
  checkItemCodeExists?: (
    itemCode: string,
    excludeId?: string
  ) => Promise<boolean>;
  generateItemCode?: (prefix?: string) => Promise<string>;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onCreateMaster,
  item,
  itemMasters,
  mode,
  checkItemCodeExists,
  generateItemCode,
}) => {
  const [formData, setFormData] = useState({
    item_code: "",
    item_name: "",
    unit: "pcs",
    alt_unit: "",
    conversion_to_base: "",
    item_master_id: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [codeExists, setCodeExists] = useState(false);

  // Common units for dropdown
  const commonUnits = [
    "pcs",
    "kg",
    "gram",
    "liter",
    "meter",
    "cm",
    "mm",
    "box",
    "pack",
    "roll",
    "sheet",
    "bottle",
    "unit",
  ];

  // Reset form when modal opens/closes or item changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && item) {
        setFormData({
          item_code: item.item_code,
          item_name: item.item_name,
          unit: item.unit || "pcs",
          alt_unit: item.alt_unit || "",
          conversion_to_base: item.conversion_to_base?.toString() || "",
          item_master_id: item.item_master_id || "",
        });
      } else {
        setFormData({
          item_code: "",
          item_name: "",
          unit: "pcs",
          alt_unit: "",
          conversion_to_base: "",
          item_master_id: "",
        });
      }
      setErrors({});
      setCodeExists(false);
    }
  }, [isOpen, item, mode]);

  // Generate item code
  const handleGenerateCode = async () => {
    if (!generateItemCode) return;

    setIsGeneratingCode(true);
    try {
      const selectedMaster = itemMasters.find(
        (m) => m.id === formData.item_master_id
      );
      const prefix = selectedMaster?.name?.substring(0, 3).toUpperCase();
      const newCode = await generateItemCode(prefix);
      setFormData((prev) => ({ ...prev, item_code: newCode }));
      setCodeExists(false);
      setErrors((prev) => ({ ...prev, item_code: "" }));
    } catch (error) {
      console.error("Failed to generate code:", error);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  // Check code uniqueness
  const handleCodeChange = async (value: string) => {
    setFormData((prev) => ({ ...prev, item_code: value }));
    setErrors((prev) => ({ ...prev, item_code: "" }));

    if (value && checkItemCodeExists) {
      const exists = await checkItemCodeExists(
        value,
        mode === "edit" && item ? item.id : undefined
      );
      setCodeExists(exists);
    } else {
      setCodeExists(false);
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

    if (!formData.item_code.trim()) {
      newErrors.item_code = "Kode barang harus diisi";
    } else if (codeExists) {
      newErrors.item_code = "Kode barang sudah ada";
    }

    if (!formData.item_name.trim()) {
      newErrors.item_name = "Nama barang harus diisi";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Unit harus diisi";
    }

    // Validate conversion ratio if alt_unit is provided
    if (formData.alt_unit && !formData.conversion_to_base) {
      newErrors.conversion_to_base =
        "Rasio konversi harus diisi jika ada unit alternatif";
    }

    if (
      formData.conversion_to_base &&
      isNaN(Number(formData.conversion_to_base))
    ) {
      newErrors.conversion_to_base = "Rasio konversi harus berupa angka";
    }

    if (
      formData.conversion_to_base &&
      Number(formData.conversion_to_base) <= 0
    ) {
      newErrors.conversion_to_base = "Rasio konversi harus lebih dari 0";
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
        item_code: formData.item_code,
        item_name: formData.item_name,
        unit: formData.unit,
        alt_unit: formData.alt_unit || null,
        conversion_to_base: formData.conversion_to_base
          ? Number(formData.conversion_to_base)
          : null,
        item_master_id: formData.item_master_id || null,
      };

      const finalPayload =
        mode === "edit" && item ? { id: item.id, ...payload } : payload;

      const result = await onSave(finalPayload);

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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">
            {mode === "create" ? "Tambah Barang" : "Edit Barang"}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Item Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kode Barang *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.item_code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.item_code || codeExists
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Masukkan kode barang"
                  disabled={isSubmitting}
                />
                {generateItemCode && (
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    disabled={isSubmitting || isGeneratingCode}
                    className="px-3 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    title="Generate Code"
                  >
                    {isGeneratingCode ? (
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Auto"
                    )}
                  </button>
                )}
              </div>
              {(errors.item_code || codeExists) && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.item_code ||
                    (codeExists ? "Kode barang sudah ada" : "")}
                </p>
              )}
            </div>

            {/* Item Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Barang *
              </label>
              <input
                type="text"
                value={formData.item_name}
                onChange={(e) => handleInputChange("item_name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.item_name
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Masukkan nama barang"
                disabled={isSubmitting}
              />
              {errors.item_name && (
                <p className="mt-1 text-sm text-red-600">{errors.item_name}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <div className="flex space-x-2">
              <select
                value={formData.item_master_id}
                onChange={(e) =>
                  handleInputChange("item_master_id", e.target.value)
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                <option value="">Pilih kategori (opsional)</option>
                {itemMasters.map((master) => (
                  <option key={master.id} value={master.id}>
                    {master.name} ({master.type})
                  </option>
                ))}
              </select>
              {onCreateMaster && (
                <button
                  type="button"
                  onClick={onCreateMaster}
                  disabled={isSubmitting}
                  className="px-3 py-2 bg-green-100 text-green-700 border border-green-300 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 flex items-center space-x-1"
                  title="Tambah Kategori Baru"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Kategori</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Base Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Dasar *
              </label>
              <select
                value={formData.unit}
                onChange={(e) => handleInputChange("unit", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.unit
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                disabled={isSubmitting}
              >
                {commonUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              {errors.unit && (
                <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
              )}
            </div>

            {/* Alternative Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Alternatif
              </label>
              <input
                type="text"
                value={formData.alt_unit}
                onChange={(e) => handleInputChange("alt_unit", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="contoh: box, lusin"
                disabled={isSubmitting}
              />
            </div>

            {/* Conversion Ratio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rasio Konversi
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.conversion_to_base}
                onChange={(e) =>
                  handleInputChange("conversion_to_base", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.conversion_to_base
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder="contoh: 12"
                disabled={isSubmitting}
              />
              {errors.conversion_to_base && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.conversion_to_base}
                </p>
              )}
              {formData.alt_unit && formData.conversion_to_base && (
                <p className="mt-1 text-xs text-gray-500">
                  1 {formData.alt_unit} = {formData.conversion_to_base}{" "}
                  {formData.unit}
                </p>
              )}
            </div>
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
            disabled={isSubmitting || codeExists}
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
