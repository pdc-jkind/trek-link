// src\app\(dashboard)\users\UserAssignmentModal.tsx
import React, { useState, useEffect } from "react";
import { X, Save, Plus, Trash2, AlertCircle } from "lucide-react";

interface Office {
  id: string;
  name: string;
  type: "pdc" | "distributor" | "grb" | "unset";
  location: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
}

interface UserOfficeAssignment {
  office_id: string;
  office_name: string;
  office_type: string;
  role_id: string;
  role_name: string;
  assigned_at: string;
  record_id?: string;
}

interface UserAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userId: string;
  assignments: UserOfficeAssignment[];
  offices: Office[];
  roles: Role[];
  onSave: (
    assignments: Array<{ office_id: string; role_id: string }>
  ) => Promise<boolean>;
  loading?: boolean;
}

// Helper function to generate unique IDs
const generateId = () =>
  `assignment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const UserAssignmentModal: React.FC<UserAssignmentModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  assignments,
  offices,
  roles,
  onSave,
}) => {
  const [editableAssignments, setEditableAssignments] = useState<
    Array<{
      id: string;
      office_id: string;
      role_id: string;
      isNew?: boolean;
    }>
  >([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize editable assignments when modal opens - Fixed null value handling
  useEffect(() => {
    if (isOpen) {
      // Handle case where user has no assignments
      if (!assignments || assignments.length === 0) {
        // Start with one empty assignment for new users
        setEditableAssignments([
          {
            id: generateId(),
            office_id: "",
            role_id: "",
            isNew: true,
          },
        ]);
      } else {
        // Map existing assignments with proper fallback values
        setEditableAssignments(
          assignments.map((assignment, index) => ({
            id: `existing-${index}-${assignment.record_id || Date.now()}`,
            office_id: assignment.office_id || "",
            role_id: assignment.role_id || "",
            isNew: false,
          }))
        );
      }
      setError(null);
    }
  }, [isOpen, assignments]);

  const handleAddAssignment = () => {
    const newId = generateId();
    setEditableAssignments((prev) => [
      ...prev,
      {
        id: newId,
        office_id: "",
        role_id: "",
        isNew: true,
      },
    ]);
  };

  const handleRemoveAssignment = (id: string) => {
    setEditableAssignments((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      // Ensure at least one assignment remains for editing
      if (filtered.length === 0) {
        return [
          {
            id: generateId(),
            office_id: "",
            role_id: "",
            isNew: true,
          },
        ];
      }
      return filtered;
    });
  };

  const handleAssignmentChange = (
    id: string,
    field: "office_id" | "role_id",
    value: string
  ) => {
    setEditableAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === id ? { ...assignment, [field]: value } : assignment
      )
    );
    // Clear error when user makes changes
    if (error) {
      setError(null);
    }
  };

  const validateAssignments = () => {
    // Filter out empty assignments
    const validAssignments = editableAssignments.filter(
      (a) => a.office_id && a.role_id
    );

    // Check if at least one valid assignment exists
    if (validAssignments.length === 0) {
      setError(
        "Minimal satu assignment harus diisi dengan office dan role yang valid"
      );
      return false;
    }

    // Check for incomplete assignments (partially filled)
    const hasIncompleteAssignments = editableAssignments.some(
      (a) => (a.office_id && !a.role_id) || (!a.office_id && a.role_id)
    );
    if (hasIncompleteAssignments) {
      setError(
        "Assignment yang sudah dimulai harus memiliki office dan role yang dipilih"
      );
      return false;
    }

    // Check for duplicate office assignments
    const officeIds = validAssignments.map((a) => a.office_id);
    const uniqueOfficeIds = new Set(officeIds);
    if (officeIds.length !== uniqueOfficeIds.size) {
      setError("Tidak boleh ada office yang sama untuk satu user");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateAssignments()) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Only include assignments that have both office and role selected
      const assignmentsData = editableAssignments
        .filter((assignment) => assignment.office_id && assignment.role_id)
        .map((assignment) => ({
          office_id: assignment.office_id,
          role_id: assignment.role_id,
        }));

      if (assignmentsData.length === 0) {
        setError("Minimal satu assignment harus diisi");
        setSaving(false);
        return;
      }

      const success = await onSave(assignmentsData);
      if (success) {
        onClose();
      } else {
        setError("Gagal menyimpan assignment");
      }
    } catch (err) {
      console.error("Error saving assignments:", err);
      setError("Terjadi kesalahan saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* Modal Container with enhanced styling */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-white/20 transform transition-all duration-300 scale-100 hover:scale-[1.01]">
        {/* Gradient Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 p-6 border-b border-purple-300/30">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white drop-shadow-sm">
                {assignments && assignments.length > 0
                  ? "Edit Office Assignment"
                  : "Assign Office"}
              </h2>
              <p className="text-purple-100 text-sm mt-1 font-medium">
                {userEmail}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 p-2 rounded-full backdrop-blur-sm"
              disabled={saving}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content with glass effect */}
        <div className="p-6 max-h-[60vh] overflow-y-auto bg-gradient-to-b from-white/80 to-gray-50/80">
          {error && (
            <div className="mb-6 p-4 bg-red-50/90 backdrop-blur-sm border border-red-200/50 rounded-xl flex items-center gap-3 shadow-sm">
              <div className="p-1 bg-red-100 rounded-full">
                <AlertCircle className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full" />
                Office Assignments
              </h3>
              <button
                onClick={handleAddAssignment}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Tambah Office
              </button>
            </div>

            <div className="space-y-4">
              {editableAssignments.map((assignment, _) => (
                <div
                  key={assignment.id}
                  className="group relative overflow-hidden rounded-xl border border-gray-200/60 bg-gradient-to-r from-white/90 to-gray-50/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:border-purple-300/60"
                >
                  {/* Animated gradient border on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                  <div className="relative flex items-start gap-4 p-5">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                          Office
                        </label>
                        <select
                          value={assignment.office_id}
                          onChange={(e) =>
                            handleAssignmentChange(
                              assignment.id,
                              "office_id",
                              e.target.value
                            )
                          }
                          disabled={saving}
                          className="w-full px-4 py-3 text-sm border border-gray-300/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 bg-white/90 text-gray-900 shadow-sm transition-all duration-200 hover:bg-white"
                        >
                          <option value="">Pilih Office</option>
                          {offices.map((office) => (
                            <option key={office.id} value={office.id}>
                              {office.name} ({office.location})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                          Role
                        </label>
                        <select
                          value={assignment.role_id}
                          onChange={(e) =>
                            handleAssignmentChange(
                              assignment.id,
                              "role_id",
                              e.target.value
                            )
                          }
                          disabled={saving}
                          className="w-full px-4 py-3 text-sm border border-gray-300/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 bg-white/90 text-gray-900 shadow-sm transition-all duration-200 hover:bg-white"
                        >
                          <option value="">Pilih Role</option>
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAssignment(assignment.id)}
                      disabled={saving || editableAssignments.length === 1}
                      className="flex items-center justify-center w-10 h-10 text-red-500 hover:text-red-700 hover:bg-red-50/80 rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed mt-8 group-hover:bg-red-50/60 backdrop-blur-sm border border-transparent hover:border-red-200/50"
                      title={
                        editableAssignments.length === 1
                          ? "Minimal satu assignment harus ada"
                          : "Hapus assignment"
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Footer with gradient */}
        <div className="relative bg-gradient-to-r from-gray-50/90 to-white/90 backdrop-blur-sm border-t border-gray-200/50 p-6">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.4'%3E%3Cpath d='M20 20h20v20H20V20zM0 0h20v20H0V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />

          <div className="relative flex items-center justify-end gap-4">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-300/60 rounded-xl hover:bg-gray-50/80 hover:border-gray-400/60 transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={
                saving ||
                editableAssignments.every((a) => !a.office_id || !a.role_id)
              }
              className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/70 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
