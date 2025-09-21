// // src\app\(auth)\components\ProtectedRoute.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { useAuth } from "@/app/(frontend)/hooks/useAuth";
// import Image from "next/image";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   requiredPermissions?: string[];
//   requiredRole?: string;
//   fallbackUrl?: string;
//   requireFullAuth?: boolean; // Whether to require full user profile loaded
// }

// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
//   children,
//   requiredPermissions = [],
//   requiredRole,
//   fallbackUrl = "/login",
//   requireFullAuth = true, // Default to requiring full auth
// }) => {
//   const {
//     user,
//     userProfile,
//     isLoading,
//     isAuthenticated,
//     isFullyAuthenticated,
//   } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isChecking, setIsChecking] = useState(true);

//   useEffect(() => {
//     const checkAuth = () => {
//       console.log("ProtectedRoute: Checking authentication...", {
//         isLoading,
//         isAuthenticated,
//         isFullyAuthenticated,
//         hasUser: !!user,
//         hasUserProfile: !!userProfile,
//         requireFullAuth,
//       });

//       // Still loading, don't redirect
//       if (isLoading) {
//         return;
//       }

//       // Not authenticated at all
//       if (!isAuthenticated) {
//         console.log(
//           "ProtectedRoute: Not authenticated, redirecting to:",
//           fallbackUrl
//         );
//         const redirectUrl = `${fallbackUrl}?redirectTo=${encodeURIComponent(
//           pathname
//         )}`;
//         router.replace(redirectUrl);
//         return;
//       }

//       // If we require full auth but don't have it yet, wait
//       if (requireFullAuth && !isFullyAuthenticated) {
//         console.log("ProtectedRoute: Waiting for full authentication...");
//         return;
//       }

//       // Check role requirement
//       if (requiredRole && userProfile?.role_name !== requiredRole) {
//         console.log(
//           `ProtectedRoute: Role ${requiredRole} required, user has ${userProfile?.role_name}`
//         );
//         router.replace("/unauthorized");
//         return;
//       }

//       // Check permission requirements
//       if (requiredPermissions.length > 0 && userProfile) {
//         const userPermissions = userProfile.role_permissions || [];
//         const hasAllPermissions = requiredPermissions.every((permission) =>
//           userPermissions.includes(permission)
//         );

//         if (!hasAllPermissions) {
//           console.log("ProtectedRoute: Required permissions not met:", {
//             required: requiredPermissions,
//             userHas: userPermissions,
//           });
//           router.replace("/unauthorized");
//           return;
//         }
//       }

//       // All checks passed
//       setIsChecking(false);
//     };

//     checkAuth();
//   }, [
//     isLoading,
//     isAuthenticated,
//     isFullyAuthenticated,
//     user,
//     userProfile,
//     requiredPermissions,
//     requiredRole,
//     requireFullAuth,
//     router,
//     pathname,
//     fallbackUrl,
//   ]);

//   // Show loading state while checking auth or loading data
//   if (isLoading || isChecking) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 flex items-center justify-center p-4">
//         <div className="bg-white/25 backdrop-blur-md border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-xl">
//           <div className="text-center">
//             {/* Loading Animation */}
//             <div className="w-20 h-20 bg-white/90 backdrop-blur-md rounded-2xl mx-auto p-3 mb-6 flex items-center justify-center shadow-2xl">
//               <Image
//                 src="/img/icon.png"
//                 alt="Application Icon"
//                 width={48}
//                 height={48}
//                 className="object-contain animate-pulse"
//                 priority
//               />
//             </div>

//             {/* Loading Spinner */}
//             <div className="flex justify-center mb-4">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
//             </div>

//             <h1 className="text-2xl font-bold text-white mb-2">
//               {isLoading ? "Memuat..." : "Memeriksa Akses..."}
//             </h1>
//             <p className="text-white/80 text-sm">
//               {isLoading
//                 ? "Memeriksa status autentikasi..."
//                 : "Memverifikasi izin akses..."}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // If we get here, all auth checks have passed
//   return <>{children}</>;
// };

// // Higher-order component version with improved typing
// export const withAuth = <P extends object>(
//   Component: React.ComponentType<P>,
//   options?: {
//     requiredPermissions?: string[];
//     requiredRole?: string;
//     requireFullAuth?: boolean;
//   }
// ) => {
//   const AuthenticatedComponent = (props: P) => (
//     <ProtectedRoute
//       requiredPermissions={options?.requiredPermissions}
//       requiredRole={options?.requiredRole}
//       requireFullAuth={options?.requireFullAuth}
//     >
//       <Component {...props} />
//     </ProtectedRoute>
//   );

//   AuthenticatedComponent.displayName = `withAuth(${
//     Component.displayName || Component.name
//   })`;

//   return AuthenticatedComponent;
// };

// // Utility component for permission-based rendering
// interface ConditionalRenderProps {
//   children: React.ReactNode;
//   permissions?: string[];
//   role?: string;
//   fallback?: React.ReactNode;
// }

// export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
//   children,
//   permissions = [],
//   role,
//   fallback = null,
// }) => {
//   const { userProfile } = useAuth();

//   // Check role
//   if (role && userProfile?.role_name !== role) {
//     return <>{fallback}</>;
//   }

//   // Check permissions
//   if (permissions.length > 0 && userProfile) {
//     const userPermissions = userProfile.role_permissions || [];
//     const hasAllPermissions = permissions.every((permission) =>
//       userPermissions.includes(permission)
//     );

//     if (!hasAllPermissions) {
//       return <>{fallback}</>;
//     }
//   }

//   return <>{children}</>;
// };
