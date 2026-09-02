"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FaDollarSign, 
  FaUsers, 
  FaUserGraduate, 
  FaClock, 
  FaShieldHalved, 
  FaEnvelope, 
  FaIdBadge,
  FaCalendarCheck,
  FaChartLine,
  FaChartPie,
  FaSpinner,
  FaDumbbell
} from "react-icons/fa6";
import { 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { useSession } from "@/lib/auth-client";

const isValidDirectImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  if ((url.includes("ibb.co/") || url.includes("ibb.co.com/")) && !url.includes("i.ibb.co")) {
    return false;
  }
  return url.startsWith("http://") || url.startsWith("https://");
};

export default function AdminOverviewPage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Hydration safety check
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalTrainers: 0,
    totalClasses: 0,
    pendingClasses: 0,
    approvedClasses: 0,
    pendingTrainerApplications: 0,
    totalBookings: 0,
    totalRevenue: "$0.00",
    categoryData: [
      { name: "HIIT & Cardio", value: 35, color: "#06b6d4" },
      { name: "Yoga & Flex", value: 25, color: "#3b82f6" },
      { name: "Strength", value: 20, color: "#10b981" },
    ],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/admin/stats`);
        if (!res.ok) throw new Error("Failed to load admin statistics");
        const data = await res.json();
        setAdminStats(data);
      } catch (error) {
        console.error("Error loading admin stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [API_URL]);

  const adminName = mounted
    ? user?.name || user?.email?.split("@")[0] || "Administrator"
    : "Administrator";
  const adminEmail = user?.email || "admin@ironpulse.com";
  const firstLetter = adminName.charAt(0).toUpperCase();

  const hasValidAvatar =
    mounted &&
    user?.image &&
    isValidDirectImageUrl(user.image) &&
    !imageError;

  // Monthly Analytics Data for Recharts Area Chart
  const monthlyData = [
    { month: "Jan", revenue: 1200, members: 10, bookings: 15 },
    { month: "Feb", revenue: 2800, members: 25, bookings: 35 },
    { month: "Mar", revenue: 4100, members: 40, bookings: 60 },
    { month: "Apr", revenue: 5400, members: 65, bookings: 90 },
    { month: "May", revenue: 7900, members: 95, bookings: 130 },
    { month: "Jun", revenue: 9200, members: 130, bookings: 170 },
    { month: "Jul", revenue: 11480, members: 180, bookings: 220 },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-transparent p-6 rounded-3xl border border-blue-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5 uppercase tracking-wider">
              <FaShieldHalved className="h-3 w-3" />
              Administrator Control Panel
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Welcome back, <span className="text-cyan-500">{adminName}</span>! 🛡️
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage registered users, review trainer applications, monitor workout programs, and track platform revenue.
          </p>
        </div>
      </div>

      {/* 1. Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-3xl bg-card border border-border shadow-sm flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Revenue
            </p>
            <h3 className="text-2xl font-black text-emerald-500">
              {loading ? <FaSpinner className="h-6 w-6 animate-spin text-emerald-500" /> : adminStats.totalRevenue}
            </h3>
            <p className="text-[11px] text-muted-foreground font-medium">
              {adminStats.totalBookings} Total Class Bookings
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <FaDollarSign className="h-6 w-6" />
          </div>
        </motion.div>

        {/* Total Members Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-3xl bg-card border border-border shadow-sm flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Platform Users
            </p>
            <h3 className="text-2xl font-black text-foreground">
              {loading ? <FaSpinner className="h-6 w-6 animate-spin text-cyan-500" /> : adminStats.totalUsers}
            </h3>
            <Link
              href="/dashboard/admin/users"
              className="inline-block text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline pt-1"
            >
              Manage All Users →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
            <FaUsers className="h-6 w-6" />
          </div>
        </motion.div>

        {/* Verified Trainers Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-3xl bg-card border border-border shadow-sm flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Verified Trainers
            </p>
            <h3 className="text-2xl font-black text-foreground">
              {loading ? <FaSpinner className="h-6 w-6 animate-spin text-cyan-500" /> : adminStats.totalTrainers}
            </h3>
            <Link
              href="/dashboard/admin/applied-trainers"
              className="inline-block text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline pt-1"
            >
              View Applications →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <FaUserGraduate className="h-6 w-6" />
          </div>
        </motion.div>

        {/* Pending Applications Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-3xl bg-card border border-border shadow-sm flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Applications
            </p>
            <h3 className="text-2xl font-black text-amber-500">
              {loading ? <FaSpinner className="h-6 w-6 animate-spin text-amber-500" /> : adminStats.pendingTrainerApplications}
            </h3>
            <Link
              href="/dashboard/admin/applied-trainers"
              className="inline-block text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline pt-1"
            >
              Review Pending Applications →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <FaClock className="h-6 w-6" />
          </div>
        </motion.div>
      </div>

      {/* 2. RECHARTS VISUAL ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Area Chart: Platform Revenue Growth */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <FaChartLine className="h-5 w-5 text-cyan-500" />
                Platform Growth & Revenue ($)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Monthly revenue trajectory and member subscription growth.
              </p>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              Live Recharts
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", borderColor: "#334155", color: "#fff", fontSize: "12px" }}
                  itemStyle={{ color: "#38bdf8" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#06b6d4" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                <Area type="monotone" dataKey="members" name="Members Count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMembers)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recharts Pie Chart: Class Category Distribution */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <FaChartPie className="h-5 w-5 text-blue-500" />
              Class Category Ratio
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Distribution of popular workout categories in database.
            </p>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={adminStats.categoryData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(adminStats.categoryData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", borderColor: "#334155", color: "#fff", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Admin Profile Details Card */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shrink-0">
              <div className="w-full h-full bg-card rounded-full overflow-hidden flex items-center justify-center font-black text-xl text-cyan-500 uppercase">
                {hasValidAvatar ? (
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
              <h3 className="text-xl font-bold text-foreground">{adminName}</h3>
              <p className="text-xs text-muted-foreground">{adminEmail}</p>
            </div>
          </div>

          <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-500/15 text-blue-600 dark:text-cyan-400 border border-blue-500/30 flex items-center gap-1.5">
            <FaShieldHalved className="h-3.5 w-3.5" />
            Super Administrator Badge
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-accent/40 border border-border space-y-1">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <FaEnvelope className="h-3.5 w-3.5 text-cyan-500" /> Admin Email:
            </span>
            <p className="font-bold text-foreground truncate">{adminEmail}</p>
          </div>

          <div className="p-4 rounded-2xl bg-accent/40 border border-border space-y-1">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <FaIdBadge className="h-3.5 w-3.5 text-blue-500" /> Security Access:
            </span>
            <p className="font-bold text-foreground">Full System Authorization</p>
          </div>

          <div className="p-4 rounded-2xl bg-accent/40 border border-border space-y-1">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <FaCalendarCheck className="h-3.5 w-3.5 text-cyan-500" /> Total Classes Managed:
            </span>
            <p className="font-bold text-foreground">{adminStats.totalClasses} Workout Sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
