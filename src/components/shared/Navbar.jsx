"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "../../../public/assets/logo.png";
import Theme from "./Theme";
import { useSession, signOut } from "@/lib/auth-client";

const isValidDirectImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  // ImgBB viewer webpage links (e.g. https://ibb.co/xxx or https://ibb.co.com/xxx) are HTML, not direct image files (i.ibb.co/xxx)
  if ((url.includes("ibb.co/") || url.includes("ibb.co.com/")) && !url.includes("i.ibb.co")) {
    return false;
  }
  return url.startsWith("http://") || url.startsWith("https://");
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  // Retrieve authenticated session
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const userRole = user?.role || "user";

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine Dashboard route based on user role (Admin, Trainer, Member)
  const getDashboardHref = (role) => {
    switch (role) {
      case "admin":
        return "/dashboard/admin";
      case "trainer":
        return "/dashboard/trainer";
      default:
        return "/dashboard/user";
    }
  };

  // Base navigation items (Dashboard dynamically added when user is logged in)
  const navItems = [
    { label: "Home", href: "/" },
    { label: "All Classes", href: "/classes" },
    { label: "Community Forum", href: "/forum" },
    ...(user ? [{ label: "Dashboard", href: getDashboardHref(userRole) }] : []),
  ];

  const isLinkActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  };

  const hasValidAvatar = user?.image && isValidDirectImageUrl(user.image) && !imageError;
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-divider bg-background/80 backdrop-blur-md">
      <header className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <Image
            src={logo}
            alt="Fitness For Life Logo"
            width={34}
            height={34}
            className="rounded-full object-cover shadow-sm"
          />
          <p className="text-lg font-black tracking-tight text-blue-500">
            <span className="text-cyan-500">Fitness </span>
            For Life
          </p>
        </Link>

        {/* Right (Desktop): Navigation Links + Theme + User Profile / Login */}
        <div className="hidden md:flex items-center gap-4">
          <ul className="flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const active = isLinkActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-cyan-500/10 font-semibold text-cyan-500"
                        : "text-foreground-600 hover:bg-default-100 hover:text-foreground"
                    }`}
                    aria-current={active ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="h-5 w-[1px] bg-divider" />

          <Theme />

          {/* User Auth / Profile Dropdown */}
          {isPending ? (
            <div className="h-9 w-9 rounded-full bg-default-200 animate-pulse" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-all hover:bg-default-100 focus:outline-none">
                <div className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-cyan-500/40 bg-cyan-600 flex items-center justify-center shrink-0">
                  {hasValidAvatar ? (
                    <Image
                      src={user.image}
                      alt=""
                      fill
                      sizes="32px"
                      unoptimized
                      onError={() => setImageError(true)}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-white uppercase">
                      {userInitial}
                    </span>
                  )}
                </div>

                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-foreground-500 leading-tight">
                    Welcome back,
                  </span>
                  <span className="text-xs font-bold max-w-[110px] truncate text-foreground leading-tight">
                    {user.name?.split(" ")[0] || "User"}
                  </span>
                </div>

                <svg
                  className={`h-4 w-4 text-foreground-500 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-divider bg-background/95 p-2 shadow-2xl backdrop-blur-xl z-50">
                  <div className="px-3 py-2 border-b border-divider mb-1">
                    <p className="text-[11px] font-medium text-foreground-500">
                      Welcome back,
                    </p>
                    <p className="text-sm font-bold truncate text-foreground">
                      {user.name || user.email}
                    </p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                      {userRole}
                    </span>
                  </div>

                  <Link
                    href={getDashboardHref(userRole)}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex w-full items-center px-3 py-2 text-sm rounded-xl font-medium text-foreground hover:bg-default-100 transition-colors">
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center px-3 py-2 text-sm rounded-xl font-medium text-danger hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors">
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-5 py-1.5 rounded-full font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm">
              Login
            </Link>
          )}
        </div>

        {/* Right (Mobile): Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Theme />
          <button
            className="rounded-lg p-1.5 text-foreground transition-colors hover:bg-default-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="border-t border-divider bg-background px-4 py-3 shadow-lg md:hidden">
          {user && (
            <div className="flex items-center gap-3 pb-3 mb-2 border-b border-divider">
              <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-cyan-500/40 bg-cyan-600 flex items-center justify-center shrink-0">
                {hasValidAvatar ? (
                  <Image
                    src={user.image}
                    alt=""
                    fill
                    sizes="40px"
                    unoptimized
                    onError={() => setImageError(true)}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-white uppercase">
                    {userInitial}
                  </span>
                )}
              </div>
              <div className="truncate">
                <p className="text-[11px] text-foreground-500">Welcome back,</p>
                <p className="text-sm font-bold truncate text-foreground">
                  {user.name || "User"}
                </p>
                <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                  {userRole}
                </span>
              </div>
            </div>
          )}

          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isLinkActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-cyan-500/10 font-semibold text-cyan-500"
                        : "text-foreground-700 hover:bg-default-100"
                    }`}>
                    {item.label}
                  </Link>
                </li>
              );
            })}

            <li className="mt-3 border-t border-divider pt-3">
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2 rounded-lg text-sm font-semibold text-danger bg-danger-50 dark:bg-danger-900/20 text-center">
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 text-center">
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
