// src/app/(frontend)/(dashboard)/items/components/ItemMasterModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle, ChevronDown } from "lucide-react";
import { Tables, TablesInsert, TablesUpdate } from "@/types/database";

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

  // Get office type badge color
  const getOfficeTypeBadgeColor = (type: string) => {
    switch (type) {
      case "distributor":
        return "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200";
      case "grb":
        return "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-200";
      case "pdc":
        return "bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-200";
      case "unset":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
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
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-modal w-full max-w-md mx-4 border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {mode === "create"
              ? "Tambah Kategori Barang"
              : "Edit Kategori Barang"}
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errors.submit && (
              <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg p-4 flex items-start space-x-3 animate-slide-down">
                <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
                <span className="text-danger-800 dark:text-danger-200 text-sm font-medium">
                  {errors.submit}
                </span>
              </div>
            )}

            {/* Nama Kategori */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                Jenis Mobil / Nama Barang *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={`
                  form-input w-full px-4 py-3 rounded-lg transition-all duration-200
                  text-gray-900 dark:text-gray-100 font-medium 
                  placeholder-gray-500 dark:placeholder-gray-400
                  bg-white dark:bg-gray-700
                  ${
                    errors.name || nameExists
                      ? "border-danger-300 dark:border-danger-600 focus:ring-danger-500 bg-danger-50 dark:bg-danger-900/20"
                      : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                  }
                `}
                placeholder="Masukkan nama mobil / Barang"
                disabled={isSubmitting}
              />
              {(errors.name || nameExists) && (
                <p className="text-sm text-danger-700 dark:text-danger-300 font-medium animate-slide-down">
                  {errors.name || (nameExists ? "Jenis mobil sudah ada" : "")}
                </p>
              )}
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                URL Gambar
              </label>
              <input
                type="url"
                value={formData.img_url}
                onChange={(e) => handleInputChange("img_url", e.target.value)}
                className="form-input w-full px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 font-medium placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                placeholder="https://example.com/image.jpg"
                disabled={isSubmitting}
              />
              {formData.img_url && (
                <div className="flex justify-center animate-fade-in">
                  <img
                    src={formData.img_url}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600 shadow-card"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Tipe Kategori */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                Tipe Kategori *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="form-select w-full px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 font-medium bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                disabled={isSubmitting}
              >
                <option
                  value="regular"
                  className="text-gray-900 dark:text-gray-100"
                >
                  Regular (KF)
                </option>
                <option
                  value="inventory"
                  className="text-gray-900 dark:text-gray-100"
                >
                  Inventory
                </option>
              </select>
            </div>

            {/* Office Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                Office *
              </label>
              <div className="relative">
                <select
                  value={formData.office_id}
                  onChange={(e) =>
                    handleInputChange("office_id", e.target.value)
                  }
                  className={`
                    form-select w-full px-4 py-3 rounded-lg appearance-none transition-all duration-200
                    text-gray-900 dark:text-gray-100 font-medium 
                    bg-white dark:bg-gray-700
                    ${
                      errors.office_id
                        ? "border-danger-300 dark:border-danger-600 focus:ring-danger-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                    }
                  `}
                  disabled={isSubmitting || officesLoading}
                >
                  <option value="" className="text-gray-500 dark:text-gray-400">
                    {officesLoading ? "Memuat office..." : "Pilih Office"}
                  </option>
                  {offices.map((office) => (
                    <option
                      key={office.id}
                      value={office.id}
                      className="text-gray-900 dark:text-gray-100"
                    >
                      {office.name} - {office.location} (
                      {office.type.toUpperCase()})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
              </div>

              {/* Show selected office details */}
              {formData.office_id && !officesLoading && (
                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 animate-slide-down">
                  {(() => {
                    const selectedOffice = offices.find(
                      (office) => office.id === formData.office_id
                    );
                    return selectedOffice ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
                            {selectedOffice.name}
                          </p>
                          <p className="text-xs text-primary-700 dark:text-primary-300">
                            {selectedOffice.location}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getOfficeTypeBadgeColor(
                            selectedOffice.type
                          )}`}
                        >
                          {selectedOffice.type.toUpperCase()}
                        </span>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {errors.office_id && (
                <p className="text-sm text-danger-700 dark:text-danger-300 font-medium animate-slide-down">
                  {errors.office_id}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 rounded-b-xl">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-gray-700 dark:text-gray-200 font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 transition-all duration-200"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || nameExists || officesLoading}
            className="px-5 py-2.5 bg-primary-600 dark:bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-card-hover"
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
