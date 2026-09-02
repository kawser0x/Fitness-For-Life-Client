"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  FaCalendarCheck,
  FaUserGraduate,
  FaCalendarDays,
  FaEye,
  FaSpinner,
  FaCircleCheck,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";
import { useSession } from "@/lib/auth-client";
import { getAuthHeaders } from "@/lib/jwt";

export default function BookedClassesPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch Booked Classes for current user from MongoDB
  const fetchBookings = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const authHeaders = await getAuthHeaders(user.email);
      const res = await fetch(`${API_URL}/api/user/bookings/${encodeURIComponent(user.email)}`, {
        headers: authHeaders,
      });
      if (!res.ok) throw new Error("Failed to fetch user bookings");
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Error loading user bookings:", error);
      toast.error("Could not load booked classes from server");
    } finally {
      setLoading(false);
    }
  }, [API_URL, user?.email]);

  useEffect(() => {
    if (user?.email) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user?.email, fetchBookings]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FaCalendarCheck className="h-5 w-5 text-cyan-500" />
          My Booked Classes
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View all fitness sessions and workout classes you have reserved.
        </p>
      </div>

      {/* Booked Classes Table */}
      <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-accent/40 text-muted-foreground text-xs uppercase font-semibold">
                <th className="py-3.5 px-4">Class Details</th>
                <th className="py-3.5 px-4">Trainer</th>
                <th className="py-3.5 px-4">Schedule</th>
                <th className="py-3.5 px-4">Paid Amount</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FaSpinner className="h-6 w-6 text-cyan-500 animate-spin" />
                      <span>Loading your booked classes from MongoDB...</span>
                    </div>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    You have not booked any fitness classes yet.
                    <div className="pt-3">
                      <Link
                        href="/classes"
                        className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-cyan-500 text-white font-bold text-xs hover:bg-cyan-600 transition shadow-sm">
                        Browse All Classes
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-accent/20 transition-colors">
                    {/* Class Details */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-accent shrink-0 border border-border">
                          <Image
                            src={getValidClassImage(booking.image)}
                            alt={booking.className}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <p className="font-bold text-foreground line-clamp-1">
                            <Link href={`/classes/${booking.classId}`} className="hover:text-cyan-500 transition">
                              {booking.className}
                            </Link>
                          </p>
                          <span className="text-[11px] text-muted-foreground">
                            Booked: {new Date(booking.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Trainer */}
                    <td className="py-4 px-4 text-xs font-semibold text-foreground">
                      <span className="flex items-center gap-1.5">
                        <FaUserGraduate className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
                        {booking.trainerName || "Certified Trainer"}
                      </span>
                    </td>

                    {/* Schedule */}
                    <td className="py-4 px-4 text-xs text-muted-foreground font-medium">
                      <span className="flex items-center gap-1.5">
                        <FaCalendarDays className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        {booking.classSchedule}
                      </span>
                    </td>

                    {/* Paid Amount */}
                    <td className="py-4 px-4 font-bold text-emerald-500">
                      ${typeof booking.price === "number" ? booking.price.toFixed(2) : booking.price}
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        <FaCircleCheck className="h-3 w-3" /> Confirmed
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/classes/${booking.classId}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold hover:bg-cyan-500/20 text-xs transition">
                        <FaEye className="h-3 w-3" />
                        <span>View Class</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}