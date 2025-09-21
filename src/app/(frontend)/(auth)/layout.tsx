// src/app/(auth)/layout.tsx
"use client";

import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

// No provider needed with Zustand!
const AuthGroupLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return <div className="auth-layout">{children}</div>;
};

export default AuthGroupLayout;
