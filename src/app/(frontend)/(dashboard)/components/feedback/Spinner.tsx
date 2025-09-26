import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "success" | "warning" | "danger" | "muted";
  className?: string;
  text?: string;
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "primary",
  className,
  text,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-[3px]",
    xl: "w-12 h-12 border-[3px]",
  };

  // Menggunakan CSS variables dari globals.css dan tailwind.config
  const colorClasses = {
    primary: "border-border border-t-primary",
    secondary: "border-border border-t-secondary",
    success: "border-border border-t-success",
    warning: "border-border border-t-accent", // menggunakan accent dari tailwind.config
    danger: "border-border border-t-destructive",
    muted: "border-border-muted border-t-muted-foreground",
  };

  const textColorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-success",
    warning: "text-accent", // menggunakan accent dari tailwind.config
    danger: "text-destructive",
    muted: "text-muted-foreground",
  };

  if (text) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div
          className={cn(
            "animate-spin rounded-full",
            sizeClasses[size],
            colorClasses[color]
          )}
          role="status"
          aria-label="Loading"
        />
        <span className={cn("text-sm font-medium", textColorClasses[color])}>
          {text}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
};
