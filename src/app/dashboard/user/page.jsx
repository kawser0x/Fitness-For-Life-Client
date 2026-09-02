"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaCalendarCheck,
  FaHeart,
  FaUserGraduate,
  FaUserCheck,
  FaCircleInfo,
  FaEnvelope,
  FaIdBadge,
  FaArrowRight,
  FaClock,
  FaSpinner,
} from "react-icons/fa6";
import { useSession } from "@/lib/auth-client";
import { getAuthHeaders } from "@/lib/jwt";

export default function UserOverviewPage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Hydration safety check to prevent SSR/Client mismatches
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [stats, setStats] = useState({
    totalBookedClasses: 0,
    totalFavorites: 0,
    trainerApplicationStatus: "Not Applied",
    adminFeedback: "",
  });
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch Real User Statistics from Backend MongoDB
  const fetchUserStats = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const authHeaders = await getAuthHeaders(user.email);
      const res = await fetch(`${API_URL}/api/user/stats/${encodeURIComponent(user.email)}`, {
        headers: authHeaders,
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, user?.email]);

  useEffect(() => {
    if (user?.email) {
      fetchUserStats();
    } else {
      setLoading(false);
    }
  }, [user?.email, fetchUserStats]);

  const userName = mounted
    ? user?.name || user?.email?.split("@")[0] || "Member"
    : "Member";
  const userEmail = mounted ? user?.email : "user@example.com";
  const userRole = mounted ? user?.role || "user" : "user";
  const firstLetter = userName ? userName.charAt(0).toUpperCase() : "U";
  const hasCustomImage =
    mounted &&
    user?.image &&
    typeof user.image === "string" &&
    (user.image.startsWith("http://") || user.image.startsWith("https://"));

  const joinDate =
    mounted && user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
      : "Recent Member";

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-transparent p-6 rounded-3xl border border-blue-500/20">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
            Welcome back, <span className="text-cyan-500">{userName}</span> ! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your registered classes, manage favorite workouts, and monitor your trainer application status.
          </p>
        </div>
        <Link
          href="/classes"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-md shrink-0 hover:from-blue-700 hover:to-cyan-600 transition">
          <span>Explore Classes</span>
          <FaArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 1. Statistics Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Booked Classes Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-3xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Booked Classes
            </p>
            <h3 className="text-3xl font-black text-foreground">
              {loading ? <FaSpinner className="h-6 w-6 animate-spin text-cyan-500" /> : stats.totalBookedClasses}
            </h3>
            <Link
              href="/dashboard/user/booked-classes"
              className="inline-block text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline pt-1">
              View Booked List →
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
            <FaCalendarCheck className="h-7 w-7" />
          </div>
        </motion.div>

        {/* Total Favorites Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-3xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Saved Favorites
            </p>
            <h3 className="text-3xl font-black text-foreground">
              {loading ? <FaSpinner className="h-6 w-6 animate-spin text-cyan-500" /> : stats.totalFavorites}
            </h3>
            <Link
              href="/dashboard/user/favorites"
              className="inline-block text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline pt-1">
              Manage Favorites →
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <FaHeart className="h-7 w-7" />
          </div>
        </motion.div>

        {/* Application Status Quick Stat */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-3xl bg-card border border-border shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Trainer Application
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <FaClock className="h-3 w-3 animate-spin [animation-duration:3s]" />
                {stats.trainerApplicationStatus}
              </span>
            </div>
            <Link
              href="/dashboard/user/apply-trainer"
              className="inline-block text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline pt-2">
              View Application →
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <FaUserGraduate className="h-7 w-7" />
          </div>
        </motion.div>
      </div>

      {/* 2. Dynamic User Profile Details & Application Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-card border border-border shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shrink-0">
              <div className="w-full h-full bg-card rounded-full overflow-hidden flex items-center justify-center font-black text-xl text-cyan-500">
                {hasCustomImage ? (
                  <Image
                    src={user.image}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span>{firstLetter}</span>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-foreground">{userName}</h3>
              <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 uppercase">
                {userRole} Member
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-border text-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-2 font-semibold">
                <FaEnvelope className="h-4 w-4 text-cyan-500" /> Email:
              </span>
              <span className="font-bold text-foreground truncate max-w-[180px]">
                {userEmail}
              </span>
            </div>

            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-2 font-semibold">
                <FaIdBadge className="h-4 w-4 text-blue-500" /> Account Role:
              </span>
              <span className="font-bold text-foreground capitalize">
                {userRole}
              </span>
            </div>

            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-2 font-semibold">
                <FaUserCheck className="h-4 w-4 text-emerald-500" /> Joined:
              </span>
              <span className="font-bold text-foreground">
                {joinDate}
              </span>
            </div>
          </div>
        </div>

        {/* Trainer Application Status & Admin Feedback Box */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-card border border-border shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FaUserGraduate className="h-5 w-5 text-cyan-500" />
                Trainer Application Status
              </h3>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                {stats.trainerApplicationStatus}
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Members can apply to become verified trainers on FitnessForLife to list their own classes and create community forum posts.
            </p>

            {/* Admin Feedback Notice */}
            {stats.adminFeedback ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  <FaCircleInfo className="h-4 w-4 text-amber-500" />
                  Admin Feedback Notice
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">"{stats.adminFeedback}"</p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-accent/40 border border-border text-xs text-muted-foreground">
                No feedback received yet. Submit an application below to get evaluated by the admin team.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              Need to apply or update your coaching experience?
            </p>
            <Link
              href="/dashboard/user/apply-trainer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-md hover:from-blue-700 hover:to-cyan-600 transition">
              Apply / Update Application
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
