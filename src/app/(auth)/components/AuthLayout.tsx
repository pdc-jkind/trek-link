// src/app/(auth)/components/AuthLayout.tsx
"use client";

import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  showFloatingBubbles?: boolean;
  variant?: "default" | "minimal";
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  showFloatingBubbles = true,
  variant = "default",
}) => {
  const gradientClass =
    variant === "minimal"
      ? "bg-gradient-to-br from-slate-50 to-slate-100"
      : "bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800";

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${gradientClass} relative overflow-hidden`}
    >
      {/* Background Floating Bubbles */}
      {showFloatingBubbles && variant === "default" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated floating bubbles */}
          <div className="absolute top-4 left-12 w-96 h-96 rounded-full bg-white/5 opacity-80 animate-pulse" />
          <div
            className="absolute bottom-16 right-20 w-96 h-96 rounded-full bg-white/5 opacity-50 animate-pulse"
            style={{ animationDelay: "-3s" }}
          />
          <div
            className="absolute top-1/3 right-8 w-64 h-64 rounded-full bg-white/5 opacity-60 animate-pulse"
            style={{ animationDelay: "-1.5s" }}
          />
          <div
            className="absolute bottom-1/4 left-40 w-60 h-60 rounded-full bg-white/5 opacity-70 animate-pulse"
            style={{ animationDelay: "-4.2s" }}
          />

          {/* Additional floating elements for more depth */}
          <div
            className="absolute top-10 right-1/4 w-32 h-32 rounded-full bg-white/3 opacity-40 animate-pulse"
            style={{ animationDelay: "-2s" }}
          />
          <div
            className="absolute bottom-20 left-1/3 w-48 h-48 rounded-full bg-white/4 opacity-30 animate-pulse"
            style={{ animationDelay: "-5s" }}
          />
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
};

export default AuthLayout;
