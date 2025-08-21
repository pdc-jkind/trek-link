// src\app\(auth)\callback\page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

const AuthCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleAuthCallback, isLoading, error } = useAuth();

  useEffect(() => {
    let mounted = true;

    const processCallback = async () => {
      try {
        // Check for error in URL params
        const errorParam = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (errorParam) {
          console.error("OAuth error:", errorParam, errorDescription);
          if (mounted) {
            setTimeout(() => {
              router.replace(
                `/login?error=${encodeURIComponent(
                  errorDescription || errorParam
                )}`
              );
            }, 2000);
          }
          return;
        }

        // Process the callback
        const success = await handleAuthCallback();

        if (!mounted) return;

        // Give some time for state to update and redirect
        setTimeout(() => {
          if (success) {
            // Check if there's a redirect URL
            const redirectTo = searchParams.get("redirect_to") || "/dashboard";
            router.replace(redirectTo);
          } else {
            router.replace("/login?error=Gagal memproses login");
          }
        }, 1500);
      } catch (err: any) {
        console.error("Callback processing error:", err);
        if (mounted) {
          setTimeout(() => {
            router.replace(
              `/login?error=${encodeURIComponent(
                err.message || "Terjadi kesalahan"
              )}`
            );
          }, 2000);
        }
      }
    };

    processCallback();

    return () => {
      mounted = false;
    };
  }, [handleAuthCallback, router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 flex items-center justify-center p-4">
        <div className="bg-white/25 backdrop-blur-md border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-xl">
          {/* Error Icon */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-2xl mx-auto p-1 mb-4 flex items-center justify-center shadow-lg">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Login Gagal</h1>
            <p className="text-red-200 text-sm mb-4">
              Terjadi kesalahan saat memproses login Anda
            </p>
            <p className="text-red-300 text-xs bg-red-900/30 rounded-lg p-3">
              {error}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-white/20 backdrop-blur-sm border border-white/30 py-3 px-6 rounded-xl text-white font-medium hover:bg-white/30 transition-all duration-300 shadow-lg"
            >
              Kembali ke Login
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-transparent border border-white/30 py-2 px-6 rounded-xl text-white/80 text-sm hover:bg-white/10 transition-all duration-300"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white/25 backdrop-blur-md border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-xl">
        <div className="text-center">
          {/* Loading Animation */}
          <div className="w-20 h-20 bg-white/90 backdrop-blur-md rounded-2xl mx-auto p-3 mb-6 flex items-center justify-center shadow-2xl">
            <Image
              src="/img/icon.png"
              alt="Application Icon"
              width={48}
              height={48}
              className="object-contain animate-pulse"
              priority
            />
          </div>

          {/* Loading Spinner */}
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            Memproses Login
          </h1>
          <p className="text-white/80 text-sm">
            Mohon tunggu, kami sedang memverifikasi akun Anda...
          </p>

          {/* Progress dots */}
          <div className="flex justify-center space-x-1 mt-6">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
