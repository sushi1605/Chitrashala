"use client";

import {
  Home,
  Upload,
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
import SignOutButton from "./signout-button";
import { ThemeToggle2 } from "./theme-toggle2";
import { SidebarUserButton } from "./sidebar-user-button";

interface SidebarProps {
  sidebarOpen: boolean;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isLoggedIn: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  currentPage,
  setCurrentPage,
  isLoggedIn,
}) => {
  const router = useRouter();

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    router.push(`/${page}`);
  };

  const collapsed = !sidebarOpen;

  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "upload", icon: Upload, label: "Upload" },
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "explore", icon: Compass, label: "Explore" },
  ] as const;

  const navItems2 = [
    { id: "about", icon: Info, label: "About" },
    { id: "contact", icon: Contact, label: "Contact" },
  ] as const;

  return (
    <aside
      className={`hidden lg:block fixed h-[calc(100vh-4rem)] bg-white dark:bg-neutral-900 transition-all duration-300 z-40 border-r border-gray-200 dark:border-neutral-800
      ${sidebarOpen ? "w-[18.5rem]" : "w-20"} overflow-hidden`}
    >
      <div className="flex h-full flex-col px-4 py-6">
        <nav className="flex-1 space-y-2">
          {navItems.map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              onClick={() => handlePageChange(id)}
              variant="ghost"
              className={`w-full justify-start rounded-2xl py-6 text-base gap-4 transition-all duration-200
                ${currentPage === id
                  ? "bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white shadow-lg shadow-rose-200 dark:shadow-rose-900/30 hover:shadow-xl hover:scale-[1.02]"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 dark:hover:from-neutral-800 dark:hover:to-neutral-800 hover:scale-[1.02]"
                }`}
            >
              <Icon size={22} strokeWidth={currentPage === id ? 2.5 : 2} />
              <span
                className={`font-semibold whitespace-nowrap transition-all duration-300
                ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-full"}`}
              >
                {label}
              </span>
            </Button>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-4 flex flex-col gap-4">
          <nav className={`flex ${collapsed ? 'flex-col gap-2' : 'justify-around'}`}>
            {navItems2.map(({ id, icon: Icon, label }) => (
              <Button
                key={id}
                onClick={() => handlePageChange(id)}
                variant="ghost"
                className={`${collapsed ? 'w-full justify-center' : ''} text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-neutral-800 transition-all duration-200 rounded-xl`}
              >
                {collapsed ? <Icon size={20} /> : (
                  <span className="font-medium whitespace-nowrap text-sm">
                    {label}
                  </span>
                )}
              </Button>
            ))}
          </nav>

          <Separator
            className={`bg-gradient-to-r from-transparent via-rose-200 to-transparent dark:via-neutral-700 transition-opacity duration-300 
            ${collapsed ? "opacity-0" : "opacity-100"}`}
          />

          <div className={`${collapsed ? 'flex justify-center' : ''}`}>
            <ThemeToggle2 />
          </div>

          {/* User Section */}
          <SidebarUserButton collapsed={!sidebarOpen} />

          {/* Logout */}
          {isLoggedIn ? (
            <SignOutButton />
          ) : (
            <Button
              onClick={() => router.push("/login")}
              className="group flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-rose-300 dark:hover:shadow-rose-900/30 rounded-xl py-6 font-semibold"
            >
              <LogIn className="h-5 w-5" />
              {!collapsed && <span>Login</span>}
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};
