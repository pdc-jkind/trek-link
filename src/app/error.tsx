// src/app/error.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  AuthLayout,
  AuthCard,
  ErrorMessage,
  BackButton,
} from "@/app/(frontend)/(auth)/components";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, reset }) => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleRetry = () => {
    reset();
  };

  const handleReportBug = () => {
    // You can implement bug reporting logic here
    // For now, we'll just open email client
    const subject = encodeURIComponent("Bug Report - Application Error");
    const body = encodeURIComponent(`
Error Details:
- Message: ${error.message}
- Digest: ${error.digest || "N/A"}
- Timestamp: ${new Date().toISOString()}
- URL: ${window.location.href}
- User Agent: ${navigator.userAgent}

Please describe what you were doing when this error occurred:

    `);
    window.location.href = `mailto:support@yourapp.com?subject=${subject}&body=${body}`;
  };

  return (
    <AuthLayout showFloatingBubbles={true} variant="default">
      <AuthCard variant="glass" padding="lg">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton onClick={handleBackToHome} text="Kembali ke Beranda" />
        </div>

        {/* Error Message */}
        <ErrorMessage
          title="Terjadi Kesalahan"
          subtitle="Aplikasi mengalami masalah yang tidak terduga"
          error={error.message || "Unknown error occurred"}
          onRetry={handleRetry}
          onBackToLogin={handleBackToHome}
          retryText="Coba Lagi"
          backText="Kembali ke Beranda"
          showErrorDetails={true}
        />

        {/* Additional Actions */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleReportBug}
            className="w-full bg-transparent border border-white/20 py-2 px-4 rounded-xl text-white/60 text-xs hover:bg-white/5 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Laporkan Bug
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-white/40 text-xs">
            Error ID: {error.digest || "UNKNOWN"}
          </p>
          <p className="text-white/40 text-xs mt-1">
            {new Date().toLocaleString("id-ID")}
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default ErrorPage;
