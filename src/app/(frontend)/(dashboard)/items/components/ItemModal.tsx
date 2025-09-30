// src/app/(frontend)/(dashboard)/items/components/ItemModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Save, AlertCircle, Plus, Minus, Info } from "lucide-react";
import { Tables } from "@/types/database";
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
      unit: "lembar",
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
    { value: "lembar", label: "lembar" },
    { value: "box", label: "box" },
    { value: "set", label: "set" },
    { value: "pack", label: "pack" },
    { value: "pcs", label: "pcs" },
    { value: "kg", label: "kg" },
    { value: "liter", label: "liter" },
    { value: "galon", label: "galon" },
    { value: "meter", label: "meter" },
    { value: "roll", label: "roll" },
    { value: "unit", label: "unit" },
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
        unit: "lembar",
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

  // Transform item masters to select options
  const masterOptions = itemMasters.map((master) => ({
    value: master.id,
    label: master.name,
  }));

  // Transform item variants to select options
  const variantOptions = itemVariants.map((variant) => ({
    value: variant.id,
    label: variant.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === "create" ? "Tambah Barang" : "Edit Barang"}
      size="xl"
      closable={!isSubmitting}
      closeOnOverlayClick={!isSubmitting}
    >
      <ModalContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Alert */}
          {errors.submit && (
            <div className="bg-error-container border-2 border-error/40 rounded-lg p-4 flex items-start space-x-3 animate-slide-down">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <span className="text-error-container-foreground text-sm font-medium">
                {errors.submit}
              </span>
            </div>
          )}

          {/* Top Section - Item Code and Category */}
          <div className="bg-surface-variant rounded-lg p-6 border-2 border-outline">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Informasi Dasar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Item Code with Auto Generate */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Kode Barang *
                </label>
                <div className="flex space-x-3">
                  <Input
                    value={formData.item_code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    placeholder="Masukkan kode barang"
                    disabled={isSubmitting}
                    error={
                      errors.item_code ||
                      (codeExists ? "Kode barang sudah ada" : "")
                    }
                    inputSize="lg"
                    className="flex-1"
                  />
                  {generateItemCode && (
                    <Button
                      type="button"
                      onClick={handleGenerateCode}
                      disabled={isSubmitting || isGeneratingCode}
                      variant="primary"
                      size="lg"
                      isLoading={isGeneratingCode}
                      className="px-4"
                    >
                      Auto
                    </Button>
                  )}
                </div>

                {/* Sequential codes preview */}
                {mode === "create" &&
                  itemGroups.length > 1 &&
                  formData.item_code && (
                    <div className="bg-info-container border-2 border-info/40 rounded-lg p-4 animate-slide-down">
                      <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-info-container-foreground mb-2">
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
                                  className="flex justify-between items-center bg-background px-3 py-2 rounded border-2 border-info/30"
                                >
                                  <span className="text-sm text-info-container-foreground">
                                    Item {index + 1}:
                                  </span>
                                  <Badge variant="info" size="md">
                                    {code}
                                  </Badge>
                                </div>
                              );
                            })}
                            {itemGroups.length > 3 && (
                              <div className="text-sm text-info-container-foreground text-center py-2">
                                ... dan {itemGroups.length - 3} lainnya
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>

              {/* Category with Add Button */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Kategori *
                </label>
                <div className="flex space-x-3">
                  <Select
                    options={masterOptions}
                    value={formData.item_master_id}
                    onValueChange={(value) =>
                      handleInputChange("item_master_id", value as string)
                    }
                    placeholder="Pilih kategori"
                    disabled={isSubmitting}
                    error={errors.item_master_id}
                    size="lg"
                    className="flex-1"
                  />
                  {onCreateMaster && (
                    <Button
                      type="button"
                      onClick={onCreateMaster}
                      disabled={isSubmitting}
                      variant="success"
                      size="lg"
                      leftIcon={<Plus className="w-4 h-4" />}
                      className="whitespace-nowrap"
                    >
                      <span className="hidden sm:inline">Kategori</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Item Groups Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Detail Barang ({itemGroups.length} item)
              </h3>
              {mode === "create" && (
                <Button
                  type="button"
                  onClick={addItemGroup}
                  disabled={isSubmitting}
                  variant="primary"
                  size="md"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Tambah Item
                </Button>
              )}
            </div>

            {itemGroups.map((group, index) => (
              <div
                key={index}
                className="border-2 border-outline rounded-lg bg-surface shadow-elevation-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Item Header */}
                <div className="bg-surface-variant px-6 py-4 rounded-t-lg border-b-2 border-outline flex items-center justify-between">
                  <h4 className="text-base font-semibold text-foreground">
                    Item {index + 1}
                  </h4>
                  {mode === "create" && itemGroups.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeItemGroup(index)}
                      disabled={isSubmitting}
                      variant="danger"
                      size="sm"
                      leftIcon={<Minus className="w-4 h-4" />}
                    >
                      Hapus
                    </Button>
                  )}
                </div>

                <div className="p-6 space-y-6">
                  {/* Item Name and Variant */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nama Barang *"
                      value={group.item_name}
                      onChange={(e) =>
                        handleItemGroupChange(
                          index,
                          "item_name",
                          e.target.value
                        )
                      }
                      placeholder="Masukkan nama barang"
                      disabled={isSubmitting}
                      error={errors[`group_${index}_item_name`]}
                      inputSize="lg"
                    />

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-foreground">
                        Variant
                      </label>
                      <div className="flex space-x-2">
                        <Select
                          options={variantOptions}
                          value={group.variant_id}
                          onValueChange={(value) =>
                            handleItemGroupChange(
                              index,
                              "variant_id",
                              value as string
                            )
                          }
                          placeholder="Pilih variant"
                          disabled={isSubmitting}
                          size="lg"
                          className="flex-1"
                        />
                        {onCreateVariant && (
                          <Button
                            type="button"
                            onClick={onCreateVariant}
                            disabled={isSubmitting}
                            variant="warning"
                            size="lg"
                            leftIcon={<Plus className="w-4 h-4" />}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Units */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Select
                      label="Unit Dasar *"
                      options={commonUnits}
                      value={group.unit}
                      onValueChange={(value) =>
                        handleItemGroupChange(index, "unit", value as string)
                      }
                      disabled={isSubmitting}
                      error={errors[`group_${index}_unit`]}
                      size="lg"
                    />

                    <Input
                      label="Unit Alternatif"
                      value={group.alt_unit}
                      onChange={(e) =>
                        handleItemGroupChange(index, "alt_unit", e.target.value)
                      }
                      placeholder="contoh: box, lusin"
                      disabled={isSubmitting}
                      inputSize="lg"
                    />

                    <div className="space-y-2">
                      <Input
                        label="Rasio Konversi"
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
                        placeholder="contoh: 12"
                        disabled={isSubmitting}
                        error={errors[`group_${index}_conversion_to_base`]}
                        inputSize="lg"
                      />
                      {group.alt_unit && group.conversion_to_base && (
                        <div className="bg-primary-container border-2 border-primary/40 px-3 py-2 rounded-lg animate-fade-in">
                          <p className="text-xs text-primary-container-foreground font-medium">
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
          disabled={isSubmitting || codeExists}
          isLoading={isSubmitting}
          leftIcon={!isSubmitting && <Save className="w-5 h-5" />}
          size="md"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
