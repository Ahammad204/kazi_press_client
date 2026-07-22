"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";
import { navItems, userMenuItems } from "@/lib/nav-config";
import { logout } from "@/service/logout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type IUser = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    profile: {
      id: string;
      name: string;
      email: string;
      activeStatus: string;
      role: string;
      createdAt: string;
      updatedAt: string;
      profile: {
        id: string;
        profilePhoto: string;
        bio: string | null;
        userId: string;
        createdAt: string;
        updatedAt: string;
      };
    };
  };
};

type NavbarProps = {
  user: IUser;
};

export function Navbar({ user }: NavbarProps) {
  const [isLogout, setIsLogout] = useState(false);
  const router = useRouter();
  const handleUserAction = async (action: string) => {
    console.log(`User action: ${action}`);
    switch (action) {
      case "logout":
        // Handle logout
        console.log("Logging out...");
        await logout();
        setIsLogout(true);
        break;
      case "profile":
        // Navigate to profile
        console.log("Going to profile...");
        break;
      case "preferences":
        // Navigate to preferences
        console.log("Going to preferences...");
        break;
      case "help":
        // Navigate to help
        console.log("Going to help...");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isLogout) {
      toast.success("User Logged out successfully");
      router.push("/login");
    }
  }, [isLogout, router]);

  const userName = `${user.data?.profile?.name}`;
  const userEmail = `${user.data?.profile?.email}`;

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="shrink-0">
            <Link href="/" className="text-xl font-bold text-foreground">
              Kazi Press
            </Link>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex md:gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  title={item.description}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Dropdown */}
            {
              user.success ? (
                   <div className="shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-input hover:bg-accent transition-colors text-sm font-medium">
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium">{userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {userEmail}
                    </span>
                  </div>
                  <ChevronDown className="size-4 ml-2 transition-transform" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium leading-none">
                      {userName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground mt-1">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  {userMenuItems.map((item) => (
                    <DropdownMenuItem
                      key={item.action}
                      onClick={async () => await handleUserAction(item.action)}
                      className={item.isDangerous ? "text-destructive" : ""}
                    >
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
              ) : <Link href="/login" ><Button>Login</Button></Link>
            }
        </div>
      </div>
    </nav>
  );
}
