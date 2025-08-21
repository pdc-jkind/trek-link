// src\app\(auth)\login\page.tsx
"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const LoginPage: React.FC = () => {
  const { login, error, clearError, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get error from URL params (from failed auth callback)
  const urlError = searchParams.get("error");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = searchParams.get("redirectTo") || "/dashboard";
      router.replace(redirectTo);
    }
  }, [isAuthenticated, router, searchParams]);

  // Show URL error if exists
  useEffect(() => {
    if (urlError && !error) {
      // Display the URL error briefly
      console.error("URL Error:", urlError);
    }
  }, [urlError, error]);

  const handleGoogleLogin = async () => {
    clearError();
    try {
      await login("google");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleAlternativeLogin = (platform: string) => {
    clearError();
    // For now, show message that these platforms are coming soon
    console.log(`${platform} login akan segera tersedia`);

    // You could show a toast notification here
    alert(`${platform} login akan segera tersedia!`);
  };

  // Don't render if already authenticated
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Mengalihkan ke dashboard...</p>
        </div>
      </div>
    );
  }

  const displayError = error || urlError;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 relative overflow-hidden">
      {/* Background Floating Bubbles - keeping your original design */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large bubbles */}
        <div className="absolute top-4 left-12 w-55 h-55 rounded-full bg-white/5 opacity-80 animate-pulse" />
        <div
          className="absolute bottom-16 right-20 w-96 h-96 rounded-full bg-white/5 opacity-50 animate-pulse"
          style={{ animationDelay: "-3s" }}
        />
        <div
          className="absolute top-1/3 right-8 w-64 h-64 rounded-full bg-white/5 opacity-60 animate-pulse"
          style={{ animationDelay: "-1.5s" }}
        />
        <div
          className="absolute bottom-1/4 left-40 w-60 h-60 rounded-full bg-white/5 opacity-70 animate-pulse"
          style={{ animationDelay: "-4.2s" }}
        />

        {/* Additional smaller bubbles... */}
        <div
          className="absolute top-20 right-1/3 w-48 h-48 rounded-full bg-white/5 opacity-70 animate-pulse"
          style={{ animationDelay: "-2s" }}
        />
        <div
          className="absolute bottom-1/5 left-1/4 w-56 h-56 rounded-full bg-white/5 opacity-60 animate-pulse"
          style={{ animationDelay: "-4s" }}
        />
      </div>

      {/* Error Notification */}
      {displayError && (
        <div className="fixed top-4 right-4 z-50 bg-red-500/90 backdrop-blur-md px-6 py-4 rounded-2xl text-white font-medium transform transition-all duration-300 flex items-center space-x-3 shadow-2xl max-w-md">
          <svg
            className="w-5 h-5 text-red-200 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm">{displayError}</span>
          <button
            onClick={clearError}
            className="ml-2 text-red-200 hover:text-white text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Login Card */}
      <div className="bg-white/25 backdrop-blur-xl border border-white/30 rounded-3xl p-8 w-full max-w-md relative z-10 transform transition-all duration-300 hover:scale-105 hover:bg-white/30 shadow-2xl">
        {/* Logo/Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-2xl mx-auto p-3 flex items-center justify-center shadow-2xl transform transition-all duration-300 hover:scale-110 relative">
            <Image
              src="/img/icon.png"
              alt="Application Icon"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
            Selamat Datang
          </h1>
          <p className="text-white/80 text-sm drop-shadow-md">
            Masuk dengan akun Google Anda untuk melanjutkan
          </p>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className={`w-full py-4 px-6 ${
              isLoading
                ? "bg-white/50 cursor-not-allowed"
                : "bg-white/95 hover:bg-white hover:shadow-3xl hover:-translate-y-1"
            } rounded-2xl font-semibold text-gray-700 flex items-center justify-center space-x-3 group shadow-2xl transition-all duration-300 backdrop-blur-md`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Masuk dengan Google</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full border-t border-white/30 mr-2"></div>
              <span className="px-4 text-white backdrop-blur-sm bg-white/20 rounded-full">
                atau
              </span>
              <div className="w-full border-t border-white/30 ms-2"></div>
            </div>
            <div className="relative flex justify-center text-sm"></div>
          </div>

          {/* Alternative Options */}
          <div className="flex space-x-4">
            <button
              onClick={() => handleAlternativeLogin("TikTok")}
              disabled={isLoading}
              className={`flex-1 ${
                isLoading
                  ? "bg-white/10 cursor-not-allowed"
                  : "bg-white/20 hover:text-white hover:bg-white/30 hover:shadow-xl"
              } backdrop-blur-md border border-white/30 py-3 px-4 rounded-xl text-white/80 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 48 48">
                <path d="M38.0766847,15.8542954 C36.0693906,15.7935177 34.2504839,14.8341149 32.8791434,13.5466056 C32.1316475,12.8317108 31.540171,11.9694126 31.1415066,11.0151329 C30.7426093,10.0603874 30.5453728,9.03391952 30.5619062,8 L24.9731521,8 L24.9731521,28.8295196 C24.9731521,32.3434487 22.8773693,34.4182737 20.2765028,34.4182737 C19.6505623,34.4320127 19.0283477,34.3209362 18.4461858,34.0908659 C17.8640239,33.8612612 17.3337909,33.5175528 16.8862248,33.0797671 C16.4386588,32.6422142 16.0833071,32.1196657 15.8404292,31.5426268 C15.5977841,30.9658208 15.4727358,30.3459348 15.4727358,29.7202272 C15.4727358,29.0940539 15.5977841,28.4746337 15.8404292,27.8978277 C16.0833071,27.3207888 16.4386588,26.7980074 16.8862248,26.3604545 C17.3337909,25.9229017 17.8640239,25.5791933 18.4461858,25.3491229 C19.0283477,25.1192854 19.6505623,25.0084418 20.2765028,25.0219479 C20.7939283,25.0263724 21.3069293,25.1167239 21.794781,25.2902081 L21.794781,19.5985278 C21.2957518,19.4900128 20.7869423,19.436221 20.2765028,19.4380839 C18.2431278,19.4392483 16.2560928,20.0426009 14.5659604,21.1729264 C12.875828,22.303019 11.5587449,23.9090873 10.7814424,25.7878401 C10.003907,27.666593 9.80084889,29.7339663 10.1981162,31.7275214 C10.5953834,33.7217752 11.5748126,35.5530237 13.0129853,36.9904978 C14.4509252,38.4277391 16.2828722,39.4064696 18.277126,39.8028054 C20.2711469,40.1991413 22.3382874,39.9951517 24.2163416,39.2169177 C26.0948616,38.4384508 27.7002312,37.1209021 28.8296253,35.4300711 C29.9592522,33.7397058 30.5619062,31.7522051 30.5619062,29.7188301 L30.5619062,18.8324027 C32.7275484,20.3418321 35.3149087,21.0404263 38.0766847,21.0867664 L38.0766847,15.8542954 Z" />
              </svg>
              <span className="text-sm">TikTok</span>
            </button>
            <button
              onClick={() => handleAlternativeLogin("GitHub")}
              disabled={isLoading}
              className={`flex-1 ${
                isLoading
                  ? "bg-white/10 cursor-not-allowed"
                  : "bg-white/20 hover:text-white hover:bg-white/30 hover:shadow-xl"
              } backdrop-blur-md border border-white/30 py-3 px-4 rounded-xl text-white/80 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-sm">GitHub</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-xs">
            Dengan masuk, Anda menyetujui{" "}
            <Link
              href="/terms"
              className="text-white hover:underline transition-all duration-200"
            >
              Syarat & Ketentuan
            </Link>{" "}
            dan{" "}
            <Link
              href="/privacy"
              className="text-white hover:underline transition-all duration-200"
            >
              Kebijakan Privasi
            </Link>
          </p>
        </div>
      </div>

      {/* Powered by info - Bottom Right with Glassmorphism */}
      <div className="fixed bottom-4 right-4 z-20">
        <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
          <span className="text-white/80 text-sm font-medium">Powered by</span>
          <Image
            src="/img/jkind.png"
            alt="JKind"
            width={80}
            height={32}
            className="object-contain opacity-80 brightness-0 invert"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
