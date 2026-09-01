"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaNewspaper,
  FaCalendarDays,
  FaUserGraduate,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaShieldHalved,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";

export default function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd";

  // Fetch Public Forum Posts with Server-Side Pagination
  const fetchPosts = useCallback(async (currentPage) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/forum?page=${currentPage}&limit=6`);
      if (!res.ok) throw new Error("Failed to fetch forum posts");
      const data = await res.json();
      setPosts(data.posts || []);
      setTotalPages(data.totalPages || 1);
      setTotalPosts(data.total || 0);
    } catch (error) {
      console.error("Error loading forum posts:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchPosts(page);
  }, [fetchPosts, page]);

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Banner Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 inline-flex items-center gap-2">
            <FaNewspaper className="h-3.5 w-3.5" />
            Fitness & Health Knowledge Hub
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            Community <span className="text-cyan-500">Forum</span>
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Discover training guides, nutrition insights, and recovery protocols authored by certified fitness trainers and platform administrators.
          </p>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
            <FaSpinner className="h-10 w-10 text-cyan-500 animate-spin" />
            <p className="text-sm font-semibold text-muted-foreground">
              Loading community forum posts from database...
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-card border border-border rounded-3xl p-16 text-center space-y-4 max-w-md mx-auto shadow-sm">
            <FaNewspaper className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-bold text-foreground">No Forum Posts Found</h3>
            <p className="text-xs text-muted-foreground">
              Check back soon for new training guides and community articles!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const isDirectImage = post.image && (post.image.includes("i.ibb.co") || post.image.includes("images.unsplash") || post.image.match(/\.(jpeg|jpg|gif|png|webp)/i));
              const imageSrc = isDirectImage ? post.image : FALLBACK_IMAGE;

              return (
                <div
                  key={post._id}
                  className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    {/* Post Image Container (Clickable) */}
                    <Link href={`/forum/${post._id}`} className="relative w-full h-52 bg-accent overflow-hidden block">
                      <Image
                        src={imageSrc}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white font-bold flex items-center gap-1.5 border border-white/10">
                        {post.authorRole === "Admin" ? (
                          <FaShieldHalved className="h-3 w-3 text-cyan-400" />
                        ) : (
                          <FaUserGraduate className="h-3 w-3 text-blue-400" />
                        )}
                        <span>{post.authorName || "Author"}</span>
                      </div>

                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-white font-medium flex items-center gap-1">
                        <FaCalendarDays className="h-3 w-3 text-cyan-400" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </Link>

                    {/* Post Content */}
                    <div className="p-6 space-y-3">
                      <Link href={`/forum/${post._id}`} className="block">
                        <h2 className="text-lg font-extrabold text-foreground line-clamp-2 group-hover:text-cyan-500 transition-colors">
                          {post.title}
                        </h2>
                      </Link>
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {post.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer Bar with Likes and Read More */}
                  <div className="p-6 pt-0 flex items-center justify-between border-t border-border/50 mt-4 pt-4 text-xs">
                    <div className="flex items-center gap-3 font-semibold text-muted-foreground">
                      <span className="flex items-center gap-1 text-emerald-500">
                        <FaThumbsUp className="h-3.5 w-3.5" />
                        {post.likes?.length || 0}
                      </span>
                      <span className="flex items-center gap-1 text-rose-500">
                        <FaThumbsDown className="h-3.5 w-3.5" />
                        {post.dislikes?.length || 0}
                      </span>
                    </div>

                    <Link
                      href={`/forum/${post._id}`}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs rounded-xl shadow-md hover:from-blue-700 hover:to-cyan-600 transition flex items-center gap-1.5">
                      <span>Read More</span>
                      <FaArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Server-Side Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6">
            <Button
              size="sm"
              variant="flat"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              startContent={<FaChevronLeft className="h-3 w-3" />}>
              Previous
            </Button>

            <span className="text-xs font-bold text-muted-foreground px-3">
              Page {page} of {totalPages} ({totalPosts} total articles)
            </span>

            <Button
              size="sm"
              variant="flat"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              endContent={<FaChevronRight className="h-3 w-3" />}>
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}