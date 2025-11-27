"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSession } from "~/server/better-auth/server";

export function UserButton() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const session = await getSession();
      setUserId(session?.user?.id ?? null);
    }
    fetchUser();
  }, []);

  if (!userId) return null;

  return (
    <Link
      href={`/profile/${userId}`}
      className="px-3 py-1 flex gap-2 rounded-md bg-primary text-white"
    >

      <User className="h-5 w-5" />
      Profile
    </Link>
  );
}
