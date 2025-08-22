// src/app/(dashboard)/layout.tsx
"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import TopBar from "@/app/(dashboard)/components/TopBar";
import Sidebar from "@/app/(dashboard)/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";

// Dummy data and types
type SectionKey =
  | "dashboard"
  | "users"
  | "inventory"
  | "orders"
  | "items"
  | "disparity"
  | "settings"
  | "help";

type Office = {
  id: string;
  name: string;
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  // State management (replacing useLayout hook with local state)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState<Office>({
    id: "1",
    name: "Jakarta",
  });
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if we're on desktop
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Dummy data
  const availableOffices: Office[] = [
    { id: "1", name: "Jakarta" },
    { id: "2", name: "Surabaya" },
  ];

  const userData = {
    userName: "John Doe",
    userRole: "admin",
  };

  // URL to SectionKey mapping
  const urlToSectionMap: Record<string, SectionKey> = {
    "/dashboard": "dashboard",
    "/users": "users",
    "/inventory": "inventory",
    "/orders": "orders",
    "/items": "items",
    "/disparity": "disparity",
    "/settings": "settings",
    "/help": "help",
  };

  // Get current section based on URL
  const currentSection = urlToSectionMap[pathname] || "dashboard";

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
  const hideLogoutModal = () => setShowLogoutModal(false);

  const toggleUserDropdown = () => setShowUserDropdown(!showUserDropdown);
  const closeAllDropdowns = () => setShowUserDropdown(false);

  const selectOffice = (office: Office) => setSelectedOffice(office);

  const handleLogout = async () => {
    try {
      await logout();
      hideLogoutModal();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Optionally show error message to user
    }
  };

  // Handler for navigation from sidebar
  const handleSectionChange = (section: SectionKey) => {
    const sectionToUrlMap: Record<SectionKey, string> = {
      dashboard: "/dashboard",
      users: "/users",
      inventory: "/inventory",
      orders: "/orders",
      items: "/items",
      disparity: "/disparity",
      settings: "/settings",
      help: "/help",
    };

    const url = sectionToUrlMap[section] || "/dashboard";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="flex min-h-screen relative">
        {/* Fixed Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          activeSection={currentSection}
          userRole={userData.userRole}
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
          {/* Fixed TopBar */}
          <TopBar
            currentSection={currentSection}
            userName={userData.userName}
            userRole={userData.userRole}
            offices={availableOffices}
            selectedOffice={selectedOffice}
            showUserDropdown={showUserDropdown}
            showLogoutModal={showLogoutModal}
            onMenuToggle={toggleSidebar}
            onLogout={handleLogout}
            onChangePassword={openChangePasswordModal}
            onShowLogoutModal={openLogoutModal}
            onHideLogoutModal={hideLogoutModal}
            onToggleUserDropdown={toggleUserDropdown}
            onCloseAllDropdowns={closeAllDropdowns}
            onOfficeSelect={selectOffice}
          />

          {/* Scrollable Main Content */}
          <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 min-h-0">
            <div className="transition-all duration-500 ease-in-out max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-96 text-center transform transition-all duration-300 mx-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Ganti Password
            </h2>
            <p className="text-gray-600 mb-6">
              Fitur ganti password akan segera tersedia.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={hideChangePasswordModal}
                className="bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
