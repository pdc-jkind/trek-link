// src/app/(auth)/unauthorized/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/(frontend)/hooks/useAuth";
import {
  AuthLayout,
  AuthCard,
  AuthIcon,
  BackButton,
  PrimaryButton,
  LoadingMessage,
} from "@/app/(frontend)/(auth)/components";

const UnauthorizedPage: React.FC = () => {
  const { user, isLoading, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleBackToLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleContactSupport = () => {
    // You can implement contact support logic here
    const subject = encodeURIComponent("Access Request - Unauthorized Access");
    const body = encodeURIComponent(`
Hi Support Team,

I'm trying to access a page but getting an "Unauthorized" error.

User Details:
- Email: ${user?.email || "N/A"}
- Role: ${user?.role || "N/A"}
- User ID: ${user?.id || "N/A"}
- Timestamp: ${new Date().toISOString()}
- Requested URL: ${window.location.href}

Please help me get the appropriate access.

Thanks,
${user?.name || "User"}
    `);
    window.location.href = `mailto:support@yourapp.com?subject=${subject}&body=${body}`;
  };

  // Show loading state
  if (isLoading) {
    return (
      <AuthLayout showFloatingBubbles={false}>
        <AuthCard variant="glass" padding="lg">
          <LoadingMessage
            title="Memuat"
            subtitle="Memeriksa akses pengguna..."
            showSpinner={true}
            showProgress={false}
          />
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout showFloatingBubbles={true} variant="default">
      <AuthCard variant="glass" padding="lg">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton onClick={() => router.back()} text="Kembali" />
        </div>

        {/* Unauthorized Icon and Message */}
        <div className="text-center mb-8">
          {/* Custom Unauthorized Icon */}
          <div className="w-24 h-24 rounded-2xl mx-auto p-4 mb-6 flex items-center justify-center shadow-2xl transform transition-all duration-300 bg-red-100/20 backdrop-blur-md border border-red-300/30">
            <svg
              className="w-12 h-12 text-red-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
            Akses Ditolak
          </h1>
          <p className="text-red-200 text-base mb-2">
            Anda tidak memiliki izin untuk mengakses halaman ini
          </p>
          <p className="text-white/60 text-sm">
            Silakan hubungi administrator untuk mendapatkan akses yang sesuai
          </p>
        </div>

        {/* User Info (if authenticated) */}
        {isAuthenticated && user && (
          <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-6 backdrop-blur-sm">
            <h3 className="text-white font-medium text-sm mb-3">
              Informasi Pengguna
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Email:</span>
                <span className="text-white">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Role:</span>
                <span className="text-white">{user.role || "User"}</span>
              </div>
              {user.name && (
                <div className="flex justify-between">
                  <span className="text-white/70">Name:</span>
                  <span className="text-white">{user.name}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          {isAuthenticated ? (
            <>
              <PrimaryButton
                onClick={() => router.push("/dashboard")}
                variant="primary"
                size="lg"
                fullWidth={true}
              >
                Kembali ke Dashboard
              </PrimaryButton>

              <PrimaryButton
                onClick={handleContactSupport}
                variant="secondary"
                size="md"
                fullWidth={true}
              >
                Hubungi Support
              </PrimaryButton>

              <PrimaryButton
                onClick={handleLogout}
                variant="outline"
                size="md"
                fullWidth={true}
              >
                Logout
              </PrimaryButton>
            </>
          ) : (
            <>
              <PrimaryButton
                onClick={handleBackToLogin}
                variant="primary"
                size="lg"
                fullWidth={true}
              >
                Masuk ke Akun
              </PrimaryButton>

              <PrimaryButton
                onClick={() => router.push("/")}
                variant="secondary"
                size="md"
                fullWidth={true}
              >
                Kembali ke Beranda
              </PrimaryButton>
            </>
          )}
        </div>

        {/* Common Reasons */}
        <div className="mt-8 border-t border-white/20 pt-6">
          <h3 className="text-white font-medium text-sm mb-4">
            Kemungkinan Penyebab:
          </h3>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start space-x-2">
              <span className="w-1 h-1 rounded-full bg-white/50 mt-2 flex-shrink-0" />
              <span>
                Role pengguna tidak sesuai untuk mengakses halaman ini
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1 h-1 rounded-full bg-white/50 mt-2 flex-shrink-0" />
              <span>Akun belum diverifikasi atau diaktifkan</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1 h-1 rounded-full bg-white/50 mt-2 flex-shrink-0" />
              <span>Sesi login telah kedaluwarsa</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1 h-1 rounded-full bg-white/50 mt-2 flex-shrink-0" />
              <span>Izin khusus diperlukan untuk fitur ini</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/40 text-xs">
            Butuh bantuan?{" "}
            <button
              onClick={handleContactSupport}
              className="text-white/60 hover:text-white underline transition-colors"
            >
              Hubungi Tim Support
            </button>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default UnauthorizedPage;
