"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaDumbbell,
  FaMagnifyingGlass,
  FaTag,
  FaCalendarDays,
  FaUserGraduate,
  FaSpinner,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaXmark,
  FaFilter,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";

const CATEGORIES = [
  "All",
  "Yoga",
  "Strength Training",
  "Cardio",
  "HIIT",
  "Pilates",
  "CrossFit",
  "Boxing",
];

const FALLBACK_CLASS_IMAGE = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd";

export default function AllClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClasses, setTotalClasses] = useState(0);

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

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      let queryParams = `status=Approved&page=${page}&limit=9`;

      if (search.trim()) {
        queryParams += `&search=${encodeURIComponent(search.trim())}`;
      }

      if (selectedCategory !== "All") {
        queryParams += `&category=${encodeURIComponent(selectedCategory)}`;
      }

      const res = await fetch(`${API_URL}/api/classes?${queryParams}`);
      if (!res.ok) throw new Error("Failed to fetch classes");

      const data = await res.json();
      setClasses(data.classes || []);
      setTotalPages(data.totalPages || 1);
      setTotalClasses(data.total || 0);
    } catch (error) {
      console.error("Error loading classes:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, search, selectedCategory, page]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Reset page to 1 when search or category changes
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* HERO BANNER SECTION */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-cyan-950/20 to-background border-b border-border overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 uppercase tracking-widest">
            <FaDumbbell className="h-3.5 w-3.5" /> Certified Expert Trainers
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight max-w-3xl mx-auto leading-tight">
            Explore All Fitness Classes & Training Sessions
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover professionally designed workouts, strength training, yoga, and endurance classes led by top certified trainers.
          </p>

          {/* SEARCH INPUT BAR */}
          <div className="max-w-xl mx-auto relative pt-4">
            <div className="relative flex items-center">
              <FaMagnifyingGlass className="absolute left-4 h-4 w-4 text-cyan-500" />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search classes by title (e.g. Yoga, Cardio, HIIT)..."
                className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-card border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 shadow-xl transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-3.5 text-muted-foreground hover:text-foreground">
                  <FaXmark className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-5">
        {/* CATEGORIES FILTER BAR */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <FaFilter className="h-3.5 w-3.5 text-cyan-500" /> Filter By Workout Category
            </span>
            <span className="text-xs text-muted-foreground font-semibold">
              Showing {classes.length} of {totalClasses} classes
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap border shrink-0 ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/20"
                      : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-accent/40"
                  }`}>
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* CLASSES GRID SECTION */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <FaSpinner className="h-10 w-10 text-cyan-500 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-muted-foreground">
              Searching database for fitness classes...
            </p>
          </div>
        ) : classes.length === 0 ? (
          <div className="py-16 text-center bg-card border border-border rounded-3xl p-8 space-y-4 max-w-md mx-auto shadow-sm">
            <FaDumbbell className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-bold text-foreground">No Classes Found</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No approved fitness classes match your search query or selected category.
            </p>
            <Button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setPage(1);
              }}
              className="bg-cyan-500 text-white font-bold text-xs">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <div
                key={cls._id}
                className="group bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-cyan-500/50 transition-all duration-300 flex flex-col">
                {/* Class Image Banner */}
                <div className="relative w-full h-52 bg-accent overflow-hidden">
                  <Image
                    src={getValidClassImage(cls.image)}
                    alt={cls.className}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Category & Price Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-black/60 text-white backdrop-blur-md border border-white/20">
                      <FaTag className="h-3 w-3 text-cyan-400" />
                      {cls.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500 text-white shadow-md">
                      ${typeof cls.price === "number" ? cls.price.toFixed(2) : cls.price}
                    </span>
                  </div>

                  {/* Duration & Difficulty */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                    <span>{cls.duration}</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-[10px] uppercase font-bold">
                      {cls.difficultyLevel}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-cyan-500 transition line-clamp-1">
                      {cls.className}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {cls.description}
                    </p>
                  </div>

                  {/* Trainer & Schedule Info */}
                  <div className="pt-3 border-t border-border space-y-2 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1.5 font-semibold text-foreground">
                        <FaUserGraduate className="h-3.5 w-3.5 text-cyan-500" />
                        {cls.trainerName || "Certified Trainer"}
                      </span>
                      <span className="text-[11px]">
                        {cls.bookingCount || 0} Bookings
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                      <FaCalendarDays className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">{cls.classSchedule}</span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Button
                    as={Link}
                    href={`/classes/${cls._id}`}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl shadow-md hover:from-blue-700 hover:to-cyan-600 transition"
                    endContent={<FaArrowRight className="h-3.5 w-3.5" />}>
                    View Details & Book
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SERVER-SIDE PAGINATION BAR */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-6">
            <Button
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="bg-card border border-border text-foreground font-bold disabled:opacity-40"
              startContent={<FaChevronLeft className="h-3 w-3" />}>
              Previous
            </Button>

            <span className="text-xs font-bold text-muted-foreground">
              Page <span className="text-foreground">{page}</span> of {totalPages}
            </span>

            <Button
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className="bg-card border border-border text-foreground font-bold disabled:opacity-40"
              endContent={<FaChevronRight className="h-3 w-3" />}>
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}