// src\app\(frontend)\components\layout\DashboardLayout.tsx
"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";

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

  const openChangePasswordModal = () => setShowChangePasswordModal(true);
  const hideChangePasswordModal = () => setShowChangePasswordModal(false);
  const openLogoutModal = () => setShowLogoutModal(true);
  const hideLogoutModal = () => setShowLogoutModal(false);

  const toggleUserDropdown = () => setShowUserDropdown(!showUserDropdown);
  const closeAllDropdowns = () => setShowUserDropdown(false);

  const selectOffice = (office: Office) => setSelectedOffice(office);

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logout clicked");
    hideLogoutModal();
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
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="flex min-h-screen relative z-10">
        <Sidebar
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          activeSection={currentSection}
          userRole={userData.userRole}
          onClose={closeSidebar}
          onSectionChange={handleSectionChange}
          onToggleCollapse={toggleSidebarCollapse}
        />

        <div
          className="flex-1 flex flex-col transition-all duration-300"
          style={{
            marginLeft: sidebarCollapsed
              ? typeof window !== "undefined" && window.innerWidth >= 1024
                ? "5rem"
                : "0"
              : typeof window !== "undefined" && window.innerWidth >= 1024
              ? "16rem"
              : "0",
          }}
        >
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

          <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
            <div className="transition-all duration-500 ease-in-out">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-96 text-center transform transition-all duration-300">
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
