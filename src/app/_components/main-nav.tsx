'use client';

import Link from 'next/link';
import {
  Search,
  User,
  LogIn,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { ThemeToggle } from './theme-toggle';
import { useRouter } from "next/navigation";
import SignOutButton from './signout-button';
import { Logo } from '~/components/logo';

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
  toggleSidebar
}: MainNavProps) {
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <nav className="fixed bg-white dark:bg-neutral-900 h-16 w-full top-0 text-black dark:text-white ">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-4">
          <Logo collapsed={false} />
          {isLoggedIn &&
            <Menu className='hidden lg:block lg:ml-12' onClick={toggleSidebar} />
          }
          {/* Mobile Sidebar Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleSidebar?.()}
            className="lg:hidden text-white"
          >
            <Menu size={24} />
          </Button>

          {/* Navigation Links */}
          {!isSearchFocused && (
            <div className="hidden md:flex space-x-6">
              {links.map((item, index) => (
                <Link
                  href={`/${item}`}
                  key={index}
                  className="text-sm font-medium text-gray-300 hover:text-white"
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
            className={`flex-1 transition-all border-2 rounded-2xl ${isSearchFocused ? "max-w-full mx-4" : "hidden lg:flex lg:max-w-2xl lg:mx-8"
              }`}
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for ideas..."
                className="h-10 w-full rounded-full pl-10 pr-4 bg-white/10 text-white border-white/20 focus-visible:ring-red-500"
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
            <div className='flex gap-4 w-[50%] mr-10'>
              <Button variant="ghost" size="icon" className=" bg-gray-300 hover:bg-gray-100 dark:bg-gray-300/20 dark:hover:bg-gray-100/80 hover:text-black lg:w-20">
                <User className="h-5 w-5" />
              </Button>
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
