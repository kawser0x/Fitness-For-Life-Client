"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import Image from "next/image";
import logo from "../../../public/assets/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  // Navigation Links
  const navItems = [
    { label: "Home", href: "/" },
    { label: "All Classes", href: "/classes" },
    { label: "Community Forum", href: "/forum" },
  ];

  // Helper to determine exact or nested active state
  const isLinkActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleAuthToggle = () => {
    setIsLoggedIn(!isLoggedIn);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-divider bg-background/80 backdrop-blur-md">
      <header className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6">
        {/* Brand Logo & Name */}
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

        {/* Desktop Menu & Auth Button */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const active = isLinkActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative px-3.5 py-1.5 text-sm font-medium transition-colors rounded-full ${
                      active
                        ? "text-cyan-500 font-semibold bg-primary/10"
                        : "text-foreground-600 hover:text-foreground hover:bg-default-100"
                    }`}
                    aria-current={active ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="h-5 w-[1px] bg-divider" />

          <Button
            size="sm"
            color={isLoggedIn ? "danger" : "primary"}
            variant={isLoggedIn ? "flat" : "solid"}
            radius="full"
            className="px-5 font-semibold shadow-sm"
            onPress={handleAuthToggle}>
            {isLoggedIn ? "Logout" : "Login"}
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden">
          <button
            className="p-1.5 text-foreground rounded-lg hover:bg-default-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}>
            <span className="sr-only">Menu</span>
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
        <div className="border-t border-divider md:hidden bg-background px-4 py-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isLinkActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground-700 hover:bg-default-100"
                    }`}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="mt-3 border-t border-divider pt-3">
              <Button
                size="sm"
                color={isLoggedIn ? "danger" : "primary"}
                variant={isLoggedIn ? "flat" : "solid"}
                className="w-full justify-center font-semibold"
                onPress={handleAuthToggle}>
                {isLoggedIn ? "Logout" : "Login"}
              </Button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
