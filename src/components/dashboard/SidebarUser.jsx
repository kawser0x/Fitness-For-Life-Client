"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const userNavItems = [
  { label: "Booked Classes", href: "/dashboard/user/booked-classes" },
  { label: "Apply Trainer", href: "/dashboard/user/apply-trainer" },
  { label: "Favorites", href: "/dashboard/user/favorites" },
];

export default function SidebarUser() {
  const pathname = usePathname();

  return (
    <aside className="w-72 min-h-screen bg-slate-950 p-6 flex flex-col text-slate-100 border-r border-slate-800">
      <div className="text-xl font-bold mb-8 px-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
        User Dashboard
      </div>

      <nav className="flex flex-col gap-3">
        {userNavItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 h-12 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50"
                  : "bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-cyan-300 border border-slate-800"
              }`}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
