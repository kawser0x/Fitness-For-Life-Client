"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaDumbbell,
  FaTag,
  FaCalendarDays,
  FaUserGraduate,
  FaClock,
  FaHeart,
  FaRegHeart,
  FaArrowLeft,
  FaSpinner,
  FaCreditCard,
  FaCheck,
  FaShieldHalved,
  FaUsers,
  FaCircleCheck,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";
import { useSession } from "@/lib/auth-client";
import { getAuthHeaders } from "@/lib/jwt";

const FALLBACK_CLASS_IMAGE = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd";

export default function ClassDetailsPage({ params }) {
  const resolvedParams = use(params);
  const classId = resolvedParams?.id;

  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const getValidClassImage = (url) => {
    if (!url || typeof url !== "string") return FALLBACK_CLASS_IMAGE;
    if ((url.includes("ibb.co/") || url.includes("ibb.co.com/")) && !url.includes("i.ibb.co")) {
      return FALLBACK_CLASS_IMAGE;
    }
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
      return url;
    }
    return FALLBACK_CLASS_IMAGE;
  };

  // Fetch Class Details by ID with dual endpoint fallback
  const fetchClassDetails = useCallback(async () => {
    if (!classId) return;
    try {
      setLoading(true);
      let res = await fetch(`${API_URL}/api/classes/details/${classId}`);
      if (!res.ok) {
        res = await fetch(`${API_URL}/api/classes/${classId}`);
      }
      if (!res.ok) {
        throw new Error("Class details not found");
      }
      const data = await res.json();
      setClassData(data);
    } catch (error) {
      console.error("Error loading class details:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, classId]);

  const [userRole, setUserRole] = useState("user");

  // Check if class is already booked or saved in favorites by user
  const checkUserRelations = useCallback(async () => {
    if (!user?.email || !classId) return;
    try {
      const authHeaders = await getAuthHeaders(user.email);

      // Check live user role from database
      const roleRes = await fetch(`${API_URL}/api/user/role/${encodeURIComponent(user.email)}`);
      if (roleRes.ok) {
        const roleData = await roleRes.json();
        if (roleData.role) {
          setUserRole(roleData.role);
        }
      }

      // Check favorites
      const favRes = await fetch(`${API_URL}/api/user/favorites/${encodeURIComponent(user.email)}`, {
        headers: authHeaders,
      });
      if (favRes.ok) {
        const favs = await favRes.json();
        const found = favs.some((f) => f.classId === classId);
        setIsFavorite(found);
      }

      // Check bookings
      const bookRes = await fetch(`${API_URL}/api/user/bookings/${encodeURIComponent(user.email)}`, {
        headers: authHeaders,
      });
      if (bookRes.ok) {
        const books = await bookRes.json();
        const foundBook = books.some((b) => b.classId === classId);
        setIsBooked(foundBook);
      }
    } catch (err) {
      console.error("Error checking user relations:", err);
    }
  }, [API_URL, classId, user?.email]);

  useEffect(() => {
    if (classId) {
      fetchClassDetails();
    }
  }, [classId, fetchClassDetails]);

  useEffect(() => {
    if (user?.email && classId) {
      checkUserRelations();
    }
  }, [user?.email, classId, checkUserRelations]);

  const isTrainerOrAdmin =
    userRole === "trainer" ||
    userRole === "admin" ||
    user?.role === "trainer" ||
    user?.role === "admin" ||
    user?.email?.toLowerCase() === "admin@ironpulse.com";

  // Handle Add / Remove Favorite Toggle connected to Backend MongoDB
  const handleFavoriteToggle = async () => {
    if (isTrainerOrAdmin) {
      toast.info("Trainer & Admin accounts cannot save favorite classes.");
      return;
    }
    if (!user?.email) {
      toast.error("Please login to save favorite classes!");
      return;
    }
    if (!classData) return;

    try {
      setFavoriteLoading(true);
      const authHeaders = await getAuthHeaders(user.email);
      const res = await fetch(`${API_URL}/api/user/favorites/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({
          userEmail: user.email,
          classId: classData._id,
          className: classData.className,
          image: classData.image,
          category: classData.category,
          price: classData.price,
          duration: classData.duration,
          difficultyLevel: classData.difficultyLevel,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update favorite");

      setIsFavorite(data.isFavorite);
      toast.success(data.message);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Handle Book Now Click
  const handleBookNow = () => {
    if (isTrainerOrAdmin) {
      toast.info("Trainer & Admin accounts cannot book classes.");
      return;
    }
    if (!user) {
      toast.error("Please login to book a class!");
      router.push("/login");
      return;
    }

    if (isBooked) {
      toast.info("You have already booked this class!");
      return;
    }

    router.push(`/payment/${classId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 p-4">
        <FaSpinner className="h-10 w-10 text-cyan-500 animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">
          Loading class details...
        </p>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-background py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Class Details Not Found</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          The requested fitness class ID does not exist in the database or may have been removed.
        </p>
        <Button as={Link} href="/classes" className="bg-cyan-500 text-white font-bold">
          Back to All Classes
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href="/classes"
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-cyan-500 transition">
          <FaArrowLeft className="h-3.5 w-3.5" /> Back to All Classes
        </Link>

        {/* 2-GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* GRID 1: FULL CLASS DETAILS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 bg-card border border-border rounded-3xl overflow-hidden shadow-xl space-y-6 p-6 sm:p-8">
            
            {/* Banner Image with Badges */}
            <div className="relative w-full h-80 sm:h-[420px] rounded-2xl overflow-hidden bg-accent border border-border">
              <Image
                src={getValidClassImage(classData.image)}
                alt={classData.className}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Overlay Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold bg-black/60 text-white backdrop-blur-md border border-white/20">
                  <FaTag className="h-3.5 w-3.5 text-cyan-400" />
                  {classData.category}
                </span>

                <button
                  type="button"
                  disabled={favoriteLoading}
                  onClick={handleFavoriteToggle}
                  className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-rose-500 hover:scale-110 transition shadow-lg disabled:opacity-50">
                  {favoriteLoading ? (
                    <FaSpinner className="h-4 w-4 animate-spin text-white" />
                  ) : isFavorite ? (
                    <FaHeart className="h-5 w-5" />
                  ) : (
                    <FaRegHeart className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>

              {/* Overlay Title */}
              <div className="absolute bottom-6 left-6 right-6 space-y-1 text-white">
                <span className="px-3 py-1 rounded-md bg-cyan-500 text-xs font-black uppercase tracking-wider">
                  {classData.difficultyLevel} Level
                </span>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mt-2">
                  {classData.className}
                </h1>
              </div>
            </div>

            {/* Quick Metadata Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-accent/30 border border-border text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px] font-semibold">Trainer</span>
                <span className="font-bold text-foreground flex items-center gap-1 mt-0.5">
                  <FaUserGraduate className="h-3.5 w-3.5 text-cyan-500" />
                  {classData.trainerName || "Certified Trainer"}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px] font-semibold">Duration</span>
                <span className="font-bold text-foreground flex items-center gap-1 mt-0.5">
                  <FaClock className="h-3.5 w-3.5 text-blue-500" />
                  {classData.duration}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px] font-semibold">Class Schedule</span>
                <span className="font-bold text-foreground flex items-center gap-1 mt-0.5 truncate">
                  <FaCalendarDays className="h-3.5 w-3.5 text-emerald-500" />
                  {classData.classSchedule}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px] font-semibold">Enrolled Students</span>
                <span className="font-bold text-foreground flex items-center gap-1 mt-0.5">
                  <FaUsers className="h-3.5 w-3.5 text-amber-500" />
                  {classData.bookingCount || 0} Members
                </span>
              </div>
            </div>

            {/* Full Detailed Description Section */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
                <FaDumbbell className="h-4 w-4 text-cyan-500" />
                Class Overview & Detailed Plan
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {classData.description}
              </p>
            </div>

            {/* Instructor Profile Info */}
            <div className="p-5 rounded-2xl bg-accent/20 border border-border flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shrink-0">
                <div className="w-full h-full bg-card rounded-full flex items-center justify-center font-bold text-foreground">
                  {classData.trainerName ? classData.trainerName.charAt(0) : "T"}
                </div>
              </div>
              <div className="space-y-0.5 text-xs">
                <p className="font-extrabold text-foreground text-sm flex items-center gap-2">
                  Led by {classData.trainerName || "Head Instructor"}
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                    Certified Trainer
                  </span>
                </p>
                <p className="text-muted-foreground">
                  Contact Instructor: {classData.trainerEmail}
                </p>
              </div>
            </div>
          </motion.div>

          {/* GRID 2: BOOK NOW CARD (FRAMER MOTION) */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1 sticky top-24 space-y-6">
            
            <div className="bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
              {/* Top Decorative Glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Pricing Section */}
              <div className="space-y-1 pb-4 border-b border-border">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Session Investment
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-cyan-500">
                    ${typeof classData.price === "number" ? classData.price.toFixed(2) : classData.price}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">/ full session</span>
                </div>
              </div>

              {/* Included Benefits Checklist */}
              <div className="space-y-3 text-xs">
                <span className="font-bold text-foreground uppercase tracking-wider block text-[11px]">
                  What's Included
                </span>

                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FaCircleCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Personalized Training Coaching</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaCircleCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Full Gym Equipment & Locker Access</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaCircleCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Live Q&A & Form Guidance</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaShieldHalved className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
                    <span>100% Satisfaction Guarantee</span>
                  </div>
                </div>
              </div>

              {/* Trainer Account Notice */}
              {isTrainerOrAdmin && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                  <FaShieldHalved className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Trainer / Admin Account: Class booking & favorites are reserved for student members.</span>
                </div>
              )}

              {/* Animated Book Now Button */}
              <motion.div whileHover={{ scale: isTrainerOrAdmin ? 1 : 1.02 }} whileTap={{ scale: isTrainerOrAdmin ? 1 : 0.98 }}>
                <Button
                  disabled={isBooked || isTrainerOrAdmin}
                  onClick={handleBookNow}
                  size="lg"
                  className={`w-full py-3.5 font-bold rounded-2xl shadow-xl transition-all ${
                    isTrainerOrAdmin
                      ? "bg-default-300/40 text-muted-foreground cursor-not-allowed blur-[2px] opacity-60"
                      : isBooked
                      ? "bg-emerald-600 text-white cursor-not-allowed opacity-95"
                      : "bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-white hover:opacity-95 shadow-cyan-500/20"
                  }`}
                  startContent={
                    isBooked ? <FaCheck className="h-4 w-4" /> : <FaCreditCard className="h-4 w-4" />
                  }>
                  {isTrainerOrAdmin
                    ? "Booking Disabled for Trainers"
                    : isBooked
                    ? "Already Booked"
                    : `Book Now • $${classData.price}`}
                </Button>
              </motion.div>

              {/* Secondary Favorite Button */}
              <button
                type="button"
                disabled={favoriteLoading || isTrainerOrAdmin}
                onClick={handleFavoriteToggle}
                className={`w-full py-2.5 rounded-xl border border-border text-xs font-bold transition flex items-center justify-center gap-2 ${
                  isTrainerOrAdmin
                    ? "bg-default-200/30 text-muted-foreground cursor-not-allowed blur-[2px] opacity-60"
                    : "text-foreground hover:bg-accent/40"
                }`}>
                {favoriteLoading ? (
                  <FaSpinner className="h-3.5 w-3.5 animate-spin text-cyan-500" />
                ) : isFavorite ? (
                  <>
                    <FaHeart className="h-3.5 w-3.5 text-rose-500" />
                    Saved in Favorites
                  </>
                ) : (
                  <>
                    <FaRegHeart className="h-3.5 w-3.5 text-muted-foreground" />
                    Save to Favorites
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-muted-foreground">
                Instant confirmation upon Stripe checkout complete.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
