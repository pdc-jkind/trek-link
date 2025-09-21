// src/app/(frontend)/(dashboard)/items/components/ItemModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle, Plus, Minus } from "lucide-react";
import { Tables, TablesInsert, TablesUpdate } from "@/types/database";

type ItemMaster = Tables<"item_masters">;
type ItemVariant = Tables<"item_variants">;
type Office = Tables<"offices">;

interface ItemGroup {
  item_name: string;
  variant_id: string;
  unit: string;
  alt_unit: string;
  conversion_to_base: string;
}

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<{ success: boolean; error?: string }>;
  onCreateMaster?: () => void;
  onCreateVariant?: () => void;
  item?: any | null;
  itemMasters: ItemMaster[];
  itemVariants: ItemVariant[];
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
  onCreateVariant,
  item,
  itemMasters,
  itemVariants,
  mode,
  checkItemCodeExists,
  generateItemCode,
}) => {
  const [formData, setFormData] = useState({
    item_code: "",
    item_master_id: "",
  });

  const [itemGroups, setItemGroups] = useState<ItemGroup[]>([
    {
      item_name: "",
      variant_id: "",
      unit: "pcs",
      alt_unit: "",
      conversion_to_base: "",
    },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [codeExists, setCodeExists] = useState(false);

  // Common units for dropdown
  const commonUnits = [
    "lembar",
    "box",
    "set",
    "pcs",
    "kg",
    "liter",
    "galon",
    "meter",
    "roll",
    "unit",
  ];

  // Reset form when modal opens/closes or item changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && item) {
        setFormData({
          item_code: item.item_code,
          item_master_id: item.item_master_id || "",
        });
        // For edit mode, we'll show the single item as one group
        setItemGroups([
          {
            item_name: item.item_name,
            variant_id: item.variant_id || "",
            unit: item.unit || "pcs",
            alt_unit: item.alt_unit || "",
            conversion_to_base: item.conversion_to_base?.toString() || "",
          },
        ]);
      } else {
        setFormData({
          item_code: "",
          item_master_id: "",
        });
        setItemGroups([
          {
            item_name: "",
            variant_id: "",
            unit: "pcs",
            alt_unit: "",
            conversion_to_base: "",
          },
        ]);
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

  // Handle item group changes
  const handleItemGroupChange = (
    index: number,
    field: keyof ItemGroup,
    value: string
  ) => {
    const newGroups = [...itemGroups];
    newGroups[index] = { ...newGroups[index], [field]: value };
    setItemGroups(newGroups);

    // Clear errors for this field
    const errorKey = `group_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  // Add new item group
  const addItemGroup = () => {
    setItemGroups([
      ...itemGroups,
      {
        item_name: "",
        variant_id: "",
        unit: "pcs",
        alt_unit: "",
        conversion_to_base: "",
      },
    ]);
  };

  // Remove item group
  const removeItemGroup = (index: number) => {
    if (itemGroups.length > 1) {
      const newGroups = itemGroups.filter((_, i) => i !== index);
      setItemGroups(newGroups);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate main form
    if (!formData.item_code.trim()) {
      newErrors.item_code = "Kode barang harus diisi";
    } else if (codeExists) {
      newErrors.item_code = "Kode barang sudah ada";
    }

    if (!formData.item_master_id) {
      newErrors.item_master_id = "Kategori harus dipilih";
    }

    // Validate item groups
    itemGroups.forEach((group, index) => {
      if (!group.item_name.trim()) {
        newErrors[`group_${index}_item_name`] = "Nama barang harus diisi";
      }

      if (!group.unit.trim()) {
        newErrors[`group_${index}_unit`] = "Unit harus diisi";
      }

      // Validate conversion ratio if alt_unit is provided
      if (group.alt_unit && !group.conversion_to_base) {
        newErrors[`group_${index}_conversion_to_base`] =
          "Rasio konversi harus diisi jika ada unit alternatif";
      }

      if (group.conversion_to_base && isNaN(Number(group.conversion_to_base))) {
        newErrors[`group_${index}_conversion_to_base`] =
          "Rasio konversi harus berupa angka";
      }

      if (group.conversion_to_base && Number(group.conversion_to_base) <= 0) {
        newErrors[`group_${index}_conversion_to_base`] =
          "Rasio konversi harus lebih dari 0";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // For edit mode, we only update a single item
      if (mode === "edit" && item) {
        const group = itemGroups[0];
        const payload = {
          id: item.id,
          item_code: formData.item_code,
          item_name: group.item_name,
          unit: group.unit,
          alt_unit: group.alt_unit || null,
          conversion_to_base: group.conversion_to_base
            ? Number(group.conversion_to_base)
            : null,
          item_master_id: formData.item_master_id || null,
          variant_id: group.variant_id || null,
        };

        const result = await onSave(payload);
        if (result.success) {
          onClose();
        } else {
          setErrors({ submit: result.error || "Terjadi kesalahan" });
        }
      } else {
        // For create mode, we create multiple items if there are multiple groups
        const items = itemGroups.map((group) => ({
          item_code: formData.item_code,
          item_name: group.item_name,
          unit: group.unit,
          alt_unit: group.alt_unit || null,
          conversion_to_base: group.conversion_to_base
            ? Number(group.conversion_to_base)
            : null,
          item_master_id: formData.item_master_id || null,
          variant_id: group.variant_id || null,
        }));

        const result = await onSave({ items });
        if (result.success) {
          onClose();
        } else {
          setErrors({ submit: result.error || "Terjadi kesalahan" });
        }
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
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto border border-gray-200/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10 rounded-t-xl">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === "create" ? "Tambah Barang" : "Edit Barang"}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-800 text-sm font-medium">
                {errors.submit}
              </span>
            </div>
          )}

          {/* Top Section - Item Code and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Item Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Kode Barang *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.item_code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-900 font-medium placeholder-gray-500 ${
                    errors.item_code || codeExists
                      ? "border-red-300 focus:ring-red-500 bg-red-50"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  }`}
                  placeholder="Masukkan kode barang"
                  disabled={isSubmitting}
                />
                {generateItemCode && (
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    disabled={isSubmitting || isGeneratingCode}
                    className="px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 font-medium border border-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all shadow-sm"
                    title="Generate Code"
                  >
                    {isGeneratingCode ? (
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="text-sm">Auto</span>
                    )}
                  </button>
                )}
              </div>
              {(errors.item_code || codeExists) && (
                <p className="mt-2 text-sm text-red-700 font-medium">
                  {errors.item_code ||
                    (codeExists ? "Kode barang sudah ada" : "")}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Kategori *
              </label>
              <div className="flex space-x-2">
                <select
                  value={formData.item_master_id}
                  onChange={(e) =>
                    handleInputChange("item_master_id", e.target.value)
                  }
                  className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-900 font-medium bg-white ${
                    errors.item_master_id
                      ? "border-red-300 focus:ring-red-500 bg-red-50"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="" className="text-gray-500">
                    Pilih kategori
                  </option>
                  {itemMasters.map((master) => (
                    <option
                      key={master.id}
                      value={master.id}
                      className="text-gray-900"
                    >
                      {master.name}
                    </option>
                  ))}
                </select>
                {onCreateMaster && (
                  <button
                    type="button"
                    onClick={onCreateMaster}
                    disabled={isSubmitting}
                    className="px-4 py-3 bg-gradient-to-r from-green-100 to-green-200 text-green-800 font-medium border border-green-300 rounded-lg hover:from-green-200 hover:to-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 flex items-center space-x-2 transition-all shadow-sm"
                    title="Tambah Kategori Baru"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Kategori</span>
                  </button>
                )}
              </div>
              {errors.item_master_id && (
                <p className="mt-2 text-sm text-red-700 font-medium">
                  {errors.item_master_id}
                </p>
              )}
            </div>
          </div>

          {/* Item Groups Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-semibold text-gray-900">
                Detail Barang
              </h3>
              {mode === "create" && (
                <button
                  type="button"
                  onClick={addItemGroup}
                  disabled={isSubmitting}
                  className="px-3 py-2 bg-blue-100 text-blue-800 font-medium border border-blue-300 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center space-x-2 transition-all text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Item</span>
                </button>
              )}
            </div>

            {itemGroups.map((group, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700">
                    Item {index + 1}
                  </h4>
                  {mode === "create" && itemGroups.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItemGroup(index)}
                      disabled={isSubmitting}
                      className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                      title="Hapus Item"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Item Name and Variant */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Barang *
                    </label>
                    <input
                      type="text"
                      value={group.item_name}
                      onChange={(e) =>
                        handleItemGroupChange(
                          index,
                          "item_name",
                          e.target.value
                        )
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-900 placeholder-gray-500 ${
                        errors[`group_${index}_item_name`]
                          ? "border-red-300 focus:ring-red-500 bg-red-50"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      }`}
                      placeholder="Masukkan nama barang"
                      disabled={isSubmitting}
                    />
                    {errors[`group_${index}_item_name`] && (
                      <p className="mt-1 text-xs text-red-700">
                        {errors[`group_${index}_item_name`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Variant
                    </label>
                    <div className="flex space-x-2">
                      <select
                        value={group.variant_id}
                        onChange={(e) =>
                          handleItemGroupChange(
                            index,
                            "variant_id",
                            e.target.value
                          )
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        disabled={isSubmitting}
                      >
                        <option value="" className="text-gray-500">
                          Pilih variant
                        </option>
                        {itemVariants.map((variant) => (
                          <option
                            key={variant.id}
                            value={variant.id}
                            className="text-gray-900"
                          >
                            {variant.name}
                          </option>
                        ))}
                      </select>
                      {onCreateVariant && (
                        <button
                          type="button"
                          onClick={onCreateVariant}
                          disabled={isSubmitting}
                          className="px-3 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 font-medium border border-purple-300 rounded-lg hover:from-purple-200 hover:to-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 flex items-center transition-all shadow-sm"
                          title="Tambah Variant Baru"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Units */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit Dasar *
                    </label>
                    <select
                      value={group.unit}
                      onChange={(e) =>
                        handleItemGroupChange(index, "unit", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-900 bg-white ${
                        errors[`group_${index}_unit`]
                          ? "border-red-300 focus:ring-red-500 bg-red-50"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                      disabled={isSubmitting}
                    >
                      {commonUnits.map((unit) => (
                        <option
                          key={unit}
                          value={unit}
                          className="text-gray-900"
                        >
                          {unit}
                        </option>
                      ))}
                    </select>
                    {errors[`group_${index}_unit`] && (
                      <p className="mt-1 text-xs text-red-700">
                        {errors[`group_${index}_unit`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit Alternatif
                    </label>
                    <input
                      type="text"
                      value={group.alt_unit}
                      onChange={(e) =>
                        handleItemGroupChange(index, "alt_unit", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white transition-all"
                      placeholder="contoh: box, lusin"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rasio Konversi
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={group.conversion_to_base}
                      onChange={(e) =>
                        handleItemGroupChange(
                          index,
                          "conversion_to_base",
                          e.target.value
                        )
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-900 placeholder-gray-500 bg-white ${
                        errors[`group_${index}_conversion_to_base`]
                          ? "border-red-300 focus:ring-red-500 bg-red-50"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                      placeholder="contoh: 12"
                      disabled={isSubmitting}
                    />
                    {errors[`group_${index}_conversion_to_base`] && (
                      <p className="mt-1 text-xs text-red-700">
                        {errors[`group_${index}_conversion_to_base`]}
                      </p>
                    )}
                    {group.alt_unit && group.conversion_to_base && (
                      <p className="mt-1 text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded">
                        1 {group.alt_unit} = {group.conversion_to_base}{" "}
                        {group.unit}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
            disabled={isSubmitting || codeExists}
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
