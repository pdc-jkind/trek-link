// src/app/not-found.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  AuthLayout,
  AuthCard,
  AuthIcon,
  BackButton,
  PrimaryButton,
} from "@/app/(auth)/components";

const NotFoundPage: React.FC = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const popularPages = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Profile", href: "/profile" },
    { name: "Settings", href: "/settings" },
    { name: "Help", href: "/help" },
  ];

  return (
    <AuthLayout showFloatingBubbles={true} variant="default">
      <AuthCard variant="glass" padding="lg">
        {/* 404 Icon and Message */}
        <div className="text-center mb-8">
          {/* Custom 404 Icon */}
          <div className="w-24 h-24 rounded-2xl mx-auto p-4 mb-6 flex items-center justify-center shadow-2xl transform transition-all duration-300 bg-white/10 backdrop-blur-md">
            <div className="text-6xl font-bold text-white/80">404</div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-white/80 text-base mb-2">
            Halaman yang Anda cari tidak dapat ditemukan
          </p>
          <p className="text-white/60 text-sm">
            URL mungkin salah atau halaman telah dipindahkan
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-6">
          <PrimaryButton
            onClick={handleBackToHome}
            variant="primary"
            size="lg"
            fullWidth={true}
          >
            Kembali ke Beranda
          </PrimaryButton>

          <PrimaryButton
            onClick={handleGoBack}
            variant="secondary"
            size="md"
            fullWidth={true}
          >
            Halaman Sebelumnya
          </PrimaryButton>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/40 text-xs">
            Jika masalah berlanjut, silakan{" "}
            <button
              onClick={() => router.push("/contact")}
              className="text-white/60 hover:text-white underline transition-colors"
            >
              hubungi support
            </button>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default NotFoundPage;
