"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  FaNewspaper,
  FaShieldHalved,
  FaUserGraduate,
  FaTrash,
  FaEye,
  FaCalendarDays,
  FaSpinner,
  FaThumbsUp,
  FaThumbsDown,
  FaXmark,
  FaArrowUpRightFromSquare,
  FaComment,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";
import { useSession } from "@/lib/auth-client";
import { getAuthHeaders } from "@/lib/jwt";

export default function AdminManagePostsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostForView, setSelectedPostForView] = useState(null);
  const [modalComments, setModalComments] = useState([]);
  const [modalCommentsLoading, setModalCommentsLoading] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd";

  const getValidImage = (url) => {
    if (!url || typeof url !== "string") return FALLBACK_IMAGE;
    if ((url.includes("ibb.co/") || url.includes("ibb.co.com/")) && !url.includes("i.ibb.co")) {
      return FALLBACK_IMAGE;
    }
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
      return url;
    }
    return FALLBACK_IMAGE;
  };

  // Fetch all community forum posts for Admin Moderation Table
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const authHeaders = await getAuthHeaders(user?.email || "admin@ironpulse.com");
      const res = await fetch(`${API_URL}/api/admin/forum-posts`, {
        headers: authHeaders,
      });
      if (!res.ok) throw new Error("Failed to fetch admin forum posts");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Error loading forum posts:", error);
      toast.error("Could not fetch forum posts from server");
    } finally {
      setLoading(false);
    }
  }, [API_URL, user?.email]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Open View Modal & Load Comments
  const openViewModal = async (post) => {
    setSelectedPostForView(post);
    try {
      setModalCommentsLoading(true);
      const res = await fetch(`${API_URL}/api/forum/${post._id}/comments`);
      if (res.ok) {
        const commentsData = await res.json();
        setModalComments(commentsData);
      }
    } catch (err) {
      console.error("Error loading modal comments:", err);
      setModalComments([]);
    } finally {
      setModalCommentsLoading(false);
    }
  };

  // Handle Delete Inappropriate Post
  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    try {
      setDeleteLoading(true);
      const authHeaders = await getAuthHeaders(user?.email || "admin@ironpulse.com");
      const res = await fetch(`${API_URL}/api/forum/${postToDelete._id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (!res.ok) throw new Error("Failed to delete post");

      toast.success(`Forum post "${postToDelete.title}" deleted by Admin.`);
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
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FaNewspaper className="h-5 w-5 text-cyan-500" />
          Community Forum Post Moderation
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review all published community forum articles across the platform and delete inappropriate or non-compliant posts.
        </p>
      </div>

      {/* Posts Moderation Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-accent/40 text-muted-foreground text-xs uppercase font-semibold">
                <th className="py-3.5 px-4">Post Article</th>
                <th className="py-3.5 px-4">Author</th>
                <th className="py-3.5 px-4">Published Date</th>
                <th className="py-3.5 px-4">Engagement</th>
                <th className="py-3.5 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FaSpinner className="h-6 w-6 text-cyan-500 animate-spin" />
                      <span>Loading community posts from MongoDB...</span>
                    </div>
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    No forum posts found in database.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post._id} className="hover:bg-accent/20 transition-colors">
                    {/* Post Article Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3 max-w-md">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-accent shrink-0 border border-border">
                          <Image
                            src={getValidImage(post.image)}
                            alt={post.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <p className="font-bold text-foreground line-clamp-1">{post.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {post.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="py-4 px-4">
                      <div className="text-xs space-y-0.5">
                        <p className="font-bold text-foreground flex items-center gap-1.5">
                          {post.authorName || "Author"}
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                            {post.authorRole === "Admin" ? (
                              <FaShieldHalved className="inline h-2.5 w-2.5 mr-0.5" />
                            ) : (
                              <FaUserGraduate className="inline h-2.5 w-2.5 mr-0.5" />
                            )}
                            {post.authorRole || "Trainer"}
                          </span>
                        </p>
                        <p className="text-muted-foreground truncate max-w-[160px]">
                          {post.authorEmail}
                        </p>
                      </div>
                    </td>

                    {/* Published Date */}
                    <td className="py-4 px-4 text-muted-foreground text-xs font-medium">
                      <span className="flex items-center gap-1.5">
                        <FaCalendarDays className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Engagement Metrics */}
                    <td className="py-4 px-4 text-xs font-semibold text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-emerald-500">
                          <FaThumbsUp className="h-3 w-3" /> {post.likes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1 text-rose-500">
                          <FaThumbsDown className="h-3 w-3" /> {post.dislikes?.length || 0}
                        </span>
                      </div>
                    </td>

                    {/* Moderation Actions: View Modal & Delete */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openViewModal(post)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 transition flex items-center gap-1">
                          <FaEye className="h-3.5 w-3.5" /> View Post
                        </button>

                        <Button
                          size="sm"
                          color="danger"
                          onClick={() => setPostToDelete(post)}
                          className="bg-rose-600 text-white font-bold text-xs shadow-sm"
                          startContent={<FaTrash className="h-3 w-3" />}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. VIEW POST DETAILS MODAL */}
      {selectedPostForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold">
                  {selectedPostForView.authorName ? selectedPostForView.authorName.charAt(0) : "A"}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-foreground flex items-center gap-2">
                    {selectedPostForView.authorName}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                      {selectedPostForView.authorRole || "Trainer"}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">{selectedPostForView.authorEmail}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPostForView(null)}
                className="text-muted-foreground hover:text-foreground">
                <FaXmark className="h-5 w-5" />
              </button>
            </div>

            {/* Post Title & Image */}
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-foreground leading-snug">
                {selectedPostForView.title}
              </h2>

              <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-accent border border-border">
                <Image
                  src={getValidImage(selectedPostForView.image)}
                  alt={selectedPostForView.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Full Description */}
              <div className="p-4 rounded-2xl bg-accent/30 border border-border text-sm text-foreground leading-relaxed whitespace-pre-line">
                {selectedPostForView.description}
              </div>

              {/* Metrics Bar */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                <div className="flex items-center gap-4 font-bold">
                  <span className="text-emerald-500 flex items-center gap-1">
                    <FaThumbsUp className="h-3.5 w-3.5" /> {selectedPostForView.likes?.length || 0} Likes
                  </span>
                  <span className="text-rose-500 flex items-center gap-1">
                    <FaThumbsDown className="h-3.5 w-3.5" /> {selectedPostForView.dislikes?.length || 0} Dislikes
                  </span>
                </div>
                <span>
                  Published: {new Date(selectedPostForView.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Comments Section in Admin Modal */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <FaComment className="h-4 w-4 text-cyan-500" />
                Comments List ({modalComments.length})
              </h3>

              {modalCommentsLoading ? (
                <div className="py-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <FaSpinner className="h-4 w-4 animate-spin text-cyan-500" /> Loading comments...
                </div>
              ) : modalComments.length === 0 ? (
                <p className="text-xs text-muted-foreground">No comments posted on this article yet.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {modalComments.map((c) => (
                    <div key={c._id} className="p-3 rounded-xl bg-accent/40 border border-border text-xs space-y-1">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="font-bold text-foreground">{c.userName} ({c.userEmail})</span>
                        <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-foreground">{c.commentText}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Link
                href={`/forum/${selectedPostForView._id}`}
                target="_blank"
                className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5">
                Open Public Forum Page <FaArrowUpRightFromSquare className="h-3 w-3" />
              </Link>
              <Button
                size="sm"
                onClick={() => setSelectedPostForView(null)}
                className="bg-accent text-foreground font-bold rounded-xl">
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONFIRM DELETE MODAL */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-500">
              <FaTrash className="h-6 w-6 shrink-0" />
              <h3 className="text-lg font-bold text-foreground">Moderate Post</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to delete <strong>"{postToDelete.title}"</strong>? This will permanently remove it from the public Community Forum.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="flat" onClick={() => setPostToDelete(null)}>
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