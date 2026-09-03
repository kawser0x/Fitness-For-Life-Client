"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaUserGraduate,
  FaBriefcase,
  FaDumbbell,
  FaClock,
  FaPaperPlane,
  FaCircleInfo,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";
import { useSession } from "@/lib/auth-client";
import { getAuthHeaders } from "@/lib/jwt";

export default function ApplyTrainerPage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Hydration safety check to prevent SSR / Client mismatches
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Pending");

  // Form Fields
  const [formData, setFormData] = useState({
    experience: "3",
    specialty: "HIIT & Cardio",
    timeSlots: "Morning (07:00 AM - 11:00 AM)",
    bio: "Certified fitness instructor with group training experience focused on strength, fat loss, and endurance build.",
  });

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a trainer application!");
      return;
    }

    setLoading(true);

    try {
      const authHeaders = await getAuthHeaders(user.email);
      const res = await fetch(`${API_URL}/api/trainer/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.name || user.email.split("@")[0] || "Applicant",
          experience: `${formData.experience} Years`,
          specialty: formData.specialty,
          availableTime: formData.timeSlots,
          bio: formData.bio,
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to submit application");

      setStatus("Pending");
      toast.success(
        "Trainer application submitted successfully! Status set to Pending.",
      );
    } catch (error) {
      console.error("Error submitting trainer application:", error);
      toast.error(error.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const applicantName = mounted
    ? user?.name || user?.email?.split("@")[0] || "Member"
    : "Member";
  const applicantEmail = mounted
    ? user?.email || "user@example.com"
    : "user@example.com";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FaUserGraduate className="h-6 w-6 text-cyan-500" />
          Apply as Certified Trainer
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Become a certified trainer on FitnessForLife to list your classes,
          track enrolled attendees, and share insights on the community forum.
        </p>
      </div>

      {/* Current Status Notification Banner */}
      {status === "Pending" && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <FaClock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-700 dark:text-amber-300">
              Application Status: Pending Review
            </h4>
            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
              Your application has been submitted and is currently being
              evaluated by the Admin team. You will receive an update once
              reviewed.
            </p>
          </div>
        </div>
      )}

      {/* Application Form */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Applicant Header Info */}
          <div className="p-4 rounded-2xl bg-accent/30 border border-border flex items-center justify-between text-xs">
            <div>
              <span className="text-muted-foreground block">
                Applicant Name
              </span>
              <span className="font-bold text-foreground text-sm">
                {applicantName}
              </span>
            </div>
            <div className="text-right">
              <span className="text-muted-foreground block">
                Applicant Email
              </span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400">
                {applicantEmail}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Experience in Years */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <FaBriefcase className="h-3.5 w-3.5 text-cyan-500" />
                Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                required
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-accent/40 border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition"
                placeholder="e.g. 3"
              />
            </div>

            {/* Specialty */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <FaDumbbell className="h-3.5 w-3.5 text-blue-500" />
                Primary Specialty
              </label>
              <select
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-accent/40 border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition">
                <option value="Yoga & Flexibility">Yoga & Flexibility</option>
                <option value="HIIT & Cardio">HIIT & Cardio</option>
                <option value="Strength & Weight Training">
                  Strength & Weight Training
                </option>
                <option value="Pilates & Core">Pilates & Core</option>
                <option value="Boxing & Combat">Boxing & Combat</option>
              </select>
            </div>
          </div>

          {/* Preferred Time Slots */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <FaClock className="h-3.5 w-3.5 text-cyan-500" />
              Available Schedule / Time Slots
            </label>
            <input
              type="text"
              required
              value={formData.timeSlots}
              onChange={(e) =>
                setFormData({ ...formData, timeSlots: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-accent/40 border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition"
              placeholder="e.g. Mon, Wed, Fri (07:00 AM - 11:00 AM)"
            />
          </div>

          {/* Bio & Qualifications */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <FaCircleInfo className="h-3.5 w-3.5 text-blue-500" />
              Bio & Qualifications
            </label>
            <textarea
              rows={4}
              required
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-accent/40 border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition leading-relaxed"
              placeholder="Tell us about your certifications, coaching background, and goals..."
            />
          </div>

          {/* Submit Action Button */}
          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              isLoading={loading}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-md hover:from-blue-700 hover:to-cyan-600 px-8 rounded-2xl"
              startContent={!loading && <FaPaperPlane className="h-4 w-4" />}>
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
