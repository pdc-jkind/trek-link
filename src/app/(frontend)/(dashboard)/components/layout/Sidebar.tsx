// src\app\(dashboard)\components\Sidebar.tsx
"use client";

import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import {
  SectionKey,
  MenuConfigUtils,
  MenuItemConfig,
  UserRole,
} from "@/app/(frontend)/(dashboard)/types/menuConfig";

export interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  activeSection: SectionKey;
  userRole: UserRole;
  onClose: () => void;
  onSectionChange: (section: SectionKey) => void;
  onToggleCollapse: () => void;
}

// Enhanced Logo with Better Dark Mode Contrast
const Logo: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => (
  <div
    className={`${
      isCollapsed ? "p-3" : "p-5"
    } border-b border-border dark:border-gray-700/50 gradient-primary backdrop-blur-sm`}
  >
    <div className={`flex items-center ${isCollapsed ? "justify-center" : ""}`}>
      {isCollapsed ? (
        <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-elevation-2 transform hover:scale-110 transition-all duration-300 hover:shadow-elevation-3 relative overflow-hidden group">
          <img
            src="img/icon.png"
            alt="Trek Link"
            className="w-6 h-6 object-contain relative z-10 filter brightness-0 invert group-hover:scale-110 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-elevation-2 transform hover:scale-110 transition-all duration-300 relative overflow-hidden group">
            <img
              src="img/icon.png"
              alt="Trek Link"
              className="w-6 h-6 object-contain relative z-10 filter brightness-0 invert group-hover:scale-110 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gradient">Trek Link</h1>
            <p className="text-xs text-muted-foreground font-medium">
              Link the Route
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
);

// Enhanced MenuItemButton with Better Dark Mode Contrast
const MenuItemButton: React.FC<{
  item: MenuItemConfig;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}> = ({ item, isActive, isCollapsed, onClick }) => (
  <li className="relative">
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center transition-all duration-300 rounded-2xl mx-2 relative group overflow-hidden ${
        isCollapsed ? "justify-center p-3" : "px-4 py-3 space-x-3"
      } ${
        isActive
          ? "bg-primary text-white shadow-elevation-2 font-semibold scale-105"
          : // Enhanced: Better contrast for inactive state in both modes
            "text-foreground dark:text-gray-200 hover:bg-muted hover:text-primary dark:hover:text-primary-500 hover:scale-105 hover:shadow-elevation-1"
      }`}
      title={isCollapsed ? item.label : undefined}
    >
      {/* Background glow effect for active state */}
      {isActive && (
        <div className="absolute inset-0 bg-primary/20 opacity-20 blur-sm" />
      )}

      {/* Icon container - Enhanced contrast */}
      <div
        className={`relative z-10 flex items-center justify-center ${
          isActive
            ? "text-white"
            : // Enhanced: Better icon contrast in dark mode
              "text-gray-600 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary-500"
        } transition-all duration-300`}
      >
        <item.icon
          className={`${
            isCollapsed ? "w-5 h-5" : "w-5 h-5"
          } transition-all duration-300 ${isActive ? "drop-shadow-sm" : ""}`}
        />
      </div>

      {/* Label - Enhanced contrast */}
      {!isCollapsed && (
        <span
          className={`text-sm font-medium truncate relative z-10 transition-all duration-300 ${
            isActive
              ? "text-white"
              : // Enhanced: More visible text in dark mode with better hover
                "text-gray-700 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-primary-500"
          }`}
        >
          {item.label}
        </span>
      )}

      {/* Enhanced tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-3 px-3 py-2 glass-effect text-foreground dark:text-gray-200 text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 pointer-events-none shadow-elevation-3 border border-border scale-95 group-hover:scale-100">
          {item.label}
          <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2">
            <div className="w-2 h-2 bg-card rotate-45 border-l border-t border-border"></div>
          </div>
        </div>
      )}
    </button>
  </li>
);

// Enhanced MenuGroup with Better Dark Mode
const MenuGroup: React.FC<{
  items: MenuItemConfig[];
  title?: string;
  isCollapsed: boolean;
  activeSection: SectionKey;
  onSectionChange: (section: SectionKey) => void;
}> = ({ items, title, isCollapsed, activeSection, onSectionChange }) => (
  <div className="mb-6">
    {!isCollapsed && title && (
      <div className="px-4 mb-3 flex items-center space-x-2">
        <Sparkles className="w-3 h-3 text-primary" />
        <h3 className="text-xs font-bold text-primary uppercase tracking-widest">
          {title}
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent dark:from-gray-700/30"></div>
      </div>
    )}

    {/* Separator line for collapsed state */}
    {isCollapsed && title && (
      <div className="mx-3 mb-3 h-px bg-border dark:bg-gray-700/30"></div>
    )}

    <ul className="space-y-2">
      {items.map((item) => (
        <MenuItemButton
          key={item.id}
          item={item}
          isActive={activeSection === item.id}
          isCollapsed={isCollapsed}
          onClick={() => onSectionChange(item.id)}
        />
      ))}
    </ul>
  </div>
);

// Enhanced CollapseToggle with Better Dark Mode
const CollapseToggle: React.FC<{
  isCollapsed: boolean;
  onToggle: () => void;
}> = ({ isCollapsed, onToggle }) => (
  <div className="p-3 border-t border-border dark:border-gray-700/50 gradient-primary hidden lg:block">
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-center rounded-2xl transition-all duration-300 group relative overflow-hidden
        ${isCollapsed ? "p-3" : "px-4 py-3"}
        surface border border-border hover:border-primary 
        text-gray-600 dark:text-gray-300 hover:text-primary 
        hover:shadow-elevation-2 transform hover:scale-105`}
      title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
    >
      <div className="relative z-10 flex items-center">
        {isCollapsed ? (
          <ChevronRight className="w-5 h-5 transition-all duration-300 group-hover:scale-110" />
        ) : (
          <>
            <ChevronLeft className="w-5 h-5 mr-2 transition-all duration-300 group-hover:scale-110" />
            <span className="text-sm font-semibold">Collapse</span>
          </>
        )}
      </div>

      {/* Enhanced tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-3 px-4 py-2 glass-effect text-foreground dark:text-gray-200 text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 pointer-events-none shadow-elevation-3 border border-border scale-95 group-hover:scale-100">
          Expand Sidebar
          <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2">
            <div className="w-2 h-2 bg-card rotate-45 border-l border-t border-border"></div>
          </div>
        </div>
      )}

      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
    </button>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isCollapsed,
  activeSection,
  userRole,
  onClose,
  onSectionChange,
  onToggleCollapse,
}) => {
  const groupedMenus = MenuConfigUtils.getGroupedMenuItems(userRole);
  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  return (
    <>
      {/* Enhanced mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 lg:hidden transition-all duration-300 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Enhanced Sidebar with Better Background Contrast */}
      <div
        className={`fixed top-0 left-0 z-50 h-full transition-all duration-300 ease-in-out
          ${sidebarWidth} ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0
          glass-effect border-r border-border dark:border-gray-700/50 shadow-elevation-3 flex flex-col backdrop-blur-xl
          bg-white/95 dark:bg-gray-900/95`}
        style={{
          width: isCollapsed ? "80px" : "256px",
        }}
      >
        {/* Logo */}
        <Logo isCollapsed={isCollapsed} />

        {/* Enhanced Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden scrollbar-thin">
          <div className="pb-4">
            {/* Main Menu */}
            {groupedMenus.main.length > 0 && (
              <MenuGroup
                items={groupedMenus.main}
                isCollapsed={isCollapsed}
                activeSection={activeSection}
                onSectionChange={onSectionChange}
              />
            )}

            {/* Inventory Management */}
            {groupedMenus.inventory.length > 0 && (
              <MenuGroup
                items={groupedMenus.inventory}
                title={isCollapsed ? undefined : "Inventory"}
                isCollapsed={isCollapsed}
                activeSection={activeSection}
                onSectionChange={onSectionChange}
              />
            )}

            {/* Reports */}
            {groupedMenus.reports.length > 0 && (
              <MenuGroup
                items={groupedMenus.reports}
                title={isCollapsed ? undefined : "Reports"}
                isCollapsed={isCollapsed}
                activeSection={activeSection}
                onSectionChange={onSectionChange}
              />
            )}

            {/* Settings */}
            {groupedMenus.settings.length > 0 && (
              <MenuGroup
                items={groupedMenus.settings}
                title={isCollapsed ? undefined : "Settings"}
                isCollapsed={isCollapsed}
                activeSection={activeSection}
                onSectionChange={onSectionChange}
              />
            )}
          </div>
        </nav>

        {/* Enhanced Collapse Toggle */}
        <CollapseToggle isCollapsed={isCollapsed} onToggle={onToggleCollapse} />
      </div>
    </>
  );
};

export default Sidebar;
