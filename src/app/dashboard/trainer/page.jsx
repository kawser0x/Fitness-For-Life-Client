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
  FaChartColumn,
} from "react-icons/fa6";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
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

  // Recharts Trainer Monthly Attendance & Bookings Data
  const attendanceData = [
    { day: "Mon", HIIT: 24, Yoga: 18, Strength: 12 },
    { day: "Tue", HIIT: 20, Yoga: 22, Strength: 15 },
    { day: "Wed", HIIT: 30, Yoga: 25, Strength: 18 },
    { day: "Thu", HIIT: 25, Yoga: 20, Strength: 14 },
    { day: "Fri", HIIT: 32, Yoga: 28, Strength: 22 },
    { day: "Sat", HIIT: 40, Yoga: 35, Strength: 30 },
    { day: "Sun", HIIT: 28, Yoga: 30, Strength: 20 },
  ];

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

      {/* 2. RECHARTS ATTENDANCE & BOOKING ANALYTICS */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <FaChartColumn className="h-5 w-5 text-cyan-500" />
              Weekly Class Attendance Analytics
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live student attendance tracking across your hosted sessions.
            </p>
          </div>
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            Recharts Analytics
          </span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={attendanceData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis
                dataKey="day"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
              />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "12px",
                  borderColor: "#334155",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Bar
                dataKey="HIIT"
                name="HIIT & Cardio"
                fill="#06b6d4"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="Yoga"
                name="Vinyasa Yoga"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="Strength"
                name="Heavy Weight Sculpt"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Trainer Profile Details Card */}
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
