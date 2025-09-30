// src/app/(dashboard)/users/UserAssignmentModal.tsx
import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2, AlertCircle } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalFooter,
  Button,
  Select,
} from "@/fe/components/index";

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

  // Initialize editable assignments when modal opens
  useEffect(() => {
    if (isOpen) {
      if (!assignments || assignments.length === 0) {
        setEditableAssignments([
          {
            id: generateId(),
            office_id: "",
            role_id: "",
            isNew: true,
          },
        ]);
      } else {
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

  // Convert offices to Select options
  const officeOptions = offices.map((office) => ({
    value: office.id,
    label: `${office.name} (${office.location})`,
  }));

  // Convert roles to Select options
  const roleOptions = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

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
    value: string | string[]
  ) => {
    // Convert to string if array (shouldn't happen since we're not using multiple)
    const stringValue = Array.isArray(value) ? value[0] || "" : value;

    setEditableAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === id
          ? { ...assignment, [field]: stringValue }
          : assignment
      )
    );
    if (error) {
      setError(null);
    }
  };

  const validateAssignments = () => {
    const validAssignments = editableAssignments.filter(
      (a) => a.office_id && a.role_id
    );

    if (validAssignments.length === 0) {
      setError(
        "Minimal satu assignment harus diisi dengan office dan role yang valid"
      );
      return false;
    }

    const hasIncompleteAssignments = editableAssignments.some(
      (a) => (a.office_id && !a.role_id) || (!a.office_id && a.role_id)
    );
    if (hasIncompleteAssignments) {
      setError(
        "Assignment yang sudah dimulai harus memiliki office dan role yang dipilih"
      );
      return false;
    }

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        assignments && assignments.length > 0
          ? "Edit Office Assignment"
          : "Assign Office"
      }
      size="lg"
    >
      <ModalContent>
        {/* User Email Info */}
        <div className="mb-6 pb-4 border-b border-outline">
          <p className="text-sm text-foreground-subtle">User</p>
          <p className="font-medium text-foreground">{userEmail}</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-error-container border border-error rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <p className="text-sm text-on-error-container">{error}</p>
          </div>
        )}

        {/* Header with Add Button */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">
            Office Assignments
          </h3>
          <Button
            onClick={handleAddAssignment}
            disabled={saving}
            variant="success"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Tambah Office
          </Button>
        </div>

        {/* Assignments List - FIXED: Removed overflow-y-auto and max-h */}
        <div className="space-y-4 pr-2">
          {editableAssignments.map((assignment) => (
            <AssignmentRow
              key={assignment.id}
              assignment={assignment}
              officeOptions={officeOptions}
              roleOptions={roleOptions}
              onOfficeChange={(value) =>
                handleAssignmentChange(assignment.id, "office_id", value)
              }
              onRoleChange={(value) =>
                handleAssignmentChange(assignment.id, "role_id", value)
              }
              onRemove={() => handleRemoveAssignment(assignment.id)}
              disabled={saving}
              canRemove={editableAssignments.length > 1}
            />
          ))}
        </div>
      </ModalContent>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={saving}>
          Batal
        </Button>
        <Button
          onClick={handleSave}
          disabled={
            saving ||
            editableAssignments.every((a) => !a.office_id || !a.role_id)
          }
          variant="warning"
          leftIcon={<Save className="w-4 h-4" />}
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

// Assignment Row Component
interface AssignmentRowProps {
  assignment: {
    id: string;
    office_id: string;
    role_id: string;
  };
  officeOptions: Array<{ value: string; label: string }>;
  roleOptions: Array<{ value: string; label: string }>;
  onOfficeChange: (value: string | string[]) => void;
  onRoleChange: (value: string | string[]) => void;
  onRemove: () => void;
  disabled: boolean;
  canRemove: boolean;
}

const AssignmentRow: React.FC<AssignmentRowProps> = ({
  assignment,
  officeOptions,
  roleOptions,
  onOfficeChange,
  onRoleChange,
  onRemove,
  disabled,
  canRemove,
}) => {
  return (
    <div className="p-4 bg-surface-variant border border-outline rounded-lg hover:border-primary/40 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Office Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Office
            </label>
            <Select
              options={[{ value: "", label: "Pilih Office" }, ...officeOptions]}
              value={assignment.office_id}
              onValueChange={onOfficeChange}
              disabled={disabled}
              searchable
              placeholder="Pilih Office"
            />
          </div>

          {/* Role Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Role</label>
            <Select
              options={[{ value: "", label: "Pilih Role" }, ...roleOptions]}
              value={assignment.role_id}
              onValueChange={onRoleChange}
              disabled={disabled}
              searchable
              placeholder="Pilih Role"
            />
          </div>
        </div>

        {/* Remove Button */}
        <div className="pt-7">
          <Button
            onClick={onRemove}
            disabled={disabled || !canRemove}
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="w-4 h-4" />}
            title={
              canRemove
                ? "Hapus assignment"
                : "Minimal satu assignment harus ada"
            }
          >
            Hapus
          </Button>
        </div>
      </div>
    </div>
  );
};
