// src/app/(auth)/components/AuthMessages.tsx
"use client";

import React from "react";
import { AuthIcon, LoadingDots, LoadingSpinner, ProgressBar } from "./AuthUI";

// ========== SUCCESS MESSAGE ==========
interface SuccessMessageProps {
  title: string;
  subtitle: string;
  showProgress?: boolean;
  progress?: number;
  icon?: boolean;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title,
  subtitle,
  showProgress = true,
  progress,
  icon = true,
}) => {
  return (
    <div className="text-center">
      {icon && <AuthIcon type="success" size="lg" />}

      <h1 className="text-2xl font-bold text-white mb-2 mt-6">{title}</h1>
      <p className="text-white/80 text-sm">{subtitle}</p>

      {showProgress && !progress && <LoadingDots />}
      {progress !== undefined && (
        <div className="mt-4">
          <ProgressBar progress={progress} showPercentage />
        </div>
      )}
    </div>
  );
};

// ========== ERROR MESSAGE ==========
interface ErrorMessageProps {
  title: string;
  subtitle: string;
  error: string;
  onRetry?: () => void;
  onBackToLogin?: () => void;
  retryText?: string;
  backText?: string;
  showErrorDetails?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  subtitle,
  error,
  onRetry,
  onBackToLogin,
  retryText = "Coba Lagi",
  backText = "Kembali ke Login",
  showErrorDetails = true,
}) => {
  return (
    <>
      <div className="text-center mb-6">
        <AuthIcon type="error" size="lg" />

        <h1 className="text-2xl font-bold text-white mb-2 mt-6">{title}</h1>
        <p className="text-red-200 text-sm mb-4">{subtitle}</p>

        {showErrorDetails && (
          <div className="text-red-300 text-xs bg-red-900/30 rounded-lg p-3 border border-red-800/30">
            <p className="font-mono break-words">{error}</p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {onBackToLogin && (
          <button
            onClick={onBackToLogin}
            className="w-full bg-white/20 backdrop-blur-sm border border-white/30 py-3 px-6 rounded-xl text-white font-medium hover:bg-white/30 transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
          >
            {backText}
          </button>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full bg-transparent border border-white/30 py-2 px-6 rounded-xl text-white/80 text-sm hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {retryText}
          </button>
        )}
      </div>
    </>
  );
};

// ========== LOADING MESSAGE ==========
interface LoadingMessageProps {
  title: string;
  subtitle: string;
  showSpinner?: boolean;
  showProgress?: boolean;
  progress?: number;
  steps?: string[];
  currentStep?: number;
}

export const LoadingMessage: React.FC<LoadingMessageProps> = ({
  title,
  subtitle,
  showSpinner = true,
  showProgress = true,
  progress,
  steps = [],
  currentStep = 0,
}) => {
  return (
    <div className="text-center">
      <AuthIcon type="loading" size="lg" />

      {showSpinner && (
        <div className="flex justify-center mb-4 mt-6">
          <LoadingSpinner />
        </div>
      )}

      <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
      <p className="text-white/80 text-sm">{subtitle}</p>

      {/* Steps indicator */}
      {steps.length > 0 && (
        <div className="mt-6">
          <div className="text-left space-y-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 text-sm transition-all duration-300 ${
                  index <= currentStep ? "text-white" : "text-white/40"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index < currentStep
                      ? "bg-green-400"
                      : index === currentStep
                      ? "bg-white animate-pulse"
                      : "bg-white/20"
                  }`}
                />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress indicators */}
      {progress !== undefined ? (
        <div className="mt-4">
          <ProgressBar progress={progress} showPercentage />
        </div>
      ) : showProgress ? (
        <LoadingDots />
      ) : null}
    </div>
  );
};

// ========== WELCOME MESSAGE ==========
interface WelcomeMessageProps {
  title: string;
  subtitle: string;
  description?: string;
  showLogo?: boolean;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  title,
  subtitle,
  description,
  showLogo = true,
}) => {
  return (
    <div className="text-center mb-8">
      {showLogo && <AuthIcon type="logo" size="md" animated={true} />}

      <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg mt-4">
        {title}
      </h1>
      <p className="text-white/80 text-sm drop-shadow-md mb-2">{subtitle}</p>
      {description && <p className="text-white/60 text-xs">{description}</p>}
    </div>
  );
};
