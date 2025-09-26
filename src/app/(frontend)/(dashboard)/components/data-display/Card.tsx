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
  const variantClasses = {
    default: "bg-card border-2 border-border shadow-elevation-2",
    outline: "border-2 border-border bg-transparent hover:border-foreground/20",
    ghost: "bg-transparent hover:bg-muted/50",
    glass: "backdrop-blur-glass shadow-elevation-2 border-2 border-border/50",
  };

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-300",
        variantClasses[variant],
        sizeClasses[size],
        hoverable &&
          "hover:shadow-elevation-3 hover:-translate-y-0.5 hover:border-primary/30",
        clickable && "cursor-pointer active:scale-[0.98]",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
}) => (
  <div className={cn("flex flex-col space-y-2 pb-6", className)}>
    {children}
  </div>
);

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
}) => <div className={cn("pb-6", className)}>{children}</div>;

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
}) => (
  <div
    className={cn("flex items-center pt-6 border-t border-border", className)}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className,
  as: Component = "h3",
}) => (
  <Component
    className={cn(
      "text-xl font-bold leading-none tracking-tight text-foreground",
      className
    )}
  >
    {children}
  </Component>
);

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className,
}) => (
  <p className={cn("text-sm text-foreground-muted leading-relaxed", className)}>
    {children}
  </p>
);
