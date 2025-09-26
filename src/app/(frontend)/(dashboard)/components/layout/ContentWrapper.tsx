// ===== /layout/ContentWrapper.tsx =====
"use client";

import React from "react";
import { cn } from "@/fe/lib/utils";

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  center?: boolean;
}

export const ContentWrapper: React.FC<ContentWrapperProps> = ({
  children,
  className,
  maxWidth = "7xl",
  padding = "md",
  center = true,
}) => {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6 sm:p-8",
    lg: "p-8 sm:p-12",
  };

  return (
    <div
      className={cn(
        "w-full",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        center && "mx-auto",
        "m-2 sm:m-4",
        "rounded-lg",
        "shadow-elevation-2",
        className
      )}
    >
      {children}
    </div>
  );
};
