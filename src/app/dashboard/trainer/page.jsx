"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaDumbbell,
  FaUsers,
  FaUserGraduate,
  FaEnvelope,
  FaIdBadge,
  FaCalendarCheck,
  FaPlus,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";
import { useAuthQuery } from "better-auth/client";

export default function TrainerOverviewPage() {
  const { user: authUser } = useAuthQuery();

  const trainer = {
    name: authUser?.name || "Elena Rostova",
    email: authUser?.email || "elena.rostova@fitness.com",
    role: "Trainer",
    joinDate: "July 2026",
    avatar: authUser?.image || "/assets/logo.png",
  };

  // Mock statistics according to PDF Requirements
  const stats = {
    totalClassesCreated: 8,
    totalStudentsEnrolled: 154,
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner - Blue & Cyan Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-transparent p-6 rounded-2xl border border-blue-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-600 dark:text-cyan-400 border border-blue-500/30 flex items-center gap-1.5">
              <FaUserGraduate className="h-3 w-3" />
              Trainer Badge
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Welcome, Trainer {trainer.name}! 💪
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your fitness classes, view enrolled students, and share
            expertise on the forum.
          </p>
        </div>
        <Button
          as={Link}
          href="/dashboard/trainer/add-class"
          className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-md shrink-0"
          startContent={<FaPlus className="h-3.5 w-3.5" />}>
          Create New Class
        </Button>
      </div>

      {/* 1. Statistics Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Total Classes Created Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Classes Created
            </p>
            <h3 className="text-3xl font-black text-foreground">
              {stats.totalClassesCreated}
            </h3>
            <Link
              href="/dashboard/trainer/my-classes"
              className="inline-block text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline pt-1">
              View My Classes →
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
            <FaDumbbell className="h-7 w-7" />
          </div>
        </motion.div>

        {/* Total Students Enrolled Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Students Enrolled
            </p>
            <h3 className="text-3xl font-black text-foreground">
              {stats.totalStudentsEnrolled}
            </h3>
            <Link
              href="/dashboard/trainer/my-classes"
              className="inline-block text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline pt-1">
              View Attendees List →
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <FaUsers className="h-7 w-7" />
          </div>
        </motion.div>
      </div>

      {/* 2. Trainer Profile Details Card */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-1 shrink-0">
              <div className="w-full h-full bg-background rounded-full flex items-center justify-center font-bold text-xl text-foreground">
                <Image
                  src={trainer.avatar}
                  alt={trainer.name}
                  width={60}
                  height={60}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {trainer.name}
              </h3>
              <p className="text-xs text-muted-foreground">{trainer.email}</p>
            </div>
          </div>

          <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-500/15 text-blue-600 dark:text-cyan-400 border border-blue-500/30 flex items-center gap-1.5">
            <FaUserGraduate className="h-3.5 w-3.5" />
            Verified Trainer
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="p-4 rounded-xl bg-accent/40 border border-border space-y-1">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <FaEnvelope className="h-3.5 w-3.5 text-cyan-500" /> Official
              Email
            </span>
            <p className="font-bold text-foreground truncate">
              {trainer.email}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-accent/40 border border-border space-y-1">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <FaIdBadge className="h-3.5 w-3.5 text-blue-500" /> Platform Role
            </span>
            <p className="font-bold text-foreground">
              Certified Fitness Trainer
            </p>
          </div>

          <div className="p-4 rounded-xl bg-accent/40 border border-border space-y-1">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <FaCalendarCheck className="h-3.5 w-3.5 text-cyan-500" /> Active
              Since
            </span>
            <p className="font-bold text-foreground">{trainer.joinDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
