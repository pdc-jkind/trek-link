import React from "react";
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Button,
} from "@/fe/components/index";
import { AlertTriangle, Info, XCircle } from "lucide-react";

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
          Icon: XCircle,
          iconBg: "bg-error-container",
          iconColor: "text-error",
          confirmVariant: "danger" as const,
        };
      case "warning":
        return {
          Icon: AlertTriangle,
          iconBg: "bg-warning-container",
          iconColor: "text-warning",
          confirmVariant: "warning" as const,
        };
      default:
        return {
          Icon: Info,
          iconBg: "bg-info-container",
          iconColor: "text-info",
          confirmVariant: "primary" as const,
        };
    }
  };

  const styles = getVariantStyles();
  const IconComponent = styles.Icon;

  const handleConfirm = () => {
    onConfirm();
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closable={false} // Disable built-in header with close button
      size="sm"
    >
      <ModalHeader>
        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-full ${
              styles.iconBg
            } border-2 ${styles.iconColor.replace(
              "text-",
              "border-"
            )}/30 flex items-center justify-center`}
          >
            <IconComponent className={`w-6 h-6 ${styles.iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
        </div>
      </ModalHeader>

      <ModalContent>
        <p className="text-foreground/80 leading-relaxed">{message}</p>
      </ModalContent>

      <ModalFooter>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          size="md"
        >
          {cancelText}
        </Button>
        <Button
          variant={styles.confirmVariant}
          onClick={handleConfirm}
          disabled={isLoading}
          isLoading={isLoading}
          size="md"
        >
          {isLoading ? "Memproses..." : confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
