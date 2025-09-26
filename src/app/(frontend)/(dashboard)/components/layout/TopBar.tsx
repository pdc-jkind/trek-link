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

// Enhanced PageTitle with gradient
const PageTitle: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => (
  <div className="flex flex-col items-start min-w-0">
    <h1 className="text-lg lg:text-xl font-bold text-gradient truncate">
      {title}
    </h1>
    <p className="text-xs lg:text-sm text-muted-foreground truncate">
      {subtitle}
    </p>
  </div>
);

// Enhanced OfficeToggleSwitch
const OfficeToggleSwitch: React.FC<{
  offices: Office[];
  selectedOffice: Office | null;
  onOfficeSelect: (office: Office) => void;
}> = ({ offices, selectedOffice, onOfficeSelect }) => {
  const toggleOffices = offices.slice(0, 2);
  const currentOffice = selectedOffice || offices[0];

  if (toggleOffices.length < 2) {
    return (
      <div className="px-3 py-1.5 gradient-primary surface rounded-full shadow-sm">
        <span className="text-sm font-semibold text-primary">
          {currentOffice?.name || "Office"}
        </span>
      </div>
    );
  }

  return (
    <div className="relative glass-effect rounded-full p-1 shadow-elevation-1">
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
              ? "text-white shadow-sm"
              : "text-muted-foreground hover:text-primary"
          }`}
          style={{ minWidth: "60px" }}
        >
          {office.name.substring(0, 3).toUpperCase()}
        </button>
      ))}
    </div>
  );
};

// Enhanced NotificationBell
const NotificationBell: React.FC = () => (
  <div className="relative group">
    <button className="relative p-2 rounded-xl gradient-primary surface border border-border hover:border-primary transition-all duration-300 hover:shadow-elevation-2">
      <Bell className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
      <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center shadow-elevation-1 animate-pulse">
        <span className="text-white text-xs font-bold">3</span>
      </div>
    </button>
  </div>
);

// Enhanced UserAvatar
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
      <User className="w-4 h-4 text-white" />
    </div>
  </div>
);

// Enhanced UserDropdown
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
  <div className="absolute right-0 mt-3 w-64 glass-effect rounded-2xl shadow-elevation-3 border border-border py-2 z-50 animate-scale-in overflow-hidden">
    {/* User Info Section */}
    <div className="px-4 py-3 gradient-primary border-b border-border">
      <div className="font-semibold text-foreground text-sm">{userName}</div>
      <div className="text-xs text-muted-foreground font-medium">
        {userRole}
      </div>
      {currentOffice && (
        <div className="text-xs text-primary mt-1.5 flex items-center gap-1.5 bg-primary/10 px-2 py-1 rounded-full w-fit">
          <Building className="w-3 h-3" />
          <span className="font-medium">{currentOffice.name}</span>
        </div>
      )}
    </div>

    {/* Action buttons */}
    <div className="py-1">
      <button
        onClick={onChangePassword}
        className="w-full text-left px-4 py-3 hover:bg-muted transition-all duration-300 flex items-center gap-3 text-foreground group"
      >
        <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center group-hover:bg-accent/30 transition-all duration-300">
          <Lock className="w-4 h-4 text-accent" />
        </div>
        <span className="text-sm font-medium">Ganti Password</span>
      </button>

      <button
        onClick={onShowLogoutModal}
        className="w-full text-left px-4 py-3 transition-all duration-300 flex items-center gap-3 text-destructive hover:bg-destructive/5 group"
      >
        <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center group-hover:bg-destructive/20 transition-all duration-300">
          <LogOut className="w-4 text-destructive" />
        </div>
        <span className="text-sm font-medium">Logout</span>
      </button>
    </div>
  </div>
);

// Enhanced LogoutModal
const LogoutModal: React.FC<{
  onLogout: () => void;
  onHideLogoutModal: () => void;
}> = ({ onLogout, onHideLogoutModal }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50 transition-all duration-300 animate-fade-in">
    <div className="glass-effect rounded-2xl shadow-elevation-3 p-8 w-96 text-center transform transition-all duration-300 scale-100 animate-scale-in border border-border mx-4">
      <div className="mb-6">
        <div className="w-16 h-16 bg-destructive rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-elevation-2">
          <LogOut className="w-8 h-8 text-white" />
        </div>
      </div>
      <h2 className="text-xl font-bold text-foreground mb-3">
        Konfirmasi Logout
      </h2>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        Apakah kamu yakin ingin logout dari sistem?
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onLogout}
          className="bg-destructive hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-elevation-1 hover:shadow-elevation-2 transform hover:scale-105"
        >
          Ya, Logout
        </button>
        <button
          onClick={onHideLogoutModal}
          className="glass-effect border border-border text-foreground font-semibold px-6 py-3 rounded-xl hover:bg-muted transition-all duration-300 transform hover:scale-105"
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
      <header className="sticky top-0 z-30 glass-effect border-b border-border shadow-elevation-1 transition-all duration-300">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Menu & Page Info */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 rounded-xl gradient-primary surface border border-border hover:border-primary transition-all duration-300 hover:shadow-elevation-1"
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
                  className={`flex items-center gap-2 py-2 px-3 rounded-xl gradient-primary surface border border-border hover:border-primary transition-all duration-300 ${
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
