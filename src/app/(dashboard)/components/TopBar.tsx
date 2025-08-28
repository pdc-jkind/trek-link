// src\app\(dashboard)\components\TopBar.tsx
"use client";

import {
  Menu,
  LogOut,
  User,
  Building,
  Lock,
  Bell,
  Loader2,
} from "lucide-react";
import {
  SectionKey,
  MenuConfigUtils,
  UserRole,
} from "@/app/(dashboard)/types/menuConfig";

type Office = {
  id: string;
  name: string;
};

export interface TopBarProps {
  // Section info
  currentSection: SectionKey;

  // User data
  userName: string;
  userRole: UserRole;
  userImage?: string; // Add optional user image prop

  // Office data
  offices: Office[];
  selectedOffice: Office | null;

  // Modal states
  showLogoutModal: boolean;
  showUserDropdown: boolean;
  isLoggingOut?: boolean; // Add loading state for logout

  // Event handlers
  onMenuToggle: () => void;
  onLogout: () => void;
  onChangePassword: () => void;
  onShowLogoutModal: () => void;
  onHideLogoutModal: () => void;
  onToggleUserDropdown: () => void;
  onCloseAllDropdowns: () => void;
  onOfficeSelect: (office: Office) => void;
}

const TopBar = ({
  currentSection,
  userName,
  userRole,
  userImage,
  offices,
  selectedOffice,
  showLogoutModal,
  showUserDropdown,
  isLoggingOut = false,
  onMenuToggle,
  onLogout,
  onChangePassword,
  onShowLogoutModal,
  onHideLogoutModal,
  onToggleUserDropdown,
  onCloseAllDropdowns,
  onOfficeSelect,
}: TopBarProps) => {
  // Get current title info from menu config
  const currentTitle = MenuConfigUtils.getSectionTitleInfo(currentSection);
  const currentOffice = selectedOffice || offices[0];

  // Office Toggle Switch Component - reduced sizes
  const OfficeToggleSwitch = () => {
    // Ensure we have exactly 2 offices for toggle
    const toggleOffices = offices.slice(0, 2);

    if (toggleOffices.length < 2) {
      // Fallback for single office - just show the name
      return (
        <span className="text-sm font-medium text-gray-600">
          {currentOffice?.name || "Office"}
        </span>
      );
    }

    return (
      <>
        {/* Toggle Switch - reduced padding and sizes */}
        <div className="relative bg-gray-100 rounded-full p-0.5 border border-gray-200 shadow-sm">
          {/* Sliding Background */}
          <div
            className="absolute top-0.5 bottom-0.5 bg-white rounded-full shadow-sm transition-all duration-200 border border-gray-200"
            style={{
              left: selectedOffice?.id === toggleOffices[0].id ? "2px" : "50%",
              right: selectedOffice?.id === toggleOffices[0].id ? "50%" : "2px",
            }}
          />

          {/* Toggle Buttons - reduced padding */}
          {toggleOffices.map((office) => (
            <button
              key={office.id}
              onClick={() => onOfficeSelect(office)}
              className={`relative z-10 px-2.5 py-1 text-sm font-medium transition-all duration-200 ${
                selectedOffice?.id === office.id
                  ? "text-purple-700"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              style={{ minWidth: "54px" }}
            >
              {/* Use office code if available, otherwise first 3 chars of name */}
              {office.name.substring(0, 3).toUpperCase()}
            </button>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white bg-opacity-80 backdrop-blur-lg border-b border-white border-opacity-30 shadow-sm transition-all duration-300">
        <div className="px-3 lg:px-5 py-3">
          <div className="flex items-center justify-between">
            {/* Left Side - Menu & Page Info - reduced spacing */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-1.5 rounded-md text-gray-800 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Page Title - reduced font sizes */}
              <div className="flex flex-col items-start min-w-0">
                <h1 className="text-lg lg:text-xl font-bold text-gray-800 truncate">
                  {currentTitle.title}
                </h1>
                <p className="text-sm text-gray-600 truncate">
                  {currentTitle.subtitle}
                </p>
              </div>
            </div>

            {/* Right Side - Office Toggle, Notifications & User - reduced spacing */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* Office Toggle Switch */}
              <div className="hidden sm:block">
                <OfficeToggleSwitch />
              </div>

              {/* Notification Bell - reduced size */}
              <div className="relative">
                <button className="p-1.5 rounded-lg text-gray-600 hover:text-gray-800 bg-white/40 hover:bg-white/70 shadow-sm hover:shadow-md transition-all duration-300 relative">
                  <Bell className="w-4 h-4" />
                  {/* Notification Badge - reduced size */}
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-mono">3</span>
                  </span>
                </button>
              </div>

              {/* User Profile Dropdown - reduced sizes */}
              <div className="relative">
                <button
                  onClick={onToggleUserDropdown}
                  disabled={isLoggingOut}
                  className={`flex items-center gap-2 bg-white/40 hover:bg-white/70 text-gray-600 hover:text-gray-800 font-medium py-1.5 px-2.5 lg:px-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ${
                    isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="w-5 lg:w-7 h-5 lg:h-7 rounded-full overflow-hidden flex items-center justify-center">
                    {userImage ? (
                      <img
                        src={userImage}
                        alt={userName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to gradient background with User icon if image fails to load
                          e.currentTarget.style.display = "none";
                          const nextElement = e.currentTarget
                            .nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center ${
                        userImage ? "hidden" : ""
                      }`}
                    >
                      <User className="w-3 lg:w-4 h-3 lg:h-4 text-white" />
                    </div>
                  </div>
                </button>

                {/* User Dropdown - reduced sizes */}
                {showUserDropdown && !isLoggingOut && (
                  <div className="absolute right-0 mt-2 w-50 bg-white rounded-lg shadow-xl border border-gray-200 py-1.5 z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2.5 border-b border-gray-100">
                      <div className="font-medium text-gray-900 text-sm">
                        {userName}
                      </div>
                      <div className="text-sm text-gray-500">{userRole}</div>
                      {/* Current Office Context in Dropdown */}
                      {currentOffice && (
                        <div className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {currentOffice.name}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={onChangePassword}
                      className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2.5 text-gray-700"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span className="text-sm">Ganti Password</span>
                    </button>

                    <button
                      onClick={onShowLogoutModal}
                      className="w-full text-left px-3 py-2.5 transition-colors flex items-center gap-2.5 text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Click outside handlers */}
      {showUserDropdown && !isLoggingOut && (
        <div className="fixed inset-0 z-20" onClick={onCloseAllDropdowns} />
      )}

      {/* Enhanced Logout Modal with blur background and loading animation */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-in fade-in duration-200">
          {/* Blur Background Overlay */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={isLoggingOut ? undefined : onHideLogoutModal}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl p-6 w-80 max-w-sm mx-4 transform animate-in zoom-in-95 duration-200">
            <div className="text-center">
              {/* Modal Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-100 mb-4">
                {isLoggingOut ? (
                  <Loader2 className="h-6 w-6 text-rose-600 animate-spin" />
                ) : (
                  <LogOut className="h-6 w-6 text-rose-600" />
                )}
              </div>

              {/* Modal Title */}
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {isLoggingOut ? "Sedang Logout..." : "Konfirmasi Logout"}
              </h2>

              {/* Modal Message */}
              <p className="text-sm text-gray-600 mb-6">
                {isLoggingOut
                  ? "Mohon tunggu, sedang memproses logout Anda."
                  : "Apakah Anda yakin ingin keluar dari sistem?"}
              </p>

              {/* Modal Actions */}
              <div className="flex justify-center gap-3">
                <button
                  onClick={onLogout}
                  disabled={isLoggingOut}
                  className={`
                    flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
                    ${
                      isLoggingOut
                        ? "bg-rose-400 text-white cursor-not-allowed"
                        : "bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg active:scale-95"
                    }
                  `}
                >
                  {isLoggingOut && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoggingOut ? "Memproses..." : "Ya, Logout"}
                </button>

                <button
                  onClick={onHideLogoutModal}
                  disabled={isLoggingOut}
                  className={`
                    px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
                    ${
                      isLoggingOut
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-lg active:scale-95"
                    }
                  `}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;
