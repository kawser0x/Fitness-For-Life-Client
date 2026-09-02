"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaScrewdriverWrench, FaHouse, FaCircleInfo, FaArrowLeft } from "react-icons/fa6";

export default function NotImplementedPage() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 text-center relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 relative z-10">
        
        {/* Status Badge & Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner">
          <FaScrewdriverWrench className="h-9 w-9" />
        </div>

        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 inline-flex items-center gap-1.5">
            <FaCircleInfo className="h-3 w-3" /> Error 501 • Not Implemented
          </span>
          <h1 className="text-3xl font-black text-foreground tracking-tight pt-1">
            Feature Under Construction
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The requested server functionality or page feature is currently not implemented or is scheduled for a future platform update.
          </p>
        </div>

        {/* Action Buttons with Native Links & Handlers */}
        <div className="space-y-3 pt-2">
          <Link
            href="/"
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2">
            <FaHouse className="h-4 w-4" />
            <span>Back to Homepage</span>
          </Link>

          <button
            type="button"
            onClick={handleGoBack}
            className="w-full py-3.5 bg-accent border border-border text-foreground font-bold text-sm rounded-2xl hover:bg-accent/70 transition flex items-center justify-center gap-2 cursor-pointer">
            <FaArrowLeft className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Go Back to Previous Page</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
