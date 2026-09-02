"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaNewspaper,
  FaCalendarDays,
  FaUserGraduate,
  FaShieldHalved,
  FaThumbsUp,
  FaThumbsDown,
  FaArrowRight,
  FaSpinner,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";

const FALLBACK_POST_IMAGE = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd";

export default function LatestForumPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    async function fetchLatestPosts() {
      try {
        setLoading(true);
        // Fetch 4 most recent forum posts from MongoDB backend
        const res = await fetch(`${API_URL}/api/forum?page=1&limit=4`);
        if (!res.ok) throw new Error("Failed to fetch latest forum posts");
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Error loading latest forum posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLatestPosts();
  }, [API_URL]);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-blue-500/10 text-blue-500 border border-blue-500/20 inline-flex items-center gap-2">
            <FaNewspaper className="h-3.5 w-3.5 text-cyan-400" /> Fitness Knowledge Hub
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            Latest Community <span className="text-cyan-500">Forum Articles</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Stay informed with expert nutrition advice, strength programming guidelines, and recovery protocols authored by certified trainers.
          </p>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <FaSpinner className="h-10 w-10 text-cyan-500 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-muted-foreground">
              Loading recent community articles...
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center bg-card border border-border rounded-3xl p-8 max-w-md mx-auto space-y-3">
            <FaNewspaper className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="text-sm font-bold text-foreground">No Forum Articles Published Yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post, idx) => {
              const isDirectImage = post.image && (post.image.includes("i.ibb.co") || post.image.includes("images.unsplash") || post.image.match(/\.(jpeg|jpg|gif|png|webp)/i));
              const imageSrc = isDirectImage ? post.image : FALLBACK_POST_IMAGE;

              return (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group">
                  
                  <div>
                    {/* Post Banner Image */}
                    <Link href={`/forum/${post._id}`} className="relative w-full h-48 bg-accent overflow-hidden block">
                      <Image
                        src={imageSrc}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Author Badge */}
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-extrabold flex items-center gap-1.5 border border-white/20">
                        {post.authorRole === "Admin" ? (
                          <FaShieldHalved className="h-3 w-3 text-cyan-400" />
                        ) : (
                          <FaUserGraduate className="h-3 w-3 text-blue-400" />
                        )}
                        <span>{post.authorName || "Author"}</span>
                      </div>

                      {/* Date Badge */}
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-white font-medium flex items-center gap-1">
                        <FaCalendarDays className="h-3 w-3 text-cyan-400" />
                        {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-5 space-y-2.5">
                      <Link href={`/forum/${post._id}`} className="block">
                        <h3 className="text-base font-extrabold text-foreground line-clamp-2 group-hover:text-cyan-500 transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {post.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div className="p-5 pt-0 flex items-center justify-between border-t border-border/50 mt-3 pt-3 text-xs">
                    <div className="flex items-center gap-2.5 font-bold text-muted-foreground text-[11px]">
                      <span className="flex items-center gap-1 text-emerald-500">
                        <FaThumbsUp className="h-3 w-3" />
                        {post.likes?.length || 0}
                      </span>
                      <span className="flex items-center gap-1 text-rose-500">
                        <FaThumbsDown className="h-3 w-3" />
                        {post.dislikes?.length || 0}
                      </span>
                    </div>

                    <Link
                      href={`/forum/${post._id}`}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold text-[11px] rounded-xl shadow-sm hover:from-blue-700 hover:to-cyan-600 transition flex items-center gap-1">
                      <span>Read</span>
                      <FaArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* View All Forum CTA */}
        <div className="text-center pt-2">
          <Button
            as={Link}
            href="/forum"
            size="lg"
            className="bg-card border border-border text-foreground font-extrabold text-sm px-8 hover:bg-accent hover:border-cyan-500/40 transition rounded-2xl shadow-sm"
            endContent={<FaArrowRight className="h-4 w-4 text-cyan-500" />}>
            Browse All Community Forum Articles
          </Button>
        </div>
      </div>
    </section>
  );
}
