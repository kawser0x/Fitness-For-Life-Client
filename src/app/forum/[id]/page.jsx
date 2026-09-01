"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  FaCalendarDays,
  FaUserGraduate,
  FaShieldHalved,
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaPaperPlane,
  FaTrash,
  FaPen,
  FaArrowLeft,
  FaSpinner,
  FaLock,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";
import { useSession } from "@/lib/auth-client";

export default function ForumPostDetailsPage({ params }) {
  const resolvedParams = use(params);
  const postId = resolvedParams?.id;

  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voteLoading, setVoteLoading] = useState(false);

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Edit Comment state
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd";

  // Fetch Post Details from MongoDB Backend
  const fetchPostDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/forum/${postId}`);
      if (!res.ok) throw new Error("Forum post not found");
      const data = await res.json();
      setPost(data);
    } catch (error) {
      console.error("Error loading forum post:", error);
      toast.error("Could not load forum post details");
    } finally {
      setLoading(false);
    }
  }, [API_URL, postId]);

  // Fetch Comments for this post
  const fetchComments = useCallback(async () => {
    try {
      setCommentsLoading(true);
      const res = await fetch(`${API_URL}/api/forum/${postId}/comments`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  }, [API_URL, postId]);

  useEffect(() => {
    if (postId) {
      fetchPostDetails();
      fetchComments();
    }
  }, [postId, fetchPostDetails, fetchComments]);

  // Handle Like / Dislike Vote (One vote per user rule)
  const handleVote = async (voteType) => {
    if (!user) {
      toast.error("Please login to vote on forum posts!");
      return;
    }

    try {
      setVoteLoading(true);
      const res = await fetch(`${API_URL}/api/forum/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          type: voteType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Vote failed");

      setPost((prev) => ({
        ...prev,
        likes: data.likes,
        dislikes: data.dislikes,
      }));

      toast.success(voteType === "like" ? "Liked post!" : "Disliked post!");
    } catch (error) {
      console.error("Error voting:", error);
      toast.error(error.message || "Failed to record vote");
    } finally {
      setVoteLoading(false);
    }
  };

  // Handle New Comment Submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to post comments!");
      return;
    }
    if (!newCommentText.trim()) return;

    try {
      setCommentSubmitting(true);
      const res = await fetch(`${API_URL}/api/forum/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.name || user.email.split("@")[0] || "Member",
          userImage: user.image || "/assets/logo.png",
          commentText: newCommentText.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post comment");

      toast.success("Comment posted successfully!");
      setNewCommentText("");
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error(error.message || "Failed to post comment");
    } finally {
      setCommentSubmitting(false);
    }
  };

  // Handle Delete Own Comment
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`${API_URL}/api/forum/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete comment");

      toast.success("Comment deleted.");
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  // Handle Edit Own Comment Submit
  const handleEditCommentSubmit = async (commentId) => {
    if (!editCommentText.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/forum/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentText: editCommentText.trim(),
          userEmail: user.email,
        }),
      });

      if (!res.ok) throw new Error("Failed to update comment");

      toast.success("Comment updated!");
      setEditingCommentId(null);
      fetchComments();
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 p-4">
        <FaSpinner className="h-10 w-10 text-cyan-500 animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">
          Loading forum article details...
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background py-16 text-center">
        <h2 className="text-xl font-bold text-foreground">Post Not Found</h2>
        <Button as={Link} href="/forum" className="mt-4">
          Back to Forum
        </Button>
      </div>
    );
  }

  const userEmail = user?.email || "";
  const hasLiked = post.likes?.includes(userEmail);
  const hasDisliked = post.dislikes?.includes(userEmail);
  const isDirectImage =
    post.image &&
    (post.image.includes("i.ibb.co") ||
      post.image.includes("images.unsplash") ||
      post.image.match(/\.(jpeg|jpg|gif|png|webp)/i));
  const imageSrc = isDirectImage ? post.image : FALLBACK_IMAGE;

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          href="/forum"
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-cyan-500 transition">
          <FaArrowLeft className="h-3.5 w-3.5" /> Back to Community Forum
        </Link>

        {/* Main Article Banner & Info */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl space-y-6 p-6 sm:p-8">
          {/* Author Badge & Date Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shrink-0">
                <div className="w-full h-full bg-background rounded-full flex items-center justify-center font-bold text-foreground">
                  {post.authorName ? post.authorName.charAt(0) : "A"}
                </div>
              </div>
              <div>
                <p className="text-sm font-extrabold text-foreground flex items-center gap-2">
                  {post.authorName}
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                    {post.authorRole === "Admin" ? (
                      <FaShieldHalved className="h-2.5 w-2.5" />
                    ) : (
                      <FaUserGraduate className="h-2.5 w-2.5" />
                    )}
                    {post.authorRole || "Trainer"}
                  </span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {post.authorEmail}
                </p>
              </div>
            </div>

            <div className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 bg-accent/40 px-3 py-1.5 rounded-xl border border-border">
              <FaCalendarDays className="h-3.5 w-3.5 text-cyan-500" />
              Published: {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Featured Image */}
          <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-accent border border-border">
            <Image
              src={imageSrc}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Complete Article Content */}
          <div className="prose dark:prose-invert max-w-none text-foreground text-sm sm:text-base leading-relaxed whitespace-pre-line py-4 border-b border-border">
            {post.description}
          </div>

          {/* Interactive Like / Dislike Voting Bar (1 vote limit per user) */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={voteLoading}
                onClick={() => handleVote("like")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border ${
                  hasLiked
                    ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20"
                    : "bg-accent/40 text-foreground border-border hover:bg-emerald-500/10 hover:text-emerald-500"
                }`}>
                <FaThumbsUp className="h-4 w-4" />
                <span>Like ({post.likes?.length || 0})</span>
              </button>

              <button
                type="button"
                disabled={voteLoading}
                onClick={() => handleVote("dislike")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border ${
                  hasDisliked
                    ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20"
                    : "bg-accent/40 text-foreground border-border hover:bg-rose-500/10 hover:text-rose-500"
                }`}>
                <FaThumbsDown className="h-4 w-4" />
                <span>Dislike ({post.dislikes?.length || 0})</span>
              </button>
            </div>

            <span className="text-xs text-muted-foreground font-medium">
              {comments.length} Comments
            </span>
          </div>
        </div>

        {/* COMMENTS SECTION */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FaComment className="h-5 w-5 text-cyan-500" />
            Community Discussion ({comments.length})
          </h3>

          {/* Post New Comment Form */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="space-y-3">
              <textarea
                rows={3}
                required
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write your thoughts, questions, or comments on this article..."
                className="w-full px-4 py-3 rounded-2xl border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition leading-relaxed bg-background"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  isLoading={commentSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-md rounded-xl"
                  startContent={
                    !commentSubmitting && (
                      <FaPaperPlane className="h-3.5 w-3.5" />
                    )
                  }>
                  Post Comment
                </Button>
              </div>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-600 dark:text-cyan-300 flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 font-medium">
                <FaLock className="h-4 w-4 shrink-0" /> Log in to join the
                discussion and post comments.
              </span>
              <Button
                as={Link}
                href="/login"
                size="sm"
                className="bg-cyan-600 text-white font-bold shrink-0">
                Log In
              </Button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4 pt-4 border-t border-border">
            {commentsLoading ? (
              <div className="py-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                <FaSpinner className="h-4 w-4 animate-spin text-cyan-500" />
                Loading comments...
              </div>
            ) : comments.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No comments yet. Be the first to comment on this post!
              </div>
            ) : (
              comments.map((comment) => {
                const isMyComment =
                  userEmail && comment.userEmail === userEmail;
                const isEditing = editingCommentId === comment._id;

                return (
                  <div
                    key={comment._id}
                    className="p-4 rounded-2xl border border-border bg-accent/20 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-white uppercase text-[10px]">
                          {comment.userName ? comment.userName.charAt(0) : "U"}
                        </div>
                        <div>
                          <span className="font-bold text-foreground">
                            {comment.userName}
                          </span>
                          <span className="text-[10px] text-muted-foreground ml-2">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Action options for comment author */}
                      {isMyComment && !isEditing && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCommentId(comment._id);
                              setEditCommentText(comment.commentText);
                            }}
                            className="text-blue-500 hover:underline flex items-center gap-1">
                            <FaPen className="h-3 w-3" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-rose-500 hover:underline flex items-center gap-1">
                            <FaTrash className="h-3 w-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2 pt-2">
                        <textarea
                          rows={2}
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-border text-foreground text-xs bg-background focus:outline-none focus:border-cyan-500"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="flat"
                            onClick={() => setEditingCommentId(null)}>
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="bg-cyan-500 text-white font-bold"
                            onClick={() =>
                              handleEditCommentSubmit(comment._id)
                            }>
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-foreground leading-relaxed pl-9">
                        {comment.commentText}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
