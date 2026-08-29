"use client";

import React from "react";
import {
  ShieldCheck,
  Dumbbell,
  Calendar,
  HeartHandshake,
  Zap,
  Award,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Pro Trainers",
    description:
      "Every trainer application is manually reviewed and vetted by our admin team before listing classes.",
  },
  {
    icon: Calendar,
    title: "Seamless Stripe Booking",
    description:
      "Reserve your class slots in seconds with secure Stripe Checkout integration and instant confirmations.",
  },
  {
    icon: Dumbbell,
    title: "Diverse Class Categories",
    description:
      "From High-Intensity HIIT to Power Yoga and Heavy Powerlifting, find sessions tailored to your goals.",
  },
  {
    icon: HeartHandshake,
    title: "Vibrant Community Forum",
    description:
      "Engage with trainers and fellow fitness enthusiasts through posts, likes, comments, and daily tips.",
  },
  {
    icon: Zap,
    title: "Real-time Tracking",
    description:
      "Track your booked classes, saved favorites, and trainer applications directly inside your dashboard.",
  },
  {
    icon: Award,
    title: "Guaranteed Results",
    description:
      "Personalized attention, structured class schedules, and progressive training programs designed for success.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-10 bg-slate-900 text-white relative overflow-hidden">
  
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
   
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Why Fitness For Life
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Built for Fitness Enthusiasts & Professionals
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Everything you need to discover classes, manage attendee rosters,
            and accelerate your fitness goals in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/50 hover:bg-slate-800 transition-all duration-300 space-y-4 group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconComp className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
