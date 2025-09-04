// src/app/login/page.tsx
"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  AuthLayout,
  AuthCard,
  WelcomeMessage,
  LoadingMessage,
  GoogleLoginButton,
  Notification,
} from "@/app/(auth)/components";

// ========== LOGIN CONTENT COMPONENT ==========
const LoginContent: React.FC = () => {
  const { login, error, clearError, isLoading, isFullyAuthenticated } =
    useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get error from URL params (from failed auth callback)
  const urlError = searchParams.get("error");
  const displayError = error || urlError;

  // Redirect if already authenticated and has user profile
  useEffect(() => {
    if (isFullyAuthenticated) {
      const redirectTo = searchParams.get("redirectTo") || "/dashboard";
      console.log("User fully authenticated, redirecting to:", redirectTo);
      router.replace(redirectTo);
    }
  }, [isFullyAuthenticated, router, searchParams]);

  const handleGoogleLogin = async () => {
    clearError();
    try {
      console.log("Initiating Google login...");
      await login("google");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // Clear URL error on mount
  useEffect(() => {
    if (urlError) {
      // Clear URL error by replacing without the error param
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("error");
      const newUrl = newParams.toString()
        ? `${window.location.pathname}?${newParams.toString()}`
        : window.location.pathname;
      router.replace(newUrl);
    }
  }, [urlError, router, searchParams]);

  // Show loading state while redirecting
  if (isFullyAuthenticated) {
    return (
      <AuthLayout showFloatingBubbles={false}>
        <AuthCard variant="glass" padding="lg">
          <LoadingMessage
            title="Mengalihkan"
            subtitle="Mengarahkan ke dashboard..."
            showSpinner={true}
            showProgress={false}
          />
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout showFloatingBubbles={true}>
      {/* Error Notification */}
      {displayError && (
        <Notification
          type="error"
          message={displayError}
          onClose={clearError}
          autoClose={false}
        />
      )}

      {/* Main Login Card */}
      <AuthCard variant="glass" padding="lg">
        {/* Welcome Message */}
        <WelcomeMessage
          title="Selamat Datang"
          subtitle="Masuk dengan akun Google Anda untuk melanjutkan"
          description="Dengan masuk, Anda menyetujui Syarat & Ketentuan dan Kebijakan Privasi"
          showLogo={true}
        />

        {/* Login Form */}
        <div className="space-y-6">
          <GoogleLoginButton
            onClick={handleGoogleLogin}
            isLoading={isLoading}
            text="Masuk dengan Google"
            loadingText="Memproses..."
            fullWidth={true}
            disabled={isLoading}
          />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-xs">
            Butuh bantuan?{" "}
            <button
              className="text-white/80 hover:text-white underline transition-colors"
              onClick={() => {
                // Add support contact functionality here
                console.log("Support contact clicked");
              }}
            >
              Hubungi Support
            </button>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

// ========== LOADING FALLBACK ==========
const LoginLoadingFallback: React.FC = () => {
  return (
    <AuthLayout showFloatingBubbles={false}>
      <AuthCard variant="glass" padding="lg">
        <LoadingMessage
          title="Memuat"
          subtitle="Menyiapkan halaman login..."
          showSpinner={true}
          showProgress={false}
        />
      </AuthCard>
    </AuthLayout>
  );
};

// ========== MAIN COMPONENT ==========
const LoginPage: React.FC = () => {
  return (
    <Suspense fallback={<LoginLoadingFallback />}>
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;
