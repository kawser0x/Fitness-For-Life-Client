"use client";

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
  FaCircleXmark,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";

export default function UserOverviewPage() {
  // Mock statistics and profile state according to assignment PDF
  const stats = {
    totalBookedClasses: 4,
    totalFavorites: 6,
    // Trainer application status: "Pending" | "Rejected" | "Approved" | "Not Applied"
    trainerApplicationStatus: "Pending",
    adminFeedback:
      "Your application has been received and is currently under review by our admin team.",
  };

  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "User (Member)",
    joinDate: "August 2026",
    avatar: "/assets/logo.png",
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-transparent p-6 rounded-2xl border border-blue-500/20">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your registered classes, manage favorites, and monitor your
            trainer application status.
          </p>
        </div>
        <Button
          as={Link}
          href="/classes"
          className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-md shrink-0"
          endContent={<FaArrowRight className="h-3.5 w-3.5" />}>
          Explore Classes
        </Button>
      </div>

      {/* 1. Statistics Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Booked Classes Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Booked Classes
            </p>
            <h3 className="text-3xl font-black text-foreground">
              {stats.totalBookedClasses}
            </h3>
            <Link
              href="/dashboard/user/booked-classes"
              className="inline-block text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline pt-1">
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
          className="p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Favorites
            </p>
            <h3 className="text-3xl font-black text-foreground">
              {stats.totalFavorites}
            </h3>
            <Link
              href="/dashboard/user/favorites"
              className="inline-block text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline pt-1">
              Manage Favorites →
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <FaHeart className="h-7 w-7" />
          </div>
        </motion.div>

        {/* Application Status Quick Stat */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
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
              className="inline-block text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline pt-2">
              View Details →
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <FaUserGraduate className="h-7 w-7" />
          </div>
        </motion.div>
      </div>

      {/* 2. User Profile Details & Trainer Application Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="lg:col-span-1 p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-1 shrink-0">
              <div className="w-full h-full bg-background rounded-full flex items-center justify-center font-bold text-xl text-foreground">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={60}
                  height={60}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{user.name}</h3>
              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                {user.role}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-border text-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-2">
                <FaEnvelope className="h-4 w-4 text-cyan-500" /> Email:
              </span>
              <span className="font-medium text-foreground truncate max-w-[180px]">
                {user.email}
              </span>
            </div>

            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-2">
                <FaIdBadge className="h-4 w-4 text-blue-500" /> Account Type:
              </span>
              <span className="font-semibold text-foreground">
                Standard Member
              </span>
            </div>

            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-2">
                <FaUserCheck className="h-4 w-4 text-emerald-500" /> Member
                Since:
              </span>
              <span className="font-medium text-foreground">
                {user.joinDate}
              </span>
            </div>
          </div>
        </div>

        {/* Trainer Application Status & Admin Feedback Box */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FaUserGraduate className="h-5 w-5 text-cyan-500" />
                Trainer Application Status
              </h3>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                Status: {stats.trainerApplicationStatus}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              Members can apply to become verified trainers on FitnessForLife to
              list their own classes and create community forum posts.
            </p>

            {/* Application Feedback Box */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <FaCircleInfo className="h-4 w-4 text-amber-500" />
                Admin Feedback Notice
              </div>
              <p className="text-sm leading-relaxed">"{stats.adminFeedback}"</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              Need to update your experience or specialty information?
            </p>
            <Button
              as={Link}
              href="/dashboard/user/apply-trainer"
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold">
              Update Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
