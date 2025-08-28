// src/app/(dashboard)/layout.tsx
"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import TopBar from "@/app/(dashboard)/components/TopBar";
import Sidebar from "@/app/(dashboard)/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardInit } from "@/app/(dashboard)/hooks/useDashboardInit";
import {
  SectionKey,
  MenuConfigUtils,
  UserRole,
} from "@/app/(dashboard)/types/menuConfig";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  // Initialize dashboard data from session
  const {
    isInitializing,
    isReady,
    error: dashboardError,
    user,
    currentUser, // Get raw current user object for image access
    availableOffices,
    selectedOffice,
    switchOffice,
    hasPermission,
    clearError,
    retry,
    redirectToLogin,
  } = useDashboardInit();

  // State management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Add logout loading state
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check if we're on desktop
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Get current section based on URL using MenuConfigUtils
  const currentSection = MenuConfigUtils.getSectionFromUrl(pathname);

  // Event handlers
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebarCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

  const openChangePasswordModal = () => {
    setShowChangePasswordModal(true);
    setShowUserDropdown(false);
  };
  const hideChangePasswordModal = () => setShowChangePasswordModal(false);

  const openLogoutModal = () => {
    setShowLogoutModal(true);
    setShowUserDropdown(false);
  };

  const hideLogoutModal = () => {
    if (!isLoggingOut) {
      setShowLogoutModal(false);
    }
  };

  const toggleUserDropdown = () => setShowUserDropdown(!showUserDropdown);
  const closeAllDropdowns = () => setShowUserDropdown(false);

  // Handle office selection
  const handleOfficeSelect = (office: { id: string; name: string }) => {
    switchOffice(office.id);
  };

  // Enhanced logout handler with loading state
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Add a small delay to show the loading state
      await new Promise((resolve) => setTimeout(resolve, 800));

      await logout();

      // Close modal and redirect
      setShowLogoutModal(false);
      setIsLoggingOut(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);

      // Show error to user (you can enhance this with a toast notification)
      alert("Terjadi kesalahan saat logout. Silakan coba lagi.");
    }
  };

  // Handler for navigation from sidebar using MenuConfigUtils
  const handleSectionChange = (section: SectionKey) => {
    // Map role_name to UserRole type for compatibility
    const userRole = (user?.role.name as UserRole) || "user";

    // Validate user has access to this section
    if (!MenuConfigUtils.validateSectionAccess(section, userRole)) {
      console.warn(
        `User ${userRole} does not have access to section: ${section}`
      );
      return;
    }

    const url = MenuConfigUtils.getUrlFromSection(section);
    router.push(url);

    // Close sidebar on mobile after navigation
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  };

  // Calculate main content margin based on sidebar state
  const getMainContentMargin = () => {
    if (!isDesktop) return "0"; // No margin on mobile

    if (sidebarCollapsed) {
      return "4.5rem"; // 72px for collapsed sidebar (reduced by 10%)
    } else {
      return "14.4rem"; // 230px for expanded sidebar (reduced by 10%)
    }
  };

  // Show loading screen while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error screen if dashboard initialization failed
  if (dashboardError && !isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 mb-6">{dashboardError}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={retry}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Coba Lagi
            </button>
            <button
              onClick={redirectToLogin}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not ready or no user data
  if (!isReady || !user || !selectedOffice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-gray-400">
            Mempersiapkan dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="flex min-h-screen relative">
        {/* Fixed Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          activeSection={currentSection}
          userRole={user.role.name as UserRole}
          onClose={closeSidebar}
          onSectionChange={handleSectionChange}
          onToggleCollapse={toggleSidebarCollapse}
        />

        {/* Main Content Area with fixed TopBar */}
        <div
          className="flex-1 flex flex-col min-h-screen transition-all duration-300"
          style={{
            marginLeft: getMainContentMargin(),
          }}
        >
          {/* Fixed TopBar with enhanced props */}
          <TopBar
            currentSection={currentSection}
            userName={user.name}
            userRole={user.role.name as UserRole}
            userImage={undefined}
            offices={availableOffices}
            selectedOffice={selectedOffice}
            showUserDropdown={showUserDropdown}
            showLogoutModal={showLogoutModal}
            isLoggingOut={isLoggingOut}
            onMenuToggle={toggleSidebar}
            onLogout={handleLogout}
            onChangePassword={openChangePasswordModal}
            onShowLogoutModal={openLogoutModal}
            onHideLogoutModal={hideLogoutModal}
            onToggleUserDropdown={toggleUserDropdown}
            onCloseAllDropdowns={closeAllDropdowns}
            onOfficeSelect={handleOfficeSelect}
          />

          {/* Scrollable Main Content */}
          <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 min-h-0">
            <div className="transition-all duration-500 ease-in-out max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Enhanced Change Password Modal with blur background */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-in fade-in duration-200">
          {/* Blur Background Overlay */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={hideChangePasswordModal}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl p-6 w-96 max-w-sm mx-4 transform animate-in zoom-in-95 duration-200">
            <div className="text-center">
              {/* Modal Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Ganti Password
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Fitur ganti password akan segera tersedia.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={hideChangePasswordModal}
                  className="bg-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-lg hover:bg-gray-300 hover:shadow-lg transition-all duration-200 active:scale-95"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Error Toast - Show errors that don't block the dashboard */}
      {dashboardError && isReady && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-white border-l-4 border-red-400 rounded-lg shadow-lg overflow-hidden max-w-sm">
            <div className="p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-red-800">Peringatan</p>
                  <p className="text-sm text-red-700 mt-1">{dashboardError}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    onClick={clearError}
                    className="inline-flex text-red-400 hover:text-red-600 focus:outline-none transition-colors duration-200"
                  >
                    <span className="sr-only">Tutup</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
