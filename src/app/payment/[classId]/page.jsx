"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaCreditCard,
  FaShieldHalved,
  FaLock,
  FaArrowLeft,
  FaSpinner,
  FaCalendarDays,
  FaUserGraduate,
  FaDumbbell,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";
import { useSession } from "@/lib/auth-client";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd";

export default function PaymentPage({ params }) {
  const resolvedParams = use(params);
  const classId = resolvedParams?.classId;

  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch Class details by ID
  const fetchClassDetails = useCallback(async () => {
    if (!classId) return;
    try {
      setLoading(true);
      let res = await fetch(`${API_URL}/api/classes/details/${classId}`);
      if (!res.ok) {
        res = await fetch(`${API_URL}/api/classes/${classId}`);
      }
      if (!res.ok) throw new Error("Failed to load class information");
      const data = await res.json();
      setClassData(data);
    } catch (error) {
      console.error("Error loading class for payment:", error);
      toast.error("Failed to load class information for payment");
    } finally {
      setLoading(false);
    }
  }, [API_URL, classId]);

  useEffect(() => {
    fetchClassDetails();
  }, [fetchClassDetails]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 p-4">
        <FaSpinner className="h-10 w-10 text-cyan-500 animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">
          Preparing Stripe Checkout...
        </p>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-background py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Class Information Not Found</h2>
        <Button as={Link} href="/classes" className="bg-cyan-500 text-white font-bold">
          Back to All Classes
        </Button>
      </div>
    );
  }

  const numericPrice = typeof classData.price === "number" ? classData.price : parseFloat(classData.price) || 0;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Link */}
        <Link
          href={`/classes/${classId}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-cyan-500 transition">
          <FaArrowLeft className="h-3.5 w-3.5" /> Back to Class Details
        </Link>

        {/* Page Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 uppercase tracking-widest">
            <FaLock className="h-3 w-3" /> Stripe Hosted Checkout
          </div>
          <h1 className="text-3xl font-black text-foreground">
            Stripe Secure Checkout
          </h1>
          <p className="text-sm text-muted-foreground">
            Review your order summary and click Checkout to complete your payment on Stripe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: STRIPE CHECKOUT FORM CARD (7 COLS) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FaCreditCard className="h-5 w-5 text-cyan-500" />
                Stripe Checkout
              </h2>
              <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                <FaShieldHalved className="h-3.5 w-3.5 text-emerald-500" /> Verified Merchant
              </span>
            </div>

            {/* FORM SUBMITTING TO /api/checkout_sessions AS REQUESTED */}
            <form action="/api/checkout_sessions" method="POST" className="space-y-6">
              <input type="hidden" name="classId" value={classData._id} />
              <input type="hidden" name="userEmail" value={user?.email || ""} />
              <input type="hidden" name="className" value={classData.className} />
              <input type="hidden" name="price" value={classData.price} />
              <input type="hidden" name="image" value={classData.image || ""} />
              <input type="hidden" name="trainerName" value={classData.trainerName || ""} />
              <input type="hidden" name="classSchedule" value={classData.classSchedule || ""} />

              <div className="p-4 rounded-2xl bg-accent/30 border border-border space-y-2 text-xs">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Logged in Account:</span>
                  <span className="font-bold text-foreground">{user?.email || "Guest"}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Class:</span>
                  <span className="font-bold text-foreground">{classData.className}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Total Amount:</span>
                  <span className="font-black text-cyan-500 text-sm">${numericPrice.toFixed(2)}</span>
                </div>
              </div>

              <section className="pt-2">
                <button
                  type="submit"
                  role="link"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2">
                  <FaCreditCard className="h-4 w-4" />
                  <span>Checkout with Stripe (${numericPrice.toFixed(2)})</span>
                </button>
              </section>
            </form>
          </motion.div>

          {/* RIGHT: ORDER SUMMARY CARD (5 COLS) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 bg-card border border-border rounded-3xl p-6 shadow-xl space-y-6">
            
            <h2 className="text-lg font-bold text-foreground border-b border-border pb-3">
              Order Summary
            </h2>

            {/* Class Card Preview */}
            <div className="flex gap-4 items-center">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-accent shrink-0 border border-border">
                <Image
                  src={classData.image || FALLBACK_IMAGE}
                  alt={classData.className}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="space-y-1 min-w-0">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                  {classData.category}
                </span>
                <h3 className="text-sm font-bold text-foreground truncate">
                  {classData.className}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <FaUserGraduate className="h-3 w-3 text-cyan-500 shrink-0" />
                  {classData.trainerName || "Certified Trainer"}
                </p>
              </div>
            </div>

            {/* Schedule & Duration Metadata */}
            <div className="p-4 rounded-2xl bg-accent/30 border border-border space-y-2 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1.5 font-semibold">
                  <FaCalendarDays className="h-3.5 w-3.5 text-blue-500" /> Schedule:
                </span>
                <span className="font-bold text-foreground truncate max-w-[170px]">
                  {classData.classSchedule}
                </span>
              </div>

              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1.5 font-semibold">
                  <FaDumbbell className="h-3.5 w-3.5 text-cyan-500" /> Difficulty:
                </span>
                <span className="font-bold text-foreground capitalize">
                  {classData.difficultyLevel}
                </span>
              </div>
            </div>

            {/* Member Details */}
            <div className="space-y-2 text-xs pt-2 border-t border-border">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Member Account
              </span>
              <div className="p-3 rounded-xl bg-accent/20 border border-border flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">{user?.name || "Member"}</p>
                  <p className="text-[11px] text-muted-foreground">{user?.email}</p>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  Verified
                </span>
              </div>
            </div>

            {/* Total Price Calculation Breakdown */}
            <div className="space-y-2 text-xs pt-2 border-t border-border">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Class Fee</span>
                <span className="font-semibold text-foreground">${numericPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Stripe Processing Fee</span>
                <span className="font-semibold text-emerald-500">INCLUDED</span>
              </div>
              <div className="flex items-center justify-between text-sm font-black text-foreground pt-2 border-t border-border">
                <span>Total Amount</span>
                <span className="text-cyan-500 text-lg">${numericPrice.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
