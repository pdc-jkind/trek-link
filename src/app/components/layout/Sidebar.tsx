// src\app\(frontend)\components\layout\Sidebar.tsx
"use client";

import {
  Home,
  Users,
  Package,
  ShoppingCart,
  Database,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type SectionKey =
  | "dashboard"
  | "users"
  | "inventory"
  | "orders"
  | "items"
  | "disparity"
  | "settings"
  | "help";

export interface SidebarProps {
  // State
  isOpen: boolean;
  isCollapsed: boolean;
  activeSection: SectionKey;
  userRole: string;

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
  const menuItems = [
    {
      id: "dashboard" as SectionKey,
      label: "Dashboard",
      icon: Home,
      category: "main",
    },
    {
      id: "users" as SectionKey,
      label: "Data User",
      icon: Users,
      roles: ["admin"],
      category: "main",
    },
    // Inventory Management Group
    {
      id: "items" as SectionKey,
      label: "Data Barang",
      icon: Database,
      roles: ["admin", "contributor"],
      category: "inventory",
    },
    {
      id: "orders" as SectionKey,
      label: "Order Barang",
      icon: ShoppingCart,
      roles: ["admin", "contributor"],
      category: "inventory",
    },
    {
      id: "inventory" as SectionKey,
      label: "Penerimaan Barang",
      icon: Package,
      roles: ["admin", "contributor"],
      category: "inventory",
    },
    // Reports Group
    {
      id: "disparity" as SectionKey,
      label: "Laporan Disparitas",
      icon: BarChart3,
      roles: ["monitor", "admin"],
      category: "reports",
    },
    // Settings Group
    {
      id: "settings" as SectionKey,
      label: "Pengaturan",
      icon: Settings,
      category: "settings",
    },
    {
      id: "help" as SectionKey,
      label: "Bantuan",
      icon: HelpCircle,
      category: "settings",
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  // Group menu items by category
  const groupedMenus = {
    main: filteredMenuItems.filter((item) => item.category === "main"),
    inventory: filteredMenuItems.filter(
      (item) => item.category === "inventory"
    ),
    reports: filteredMenuItems.filter((item) => item.category === "reports"),
    settings: filteredMenuItems.filter((item) => item.category === "settings"),
  };

  const renderMenuGroup = (items: typeof filteredMenuItems, title?: string) => (
    <div className="mb-6">
      {!isCollapsed && title && (
        <h3 className="px-4 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {title}
        </h3>
      )}
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onSectionChange(item.id)}
              className={`w-full text-left ${
                isCollapsed ? "px-3 py-3" : "px-4 py-3"
              } rounded-xl transition-all duration-300 flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              } ${
                activeSection === item.id
                  ? "bg-white bg-opacity-90 border-l-4 border-purple-500 text-purple-700 shadow-md font-medium"
                  : "text-gray-700 hover:text-purple-700 hover:bg-white hover:bg-opacity-60"
              } group relative`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-60 pointer-events-none shadow-lg">
                  {item.label}
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2">
                    <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 ${
          isCollapsed ? "w-20" : "w-64"
        } h-full bg-white bg-opacity-90 backdrop-blur-lg border-r border-white border-opacity-30 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 shadow-lg flex flex-col`}
      >
        {/* Logo */}
        <div
          className={`${
            isCollapsed ? "p-4" : "p-6"
          } border-b border-white border-opacity-30 flex-shrink-0`}
        >
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-10 h-10 bg-white bg-opacity-90 rounded-xl flex items-center justify-center shadow-md overflow-hidden">
              <div className="w-6 h-6 bg-purple-600 rounded"></div>
            </div>
            {!isCollapsed && (
              <div className="ml-3">
                <h1 className="text-gray-800 font-bold text-lg">Trek Link</h1>
                <p className="text-gray-600 text-sm">Link the Route</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation - with better scrolling */}
        <nav className="flex-1 p-4 overflow-y-auto overflow-x-clip scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
          <div className="pb-4">
            {/* Main Menu */}
            {renderMenuGroup(groupedMenus.main)}

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

        {/* Collapse Toggle Button */}
        <div className="p-4 border-t border-white border-opacity-30 flex-shrink-0 hidden lg:block">
          <button
            onClick={onToggleCollapse}
            className={`w-full flex items-center justify-center ${
              isCollapsed ? "p-3" : "p-2"
            } rounded-xl text-gray-700 hover:text-purple-700 hover:bg-white hover:bg-opacity-60 transition-all duration-300 group relative`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-60 pointer-events-none shadow-lg">
                Expand Sidebar
                <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2">
                  <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Custom scrollbar styles */}
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
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 2px;
        }
        .hover\\:scrollbar-thumb-gray-400:hover::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
