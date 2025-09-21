// src\app\(dashboard)\items\components\ItemMasterModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle, ChevronDown } from "lucide-react";
import {
  ItemMaster,
  CreateItemMasterPayload,
  UpdateItemMasterPayload,
} from "../items.type";
import { Office } from "../../offices/office.type";

interface ItemMasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: CreateItemMasterPayload | UpdateItemMasterPayload
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
      setErrors({ submit: `Terjadi kesalahan tidak terduga error: ${error}` });
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
        return "bg-blue-100 text-blue-800";
      case "grb":
        return "bg-green-100 text-green-800";
      case "pdc":
        return "bg-purple-100 text-purple-800";
      case "unset":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
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
            {mode === "create"
              ? "Tambah Kategori Barang"
              : "Edit Kategori Barang"}
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

          {/* Nama Kategori */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Nama Kategori *
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
              placeholder="Masukkan nama kategori"
              disabled={isSubmitting}
            />
            {(errors.name || nameExists) && (
              <p className="mt-2 text-sm text-red-700 font-medium">
                {errors.name || (nameExists ? "Nama kategori sudah ada" : "")}
              </p>
            )}
          </div>

          {/* Tipe Kategori */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tipe Kategori *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white"
              disabled={isSubmitting}
            >
              <option value="regular" className="text-gray-900">
                Regular
              </option>
              <option value="inventory" className="text-gray-900">
                Inventory
              </option>
            </select>
          </div>

          {/* Office Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Office *
            </label>
            <div className="relative">
              <select
                value={formData.office_id}
                onChange={(e) => handleInputChange("office_id", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-900 font-medium bg-white appearance-none ${
                  errors.office_id
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                disabled={isSubmitting || officesLoading}
              >
                <option value="" className="text-gray-500">
                  {officesLoading ? "Memuat office..." : "Pilih Office"}
                </option>
                {offices.map((office) => (
                  <option
                    key={office.id}
                    value={office.id}
                    className="text-gray-900"
                  >
                    {office.name} - {office.location} (
                    {office.type.toUpperCase()})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Show selected office details */}
            {formData.office_id && !officesLoading && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                {(() => {
                  const selectedOffice = offices.find(
                    (office) => office.id === formData.office_id
                  );
                  return selectedOffice ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          {selectedOffice.name}
                        </p>
                        <p className="text-xs text-blue-700">
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
              <p className="mt-2 text-sm text-red-700 font-medium">
                {errors.office_id}
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
            disabled={isSubmitting || nameExists || officesLoading}
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
