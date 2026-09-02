"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  FaChartPie, 
  FaUsers, 
  FaUserCheck, 
  FaListCheck, 
  FaPenToSquare, 
  FaNewspaper,
  FaArrowLeft,
  FaShieldHalved,
  FaLock,
  FaSpinner
} from "react-icons/fa6";
import { useSession } from "@/lib/auth-client";

export default function AdminDashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Verify Role from Backend MongoDB API
  const verifyRole = useCallback(async () => {
    if (!user?.email) {
      setCheckingRole(false);
      return;
    }
    try {
      setCheckingRole(true);
      const res = await fetch(`${API_URL}/api/user/role/${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setRole(data.role || "user");
        if (data.role !== "admin") {
          console.warn(`Unauthorized access attempt to /dashboard/admin by ${user.email} with role: ${data.role}`);
          if (data.role === "trainer") {
            router.replace("/dashboard/trainer");
          } else {
            router.replace("/dashboard/user");
          }
        }
      }
    } catch (err) {
      console.error("Error verifying admin role:", err);
    } finally {
      setCheckingRole(false);
    }
  }, [API_URL, user?.email, router]);

  useEffect(() => {
    setMounted(true);
    if (!isPending) {
      if (!user) {
        router.replace("/login");
      } else {
        verifyRole();
      }
    }
  }, [isPending, user, verifyRole, router]);

  if (!mounted || isPending || checkingRole) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 p-4">
        <FaSpinner className="h-10 w-10 text-cyan-500 animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">
          Verifying Super Administrator credentials & role security...
        </p>
      </div>
    );
  }

  // Access Denied Protection Guard
  if (role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 text-2xl">
          <FaLock />
        </div>
        <h1 className="text-2xl font-black text-foreground">Access Denied (403 Unauthorized)</h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          You do not have permission to view the Super Administrator Dashboard. Redirecting you to your authorized dashboard...
        </p>
      </div>
    );
  }

  const displayName = user?.name || user?.email?.split("@")[0] || "Admin";
  const firstLetter = displayName.charAt(0).toUpperCase();

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard/admin",
      icon: FaChartPie,
    },
    {
      label: "All Users",
      href: "/dashboard/admin/users",
      icon: FaUsers,
    },
    {
      label: "Applied Trainers",
      href: "/dashboard/admin/applied-trainers",
      icon: FaUserCheck,
    },
    {
      label: "Manage Classes",
      href: "/dashboard/admin/manage-classes",
      icon: FaListCheck,
    },
    {
      label: "Add Forum Post",
      href: "/dashboard/admin/add-post",
      icon: FaPenToSquare,
    },
    {
      label: "Manage Forum Posts",
      href: "/dashboard/admin/manage-posts",
      icon: FaNewspaper,
    },
  ];

  const isLinkActive = (href) => {
    if (href === "/dashboard/admin") {
      return pathname === "/dashboard/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/60 backdrop-blur-md p-4 space-y-6 shrink-0">
        {/* Admin Profile Card */}
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shrink-0">
            <div className="w-full h-full bg-card rounded-full flex items-center justify-center font-bold text-foreground uppercase">
              {firstLetter}
            </div>
          </div>
          <div className="overflow-hidden text-ellipsis">
            <p className="text-sm font-semibold truncate text-foreground">{displayName}</p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 uppercase">
              <FaShieldHalved className="h-2.5 w-2.5" />
              ADMIN Badge
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-border space-y-2">
          <Link
            href="/"
            className="w-full inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition">
            <FaArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Public Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Responsive Navigation */}
        <div className="md:hidden p-3 border-b border-border bg-card/80 backdrop-blur-md">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 touch-pan-x">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isLinkActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 shrink-0 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all active:scale-95 touch-manipulation ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent shadow-md shadow-blue-500/20"
                      : "bg-card border-border text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
