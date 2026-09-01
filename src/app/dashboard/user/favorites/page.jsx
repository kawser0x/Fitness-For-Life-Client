"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  FaHeart,
  FaTag,
  FaArrowRight,
  FaSpinner,
  FaTrash,
  FaDumbbell,
} from "react-icons/fa6";
import { useSession } from "@/lib/auth-client";

export default function FavoritePage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removeLoadingId, setRemoveLoadingId] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const FALLBACK_CLASS_IMAGE = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd";

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

  // Fetch User Favorites from MongoDB
  const fetchFavorites = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/user/favorites/${encodeURIComponent(user.email)}`);
      if (!res.ok) throw new Error("Failed to fetch favorites");
      const data = await res.json();
      setFavorites(data);
    } catch (error) {
      console.error("Error loading favorites:", error);
      toast.error("Could not load saved favorites");
    } finally {
      setLoading(false);
    }
  }, [API_URL, user?.email]);

  useEffect(() => {
    if (user?.email) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [user?.email, fetchFavorites]);

  // Remove Favorite Toggle
  const handleRemoveFavorite = async (classId) => {
    try {
      setRemoveLoadingId(classId);
      const res = await fetch(`${API_URL}/api/user/favorites/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          classId,
        }),
      });

      if (!res.ok) throw new Error("Failed to remove favorite");

      toast.info("Class removed from your favorites list.");
      fetchFavorites();
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove favorite");
    } finally {
      setRemoveLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FaHeart className="h-5 w-5 text-rose-500" />
          My Saved Favorite Classes
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quickly access your saved fitness routines and training sessions.
        </p>
      </div>

      {/* Favorites Grid */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <FaSpinner className="h-10 w-10 text-cyan-500 animate-spin" />
          <p className="text-sm font-semibold text-muted-foreground">
            Loading your saved favorites from database...
          </p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-card border border-border rounded-3xl p-16 text-center space-y-4 max-w-md mx-auto shadow-sm">
          <FaDumbbell className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-lg font-bold text-foreground">No Saved Favorites</h3>
          <p className="text-xs text-muted-foreground">
            You have not saved any classes to your favorites list yet.
          </p>
          <Link
            href="/classes"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-cyan-500 text-white font-bold text-sm hover:bg-cyan-600 transition shadow-md">
            Browse Classes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div
              key={fav._id}
              className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group">
              <div>
                {/* Image Container */}
                <div className="relative w-full h-48 bg-accent overflow-hidden">
                  <Image
                    src={getValidClassImage(fav.image)}
                    alt={fav.className}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white font-bold flex items-center gap-1 border border-white/20">
                    <FaTag className="h-3 w-3 text-cyan-400" />
                    {fav.category || "General"}
                  </div>

                  <button
                    type="button"
                    disabled={removeLoadingId === fav.classId}
                    onClick={() => handleRemoveFavorite(fav.classId)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-rose-500 border border-white/20 flex items-center justify-center hover:scale-110 transition shadow-md"
                    title="Remove from favorites">
                    <FaTrash className="h-4 w-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-foreground line-clamp-1 group-hover:text-cyan-500 transition">
                    <Link href={`/classes/${fav.classId}`}>{fav.className}</Link>
                  </h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{fav.duration || "45 mins"}</span>
                    <span className="font-bold text-emerald-500">
                      ${typeof fav.price === "number" ? fav.price.toFixed(2) : fav.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <Link
                  href={`/classes/${fav.classId}`}
                  className="w-full py-3 px-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs shadow-md transition-all">
                  <span>View Details & Book</span>
                  <FaArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}