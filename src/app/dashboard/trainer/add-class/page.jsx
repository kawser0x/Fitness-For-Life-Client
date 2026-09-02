"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FaDumbbell,
  FaFolderOpen,
  FaSignal,
  FaClock,
  FaCalendarDays,
  FaDollarSign,
  FaCircleInfo,
  FaPaperPlane,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";
import ImgBBUpload from "@/components/shared/ImgBBUpload";
import { useSession } from "@/lib/auth-client";

const CATEGORIES = [
  "Yoga",
  "Strength Training",
  "Cardio",
  "HIIT",
  "Pilates",
  "CrossFit",
  "Boxing",
];

const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function AddClassPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    className: "",
    image: "",
    category: "Yoga",
    difficultyLevel: "Intermediate",
    duration: "45 mins",
    classSchedule: "Mon, Wed, Fri - 8:00 AM",
    price: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.className || !formData.image || !formData.price) {
      toast.error("Please fill in all required class fields!");
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
          trainerEmail: user?.email,
          trainerName: user?.name || user?.email?.split("@")[0] || "Coach",
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

      setFormData({
        className: "",
        image: "",
        category: "Yoga",
        difficultyLevel: "Intermediate",
        duration: "45 mins",
        classSchedule: "Mon, Wed, Fri - 8:00 AM",
        price: "",
        description: "",
      });

      router.push("/dashboard/trainer/my-classes");
    } catch (error) {
      console.error("Error creating class:", error);
      toast.error(error.message || "Failed to create class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FaDumbbell className="h-5 w-5 text-cyan-500" />
          Add New Fitness Class
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create a new workout program. Submitted classes will enter "Pending" status for Admin approval before appearing on the public page.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
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
              placeholder="e.g. Morning Sunrise Power Yoga"
              className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <ImgBBUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            label="Class Cover Image (ImgBB Upload)"
            required={true}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <FaFolderOpen className="h-3.5 w-3.5 text-cyan-500" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-cyan-500 transition">
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <FaSignal className="h-3.5 w-3.5 text-cyan-500" />
                Difficulty Level
              </label>
              <select
                value={formData.difficultyLevel}
                onChange={(e) =>
                  setFormData({ ...formData, difficultyLevel: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-cyan-500 transition">
                {DIFFICULTY_LEVELS.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                placeholder="e.g. 45 mins"
                className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <FaCalendarDays className="h-3.5 w-3.5 text-cyan-500" />
                Schedule
              </label>
              <input
                type="text"
                required
                value={formData.classSchedule}
                onChange={(e) =>
                  setFormData({ ...formData, classSchedule: e.target.value })
                }
                placeholder="e.g. Mon, Wed, Fri - 8:00 AM"
                className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <FaDollarSign className="h-3.5 w-3.5 text-cyan-500" />
              Price ($ USD)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="e.g. 29.99"
              className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

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
              placeholder="Describe the workout goals, intensity, and equipment needed..."
              className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              isLoading={loading}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-md hover:from-blue-700 hover:to-cyan-600 px-8"
              startContent={!loading && <FaPaperPlane className="h-4 w-4" />}>
              {loading ? "Submitting..." : "Submit Class for Approval"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
