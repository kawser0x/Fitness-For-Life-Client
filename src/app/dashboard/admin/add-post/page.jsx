"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  FaPenToSquare,
  FaHeading,
  FaImage,
  FaCircleInfo,
  FaPaperPlane,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";

export default function AddForumPostPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success("Community Forum post published successfully!");
      setFormData({ title: "", image: "", description: "" });
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FaPenToSquare className="h-5 w-5 text-cyan-500" />
          Add Forum Post
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Share fitness guides, nutrition tips, and training advice on the
          public Community Forum.
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
              placeholder="e.g. 5 Science-Backed Nutrition Habits for Faster Recovery"
              className="w-full px-4 py-2.5 rounded-xl  border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* Featured Image URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <FaImage className="h-3.5 w-3.5 text-blue-500" />
              Featured Image URL
            </label>
            <input
              type="url"
              required
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="https://images.unsplash.com/photo-1517838277536-f5f99be501cd"
              className="w-full px-4 py-2.5 rounded-xl  border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

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
              placeholder="Write your article details, training recommendations, or community advice..."
              className="w-full px-4 py-2.5 rounded-xl  border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              isLoading={loading}
              size="lg"
              className="bg-linear-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-md hover:from-blue-700 hover:to-cyan-600"
              startContent={!loading && <FaPaperPlane className="h-4 w-4" />}>
              {loading ? "Publishing..." : "Publish Forum Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
