// src/components/auth/ProtectedRoute.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallbackUrl?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackUrl = "/login",
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace(fallbackUrl);
        return;
      }

      if (requiredRole && user?.role !== requiredRole) {
        router.replace("/unauthorized");
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, router, fallbackUrl]);

  if (isLoading) {
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

            <h1 className="text-2xl font-bold text-white mb-2">Memuat...</h1>
            <p className="text-white/80 text-sm">
              Memeriksa status autentikasi...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Router will redirect
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null; // Router will redirect
  }

  return <>{children}</>;
};

// Higher-order component version
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: string
) => {
  const AuthenticatedComponent = (props: P) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  );

  AuthenticatedComponent.displayName = `withAuth(${
    Component.displayName || Component.name
  })`;

  return AuthenticatedComponent;
};
