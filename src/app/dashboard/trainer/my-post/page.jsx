"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  FaNewspaper,
  FaPenToSquare,
  FaTrash,
  FaCalendarDays,
  FaSpinner,
  FaEye,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";
import { useSession } from "@/lib/auth-client";

export default function MyForumPostsPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const trainerEmail = user?.email || "elena.rostova@fitness.com";

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd";

  // Fetch Trainer Forum Posts from MongoDB Backend
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/forum/trainer/${trainerEmail}`);
      if (!res.ok) throw new Error("Failed to fetch forum posts");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Error loading trainer posts:", error);
      toast.error("Could not fetch forum posts from server");
    } finally {
      setLoading(false);
    }
  }, [API_URL, trainerEmail]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Confirm Delete Forum Post
  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await fetch(`${API_URL}/api/forum/${postToDelete._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete forum post");

      toast.success(`Forum post "${postToDelete.title}" deleted successfully.`);
      setPostToDelete(null);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete forum post");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FaNewspaper className="h-5 w-5 text-cyan-500" />
            My Forum Posts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your published Community Forum articles, tutorials, and fitness insights.
          </p>
        </div>
        <Button
          as={Link}
          href="/dashboard/trainer/add-post"
          className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-md shrink-0"
          startContent={<FaPenToSquare className="h-3.5 w-3.5" />}>
          Add New Post
        </Button>
      </div>

      {/* Posts List / Grid */}
      {loading ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <FaSpinner className="h-8 w-8 text-cyan-500 animate-spin" />
          <span className="text-sm text-muted-foreground font-medium">
            Loading your published articles from MongoDB...
          </span>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-4">
          <p className="text-muted-foreground text-sm">
            You haven't authored any Community Forum posts yet.
          </p>
          <Button
            as={Link}
            href="/dashboard/trainer/add-post"
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold">
            Create First Forum Post
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => {
            // Check if post image is a direct image URL
            const isDirectImage = post.image && (post.image.includes("i.ibb.co") || post.image.includes("images.unsplash") || post.image.match(/\.(jpeg|jpg|gif|png|webp)/i));
            const imageSrc = isDirectImage ? post.image : FALLBACK_IMAGE;

            return (
              <div
                key={post._id}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-cyan-500/30 transition">
                <div>
                  {/* Post Image Banner */}
                  <div className="relative w-full h-48 bg-accent">
                    <Image
                      src={imageSrc}
                      alt={post.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] text-white font-semibold flex items-center gap-1.5">
                      <FaCalendarDays className="h-3 w-3 text-cyan-400" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-foreground line-clamp-2 hover:text-cyan-500 transition">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {post.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="px-5 py-3 border-t border-border bg-accent/20 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3 font-semibold">
                    <span>👍 {post.likes?.length || 0} Likes</span>
                    <span>👎 {post.dislikes?.length || 0} Dislikes</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/forum/${post._id}`}
                      className="px-3 py-1.5 rounded-lg font-semibold bg-accent hover:bg-default-200 text-foreground transition flex items-center gap-1">
                      <FaEye className="h-3 w-3" /> View
                    </Link>

                    <button
                      type="button"
                      onClick={() => setPostToDelete(post)}
                      className="px-3 py-1.5 rounded-lg font-semibold bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition flex items-center gap-1">
                      <FaTrash className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-500">
              <FaTrash className="h-6 w-6 shrink-0" />
              <h3 className="text-lg font-bold text-foreground">Delete Forum Post</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to delete <strong>"{postToDelete.title}"</strong>? This will permanently remove it from the Community Forum.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="flat"
                onClick={() => setPostToDelete(null)}>
                Cancel
              </Button>
              <Button
                color="danger"
                isLoading={deleteLoading}
                className="bg-rose-600 text-white font-bold"
                onClick={handleDeleteConfirm}>
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}