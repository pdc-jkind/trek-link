// src\app\(dashboard)\components\Sidebar.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  SectionKey,
  MenuConfigUtils,
  MenuItemConfig,
  UserRole,
  MenuCategory,
} from "@/app/(frontend)/(dashboard)/types/menuConfig";

export interface SidebarProps {
  // State
  isOpen: boolean;
  isCollapsed: boolean;
  activeSection: SectionKey;
  userRole: UserRole;

  // Event handlers
  onClose: () => void;
  onSectionChange: (section: SectionKey) => void;
  onToggleCollapse: () => void;
}

const Sidebar = ({
  isOpen,
  isCollapsed,
  activeSection,
  userRole,
  onClose,
  onSectionChange,
  onToggleCollapse,
}: SidebarProps) => {
  // Get grouped menu items filtered by user role
  const groupedMenus = MenuConfigUtils.getGroupedMenuItems(userRole);

  const renderMenuGroup = (items: MenuItemConfig[], title?: string) => (
    <div className="mb-5">
      {!isCollapsed && title && (
        <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {title}
        </h3>
      )}
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onSectionChange(item.id)}
              className={`w-full text-left ${
                isCollapsed ? "px-2 py-2.5" : "px-3 py-2.5"
              } rounded-lg transition-all duration-300 flex items-center ${
                isCollapsed ? "justify-center" : "space-x-2.5"
              } ${
                activeSection === item.id
                  ? "bg-white bg-opacity-90 border-l-4 border-purple-500 text-purple-700 shadow-md font-medium"
                  : "text-gray-700 hover:text-purple-700 hover:bg-white hover:bg-opacity-60"
              } group relative`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1.5 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-60 pointer-events-none shadow-lg">
                  {item.label}
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2">
                    <div className="w-1.5 h-1.5 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  // Get sidebar width based on collapsed state
  const getSidebarWidth = () => {
    return isCollapsed ? "w-18" : "w-58"; // Reduced by 10%: 72px and 232px
  };

  return (
    <>
      {/* Enhanced Mobile overlay with transparent blur background */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 ${getSidebarWidth()} h-full bg-white/95 backdrop-blur-lg border-r border-white/30 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 shadow-xl flex flex-col`}
        style={{
          width: isCollapsed ? "72px" : "230px", // Exact pixel values (reduced by 10%)
        }}
      >
        {/* Logo */}
        <div
          className={`${
            isCollapsed ? "p-2.5" : "p-4"
          } border-b border-white/20 flex-shrink-0 bg-gradient-to-r from-purple-50/50 to-pink-50/50`}
        >
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            {isCollapsed && (
              <div className="w-12 h-10 bg-gray rounded-xl flex items-center justify-center shadow-lg overflow-hidden p-1 transform hover:scale-105 transition-transform duration-300">
                <img
                  src="img/icon.png"
                  alt="icon"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            {!isCollapsed && (
              <div className="ml-2.5">
                <h1 className="font-bold text-base bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Trek Link
                </h1>
                <p className="text-gray-600 text-xs">Link the Route</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation - with better scrolling */}
        <nav className="flex-1 p-2 overflow-y-auto overflow-x-clip scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
          <div className="pb-5 pt-3">
            {/* Main Menu */}
            {groupedMenus.main.length > 0 && renderMenuGroup(groupedMenus.main)}

            {/* Inventory Management */}
            {groupedMenus.inventory.length > 0 &&
              renderMenuGroup(
                groupedMenus.inventory,
                isCollapsed ? undefined : "Inventory"
              )}

            {/* Reports */}
            {groupedMenus.reports.length > 0 &&
              renderMenuGroup(
                groupedMenus.reports,
                isCollapsed ? undefined : "Reports"
              )}

            {/* Settings */}
            {groupedMenus.settings.length > 0 &&
              renderMenuGroup(
                groupedMenus.settings,
                isCollapsed ? undefined : "Settings"
              )}
          </div>
        </nav>

        {/* Enhanced Collapse Toggle Button */}
        <div className="p-2.5 border-t border-white/20 flex-shrink-0 hidden lg:block bg-gradient-to-r from-gray-50/50 to-slate-50/50">
          <button
            onClick={onToggleCollapse}
            className={`w-full flex items-center justify-center ${
              isCollapsed ? "p-2.5" : "p-2"
            } rounded-lg text-gray-700 hover:text-purple-700 hover:bg-white/60 backdrop-blur-sm transition-all duration-300 group relative border border-transparent hover:border-purple-200 hover:shadow-md`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-300" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-1.5 transform group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs font-medium">Collapse</span>
              </>
            )}

            {/* Enhanced Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900/90 backdrop-blur-sm text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-60 pointer-events-none shadow-xl border border-white/10">
                Expand Sidebar
                <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2">
                  <div className="w-2 h-2 bg-gray-900/90 rotate-45 border-l border-t border-white/10"></div>
                </div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Enhanced custom scrollbar styles */}
      <style>{`
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-track-transparent {
          scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.4);
          border-radius: 2px;
          transition: background-color 0.3s ease;
        }
        .hover\\:scrollbar-thumb-gray-400:hover::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.6);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
