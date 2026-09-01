"use client";

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
  FaChartPie
} from "react-icons/fa6";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
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
import { useAuthQuery } from "better-auth/client";

export default function AdminOverviewPage() {
  const { user: authUser } = useAuthQuery();

  const admin = {
    name: authUser?.name || "System Administrator",
    email: authUser?.email || "admin@ironpulse.com",
    role: "Admin",
    joinDate: "January 2026",
    avatar: authUser?.image || "/assets/logo.png",
  };

  // Mock Admin statistics according to PDF Requirements
  const stats = {
    totalRevenue: "$12,480.00",
    totalSubscribers: 1240,
    totalUsers: 480,
    totalTrainers: 24,
    totalClasses: 36,
    pendingTrainerApplications: 3,
  };

  // Monthly Analytics Data for Recharts Area/Bar Chart
  const monthlyData = [
    { month: "Jan", revenue: 4200, members: 120, bookings: 150 },
    { month: "Feb", revenue: 5800, members: 190, bookings: 230 },
    { month: "Mar", revenue: 7100, members: 260, bookings: 310 },
    { month: "Apr", revenue: 8400, members: 320, bookings: 420 },
    { month: "May", revenue: 9900, members: 390, bookings: 530 },
    { month: "Jun", revenue: 11200, members: 440, bookings: 640 },
    { month: "Jul", revenue: 12480, members: 480, bookings: 720 },
  ];

  // Class Category Distribution Data for Recharts Pie Chart
  const categoryData = [
    { name: "HIIT & Cardio", value: 35, color: "#06b6d4" },
    { name: "Yoga & Stretch", value: 25, color: "#3b82f6" },
    { name: "Strength", value: 20, color: "#10b981" },
    { name: "Pilates", value: 12, color: "#8b5cf6" },
    { name: "Boxing", value: 8, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner - Blue & Cyan Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-transparent p-6 rounded-2xl border border-blue-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
              <FaShieldHalved className="h-3 w-3" />
              Administrator Control Panel
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Welcome, Admin {admin.name}! 🛡️
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage users, evaluate trainer applications, approve classes, and monitor platform analytics.
          </p>
        </div>
      </div>

      {/* 1. Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Revenue
            </p>
            <h3 className="text-2xl font-black text-emerald-500">{stats.totalRevenue}</h3>
            <p className="text-[11px] text-muted-foreground font-medium">
              {stats.totalSubscribers} Newsletter Subscribers
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <FaDollarSign className="h-6 w-6" />
          </div>
        </motion.div>

        {/* Total Registered Users Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Members
            </p>
            <h3 className="text-2xl font-black text-foreground">{stats.totalUsers}</h3>
            <Link
              href="/dashboard/admin/users"
              className="inline-block text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline pt-1"
            >
              Manage All Users →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
            <FaUsers className="h-6 w-6" />
          </div>
        </motion.div>

        {/* Total Verified Trainers Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Verified Trainers
            </p>
            <h3 className="text-2xl font-black text-foreground">{stats.totalTrainers}</h3>
            <Link
              href="/dashboard/admin/applied-trainers"
              className="inline-block text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline pt-1"
            >
              View Trainers List →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <FaUserGraduate className="h-6 w-6" />
          </div>
        </motion.div>

        {/* Pending Applications Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Applications
            </p>
            <h3 className="text-2xl font-black text-amber-500">{stats.pendingTrainerApplications}</h3>
            <Link
              href="/dashboard/admin/applied-trainers"
              className="inline-block text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline pt-1"
            >
              Review Applications →
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
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <FaChartLine className="h-5 w-5 text-cyan-500" />
                Platform Growth & Revenue ($)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Monthly revenue trajectory and member subscription growth over 2026.
              </p>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
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
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <FaChartPie className="h-5 w-5 text-blue-500" />
              Class Category Ratio
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Distribution of popular fitness session categories.
            </p>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", borderColor: "#334155", color: "#fff", fontSize: "12px" }}
                  formatter={(val) => `${val}%`}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Admin Profile Details Card */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-1 shrink-0">
              <div className="w-full h-full bg-background rounded-full flex items-center justify-center font-bold text-xl text-foreground">
                <Image
                  src={admin.avatar}
                  alt={admin.name}
                  width={60}
                  height={60}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{admin.name}</h3>
              <p className="text-xs text-muted-foreground">{admin.email}</p>
            </div>
          </div>

          <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-500/15 text-blue-600 dark:text-cyan-400 border border-blue-500/30 flex items-center gap-1.5">
            <FaShieldHalved className="h-3.5 w-3.5" />
            Super Administrator Badge
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="p-4 rounded-xl bg-accent/40 border border-border space-y-1">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <FaEnvelope className="h-3.5 w-3.5 text-cyan-500" /> Admin Email
            </span>
            <p className="font-bold text-foreground truncate">{admin.email}</p>
          </div>

          <div className="p-4 rounded-xl bg-accent/40 border border-border space-y-1">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <FaIdBadge className="h-3.5 w-3.5 text-blue-500" /> Security Access
            </span>
            <p className="font-bold text-foreground">Full Platform Permissions</p>
          </div>

          <div className="p-4 rounded-xl bg-accent/40 border border-border space-y-1">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <FaCalendarCheck className="h-3.5 w-3.5 text-cyan-500" /> Member Since
            </span>
            <p className="font-bold text-foreground">{admin.joinDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
