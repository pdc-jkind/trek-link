// src/app/(dashboard)/types/menuConfig.ts
import {
  Home,
  Users,
  Store,
  Package,
  ShoppingCart,
  Database,
  BarChart3,
  Settings,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

// Base types
export type SectionKey =
  | "dashboard"
  | "users"
  | "offices"
  | "inventory"
  | "orders"
  | "items"
  | "disparity"
  | "settings"
  | "help";

export type UserRole = "admin" | "contributor" | "monitor";

export type MenuCategory = "main" | "inventory" | "reports" | "settings";

// Menu item configuration interface
export interface MenuItemConfig {
  id: SectionKey;
  label: string;
  icon: LucideIcon;
  url: string;
  category: MenuCategory;
  roles?: UserRole[];
  title: string;
  subtitle: string;
}

// Category configuration interface
export interface CategoryConfig {
  id: MenuCategory;
  label: string;
  order: number;
}

// Complete menu configuration
export const MENU_CONFIG: MenuItemConfig[] = [
  // Main Menu
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    url: "/dashboard",
    category: "main",
    title: "Dashboard",
    subtitle: "Selamat datang di sistem inventory",
  },
  {
    id: "users",
    label: "Data User",
    icon: Users,
    url: "/users",
    category: "main",
    roles: ["admin"],
    title: "Data User",
    subtitle: "Kelola data pengguna sistem",
  },
  {
    id: "offices",
    label: "Data Office",
    icon: Store,
    url: "/offices",
    category: "main",
    roles: ["admin"],
    title: "Data Office",
    subtitle: "Kelola data office",
  },

  // Inventory Management Group
  {
    id: "items",
    label: "Data Barang",
    icon: Database,
    url: "/items",
    category: "inventory",
    roles: ["admin", "contributor"],
    title: "Data Barang",
    subtitle: "Master data barang dan kategori",
  },
  {
    id: "orders",
    label: "Order Barang",
    icon: ShoppingCart,
    url: "/orders",
    category: "inventory",
    roles: ["admin", "contributor"],
    title: "Order Barang",
    subtitle: "Kelola pesanan dan pembelian barang",
  },
  {
    id: "inventory",
    label: "Penerimaan Barang",
    icon: Package,
    url: "/reception",
    category: "inventory",
    roles: ["admin", "contributor"],
    title: "Penerimaan Barang",
    subtitle: "Kelola data penerimaan barang",
  },

  // Reports Group
  {
    id: "disparity",
    label: "Laporan Disparitas",
    icon: BarChart3,
    url: "/disparity",
    category: "reports",
    roles: ["monitor", "admin"],
    title: "Laporan Disparitas",
    subtitle: "Pantau selisih penerimaan barang",
  },

  // Settings Group
  {
    id: "settings",
    label: "Pengaturan",
    icon: Settings,
    url: "/settings",
    category: "settings",
    title: "Pengaturan",
    subtitle: "Konfigurasi sistem",
  },
  {
    id: "help",
    label: "Bantuan",
    icon: HelpCircle,
    url: "/help",
    category: "settings",
    title: "Bantuan",
    subtitle: "Panduan penggunaan sistem",
  },
];

// Category configurations
export const CATEGORY_CONFIG: CategoryConfig[] = [
  { id: "main", label: "Main", order: 1 },
  { id: "inventory", label: "Inventory", order: 2 },
  { id: "reports", label: "Reports", order: 3 },
  { id: "settings", label: "Settings", order: 4 },
];

// Utility functions
export class MenuConfigUtils {
  /**
   * Get all menu items filtered by user role
   */
  static getMenuItemsByRole(userRole: UserRole): MenuItemConfig[] {
    return MENU_CONFIG.filter(
      (item) => !item.roles || item.roles.includes(userRole)
    );
  }

  /**
   * Get menu items grouped by category for a specific user role
   */
  static getGroupedMenuItems(userRole: UserRole): Record<MenuCategory, MenuItemConfig[]> {
    const filteredItems = this.getMenuItemsByRole(userRole);
    
    const grouped: Record<MenuCategory, MenuItemConfig[]> = {
      main: [],
      inventory: [],
      reports: [],
      settings: [],
    };

    filteredItems.forEach((item) => {
      grouped[item.category].push(item);
    });

    return grouped;
  }

  /**
   * Get menu item by section key
   */
  static getMenuItemBySection(section: SectionKey): MenuItemConfig | undefined {
    return MENU_CONFIG.find((item) => item.id === section);
  }

  /**
   * Get menu item by URL path
   */
  static getMenuItemByUrl(url: string): MenuItemConfig | undefined {
    return MENU_CONFIG.find((item) => item.url === url);
  }

  /**
   * Get section key from URL path
   */
  static getSectionFromUrl(url: string): SectionKey {
    const menuItem = this.getMenuItemByUrl(url);
    return menuItem?.id || "dashboard";
  }

  /**
   * Get URL from section key
   */
  static getUrlFromSection(section: SectionKey): string {
    const menuItem = this.getMenuItemBySection(section);
    return menuItem?.url || "/dashboard";
  }

  /**
   * Get page title and subtitle for a section
   */
  static getSectionTitleInfo(section: SectionKey): { title: string; subtitle: string } {
    const menuItem = this.getMenuItemBySection(section);
    return {
      title: menuItem?.title || "Dashboard",
      subtitle: menuItem?.subtitle || "Selamat datang di sistem inventory",
    };
  }

  /**
   * Get category configuration by category id
   */
  static getCategoryConfig(categoryId: MenuCategory): CategoryConfig | undefined {
    return CATEGORY_CONFIG.find((cat) => cat.id === categoryId);
  }

  /**
   * Get all categories sorted by order
   */
  static getSortedCategories(): CategoryConfig[] {
    return [...CATEGORY_CONFIG].sort((a, b) => a.order - b.order);
  }

  /**
   * Check if user has access to a specific menu item
   */
  static hasAccess(menuItem: MenuItemConfig, userRole: UserRole): boolean {
    return !menuItem.roles || menuItem.roles.includes(userRole);
  }

  /**
   * Get all available sections for a user role
   */
  static getAvailableSections(userRole: UserRole): SectionKey[] {
    return this.getMenuItemsByRole(userRole).map((item) => item.id);
  }

  /**
   * Validate if a section is accessible by user role
   */
  static validateSectionAccess(section: SectionKey, userRole: UserRole): boolean {
    const menuItem = this.getMenuItemBySection(section);
    return menuItem ? this.hasAccess(menuItem, userRole) : false;
  }
}

// Export types for use in other files
export type { LucideIcon };

// Default export for convenience
export default {
  MENU_CONFIG,
  CATEGORY_CONFIG,
  MenuConfigUtils,
};