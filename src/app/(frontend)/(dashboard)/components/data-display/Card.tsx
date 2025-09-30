"use client";

import React from "react";
import { cn } from "@/fe/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = "default",
  size = "md",
  hoverable = false,
  clickable = false,
  onClick,
}) => {
  // Get dynamic colors from CSS variables
  const getColor = (variable: string) => {
    if (typeof window === "undefined") return "";
    const style = getComputedStyle(document.documentElement);
    return `rgb(${style.getPropertyValue(variable).trim()})`;
  };

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const getDynamicStyles = (): React.CSSProperties => {
    const styles: Record<string, React.CSSProperties> = {
      default: {
        backgroundColor: getColor("--surface"),
        borderColor: getColor("--outline"),
        color: getColor("--on-surface"),
      },
      outline: {
        backgroundColor: "transparent",
        borderColor: getColor("--outline"),
        color: getColor("--on-surface"),
      },
      ghost: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        color: getColor("--on-surface"),
      },
      glass: {
        backgroundColor: `${getColor("--surface")}cc`, // 80% opacity
        borderColor: `${getColor("--outline")}80`, // 50% opacity
        backdropFilter: "blur(20px) saturate(180%)",
        color: getColor("--on-surface"),
      },
    };

    return styles[variant] || styles.default;
  };

  const getHoverStyles = (): React.CSSProperties => {
    if (!hoverable) return {};

    return {
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    };
  };

  const baseStyle = {
    ...getDynamicStyles(),
    ...getHoverStyles(),
  };

  return (
    <div
      className={cn(
        "rounded-xl border-2 transition-all duration-300",
        sizeClasses[size],
        hoverable && "hover:shadow-elevation-3 hover:-translate-y-1",
        clickable && "cursor-pointer active:scale-[0.98]",
        className
      )}
      style={baseStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.borderColor = `${getColor("--primary")}60`;
          e.currentTarget.style.boxShadow = `0 10px 15px -3px ${getColor(
            "--primary"
          )}20, 0 4px 6px -4px ${getColor("--primary")}10`;
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.borderColor = getColor("--outline");
          e.currentTarget.style.boxShadow = "none";
        }
        if (variant === "outline") {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
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
      className={cn("flex flex-col space-y-2 pb-6", className)}
      style={{
        borderBottom: `1px solid ${getColor("--outline-variant")}`,
        marginBottom: "1.5rem",
      }}
    >
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
}) => <div className={cn("pb-6", className)}>{children}</div>;

export const CardFooter: React.FC<CardFooterProps> = ({
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
      className={cn("flex items-center pt-6", className)}
      style={{
        borderTop: `1px solid ${getColor("--outline-variant")}`,
        marginTop: "1.5rem",
      }}
    >
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className,
  as: Component = "h3",
}) => {
  const getColor = (variable: string) => {
    if (typeof window === "undefined") return "";
    const style = getComputedStyle(document.documentElement);
    return `rgb(${style.getPropertyValue(variable).trim()})`;
  };

  return (
    <Component
      className={cn("text-xl font-bold leading-none tracking-tight", className)}
      style={{ color: getColor("--on-surface") }}
    >
      {children}
    </Component>
  );
};

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className,
}) => {
  const getColor = (variable: string) => {
    if (typeof window === "undefined") return "";
    const style = getComputedStyle(document.documentElement);
    return `rgb(${style.getPropertyValue(variable).trim()})`;
  };

  return (
    <p
      className={cn("text-sm leading-relaxed", className)}
      style={{ color: getColor("--on-surface-variant") }}
    >
      {children}
    </p>
  );
};
