// src/app/(dashboard)/settings/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Bell,
  Shield,
  Globe,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Dummy data - replace with your actual hooks/stores
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." + Date.now();
      setAccessToken(newToken);
    } catch (err) {
      setError("Failed to refresh token");
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

const useDummyAuth = () => ({
  isAuthenticated: true,
});

const useDummySessionStore = () => ({
  id: "user123",
  email: "user@example.com",
  activeOffice: {
    office_name: "Jakarta Office",
    role_name: "Administrator",
  },
  hasSession: () => true,
});

const SettingsPage: React.FC = () => {
  const {
    isLoading,
    error,
    accessToken,
    copyToClipboard,
    refreshToken,
    clearError,
  } = useDummySettings();

  const { isAuthenticated } = useDummyAuth();
  const { id, email, activeOffice, hasSession } = useDummySessionStore();

  const [showToken, setShowToken] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyToken = async () => {
    if (!accessToken) return;

    const success = await copyToClipboard(accessToken);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleRefreshToken = async () => {
    await refreshToken();
  };

  const maskToken = (token: string) => {
    if (token.length <= 10) return token;
    return token.substring(0, 10) + "..." + token.substring(token.length - 10);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-40 shadow-lg">
        <h2 className="text-gray-900 text-xl font-semibold mb-6">Pengaturan</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <User className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-medium text-gray-900">Profil Pengguna</h3>
                <p className="text-sm text-gray-600">
                  Kelola informasi profil Anda
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <Bell className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-900">Notifikasi</h3>
                <p className="text-sm text-gray-600">
                  Atur preferensi notifikasi
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <Shield className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-medium text-gray-900">Keamanan</h3>
                <p className="text-sm text-gray-600">
                  Pengaturan keamanan akun
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <Globe className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="font-medium text-gray-900">Bahasa & Region</h3>
                <p className="text-sm text-gray-600">
                  Pengaturan bahasa dan lokasi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Token Section */}
      {isAuthenticated && hasSession() && (
        <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-40 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900 text-lg font-semibold">
              Developer Information
            </h3>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              Development Only
            </span>
          </div>

          {/* Session Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Session Info</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <code className="text-gray-800 font-mono">{id}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <code className="text-gray-800 font-mono">{email}</code>
              </div>
              {activeOffice && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Office:</span>
                    <code className="text-gray-800 font-mono">
                      {activeOffice.office_name}
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <code className="text-gray-800 font-mono">
                      {activeOffice.role_name}
                    </code>
                  </div>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
              <button
                onClick={clearError}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          )}

          {copySuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">
                Token berhasil disalin ke clipboard!
              </span>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Access Token:
              </label>
              <button
                onClick={handleRefreshToken}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                title="Refresh Token"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            <div className="relative">
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                <code className="flex-1 text-sm font-mono text-gray-800 break-all">
                  {isLoading ? (
                    <span className="text-gray-500">Loading...</span>
                  ) : accessToken ? (
                    showToken ? (
                      accessToken
                    ) : (
                      maskToken(accessToken)
                    )
                  ) : (
                    <span className="text-gray-500">No token available</span>
                  )}
                </code>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setShowToken(!showToken)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    title={showToken ? "Hide token" : "Show token"}
                    disabled={!accessToken}
                  >
                    {showToken ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={handleCopyToken}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    title="Copy to clipboard"
                    disabled={!accessToken || isLoading}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              ⚠️ Token ini hanya untuk development. Jangan share atau commit ke
              repository.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
