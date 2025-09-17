// src\app\(dashboard)\components\ui\Card.tsx
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`bg-white bg-opacity-80 backdrop-blur-lg rounded-xl p-5 border border-white border-opacity-40 shadow-md ${className}`}
  >
    {children}
  </div>
);
