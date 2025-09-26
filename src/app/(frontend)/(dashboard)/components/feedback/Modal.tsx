import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closable?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  closable = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
}) => {
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw] max-h-[95vh]",
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay menggunakan CSS variables dengan backdrop yang kuat */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-all duration-300"
        onClick={handleOverlayClick}
      />

      {/* Modal dengan kontras maksimal menggunakan card variables */}
      <div
        className={cn(
          "relative w-full mx-4 rounded-xl overflow-hidden",
          "surface shadow-elevation-3",
          "animate-scale-in transition-all duration-300",
          sizeClasses[size],
          size === "full" && "h-full",
          className
        )}
      >
        {/* Header dengan kontras tinggi */}
        {(title || closable) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted">
            {title && (
              <h2 className="text-lg font-bold text-foreground">{title}</h2>
            )}
            {closable && (
              <button
                onClick={onClose}
                className="ml-auto p-2 rounded-lg transition-all duration-200
                  text-muted-foreground hover:text-foreground
                  hover:bg-muted
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Content dengan background yang jelas */}
        <div
          className={cn(
            "bg-card text-card-foreground",
            size === "full" ? "flex-1 overflow-auto" : "",
            !(title || closable) && "rounded-t-xl"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  className,
}) => (
  <div className={cn("px-6 py-4 border-b border-border bg-muted", className)}>
    {children}
  </div>
);

export const ModalContent: React.FC<ModalContentProps> = ({
  children,
  className,
}) => <div className={cn("p-6 text-foreground", className)}>{children}</div>;

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      "flex items-center justify-end gap-3 px-6 py-4",
      "border-t border-border bg-muted",
      className
    )}
  >
    {children}
  </div>
);
