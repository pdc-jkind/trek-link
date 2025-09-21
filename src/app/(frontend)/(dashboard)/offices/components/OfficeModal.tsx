// src/app/(dashboard)/offices/components/OfficeModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle, Building } from "lucide-react";
import type { Office, OfficeType } from "../office.type";

interface CreateOfficePayload {
  name: string;
  type: OfficeType;
  location: string;
}

interface UpdateOfficePayload extends CreateOfficePayload {
  id: string;
}

interface OfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: CreateOfficePayload | UpdateOfficePayload
  ) => Promise<{ success: boolean; error?: string }>;
  office?: Office | null;
  mode: "create" | "edit";
  checkOfficeNameExists?: (
    officeName: string,
    excludeId?: string
  ) => Promise<boolean>;
}

export const OfficeModal: React.FC<OfficeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  office,
  mode,
  checkOfficeNameExists,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "unset" as OfficeType,
    location: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameExists, setNameExists] = useState(false);

  // Office type options
  const officeTypeOptions = [
    { value: "pdc", label: "PDC", description: "Primary Distribution Center" },
    {
      value: "distributor",
      label: "Distributor",
      description: "Distributor Office",
    },
    { value: "grb", label: "GRB", description: "Gudang Regional Branch" },
    { value: "unset", label: "Unassigned", description: "Belum ditentukan" },
  ];

  // Common locations for dropdown
  const commonLocations = [
    "Jakarta",
    "Surabaya",
    "Bandung",
    "Medan",
    "Semarang",
    "Makassar",
    "Palembang",
    "Tangerang",
    "Depok",
    "Bekasi",
    "Bogor",
    "Yogyakarta",
    "Malang",
    "Solo",
    "Balikpapan",
    "Manado",
    "Denpasar",
    "Pontianak",
    "Pekanbaru",
    "Banjarmasin",
  ];

  // Reset form when modal opens/closes or office changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && office) {
        setFormData({
          name: office.name,
          type: office.type,
          location: office.location,
        });
      } else {
        setFormData({
          name: "",
          type: "unset",
          location: "",
        });
      }
      setErrors({});
      setNameExists(false);
    }
  }, [isOpen, office, mode]);

  // Check name uniqueness
  const handleNameChange = async (value: string) => {
    setFormData((prev) => ({ ...prev, name: value }));
    setErrors((prev) => ({ ...prev, name: "" }));

    if (value && checkOfficeNameExists) {
      const exists = await checkOfficeNameExists(
        value,
        mode === "edit" && office ? office.id : undefined
      );
      setNameExists(exists);
    } else {
      setNameExists(false);
    }
  };

  const handleInputChange = (field: string, value: string | OfficeType) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama office harus diisi";
    } else if (nameExists) {
      newErrors.name = "Nama office sudah ada";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Lokasi harus diisi";
    }

    if (!formData.type) {
      newErrors.type = "Tipe office harus dipilih";
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
        name: formData.name.trim(),
        type: formData.type,
        location: formData.location.trim(),
      };

      const finalPayload =
        mode === "edit" && office ? { id: office.id, ...payload } : payload;

      const result = await onSave(finalPayload);

      if (result.success) {
        onClose();
      } else {
        setErrors({ submit: result.error || "Terjadi kesalahan" });
      }
    } catch (error) {
      setErrors({ submit: `Terjadi kesalahan tidak terduga, error: ${error}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // Get office type color scheme
  const getOfficeTypeStyle = (type: OfficeType) => {
    const styles = {
      pdc: "bg-blue-50 border-blue-200 text-blue-800",
      distributor: "bg-green-50 border-green-200 text-green-800",
      grb: "bg-yellow-50 border-yellow-200 text-yellow-800",
      unset: "bg-gray-50 border-gray-200 text-gray-800",
    };
    return styles[type] || styles.unset;
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
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto border border-gray-200/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {mode === "create" ? "Tambah Office" : "Edit Office"}
            </h2>
          </div>
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

          {/* Office Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Nama Office *
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
              placeholder="Masukkan nama office"
              disabled={isSubmitting}
            />
            {(errors.name || nameExists) && (
              <p className="mt-2 text-sm text-red-700 font-medium">
                {errors.name || (nameExists ? "Nama office sudah ada" : "")}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Office Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tipe Office *
              </label>
              <div className="space-y-2">
                {officeTypeOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.type === option.value
                        ? `${getOfficeTypeStyle(
                            option.value as OfficeType
                          )} border-2`
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="office-type"
                      value={option.value}
                      checked={formData.type === option.value}
                      onChange={(e) =>
                        handleInputChange("type", e.target.value as OfficeType)
                      }
                      className="sr-only"
                      disabled={isSubmitting}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {option.label}
                        </span>
                        {formData.type === option.value && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {option.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              {errors.type && (
                <p className="mt-2 text-sm text-red-700 font-medium">
                  {errors.type}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Lokasi *
              </label>
              <div className="space-y-3">
                <select
                  value={
                    commonLocations.includes(formData.location)
                      ? formData.location
                      : "custom"
                  }
                  onChange={(e) => {
                    if (e.target.value !== "custom") {
                      handleInputChange("location", e.target.value);
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white"
                  disabled={isSubmitting}
                >
                  <option value="" disabled className="text-gray-500">
                    Pilih lokasi
                  </option>
                  {commonLocations.map((location) => (
                    <option
                      key={location}
                      value={location}
                      className="text-gray-900"
                    >
                      {location}
                    </option>
                  ))}
                  <option value="custom" className="text-gray-900">
                    Lokasi Lainnya...
                  </option>
                </select>

                {(!commonLocations.includes(formData.location) ||
                  formData.location === "") && (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-900 font-medium placeholder-gray-500 ${
                      errors.location
                        ? "border-red-300 focus:ring-red-500 bg-red-50"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    }`}
                    placeholder="Masukkan lokasi office"
                    disabled={isSubmitting}
                  />
                )}
              </div>
              {errors.location && (
                <p className="mt-2 text-sm text-red-700 font-medium">
                  {errors.location}
                </p>
              )}
            </div>
          </div>

          {/* Preview Card */}
          {formData.name && formData.location && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Preview:
              </h4>
              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {formData.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formData.location}
                    </div>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getOfficeTypeStyle(
                    formData.type
                  )}`}
                >
                  {
                    officeTypeOptions.find((opt) => opt.value === formData.type)
                      ?.label
                  }
                </div>
              </div>
            </div>
          )}
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
            disabled={
              isSubmitting ||
              nameExists ||
              !formData.name.trim() ||
              !formData.location.trim()
            }
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
