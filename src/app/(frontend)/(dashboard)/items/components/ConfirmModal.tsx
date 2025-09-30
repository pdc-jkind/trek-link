import React from "react";
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Button,
} from "@/fe/components/index";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message = "Apakah Anda yakin ingin melanjutkan?",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  variant = "info",
  isLoading = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: "⚠️",
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          confirmVariant: "danger" as const,
        };
      case "warning":
        return {
          icon: "⚠️",
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
          confirmVariant: "warning" as const,
        };
      default:
        return {
          icon: "ℹ️",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          confirmVariant: "primary" as const,
        };
    }
  };

  const styles = getVariantStyles();

  const handleConfirm = () => {
    onConfirm();
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center`}
          >
            <span className={`text-2xl ${styles.iconColor}`}>
              {styles.icon}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
        </div>
      </ModalHeader>

      <ModalContent>
        <p className="text-gray-600 leading-relaxed">{message}</p>
      </ModalContent>

      <ModalFooter>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={styles.confirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : confirmText}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};
