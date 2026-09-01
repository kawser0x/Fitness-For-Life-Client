"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaDumbbell,
  FaLayerGroup,
  FaGauge,
  FaClock,
  FaCalendarDays,
  FaDollarSign,
  FaCircleInfo,
  FaPaperPlane,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";
import ImgBBUpload from "@/components/shared/ImgBBUpload";
import { useSession } from "@/lib/auth-client";

export default function AddClassPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(false);

  // Form Fields according to PDF requirements
  const [formData, setFormData] = useState({
    className: "",
    image: "",
    category: "HIIT & Cardio",
    difficultyLevel: "Intermediate",
    duration: "45 mins",
    classSchedule: "Mon, Wed, Fri (08:00 AM)",
    price: "25.00",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error("Please upload or provide an image for the class!");
      return;
    }

    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${API_URL}/api/classes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          trainerEmail: user?.email || "elena.rostova@fitness.com",
          trainerName: user?.name || "Elena Rostova",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create class");
      }

      toast.success(
        `Class "${formData.className}" submitted successfully! Status set to Pending.`,
        {
          description: "Admin will review and approve your class.",
        }
      );

      // Reset form
      setFormData({
        className: "",
        image: "",
        category: "HIIT & Cardio",
        difficultyLevel: "Intermediate",
        duration: "45 mins",
        classSchedule: "",
        price: "",
        description: "",
      });
    } catch (error) {
      console.error("Error submitting class:", error);
      toast.error(error.message || "Failed to submit class to database");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FaPlus className="h-5 w-5 text-cyan-500" />
          Add New Fitness Class
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create and list a new fitness session for members to discover and
          book.
        </p>
      </div>

      {/* Mandatory PDF Requirement Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2 font-medium">
        <FaCircleInfo className="h-4 w-4 text-amber-500 shrink-0" />
        <span>
          <strong>Note:</strong> Newly added classes will have a default status
          of <strong>Pending</strong> until approved by an Administrator.
        </span>
      </div>

      {/* Form */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Class Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <FaDumbbell className="h-3.5 w-3.5 text-cyan-500" />
                Class Name
              </label>
              <input
                type="text"
                required
                value={formData.className}
                onChange={(e) =>
                  setFormData({ ...formData, className: e.target.value })
                }
                placeholder="e.g. Power HIIT & Endurance Burn"
                className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* ImgBB Image Upload Component */}
            <div className="sm:col-span-2">
              <ImgBBUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Class Cover Image (ImgBB Upload Required)"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <FaLayerGroup className="h-3.5 w-3.5 text-cyan-500" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-cyan-500 transition [&>option]:bg-white [&>option]:dark:bg-zinc-900 [&>option]:text-gray-900 [&>option]:dark:text-white">
                <option value="Yoga & Flexibility">Yoga & Flexibility</option>
                <option value="HIIT & Cardio">HIIT & Cardio</option>
                <option value="Strength & Weight Training">
                  Strength & Weight Training
                </option>
                <option value="Pilates & Core">Pilates & Core</option>
                <option value="Boxing & Combat">Boxing & Combat</option>
              </select>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <FaGauge className="h-3.5 w-3.5 text-blue-500" />
                Difficulty Level
              </label>
              <select
                value={formData.difficultyLevel}
                onChange={(e) =>
                  setFormData({ ...formData, difficultyLevel: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-cyan-500 transition [&>option]:bg-white [&>option]:dark:bg-zinc-900 [&>option]:text-gray-900 [&>option]:dark:text-white">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <FaClock className="h-3.5 w-3.5 text-cyan-500" />
                Duration
              </label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                placeholder="e.g. 45 mins / 60 mins"
                className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* Price ($) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <FaDollarSign className="h-3.5 w-3.5 text-emerald-500" />
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="25.00"
                className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>

          {/* Class Schedule (Days & Time) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <FaCalendarDays className="h-3.5 w-3.5 text-blue-500" />
              Class Schedule (Days & Time)
            </label>
            <input
              type="text"
              required
              value={formData.classSchedule}
              onChange={(e) =>
                setFormData({ ...formData, classSchedule: e.target.value })
              }
              placeholder="e.g. Mon, Wed, Fri (07:00 AM - 08:00 AM)"
              className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <FaCircleInfo className="h-3.5 w-3.5 text-cyan-500" />
              Description
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the workout goals, intensity, equipment needed, and target audience..."
              className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition leading-relaxed"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              isLoading={loading}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-md hover:from-blue-700 hover:to-cyan-600 px-8"
              startContent={!loading && <FaPaperPlane className="h-4 w-4" />}>
              {loading ? "Adding Class..." : "Submit Class"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
