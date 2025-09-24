// src/app/(dashboard)/settings/page.tsx
"use client";

import React, { useState } from "react";
import { User, Bell, Shield, Globe } from "lucide-react";
import { Card, PageHeader } from "../components/ui";

// Dummy data and hooks
const useDummySettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  );

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  const refreshToken = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." + Date.now();
      setAccessToken(newToken);
    } catch (error) {
      setError(`Failed to refresh token error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    isLoading,
    error,
    accessToken,
    copyToClipboard,
    refreshToken,
    clearError,
  };
};

// Settings menu items
const settingsMenuItems = [
  {
    icon: User,
    title: "Profil Pengguna",
    description: "Kelola informasi profil Anda",
    color: "text-purple-600",
  },
  {
    icon: Bell,
    title: "Notifikasi",
    description: "Atur preferensi notifikasi",
    color: "text-blue-600",
  },
  {
    icon: Shield,
    title: "Keamanan",
    description: "Pengaturan keamanan akun",
    color: "text-green-600",
  },
  {
    icon: Globe,
    title: "Bahasa & Region",
    description: "Pengaturan bahasa dan lokasi",
    color: "text-orange-600",
  },
];

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Main Settings Card */}
      <Card>
        <PageHeader title="Pengaturan" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {settingsMenuItems.slice(0, 2).map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <item.icon className={`w-6 h-6 ${item.color}`} />
                <div>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {settingsMenuItems.slice(2, 4).map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <item.icon className={`w-6 h-6 ${item.color}`} />
                <div>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
