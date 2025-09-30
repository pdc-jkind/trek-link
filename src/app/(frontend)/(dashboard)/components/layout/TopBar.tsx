// src\app\(dashboard)\components\TopBar.tsx
"use client";

import { Menu, LogOut, User, Building, Lock, Bell } from "lucide-react";
import {
  SectionKey,
  MenuConfigUtils,
  UserRole,
} from "@/app/(frontend)/(dashboard)/types/menuConfig";

type Office = {
  id: string;
  name: string;
};

export interface TopBarProps {
  currentSection: SectionKey;
  userName: string;
  userRole: UserRole;
  userImage?: string;
  offices: Office[];
  selectedOffice: Office | null;
  showLogoutModal: boolean;
  showUserDropdown: boolean;
  isLoggingOut?: boolean;
  onMenuToggle: () => void;
  onLogout: () => void;
  onChangePassword: () => void;
  onShowLogoutModal: () => void;
  onHideLogoutModal: () => void;
  onToggleUserDropdown: () => void;
  onCloseAllDropdowns: () => void;
  onOfficeSelect: (office: Office) => void;
}

// Enhanced PageTitle with new color system
const PageTitle: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => (
  <div className="flex flex-col items-start min-w-0">
    <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent truncate">
      {title}
    </h1>
    <p className="text-xs lg:text-sm text-surface-variant-foreground truncate">
      {subtitle}
    </p>
  </div>
);

// Enhanced OfficeToggleSwitch with new color system
const OfficeToggleSwitch: React.FC<{
  offices: Office[];
  selectedOffice: Office | null;
  onOfficeSelect: (office: Office) => void;
}> = ({ offices, selectedOffice, onOfficeSelect }) => {
  const toggleOffices = offices.slice(0, 2);
  const currentOffice = selectedOffice || offices[0];

  if (toggleOffices.length < 2) {
    return (
      <div className="px-3 py-1.5 bg-primary-container rounded-full shadow-sm">
        <span className="text-sm font-semibold text-primary-container-foreground">
          {currentOffice?.name || "Office"}
        </span>
      </div>
    );
  }

  return (
    <div className="relative bg-surface-variant rounded-full p-1 shadow-elevation-1 border border-outline">
      {/* Sliding background */}
      <div
        className="absolute top-1 bottom-1 bg-primary rounded-full shadow-elevation-2 transition-all duration-300 ease-out"
        style={{
          left: selectedOffice?.id === toggleOffices[0].id ? "4px" : "50%",
          right: selectedOffice?.id === toggleOffices[0].id ? "50%" : "4px",
        }}
      />

      {/* Toggle buttons */}
      {toggleOffices.map((office) => (
        <button
          key={office.id}
          onClick={() => onOfficeSelect(office)}
          className={`relative z-10 px-3 py-1.5 text-sm font-semibold transition-all duration-300 rounded-full ${
            selectedOffice?.id === office.id
              ? "text-primary-foreground"
              : "text-surface-variant-foreground hover:text-primary"
          }`}
          style={{ minWidth: "60px" }}
        >
          {office.name.substring(0, 3).toUpperCase()}
        </button>
      ))}
    </div>
  );
};

// Enhanced NotificationBell with new color system
const NotificationBell: React.FC = () => (
  <div className="relative group">
    <button className="relative p-2 rounded-xl bg-surface-variant border border-outline hover:border-primary transition-all duration-300 hover:shadow-elevation-2">
      <Bell className="w-4 h-4 text-surface-variant-foreground group-hover:text-primary transition-colors duration-300" />
      <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center shadow-elevation-1 animate-pulse">
        <span className="text-secondary-foreground text-xs font-bold">3</span>
      </div>
    </button>
  </div>
);

// Enhanced UserAvatar with new color system
const UserAvatar: React.FC<{ userName: string; userImage?: string }> = ({
  userName,
  userImage,
}) => (
  <div className="w-8 h-8 rounded-xl overflow-hidden shadow-elevation-1 ring-2 ring-primary/30 hover:ring-primary transition-all duration-300">
    {userImage ? (
      <img
        src={userImage}
        alt={userName}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
          if (nextElement) {
            nextElement.style.display = "flex";
          }
        }}
      />
    ) : null}
    <div
      className={`w-full h-full bg-primary flex items-center justify-center ${
        userImage ? "hidden" : ""
      }`}
    >
      <User className="w-4 h-4 text-primary-foreground" />
    </div>
  </div>
);

