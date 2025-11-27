"use client";

import Link from "next/link";
import { Search, User, LogIn, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ThemeToggle } from "./theme-toggle";
import { useRouter } from "next/navigation";
import SignOutButton from "./signout-button";
import { Logo } from "~/components/logo";
import { UserButton } from "./userProfileButton";

interface MainNavProps {
  isLoggedIn: boolean;
  links: string[];
  showSearchBar: boolean;
  toggleSidebar?: () => void;
}

export function MainNav({
  isLoggedIn,
  links,
  showSearchBar,
  toggleSidebar,
}: MainNavProps) {
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <nav className="fixed h-16 w-full top-0 text-black dark:text-white border-b border-gray-200 dark:border-neutral-800 backdrop-blur-sm bg-white/95 dark:bg-neutral-900/95 z-50">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-4">
          <Logo collapsed={false} />

          {isLoggedIn && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden lg:flex lg:ml-8 hover:bg-rose-50 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-200 rounded-xl transition-all duration-200"
            >
              <Menu size={22} />
            </Button>
          )}

          {/* Mobile Sidebar Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleSidebar?.()}
            className="lg:hidden hover:bg-rose-50 dark:hover:bg-neutral-800 rounded-xl"
          >
            <Menu size={24} />
          </Button>

          {/* Navigation Links */}
          {!isSearchFocused && (
            <div className="hidden md:flex space-x-2 ml-8">
              {links.map((item, index) => (
                <Link
                  href={`/${item}`}
                  key={index}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-neutral-800 rounded-xl transition-all duration-200"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* SEARCH BAR */}
        {showSearchBar && (
          <div
            className={`flex-1 transition-all duration-300 ${isSearchFocused
              ? "max-w-full mx-4"
              : "hidden lg:flex lg:max-w-2xl lg:mx-8"
              }`}
          >
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for ideas..."
                className="h-12 w-full rounded-full pl-12 pr-4 bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white border-2 border-transparent focus-visible:border-rose-500 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 dark:placeholder:text-gray-400 shadow-sm hover:shadow-md transition-all duration-200"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>
        )}

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isLoggedIn ? (
            <div className="flex gap-4 w-[50%] mr-10">
              <UserButton />
              <SignOutButton />
            </div>
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
    </nav>
  );
}
