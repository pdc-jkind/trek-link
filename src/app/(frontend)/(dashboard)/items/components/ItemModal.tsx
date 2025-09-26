// src/app/(frontend)/(dashboard)/items/components/ItemModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle, Plus, Minus, Info } from "lucide-react";
import { Tables } from "@/types/database";

type ItemMaster = Tables<"item_masters">;
type ItemVariant = Tables<"item_variants">;

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
  generateSequentialCodes?: (
    baseCode: string,
    count: number
  ) => Promise<string[]>;
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
      unit: "",
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
    "pack",
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
        setItemGroups([
          {
            item_name: item.item_name,
            variant_id: item.variant_id || "",
            unit: item.unit || "lembar",
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
            unit: "lembar",
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
        const payload = {
          baseItemCode: formData.item_code,
          item_master_id: formData.item_master_id,
          items: itemGroups.map((group) => ({
            item_name: group.item_name,
            unit: group.unit,
            alt_unit: group.alt_unit || null,
            conversion_to_base: group.conversion_to_base
              ? Number(group.conversion_to_base)
              : null,
            variant_id: group.variant_id || null,
          })),
        };

        const result = await onSave(payload);
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
        className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-xs animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-modal w-full max-w-5xl mx-4 max-h-[95vh] border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10 rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {mode === "create" ? "Tambah Barang" : "Edit Barang"}
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 max-h-[calc(95vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {errors.submit && (
              <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg p-4 flex items-start space-x-3 animate-slide-down">
                <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
                <span className="text-danger-800 dark:text-danger-200 text-sm font-medium">
                  {errors.submit}
                </span>
              </div>
            )}

            {/* Top Section - Item Code and Category */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Informasi Dasar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Item Code */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Kode Barang *
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={formData.item_code}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      className={`
                        form-input flex-1 px-4 py-3 rounded-lg transition-all duration-200
                        text-gray-900 dark:text-gray-100 font-medium 
                        placeholder-gray-500 dark:placeholder-gray-400
                        bg-white dark:bg-gray-700
                        ${
                          errors.item_code || codeExists
                            ? "border-danger-300 dark:border-danger-600 focus:ring-danger-500 bg-danger-50 dark:bg-danger-900/20"
                            : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                        }
                      `}
                      placeholder="Masukkan kode barang"
                      disabled={isSubmitting}
                    />
                    {generateItemCode && (
                      <button
                        type="button"
                        onClick={handleGenerateCode}
                        disabled={isSubmitting || isGeneratingCode}
                        className="px-4 py-3 bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-800 dark:text-primary-200 font-medium border border-primary-300 dark:border-primary-600 rounded-lg hover:from-primary-200 hover:to-primary-300 dark:hover:from-primary-800/50 dark:hover:to-primary-700/50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition-all duration-200 shadow-card hover:shadow-card-hover"
                        title="Generate Code"
                      >
                        {isGeneratingCode ? (
                          <div className="w-4 h-4 border-2 border-primary-600 dark:border-primary-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className="text-sm font-semibold">Auto</span>
                        )}
                      </button>
                    )}
                  </div>
                  {(errors.item_code || codeExists) && (
                    <p className="text-sm text-danger-700 dark:text-danger-300 font-medium animate-slide-down">
                      {errors.item_code ||
                        (codeExists ? "Kode barang sudah ada" : "")}
                    </p>
                  )}

                  {/* Enhanced Info about sequential codes */}
                  {mode === "create" &&
                    itemGroups.length > 1 &&
                    formData.item_code && (
                      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 animate-slide-down">
                        <div className="flex items-start space-x-3">
                          <Info className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-primary-800 dark:text-primary-200 mb-2">
                              Kode berurutan akan di-generate otomatis:
                            </p>
                            <div className="space-y-2">
                              {itemGroups.slice(0, 3).map((_, index) => {
                                const parts = formData.item_code.split("-");
                                const prefix = parts.slice(0, -1).join("-");
                                const startNumber =
                                  parseInt(parts[parts.length - 1]) || 1;
                                const number = startNumber + index;
                                const paddedNumber = number
                                  .toString()
                                  .padStart(3, "0");
                                const code = `${prefix}-${paddedNumber}`;
                                return (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center bg-white dark:bg-gray-800 px-3 py-2 rounded border border-primary-200 dark:border-primary-800"
                                  >
                                    <span className="text-sm text-primary-700 dark:text-primary-300">
                                      Item {index + 1}:
                                    </span>
                                    <span className="font-mono text-sm font-semibold text-primary-900 dark:text-primary-100 bg-primary-100 dark:bg-primary-900/40 px-2 py-1 rounded">
                                      {code}
                                    </span>
                                  </div>
                                );
                              })}
                              {itemGroups.length > 3 && (
                                <div className="text-sm text-primary-600 dark:text-primary-400 text-center py-2">
                                  ... dan {itemGroups.length - 3} lainnya
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Kategori *
                  </label>
                  <div className="flex space-x-3">
                    <select
                      value={formData.item_master_id}
                      onChange={(e) =>
                        handleInputChange("item_master_id", e.target.value)
                      }
                      className={`
                        form-select flex-1 px-4 py-3 rounded-lg transition-all duration-200
                        text-gray-900 dark:text-gray-100 font-medium 
                        bg-white dark:bg-gray-700
                        ${
                          errors.item_master_id
                            ? "border-danger-300 dark:border-danger-600 focus:ring-danger-500 bg-danger-50 dark:bg-danger-900/20"
                            : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                        }
                      `}
                      disabled={isSubmitting}
                    >
                      <option
                        value=""
                        className="text-gray-500 dark:text-gray-400"
                      >
                        Pilih kategori
                      </option>
                      {itemMasters.map((master) => (
                        <option
                          key={master.id}
                          value={master.id}
                          className="text-gray-900 dark:text-gray-100"
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
                        className="px-4 py-3 bg-gradient-to-r from-success-100 to-success-200 dark:from-success-900/30 dark:to-success-800/30 text-success-800 dark:text-success-200 font-medium border border-success-300 dark:border-success-600 rounded-lg hover:from-success-200 hover:to-success-300 dark:hover:from-success-800/50 dark:hover:to-success-700/50 focus:outline-none focus:ring-2 focus:ring-success-500 disabled:opacity-50 flex items-center space-x-2 transition-all duration-200 shadow-card hover:shadow-card-hover"
                        title="Tambah Kategori Baru"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Kategori</span>
                      </button>
                    )}
                  </div>
                  {errors.item_master_id && (
                    <p className="text-sm text-danger-700 dark:text-danger-300 font-medium animate-slide-down">
                      {errors.item_master_id}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Item Groups Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Detail Barang ({itemGroups.length} item)
                </h3>
                {mode === "create" && (
                  <button
                    type="button"
                    onClick={addItemGroup}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 flex items-center space-x-2 transition-all duration-200 shadow-card hover:shadow-card-hover"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Item</span>
                  </button>
                )}
              </div>

              {itemGroups.map((group, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-card animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 px-6 py-4 rounded-t-lg border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                      Item {index + 1}
                    </h4>
                    {mode === "create" && itemGroups.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItemGroup(index)}
                        disabled={isSubmitting}
                        className="text-danger-600 dark:text-danger-400 hover:text-danger-800 dark:hover:text-danger-200 p-2 rounded-lg hover:bg-danger-100 dark:hover:bg-danger-900/20 transition-all duration-200"
                        title="Hapus Item"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Item Name and Variant */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                          className={`
                            form-input w-full px-4 py-3 rounded-lg transition-all duration-200
                            text-gray-900 dark:text-gray-100 
                            placeholder-gray-500 dark:placeholder-gray-400
                            bg-white dark:bg-gray-700
                            ${
                              errors[`group_${index}_item_name`]
                                ? "border-danger-300 dark:border-danger-600 focus:ring-danger-500 bg-danger-50 dark:bg-danger-900/20"
                                : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                            }
                          `}
                          placeholder="Masukkan nama barang"
                          disabled={isSubmitting}
                        />
                        {errors[`group_${index}_item_name`] && (
                          <p className="text-xs text-danger-700 dark:text-danger-300 animate-slide-down">
                            {errors[`group_${index}_item_name`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                            className="form-select flex-1 px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 transition-all duration-200"
                            disabled={isSubmitting}
                          >
                            <option
                              value=""
                              className="text-gray-500 dark:text-gray-400"
                            >
                              Pilih variant
                            </option>
                            {itemVariants.map((variant) => (
                              <option
                                key={variant.id}
                                value={variant.id}
                                className="text-gray-900 dark:text-gray-100"
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
                              className="px-4 py-3 bg-gradient-to-r from-warning-100 to-warning-200 dark:from-warning-900/30 dark:to-warning-800/30 text-warning-800 dark:text-warning-200 font-medium border border-warning-300 dark:border-warning-600 rounded-lg hover:from-warning-200 hover:to-warning-300 dark:hover:from-warning-800/50 dark:hover:to-warning-700/50 focus:outline-none focus:ring-2 focus:ring-warning-500 disabled:opacity-50 flex items-center transition-all duration-200 shadow-card hover:shadow-card-hover"
                              title="Tambah Variant Baru"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Units */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Unit Dasar *
                        </label>
                        <select
                          value={group.unit}
                          onChange={(e) =>
                            handleItemGroupChange(index, "unit", e.target.value)
                          }
                          className={`
                            form-select w-full px-4 py-3 rounded-lg transition-all duration-200
                            text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700
                            ${
                              errors[`group_${index}_unit`]
                                ? "border-danger-300 dark:border-danger-600 focus:ring-danger-500 bg-danger-50 dark:bg-danger-900/20"
                                : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                            }
                          `}
                          disabled={isSubmitting}
                        >
                          {commonUnits.map((unit) => (
                            <option
                              key={unit}
                              value={unit}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {unit}
                            </option>
                          ))}
                        </select>
                        {errors[`group_${index}_unit`] && (
                          <p className="text-xs text-danger-700 dark:text-danger-300 animate-slide-down">
                            {errors[`group_${index}_unit`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Unit Alternatif
                        </label>
                        <input
                          type="text"
                          value={group.alt_unit}
                          onChange={(e) =>
                            handleItemGroupChange(
                              index,
                              "alt_unit",
                              e.target.value
                            )
                          }
                          className="form-input w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 transition-all duration-200"
                          placeholder="contoh: box, lusin"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                          className={`
                            form-input w-full px-4 py-3 rounded-lg transition-all duration-200
                            text-gray-900 dark:text-gray-100 
                            placeholder-gray-500 dark:placeholder-gray-400
                            bg-white dark:bg-gray-700
                            ${
                              errors[`group_${index}_conversion_to_base`]
                                ? "border-danger-300 dark:border-danger-600 focus:ring-danger-500 bg-danger-50 dark:bg-danger-900/20"
                                : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                            }
                          `}
                          placeholder="contoh: 12"
                          disabled={isSubmitting}
                        />
                        {errors[`group_${index}_conversion_to_base`] && (
                          <p className="text-xs text-danger-700 dark:text-danger-300 animate-slide-down">
                            {errors[`group_${index}_conversion_to_base`]}
                          </p>
                        )}
                        {group.alt_unit && group.conversion_to_base && (
                          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 px-3 py-2 rounded-lg animate-fade-in">
                            <p className="text-xs text-primary-800 dark:text-primary-200 font-medium">
                              1 {group.alt_unit} = {group.conversion_to_base}{" "}
                              {group.unit}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 rounded-b-xl">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-6 py-3 text-gray-700 dark:text-gray-200 font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 transition-all duration-200 shadow-card hover:shadow-card-hover"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || codeExists}
            className="px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-card-hover"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{isSubmitting ? "Menyimpan..." : "Simpan"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