// Enhanced UserDropdown with new color system
const UserDropdown: React.FC<{
  userName: string;
  userRole: UserRole;
  currentOffice: Office | null;
  onChangePassword: () => void;
  onShowLogoutModal: () => void;
}> = ({
  userName,
  userRole,
  currentOffice,
  onChangePassword,
  onShowLogoutModal,
}) => (
  <div className="absolute right-0 mt-3 w-64 bg-surface rounded-2xl shadow-elevation-3 border border-outline py-2 z-50 animate-scale-in overflow-hidden">
    {/* User Info Section */}
    <div className="px-4 py-3 bg-gradient-to-br from-primary-container/40 to-tertiary-container/30 border-b border-outline">
      <div className="font-semibold text-surface-foreground text-sm">
        {userName}
      </div>
      <div className="text-xs text-surface-variant-foreground font-medium">
        {userRole}
      </div>
      {currentOffice && (
        <div className="text-xs text-primary-container-foreground mt-1.5 flex items-center gap-1.5 bg-primary-container px-2 py-1 rounded-full w-fit">
          <Building className="w-3 h-3" />
          <span className="font-medium">{currentOffice.name}</span>
        </div>
      )}
    </div>

    {/* Action buttons */}
    <div className="py-1">
      <button
        onClick={onChangePassword}
        className="w-full text-left px-4 py-3 hover:bg-surface-variant transition-all duration-300 flex items-center gap-3 text-surface-foreground group"
      >
        <div className="w-8 h-8 bg-tertiary-container rounded-lg flex items-center justify-center group-hover:bg-tertiary transition-all duration-300">
          <Lock className="w-4 h-4 text-tertiary-container-foreground group-hover:text-tertiary-foreground transition-colors duration-300" />
        </div>
        <span className="text-sm font-medium">Ganti Password</span>
      </button>

      <button
        onClick={onShowLogoutModal}
        className="w-full text-left px-4 py-3 transition-all duration-300 flex items-center gap-3 text-error hover:bg-error-container/50 group"
      >
        <div className="w-8 h-8 bg-error-container rounded-lg flex items-center justify-center group-hover:bg-error transition-all duration-300">
          <LogOut className="w-4 text-error-container-foreground group-hover:text-error-foreground transition-colors duration-300" />
        </div>
        <span className="text-sm font-medium">Logout</span>
      </button>
    </div>
  </div>
);

// Enhanced LogoutModal with new color system
const LogoutModal: React.FC<{
  onLogout: () => void;
  onHideLogoutModal: () => void;
}> = ({ onLogout, onHideLogoutModal }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-md z-50 transition-all duration-300 animate-fade-in">
    <div className="bg-surface rounded-2xl shadow-elevation-3 p-8 w-96 text-center transform transition-all duration-300 scale-100 animate-scale-in border border-outline mx-4">
      <div className="mb-6">
        <div className="w-16 h-16 bg-error rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-elevation-2">
          <LogOut className="w-8 h-8 text-error-foreground" />
        </div>
      </div>
      <h2 className="text-xl font-bold text-surface-foreground mb-3">
        Konfirmasi Logout
      </h2>
      <p className="text-surface-variant-foreground mb-8 leading-relaxed">
        Apakah kamu yakin ingin logout dari sistem?
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onLogout}
          className="bg-error hover:opacity-90 text-error-foreground font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-elevation-1 hover:shadow-elevation-2 transform hover:scale-105"
        >
          Ya, Logout
        </button>
        <button
          onClick={onHideLogoutModal}
          className="bg-surface-variant border border-outline text-surface-foreground font-semibold px-6 py-3 rounded-xl hover:bg-surface transition-all duration-300 transform hover:scale-105"
        >
          Batal
        </button>
      </div>
    </div>
  </div>
);

const TopBar: React.FC<TopBarProps> = ({
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
}) => {
  const currentTitle = MenuConfigUtils.getSectionTitleInfo(currentSection);
  const currentOffice = selectedOffice || offices[0];

  return (
    <>
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-xl border-b border-outline shadow-elevation-1 transition-all duration-300">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Menu & Page Info */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 rounded-xl bg-surface-variant border border-outline hover:border-primary transition-all duration-300 hover:shadow-elevation-1"
              >
                <Menu className="w-5 h-5 text-primary" />
              </button>

              <PageTitle
                title={currentTitle.title}
                subtitle={currentTitle.subtitle}
              />
            </div>

            {/* Right Side - Controls & User */}
            <div className="flex items-center space-x-4">
              {/* Office Toggle Switch */}
              <div className="hidden sm:block">
                <OfficeToggleSwitch
                  offices={offices}
                  selectedOffice={selectedOffice}
                  onOfficeSelect={onOfficeSelect}
                />
              </div>

              {/* Notification Bell */}
              <NotificationBell />

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={onToggleUserDropdown}
                  disabled={isLoggingOut}
                  className={`flex items-center gap-2 py-2 px-3 rounded-xl bg-surface-variant border border-outline hover:border-primary transition-all duration-300 ${
                    isLoggingOut
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-elevation-2 transform hover:scale-105"
                  }`}
                >
                  <UserAvatar userName={userName} userImage={userImage} />
                </button>

                {showUserDropdown && !isLoggingOut && (
                  <UserDropdown
                    userName={userName}
                    userRole={userRole}
                    currentOffice={currentOffice}
                    onChangePassword={onChangePassword}
                    onShowLogoutModal={onShowLogoutModal}
                  />
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

      {/* Logout Modal */}
      {showLogoutModal && (
        <LogoutModal
          onLogout={onLogout}
          onHideLogoutModal={onHideLogoutModal}
        />
      )}
    </>
  );
};

export default TopBar;
