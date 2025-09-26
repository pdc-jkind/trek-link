"use client";

import React from "react";
import { cn } from "@/fe/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className,
  dot = false,
}) => {
  const variantClasses = {
    // Default menggunakan variabel muted yang sudah didefinisikan
    default: "bg-muted text-muted-foreground border border-border",

    // Primary menggunakan warna primary dari CSS variables dengan kontras yang baik
    primary:
      "bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30",

    // Secondary menggunakan warna secondary dari CSS variables
    secondary:
      "bg-secondary/10 text-secondary border border-secondary/20 dark:bg-secondary/20 dark:text-secondary dark:border-secondary/30",

    // Success menggunakan warna success dari CSS variables
    success:
      "bg-success/10 text-success border border-success/20 dark:bg-success/20 dark:text-success dark:border-success/30",

    // Warning menggunakan warna accent (amber/warm) dari tailwind config
    warning:
      "bg-accent/10 text-accent border border-accent/20 dark:bg-accent/20 dark:text-accent dark:border-accent/30",

    // Danger menggunakan destructive dari CSS variables
    danger:
      "bg-destructive/10 text-destructive border border-destructive/20 dark:bg-destructive/20 dark:text-destructive dark:border-destructive/30",

    // Outline menggunakan border dan foreground variables
    outline:
      "border-2 border-border text-foreground bg-transparent hover:bg-muted/50 dark:border-border dark:text-foreground dark:hover:bg-muted/50",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-2xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  if (dot) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5",
          sizeClasses[size],
          "rounded-full font-semibold transition-colors",
          variantClasses[variant],
          className
        )}
      >
        <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold transition-colors",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
