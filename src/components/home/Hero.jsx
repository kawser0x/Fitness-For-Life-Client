"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Dumbbell,
  ArrowRight,
  ShieldCheck,
  Flame,
  Users,
  Trophy,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white py-10 sm:py-10">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-luminosity scale-105 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&auto=format&fit=crop&q=80')`,
        }}
      />

      {/* Radial Glow & Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/30 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Animated Text & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
              <Flame className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Elevate Your Fitness Journey</span>
            </div>

            {/* Energetic Title */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Transform Your Body,{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Empower Your Life
              </span>
            </h1>

            {/* Brief Description */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Discover top-rated fitness classes led by world-class certified
              trainers. Book your spot, join community discussions, and achieve
              your peak performance today.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/classes"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/25 hover:scale-[1.02] hover:shadow-emerald-500/40 transition-all">
                <span>Explore Classes</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/forum"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-slate-700 bg-slate-800/60 text-white font-semibold text-base hover:bg-slate-800 hover:border-slate-600 transition-all">
                Join Community
              </Link>
            </div>

            {/* Quick Highlight Stats */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                  50+
                </p>
                <p className="text-xs sm:text-sm text-slate-400">
                  Live Classes
                </p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-extrabold text-teal-400">
                  30+
                </p>
                <p className="text-xs sm:text-sm text-slate-400">
                  Pro Trainers
                </p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400">
                  10k+
                </p>
                <p className="text-xs sm:text-sm text-slate-400">
                  Active Members
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Card with Animated Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 group">
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"
                alt="Fitness Training Session"
                className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Floating Overlay Badge 1 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-6 right-6 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3.5 rounded-2xl flex items-center gap-3 shadow-xl">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Top Rated Gym
                  </p>
                  <p className="text-sm font-bold text-white">#1 Fitness Hub</p>
                </div>
              </motion.div>

              {/* Floating Overlay Badge 2 */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-4 rounded-2xl flex items-center gap-3 shadow-xl max-w-xs">
                <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Certified Trainers
                  </p>
                  <p className="text-xs text-slate-400">
                    Expert guidance guaranteed
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
