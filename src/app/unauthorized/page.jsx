"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaLock, FaRightToBracket, FaHouse, FaShieldHalved } from "react-icons/fa6";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 text-center relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 relative z-10">
        
        {/* Status Badge & Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 shadow-inner">
          <FaLock className="h-9 w-9" />
        </div>

        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 inline-flex items-center gap-1.5">
            <FaShieldHalved className="h-3 w-3" /> Error 401 • Unauthorized
          </span>
          <h1 className="text-3xl font-black text-foreground tracking-tight pt-1">
            Authentication Required
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You must be logged in to access this protected area. Please sign in with your account credentials to view this page.
          </p>
        </div>

        {/* Action Buttons with Native Links & Handlers */}
        <div className="space-y-3 pt-2">
          <Link
            href="/login"
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2">
            <FaRightToBracket className="h-4 w-4" />
            <span>Log In to Continue</span>
          </Link>

          <Link
            href="/"
            className="w-full py-3.5 bg-accent border border-border text-foreground font-bold text-sm rounded-2xl hover:bg-accent/70 transition flex items-center justify-center gap-2">
            <FaHouse className="h-4 w-4 text-cyan-500" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
