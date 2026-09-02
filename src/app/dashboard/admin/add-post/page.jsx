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

export default function AdminAddForumPostPage() {
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
      const authHeaders = await getAuthHeaders(user?.email || "admin@ironpulse.com");

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
          authorEmail: user?.email || "admin@ironpulse.com",
          authorName: user?.name || "System Administrator",
          authorRole: "Admin",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to publish forum post");
      }

      toast.success("Admin Forum post published successfully!");
      setFormData({ title: "", image: "", description: "" });
      router.push("/forum");
    } catch (error) {
      console.error("Error publishing forum post:", error);
      toast.error(error.message || "Failed to publish post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FaPenToSquare className="h-5 w-5 text-cyan-500" />
          Admin Add Forum Post
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Publish official platform guides, announcements, and articles to the
          Community Forum using ImgBB upload.
        </p>
      </div>

      {/* Form */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <FaHeading className="h-3.5 w-3.5 text-cyan-500" />
              Post Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Platform Safety Guidelines & Official Trainer Code of Conduct"
              className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* Featured Image - ImgBB Upload */}
          <ImgBBUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            label="Featured Image (ImgBB Upload / Direct Link)"
            required={false}
          />

          {/* Description / Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <FaCircleInfo className="h-3.5 w-3.5 text-cyan-500" />
              Post Description / Article Content
            </label>
            <textarea
              rows={6}
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Write your announcement or official guide content..."
              className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition leading-relaxed"
            />
          </div>

          {/* Submit Button */}
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
