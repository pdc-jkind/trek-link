import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

interface ToastProps {
  id: string;
  title?: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose?: (id: string) => void;
  closable?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  type = "info",
  duration = 5000,
  onClose,
  closable = true,
  action,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.(id);
    }, 200);
  };

  const typeConfig = {
    success: {
      icon: CheckCircle,
      // Menggunakan success variables dari globals.css
      className: "bg-success/10 border-2 border-success/30",
      iconClassName: "text-success",
      titleClassName: "text-success",
      messageClassName: "text-success",
      actionClassName: "text-success hover:text-success focus:ring-success",
    },
    error: {
      icon: XCircle,
      // Menggunakan destructive variables dari globals.css
      className: "bg-destructive/10 border-2 border-destructive/30",
      iconClassName: "text-destructive",
      titleClassName: "text-destructive",
      messageClassName: "text-destructive",
      actionClassName:
        "text-destructive hover:text-destructive focus:ring-destructive",
    },
    warning: {
      icon: AlertCircle,
      // Menggunakan accent variables dari tailwind.config (untuk warning/amber)
      className: "bg-accent/10 border-2 border-accent/30",
      iconClassName: "text-accent",
      titleClassName: "text-accent",
      messageClassName: "text-accent",
      actionClassName: "text-accent hover:text-accent focus:ring-accent",
    },
    info: {
      icon: Info,
      // Menggunakan primary variables dari globals.css
      className: "bg-primary/10 border-2 border-primary/30",
      iconClassName: "text-primary",
      titleClassName: "text-primary",
      messageClassName: "text-primary",
      actionClassName: "text-primary hover:text-primary focus:ring-primary",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg shadow-elevation-2",
        "transition-all duration-200 max-w-md min-w-[320px]",
        "bg-card border border-border", // Base styling menggunakan card variables
        config.className,
        isVisible && !isExiting && "animate-fade-in",
        isExiting && "opacity-0 scale-95"
      )}
      role="alert"
    >
      {/* Icon dengan ukuran yang lebih proporsional */}
      <Icon
        className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.iconClassName)}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <div className={cn("font-bold text-sm mb-1", config.titleClassName)}>
            {title}
          </div>
        )}
        <div className={cn("text-sm leading-relaxed", config.messageClassName)}>
          {message}
        </div>

        {action && (
          <button
            onClick={action.onClick}
            className={cn(
              "mt-2 text-sm font-semibold underline hover:no-underline",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded",
              config.actionClassName
            )}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Close button dengan hover state yang jelas menggunakan muted variables */}
      {closable && (
        <button
          onClick={handleClose}
          className={cn(
            "flex-shrink-0 p-1 rounded-md transition-all",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-muted",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          )}
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: ToastProps[];
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = "top-right",
}) => {
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col gap-3",
        positionClasses[position]
      )}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};
