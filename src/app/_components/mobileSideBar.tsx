"use client";

import {
  Home,
  Upload,
  FolderOpen,
  X,
  LogOut,
  Link,
  Grid,
  Compass,
  Info,
  Contact,
  LogIn,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { useRouter } from "next/navigation";
import { ThemeToggle2 } from "./theme-toggle2";
import SignOutButton from "./signout-button";
import { SidebarUserButton } from "./sidebar-user-button";

interface SidebarProps {
  sidebarOpen: boolean;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isLoggedIn: boolean;
}

export const MobileSidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  currentPage,
  setCurrentPage,
  isLoggedIn,
}) => {
  const router = useRouter();

  const handlePageChange = (page: string) => {
    setCurrentPage(page); // update UI state
    router.push(`/${page}`); // redirect to route
  };
  const collapsed = !sidebarOpen;
  const navItems = [
    { id: "home", icon: Home, label: "Home", login: true },
    { id: "explore", icon: Compass, label: "Explore", login: true },
    { id: "upload", icon: Upload, label: "Upload", login: true },
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", login: true },
  ] as const;

  const navItems2 = [
    { id: "about", icon: Info, label: "About", login: false },
    { id: "contact", icon: Contact, label: "Contact", login: false },
  ] as const;
  return (
    <aside
      className={`lg:hidden fixed h-[calc(100vh-4rem)] bg-white dark:bg-neutral-900 transition-all duration-300 z-40
      ${sidebarOpen ? "w-64" : "w-20"} overflow-hidden`}
    >
      <div className="flex h-full flex-col px-3 py-6">
        <nav className="flex-1 space-y-2">
          {navItems.map(({ id, icon: Icon, label, login }) => (
            <Button
              key={id}
              onClick={() => handlePageChange(id)}
              variant="ghost"
              className={`${login == isLoggedIn ? "" : "hidden"} w-full justify-start rounded-xl py-3 text-base gap-3
                ${currentPage === id
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-700 dark:text-gray-200 hover:bg-rose-50 dark:hover:bg-neutral-800"
                }`}
            >
              <Icon size={20} />

              {/* Label fades out on collapse */}
              <span
                className={`font-medium whitespace-nowrap transition-all duration-300
                ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-full"}`}
              >
                {label}
              </span>
            </Button>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-6 flex flex-col gap-4">
          <nav className="flex justify-around">
            {navItems2.map(({ id, label }) => (
              <Button
                key={id}
                onClick={() => handlePageChange(id)}
                variant="ghost"
              >
                {/* Label fades out on collapse */}
                <span
                  className={`font-medium whitespace-nowrap transition-all duration-300
                ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-full"}`}
                >
                  {label}
                </span>
              </Button>
            ))}
          </nav>
          <Separator
            className={`bg-rose-200 dark:bg-neutral-700 mb-4 transition-opacity duration-300 
            ${collapsed ? "opacity-0" : "opacity-100"}`}
          />

          <ThemeToggle2 />
          {/* User Section */}
          <SidebarUserButton collapsed={!sidebarOpen} />
          {/* Logout */}

          {isLoggedIn ? (
            <>
              <SignOutButton />
            </>
          ) : (
            <Button
              onClick={() => router.push("/login")}
              className="group flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white transition-all hover:scale-105 hover:shadow-lg"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};
