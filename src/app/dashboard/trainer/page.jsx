"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaDumbbell,
  FaUsers,
  FaUserGraduate,
  FaEnvelope,
  FaIdBadge,
  FaPlus,
  FaArrowRight,
  FaClock,
  FaPenToSquare,
  FaNewspaper,
  FaCircleCheck,
  FaSpinner,
} from "react-icons/fa6";
import { useSession } from "@/lib/auth-client";
import { getAuthHeaders } from "@/lib/jwt";

const isValidDirectImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  if ((url.includes("ibb.co/") || url.includes("ibb.co.com/")) && !url.includes("i.ibb.co")) {
    return false;
  }
  return url.startsWith("http://") || url.startsWith("https://");
};

export default function TrainerOverviewPage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Hydration safety check to prevent SSR/Client mismatches
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const trainerName = mounted
    ? user?.name || user?.email?.split("@")[0] || "Coach"
    : "Coach";
  const trainerEmail = user?.email || "";
  const firstLetter = trainerName ? trainerName.charAt(0).toUpperCase() : "C";

  const hasCustomAvatar =
    mounted &&
    user?.image &&
    isValidDirectImageUrl(user.image) &&
    !imageError;

  const trainer = {
    name: trainerName,
    email: trainerEmail ,
    role: "Trainer",
    specialty: "HIIT & Strength Specialist",
    experience: "Certified Coach",
    joinDate: "Active Member",
  };

  const [stats, setStats] = useState({
    totalClassesCreated: 0,
    totalStudentsEnrolled: 0,
    pendingClasses: 0,
    approvedClasses: 0,
    totalForumPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!trainerEmail) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL ;
        const authHeaders = await getAuthHeaders(trainerEmail);
        const res = await fetch(`${API_URL}/api/trainer/stats/${encodeURIComponent(trainerEmail)}`, {
          headers: authHeaders,
        });
        if (!res.ok) throw new Error("Failed to load statistics");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching trainer stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [trainerEmail]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-transparent p-6 rounded-3xl border border-blue-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-blue-500/15 text-blue-600 dark:text-cyan-400 border border-blue-500/30 flex items-center gap-1.5">
              <FaUserGraduate className="h-3 w-3" />
              Verified Trainer Panel
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
            Welcome back, Coach <span className="text-cyan-500">{trainer.name.split(" ")[0]}</span>! 🏋️‍♀️
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your fitness classes, track student enrollments, and publish community articles.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/dashboard/trainer/add-class"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-sm shadow-md transition-all">
            <FaPlus className="h-3.5 w-3.5" />
            <span>Add New Class</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-3xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Classes Created
            </p>
            <h3 className="text-3xl font-black text-foreground">
              {loading ? <FaSpinner className="h-6 w-6 animate-spin text-cyan-500" /> : stats.totalClassesCreated}
            </h3>
            <Link
              href="/dashboard/trainer/my-classes"
              className="inline-block text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline pt-1">
              View All Classes →
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
            <FaDumbbell className="h-7 w-7" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-3xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Students Enrolled
            </p>
            <h3 className="text-3xl font-black text-emerald-500">
              {loading ? <FaSpinner className="h-6 w-6 animate-spin text-emerald-500" /> : stats.totalStudentsEnrolled}
            </h3>
            <p className="text-[11px] text-muted-foreground font-medium pt-1">
              Across all sessions
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <FaUsers className="h-7 w-7" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-3xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Classes
            </p>
            <h3 className="text-3xl font-black text-amber-500">
              {loading ? <FaSpinner className="h-6 w-6 animate-spin text-amber-500" /> : stats.pendingClasses}
            </h3>
            <span className="inline-block text-[11px] font-bold text-amber-600 dark:text-amber-400 pt-1">
              Awaiting Admin Approval
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <FaClock className="h-7 w-7" />
          </div>
        </motion.div>

        {/* Community Posts Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-3xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Forum Posts
            </p>
            <h3 className="text-3xl font-black text-cyan-500">
              {loading ? <FaSpinner className="h-6 w-6 animate-spin text-cyan-500" /> : stats.totalForumPosts}
            </h3>
            <Link
              href="/dashboard/trainer/my-post"
              className="inline-block text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline pt-1">
              Manage Posts →
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <FaNewspaper className="h-7 w-7" />
          </div>
        </motion.div>
      </div>

      {/* 2. Trainer Profile Details & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Details Card */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-card border border-border shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shrink-0">
              <div className="w-full h-full bg-card rounded-full overflow-hidden flex items-center justify-center font-black text-xl text-cyan-500">
                {hasCustomAvatar ? (
                  <Image
                    src={user.image}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span>{firstLetter}</span>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-foreground">{trainer.name}</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-500/15 text-blue-600 dark:text-cyan-400 border border-blue-500/30">
                <FaUserGraduate className="h-3 w-3" />
                Trainer Badge
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-border text-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-2 font-semibold">
                <FaEnvelope className="h-4 w-4 text-cyan-500" /> Email:
              </span>
              <span className="font-bold text-foreground truncate max-w-[180px]">
                {trainer.email}
              </span>
            </div>

            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-2 font-semibold">
                <FaDumbbell className="h-4 w-4 text-blue-500" /> Specialty:
              </span>
              <span className="font-bold text-foreground">
                {trainer.specialty}
              </span>
            </div>

            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-2 font-semibold">
                <FaIdBadge className="h-4 w-4 text-emerald-500" /> Status:
              </span>
              <span className="font-bold text-emerald-500 capitalize">
                Verified Trainer
              </span>
            </div>
          </div>
        </div>

        {/* Quick Management Banner */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-card border border-border shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FaDumbbell className="h-5 w-5 text-cyan-500" />
              Trainer Management Hub
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              As a verified trainer on Fitness For Life, you can publish new workout programs, view student rosters, and publish community articles to build your fitness brand.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Link
                href="/dashboard/trainer/add-class"
                className="p-4 rounded-2xl border border-border bg-accent/30 hover:bg-accent hover:border-cyan-500/40 transition group flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:text-white transition">
                  <FaPlus className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-cyan-500 transition">
                    Create Fitness Class
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Submit new workout session for admin approval.
                  </p>
                </div>
              </Link>

              <Link
                href="/dashboard/trainer/add-post"
                className="p-4 rounded-2xl border border-border bg-accent/30 hover:bg-accent hover:border-cyan-500/40 transition group flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0 group-hover:bg-cyan-500 group-hover:text-white transition">
                  <FaPenToSquare className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-cyan-500 transition">
                    Write Forum Article
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Share nutrition, guides & workout tips.
                  </p>
                </div>
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
              <FaCircleCheck className="h-4 w-4" /> Account Verified & Active
            </span>
            <Link
              href="/dashboard/trainer/my-classes"
              className="font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
              Go to My Classes <FaArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
