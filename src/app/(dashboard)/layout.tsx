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

      {/* Enhanced Change Password Modal with transparent blur background */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 transition-all duration-300">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-6 w-96 text-center transform transition-all duration-300 mx-4 border border-white/20">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Ganti Password
            </h2>
            <p className="text-gray-600 mb-6">
              Fitur ganti password akan segera tersedia.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={hideChangePasswordModal}
                className="bg-white/80 backdrop-blur-sm text-gray-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-white/90 border border-gray-200 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Error Toast with blur effect */}
      {dashboardError && isReady && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-100/90 backdrop-blur-md border text-red-700 px-4 py-3 rounded-xl shadow-2xl max-w-sm border-white/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">Peringatan</p>
                <p className="text-sm">{dashboardError}</p>
              </div>
              <button
                onClick={clearError}
                className="ml-2 text-red-400 hover:text-red-600 transform hover:scale-110 transition-all duration-300"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
