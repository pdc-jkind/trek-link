// src/app/(auth)/layout.tsx
"use client";

import React from "react";
import { AuthProvider } from "./components";

interface AuthLayoutProps {
  children: React.ReactNode;
}

// Main layout untuk auth pages
const AuthGroupLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <AuthProvider>
      <div className="auth-layout">{children}</div>
    </AuthProvider>
  );
};

export default AuthGroupLayout;
