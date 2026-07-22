import {
  Home,
  BarChart3,
  Settings,
  HelpCircle,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

export interface UserMenuItem {
  label: string;
  action: string;
  isDangerous?: boolean;
}

export const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    description: "Go to dashboard",
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "View analytics",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Manage settings",
  },
  {
    label: "Help",
    href: "/help",
    icon: HelpCircle,
    description: "Get help",
  },
];

export const userMenuItems: UserMenuItem[] = [
  {
    label: "Profile",
    action: "profile",
  },
  {
    label: "Preferences",
    action: "preferences",
  },
  {
    label: "Help & Support",
    action: "help",
  },
  {
    label: "Sign Out",
    action: "logout",
    isDangerous: true,
  },
];
