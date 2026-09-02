"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FaPenToSquare,
  FaHeading,
  FaCircleInfo,
  FaPaperPlane,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";
import ImgBBUpload from "@/components/shared/ImgBBUpload";
import { useSession } from "@/lib/auth-client";
import { getAuthHeaders } from "@/lib/jwt";

export default function TrainerAddForumPostPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
  });

  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in the post title and content!");
      return;
    }

    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const authHeaders = await getAuthHeaders(user?.email);

      const finalImage =
        formData.image && formData.image.trim()
          ? formData.image.trim()
          : FALLBACK_IMAGE;

      const res = await fetch(`${API_URL}/api/forum`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({
          title: formData.title,
          image: finalImage,
          description: formData.description,
          authorEmail: user?.email,
          authorName: user?.name || user?.email?.split("@")[0] || "Trainer",
          authorRole: "Trainer",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to publish forum post");
      }

      toast.success("Community Forum post published successfully!");
      setFormData({ title: "", image: "", description: "" });

      router.push("/dashboard/trainer/my-post");
    } catch (error) {
      console.error("Error publishing forum post:", error);
      toast.error(error.message || "Failed to publish post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FaPenToSquare className="h-5 w-5 text-cyan-500" />
          Add Forum Post
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Share workout guides, nutrition advice, and fitness tips with the Fitness For Life community using ImgBB image upload.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <FaHeading className="h-3.5 w-3.5 text-cyan-500" />
              Article Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. 5 Core Exercises to Build Functional Strength & Endurance"
              className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <ImgBBUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            label="Featured Image (ImgBB Upload / Direct Link)"
            required={false}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <FaCircleInfo className="h-3.5 w-3.5 text-cyan-500" />
              Article Content / Description
            </label>
            <textarea
              rows={6}
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Write your article details, training tips, and guidance..."
              className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              isLoading={loading}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-md hover:from-blue-700 hover:to-cyan-600 px-8"
              startContent={!loading && <FaPaperPlane className="h-4 w-4" />}>
              {loading ? "Publishing..." : "Publish Forum Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
