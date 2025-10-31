/**
 * Navigation Module Translation Labels
 * 
 * This file contains all static UI labels used in the Navigation/Sidebar component.
 * Labels are organized by category for better maintainability.
 * 
 * Usage with useNavigationLabels hook:
 * const { L } = useNavigationLabels();
 * <span>{L.menuItems.dashboard}</span>
 */

export interface NavigationLabels {
  // Menu Items
  menuItems: {
    dashboard: string;
    microservices: string;
    users: string;
    roles: string;
    customers: string;
    carriers: string;
    sellers: string;
    pricing: string;
    translations: string;
    analytics: string;
    settings: string;
  };

  // User Profile Section
  profile: {
    viewProfile: string;
    logout: string;
    toggleTheme: string;
  };

  // Mobile Menu
  mobile: {
    openMenu: string;
    closeMenu: string;
  };

  // Branding
  branding: {
    appName: string;
  };
}

/**
 * Default English labels for the Navigation module
 */
export const navigationLabels: NavigationLabels = {
  menuItems: {
    dashboard: 'Dashboard',
    microservices: 'Microservices',
    users: 'Users',
    roles: 'Roles',
    customers: 'Customers',
    carriers: 'Carriers',
    sellers: 'Sellers',
    pricing: 'Pricing',
    translations: 'Translations',
    analytics: 'Analytics',
    settings: 'Settings',
  },

  profile: {
    viewProfile: 'View Profile',
    logout: 'Logout',
    toggleTheme: 'Toggle Theme',
  },

  mobile: {
    openMenu: 'Open main menu',
    closeMenu: 'Close menu',
  },

  branding: {
    appName: 'React Admin',
  },
};
