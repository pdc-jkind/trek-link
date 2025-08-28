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

export const UserAssignmentModal: React.FC<UserAssignmentModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  userId,
  assignments,
  offices,
  roles,
  onSave,
  loading = false,
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

  // Initialize editable assignments when modal opens
  useEffect(() => {
    if (isOpen) {
      setEditableAssignments(
        assignments.map((assignment, index) => ({
          id: `existing-${index}`,
          office_id: assignment.office_id,
          role_id: assignment.role_id,
        }))
      );
      setError(null);
    }
  }, [isOpen, assignments]);

  const handleAddAssignment = () => {
    const newId = `new-${Date.now()}`;
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
    setEditableAssignments((prev) => prev.filter((a) => a.id !== id));
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
  };

  const validateAssignments = () => {
    // Check if all assignments have office and role selected
    const hasIncompleteAssignments = editableAssignments.some(
      (a) => !a.office_id || !a.role_id
    );
    if (hasIncompleteAssignments) {
      setError("Semua assignment harus memiliki office dan role yang dipilih");
      return false;
    }

    // Check for duplicate office assignments
    const officeIds = editableAssignments.map((a) => a.office_id);
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
      const assignmentsData = editableAssignments.map((assignment) => ({
        office_id: assignment.office_id,
        role_id: assignment.role_id,
      }));

      const success = await onSave(assignmentsData);
      if (success) {
        onClose();
      } else {
        setError("Gagal menyimpan assignment");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const getOfficeName = (officeId: string) => {
    const office = offices.find((o) => o.id === officeId);
    return office ? `${office.name} (${office.location})` : "";
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : "";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Office Assignment
            </h2>
            <p className="text-sm text-gray-600 mt-1">{userEmail}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={saving}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Office Assignments
              </h3>
              <button
                onClick={handleAddAssignment}
                disabled={saving}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Tambah Office
              </button>
            </div>

            {editableAssignments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Belum ada office assignment</p>
                <p className="text-sm">
                  Klik "Tambah Office" untuk menambah assignment
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {editableAssignments.map((assignment, index) => (
                  <div
                    key={assignment.id}
                    className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
                        >
                          <option value="">Pilih Office</option>
                          {offices.map((office) => (
                            <option key={office.id} value={office.id}>
                              {office.name} ({office.location})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
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
                      disabled={saving}
                      className="flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 mt-6"
                      title="Hapus assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving || editableAssignments.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
};
