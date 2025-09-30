"use client";

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
  // Get dynamic colors from CSS variables
  const getColor = (variable: string) => {
    if (typeof window === "undefined") return "";
    const style = getComputedStyle(document.documentElement);
    return `rgb(${style.getPropertyValue(variable).trim()})`;
  };

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
      {/* Overlay with dynamic backdrop */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          backgroundColor: `${getColor("--background")}e6`, // 90% opacity
          backdropFilter: "blur(8px) saturate(120%)",
        }}
        onClick={handleOverlayClick}
      />

      {/* Modal with dynamic colors */}
      <div
        className={cn(
          "relative w-full mx-4 rounded-xl overflow-hidden flex flex-col",
          "shadow-elevation-3 border-2",
          "animate-scale-in transition-all duration-300",
          sizeClasses[size],
          size === "full" ? "h-full" : "max-h-[90vh]",
          className
        )}
        style={{
          backgroundColor: getColor("--surface"),
          borderColor: getColor("--outline"),
        }}
      >
        {/* Header */}
        {(title || closable) && (
          <div
            className="flex items-center justify-between px-6 py-4 border-b-2 flex-shrink-0"
            style={{
              backgroundColor: getColor("--surface-variant"),
              borderColor: getColor("--outline"),
            }}
          >
            {title && (
              <h2
                className="text-lg font-bold"
                style={{ color: getColor("--on-surface") }}
              >
                {title}
              </h2>
            )}
            {closable && (
              <button
                onClick={onClose}
                className="ml-auto p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  color: getColor("--on-surface-variant"),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = getColor("--on-surface");
                  e.currentTarget.style.backgroundColor = `${getColor(
                    "--surface-3"
                  )}80`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = getColor(
                    "--on-surface-variant"
                  );
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${getColor(
                    "--primary"
                  )}40`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden",
            !(title || closable) && "rounded-t-xl"
          )}
          style={{
            backgroundColor: getColor("--surface"),
            color: getColor("--on-surface"),
          }}
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
}) => {
  const getColor = (variable: string) => {
    if (typeof window === "undefined") return "";
    const style = getComputedStyle(document.documentElement);
    return `rgb(${style.getPropertyValue(variable).trim()})`;
  };

  return (
    <div
      className={cn("px-6 py-4 border-b-2", className)}
      style={{
        backgroundColor: getColor("--surface-variant"),
        borderColor: getColor("--outline"),
      }}
    >
      {children}
    </div>
  );
};

export const ModalContent: React.FC<ModalContentProps> = ({
  children,
  className,
}) => {
  const getColor = (variable: string) => {
    if (typeof window === "undefined") return "";
    const style = getComputedStyle(document.documentElement);
    return `rgb(${style.getPropertyValue(variable).trim()})`;
  };

  return (
    <div
      className={cn("p-6", className)}
      style={{ color: getColor("--on-surface") }}
    >
      {children}
    </div>
  );
};

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className,
}) => {
  const getColor = (variable: string) => {
    if (typeof window === "undefined") return "";
    const style = getComputedStyle(document.documentElement);
    return `rgb(${style.getPropertyValue(variable).trim()})`;
  };

  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 px-6 py-4 border-t-2 flex-shrink-0",
        className
      )}
      style={{
        backgroundColor: getColor("--surface-variant"),
        borderColor: getColor("--outline"),
      }}
    >
      {children}
    </div>
  );
};
