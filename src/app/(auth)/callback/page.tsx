// src/app/callback/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  AuthLayout,
  AuthCard,
  SuccessMessage,
  ErrorMessage,
  LoadingMessage,
} from "@/app/(auth)/components";

// ========== AUTH CALLBACK CONTENT ==========
const AuthCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleAuthCallback, isLoading, error } = useAuth();

  const [processingStatus, setProcessingStatus] = useState<
    "processing" | "success" | "error"
  >("processing");
  const [statusMessage, setStatusMessage] = useState(
    "Memverifikasi akun Anda..."
  );
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const processingSteps = [
    "Memverifikasi token autentikasi",
    "Mengambil data pengguna",
    "Menyiapkan sesi",
    "Mengarahkan ke dashboard",
  ];

  useEffect(() => {
    let mounted = true;
    let redirectTimeoutId: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    const processCallback = async () => {
      try {
        console.log("Starting callback processing...");

        // Start progress animation
        progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev < 90) return prev + Math.random() * 10;
            return prev;
          });
        }, 200);

        // Check for error in URL params first
        const errorParam = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (errorParam) {
          console.error("OAuth error:", errorParam, errorDescription);
          if (mounted) {
            setProcessingStatus("error");
            setProgress(0);
            clearInterval(progressInterval);

            // Redirect to login with error
            redirectTimeoutId = setTimeout(() => {
              router.replace(
                `/login?error=${encodeURIComponent(
                  errorDescription || errorParam
                )}`
              );
            }, 2000);
          }
          return;
        }

        // Step 1: Verify authentication
        setCurrentStep(0);
        setStatusMessage("Memverifikasi autentikasi...");
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Step 2: Process callback
        setCurrentStep(1);
        setStatusMessage("Memproses data login...");
        console.log("Processing auth callback...");
        const success = await handleAuthCallback();
        console.log("handleAuthCallback result:", success);

        if (!mounted) return;

        if (success || success === undefined) {
          // Step 3: Preparing session
          setCurrentStep(2);
          setStatusMessage("Menyiapkan sesi...");
          await new Promise((resolve) => setTimeout(resolve, 300));

          // Step 4: Success
          setCurrentStep(3);
          console.log("Auth callback successful, preparing redirect...");
          setProcessingStatus("success");
          setStatusMessage("Login berhasil!");
          setProgress(100);
          clearInterval(progressInterval);

          // Get redirect URL
          const redirectTo =
            searchParams.get("redirect_to") ||
            searchParams.get("redirectTo") ||
            "/dashboard";

          console.log("Redirecting to:", redirectTo);

          // Redirect with minimal delay
          redirectTimeoutId = setTimeout(() => {
            if (mounted) {
              console.log("Executing redirect now...");
              router.replace(redirectTo);
            }
          }, 1000);
        } else {
          console.error("Auth callback failed, success:", success);
          if (mounted) {
            setProcessingStatus("error");
            setProgress(0);
            clearInterval(progressInterval);

            redirectTimeoutId = setTimeout(() => {
              router.replace("/login?error=Gagal memproses login");
            }, 2000);
          }
        }
      } catch (err: any) {
        console.error("Callback processing error:", err);
        if (mounted) {
          setProcessingStatus("error");
          setProgress(0);
          clearInterval(progressInterval);

          redirectTimeoutId = setTimeout(() => {
            router.replace(
              `/login?error=${encodeURIComponent(
                err.message || "Terjadi kesalahan saat memproses login"
              )}`
            );
          }, 2000);
        }
      }
    };

    // Start processing
    processCallback();

    // Fallback mechanism - force redirect after 10 seconds
    const fallbackTimeoutId = setTimeout(() => {
      if (mounted && processingStatus === "processing") {
        console.log("Fallback: Forcing redirect after timeout");
        setProcessingStatus("success");
        setStatusMessage("Mengalihkan...");
        setProgress(100);
        clearInterval(progressInterval);

        const redirectTo =
          searchParams.get("redirect_to") ||
          searchParams.get("redirectTo") ||
          "/dashboard";

        router.replace(redirectTo);
      }
    }, 10000);

    return () => {
      mounted = false;
      if (redirectTimeoutId) clearTimeout(redirectTimeoutId);
      if (progressInterval) clearInterval(progressInterval);
      clearTimeout(fallbackTimeoutId);
    };
  }, [handleAuthCallback, router, searchParams, processingStatus]);

  // Error state
  if (error || processingStatus === "error") {
    return (
      <AuthLayout showFloatingBubbles={true}>
        <AuthCard variant="glass" padding="lg">
          <ErrorMessage
            title="Login Gagal"
            subtitle="Terjadi kesalahan saat memproses login Anda"
            error={error || "Terjadi kesalahan tidak dikenal"}
            onBackToLogin={() => router.push("/login")}
            onRetry={() => window.location.reload()}
            showErrorDetails={true}
          />
        </AuthCard>
      </AuthLayout>
    );
  }

  // Success state
  if (processingStatus === "success") {
    return (
      <AuthLayout showFloatingBubbles={true}>
        <AuthCard variant="glass" padding="lg">
          <SuccessMessage
            title="Login Berhasil!"
            subtitle="Mengalihkan ke dashboard..."
            showProgress={true}
            progress={progress}
          />
        </AuthCard>
      </AuthLayout>
    );
  }

  // Loading state
  return (
    <AuthLayout showFloatingBubbles={true}>
      <AuthCard variant="glass" padding="lg">
        <LoadingMessage
          title="Memproses Login"
          subtitle={statusMessage}
          showSpinner={true}
          showProgress={false}
          progress={progress}
          steps={processingSteps}
          currentStep={currentStep}
        />
      </AuthCard>
    </AuthLayout>
  );
};

// ========== LOADING FALLBACK ==========
const CallbackLoadingFallback = () => {
  return (
    <AuthLayout showFloatingBubbles={false}>
      <AuthCard variant="glass" padding="lg">
        <LoadingMessage
          title="Memuat"
          subtitle="Menyiapkan proses autentikasi..."
          showSpinner={true}
          showProgress={false}
        />
      </AuthCard>
    </AuthLayout>
  );
};

// ========== MAIN COMPONENT ==========
const AuthCallback = () => {
  return (
    <Suspense fallback={<CallbackLoadingFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
};

export default AuthCallback;
