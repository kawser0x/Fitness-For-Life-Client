"use client";

import React from "react";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Jessica Taylor",
    role: "Member (Lost 25 lbs in 4 Months)",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    comment:
      "IronPulse completely revolutionized my workout routine! Booking classes takes literally 10 seconds, and the HIIT trainers push me beyond my limits every single day.",
    rating: 5,
  },
  {
    name: "Marcus Vance",
    role: "Certified Fitness Trainer",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    comment:
      "As a trainer, managing my class schedule and viewing booked attendee lists used to be a headache. IronPulse's Trainer Dashboard makes class management effortless!",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Powerlifting Enthusiast",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    comment:
      "The community forum is incredible. Being able to read daily mobility tips and interact directly with professional coaches keeps me motivated to stay consistent.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-10 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Loved by Members & Trainers Alike
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            See how our platform is helping thousands of fitness enthusiasts
            reach their personal records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6 relative">
              <Quote className="w-10 h-10 text-emerald-500/20 absolute top-6 right-6" />

              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic">
                  {rev.comment}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/40"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {rev.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {rev.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
