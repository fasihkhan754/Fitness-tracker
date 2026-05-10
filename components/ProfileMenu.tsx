"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import Link from "next/link";

export default function ProfileMenu({ name }: { name: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-black"
      >
        {name}
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-md">

          <Link
            href="/dashboard/profile"
            className="block px-4 py-2 text-sm hover:bg-slate-50"
          >
            Profile
          </Link>

          <Link
            href="/dashboard/settings"
            className="block px-4 py-2 text-sm hover:bg-slate-50"
          >
            Settings
          </Link>

          <div className="border-t my-1"></div>

          <div className="px-4 py-2">
            <LogoutButton />
          </div>

        </div>
      )}
    </div>
  );
}