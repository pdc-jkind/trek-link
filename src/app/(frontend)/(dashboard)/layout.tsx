// src/app/(frontend)/(dashboard)/layout.tsx
"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import TopBar from "@/app/(frontend)/(dashboard)/components/layout/TopBar";
import Sidebar from "@/app/(frontend)/(dashboard)/components/layout/Sidebar";
import { useAuth } from "@/app/(frontend)/(auth)/useAuth";
import { useDashboardInit } from "@/app/(frontend)/(dashboard)/dashboard/useDashboardInit";
import {
  SectionKey,
  MenuConfigUtils,
  UserRole,
} from "@/app/(frontend)/(dashboard)/types/menuConfig";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Separate component for dashboard content to ensure theme initialization
const DashboardContent: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  // Initialize dashboard data from session
  const {
    isInitializing,
    isReady,
    error: dashboardError,
    user,
    availableOffices,
    selectedOffice,
    switchOffice,
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
      <div className="min-h-screen bg-background flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-surface-variant-foreground">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error screen if dashboard initialization failed
  if (dashboardError && !isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center transition-colors duration-200">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-error text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-surface-variant-foreground mb-6">
            {dashboardError}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={retry}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-all shadow-elevation-1 hover:shadow-elevation-2"
            >
              Coba Lagi
            </button>
            <button
              onClick={redirectToLogin}
              className="bg-surface-variant text-surface-variant-foreground px-6 py-2 rounded-lg hover:bg-surface transition-all border border-outline"
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
      <div className="min-h-screen bg-background flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <div className="animate-pulse text-surface-variant-foreground">
            Mempersiapkan dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
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
          <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-gradient-to-br from-background to-primary-container/20 min-h-0 transition-colors duration-200">
            <div className="transition-all duration-500 ease-in-out max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Enhanced Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-md z-50 transition-all duration-300">
          <div className="bg-surface backdrop-blur-md rounded-xl shadow-elevation-3 p-6 w-96 text-center transform transition-all duration-300 mx-4 border border-outline">
            <h2 className="text-lg font-semibold text-surface-foreground mb-4">
              Ganti Password
            </h2>
            <p className="text-surface-variant-foreground mb-6">
              Fitur ganti password akan segera tersedia.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={hideChangePasswordModal}
                className="bg-surface-variant text-surface-foreground font-semibold px-6 py-2.5 rounded-lg hover:bg-surface-variant/80 border border-outline transform hover:scale-105 transition-all duration-300 shadow-elevation-1"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Error Toast */}
      {dashboardError && isReady && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-error-container backdrop-blur-md border border-outline text-error-container-foreground px-4 py-3 rounded-xl shadow-elevation-3 max-w-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">Peringatan</p>
                <p className="text-sm">{dashboardError}</p>
              </div>
              <button
                onClick={clearError}
                className="ml-2 text-error hover:text-error/80 transform hover:scale-110 transition-all duration-300"
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

// Main layout wrapper with ThemeInitializer
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return <DashboardContent>{children}</DashboardContent>;
};

export default DashboardLayout;
