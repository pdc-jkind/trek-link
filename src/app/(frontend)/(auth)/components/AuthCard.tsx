// src/app/(auth)/components/AuthCard.tsx
"use client";

import React from "react";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "glass" | "solid" | "minimal";
  padding?: "sm" | "md" | "lg";
}

export const AuthCard: React.FC<AuthCardProps> = ({
  children,
  className = "",
  variant = "glass",
  padding = "lg",
}) => {
  const variantClasses = {
    glass: "bg-white/25 backdrop-blur-xl border border-white/30 shadow-2xl",
    solid: "bg-white shadow-xl border border-gray-100",
    minimal: "bg-white/95 backdrop-blur-sm shadow-lg border border-white/50",
  };

  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        rounded-3xl w-full transform transition-all duration-300 
        hover:scale-105 hover:shadow-3xl
        ${variant === "glass" ? "hover:bg-white/30" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default AuthCard;
