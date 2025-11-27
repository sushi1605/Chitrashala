"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getSession } from "~/server/better-auth/server";

interface SidebarUserButtonProps {
  collapsed: boolean;
}

export function SidebarUserButton({ collapsed }: SidebarUserButtonProps) {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    image?: string | null;
  } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const session = await getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.name ?? "User",
          email: session.user.email ?? "",
          image: session.user.image,
        });
      }
    }

    fetchUser();
  }, []);

  if (!user) return null;

  return (
    <Link
      href={`/profile/${user.id}`}
      className={`flex items-center gap-3 p-3 rounded-2xl 
        bg-gradient-to-br from-gray-50 to-gray-100 
        dark:from-neutral-800 dark:to-neutral-900 
        border border-gray-200 dark:border-neutral-700 
        transition-all duration-200 hover:shadow-md
        ${collapsed ? "justify-center" : ""}`}
    >
      <Avatar className="h-11 w-11 ring-2 ring-rose-200 dark:ring-rose-900/30 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900">
        <AvatarImage src={user.image ?? "https://github.com/shadcn.png"} />

        <AvatarFallback
          className="bg-gradient-to-br from-rose-500 to-pink-500 text-white font-bold"
        >
          {user.name?.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Name + Email */}
      <div
        className={`flex-1 min-w-0 transition-all duration-300
          ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
      >
        <p className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm">
          {user.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {user.email}
        </p>
      </div>
    </Link>
  );
}
