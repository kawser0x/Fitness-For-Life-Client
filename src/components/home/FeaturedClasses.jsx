"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaDumbbell,
  FaTag,
  FaUserGraduate,
  FaClock,
  FaUsers,
  FaArrowRight,
  FaSpinner,
  FaFire,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";

const FALLBACK_CLASS_IMAGE = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd";

export default function FeaturedClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

  useEffect(() => {
    async function fetchFeaturedClasses() {
      try {
        setLoading(true);
        // Backend sorts classes by bookingCount descending
        const res = await fetch(`${API_URL}/api/classes?status=Approved&limit=6`);
        if (!res.ok) throw new Error("Failed to fetch featured classes");
        const data = await res.json();
        setClasses(data.classes || []);
      } catch (error) {
        console.error("Error loading featured classes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedClasses();
  }, [API_URL]);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-cyan-950/10 to-background border-b border-border">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 inline-flex items-center gap-2">
            <FaFire className="h-3.5 w-3.5 text-amber-500" /> Most Popular Workout Sessions
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            Top Featured <span className="text-cyan-500">Fitness Classes</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Discover our highest-rated workout programs and sessions with top student enrollments led by certified coaches.
          </p>
        </div>

        {/* Classes Grid */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <FaSpinner className="h-10 w-10 text-cyan-500 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-muted-foreground">
              Fetching top featured classes...
            </p>
          </div>
        ) : classes.length === 0 ? (
          <div className="py-12 text-center bg-card border border-border rounded-3xl p-8 max-w-md mx-auto space-y-3">
            <FaDumbbell className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="text-sm font-bold text-foreground">No Featured Classes Currently Available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((cls, idx) => {
              const numericPrice = typeof cls.price === "number" ? cls.price : parseFloat(cls.price) || 0;
              return (
                <motion.div
                  key={cls._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="group bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between">
                  
                  <div>
                    {/* Class Cover Image Banner */}
                    <Link href={`/classes/${cls._id}`} className="relative w-full h-56 bg-accent overflow-hidden block">
                      <Image
                        src={getValidClassImage(cls.image)}
                        alt={cls.className}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Top Badges: Category & Price/Duration */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-black/60 text-white backdrop-blur-md border border-white/20">
                          <FaTag className="h-3 w-3 text-cyan-400" />
                          {cls.category}
                        </span>

                        <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500 text-white shadow-md">
                          ${numericPrice.toFixed(2)}
                        </span>
                      </div>

                      {/* Bottom Image Stats: Duration & Booking Count */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                        <span className="flex items-center gap-1 bg-black/50 px-2.5 py-0.5 rounded-lg backdrop-blur-sm">
                          <FaClock className="h-3 w-3 text-cyan-400" />
                          {cls.duration}
                        </span>

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-500/90 text-white font-extrabold text-[11px] shadow-sm">
                          <FaUsers className="h-3 w-3" />
                          {cls.bookingCount || 0} Bookings
                        </span>
                      </div>
                    </Link>

                    {/* Content Section */}
                    <div className="p-6 space-y-3">
                      <Link href={`/classes/${cls._id}`} className="block">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-cyan-500 transition line-clamp-1">
                          {cls.className}
                        </h3>
                      </Link>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {cls.description}
                      </p>

                      {/* Trainer Name */}
                      <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-bold text-foreground">
                          <FaUserGraduate className="h-3.5 w-3.5 text-cyan-500" />
                          {cls.trainerName || "Certified Trainer"}
                        </span>

                        <span className="px-2 py-0.5 rounded-md bg-accent text-[10px] uppercase font-bold text-muted-foreground">
                          {cls.difficultyLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details Button */}
                  <div className="p-6 pt-0">
                    <Link
                      href={`/classes/${cls._id}`}
                      className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs rounded-2xl shadow-md hover:from-blue-700 hover:to-cyan-600 transition flex items-center justify-center gap-2 group-hover:shadow-cyan-500/20">
                      <span>View Details & Book</span>
                      <FaArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* View All Classes CTA */}
        <div className="text-center pt-4">
          <Button
            as={Link}
            href="/classes"
            size="lg"
            className="bg-card border border-border text-foreground font-extrabold text-sm px-8 hover:bg-accent hover:border-cyan-500/40 transition rounded-2xl shadow-sm"
            endContent={<FaArrowRight className="h-4 w-4 text-cyan-500" />}>
            Explore All Classes
          </Button>
        </div>
      </div>
    </section>
  );
}
