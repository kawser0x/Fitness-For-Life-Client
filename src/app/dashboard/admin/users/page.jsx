"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  FaUsers,
  FaShieldHalved,
  FaUserGraduate,
  FaUserCheck,
  FaBan,
  FaCheck,
  FaSpinner,
  FaEnvelope,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";
import { useSession } from "@/lib/auth-client";
import { getAuthHeaders } from "@/lib/jwt";

export default function AdminManageUsersPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Fetch registered users from MongoDB
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const authHeaders = await getAuthHeaders(user?.email || "admin@ironpulse.com");
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: authHeaders,
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users from database");
    } finally {
      setLoading(false);
    }
  }, [API_URL, user?.email]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Block / Unblock Toggle (Soft Block)
  const handleToggleBlock = async (userItem) => {
    const newStatus = userItem.status === "blocked" ? "active" : "blocked";
    try {
      setActionLoadingId(userItem._id);
      const authHeaders = await getAuthHeaders(user?.email || "admin@ironpulse.com");
      const res = await fetch(`${API_URL}/api/admin/users/${userItem._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update user status");

      toast.success(
        newStatus === "blocked"
          ? `User "${userItem.name || userItem.email}" has been blocked.`
          : `User "${userItem.name || userItem.email}" has been unblocked.`
      );
      fetchUsers();
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Failed to update user status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Make Admin (Promote User)
  const handleMakeAdmin = async (userItem) => {
    try {
      setActionLoadingId(userItem._id);
      const authHeaders = await getAuthHeaders(user?.email || "admin@ironpulse.com");
      const res = await fetch(`${API_URL}/api/admin/users/${userItem._id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ role: "admin" }),
      });

      if (!res.ok) throw new Error("Failed to promote user");

      toast.success(`User "${userItem.name || userItem.email}" promoted to Admin!`);
      fetchUsers();
    } catch (error) {
      console.error("Error promoting user:", error);
      toast.error("Failed to promote user to admin");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FaUsers className="h-5 w-5 text-cyan-500" />
          Manage All Platform Users
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View registered members, conditionally block/unblock accounts (Soft Block), and promote standard users to Super Administrators.
        </p>
      </div>

      {/* Users Data Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-accent/40 text-muted-foreground text-xs uppercase font-semibold">
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role Badge</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FaSpinner className="h-6 w-6 text-cyan-500 animate-spin" />
                      <span>Loading registered users from MongoDB...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    No users found in database.
                  </td>
                </tr>
              ) : (
                users.map((userItem) => (
                  <tr key={userItem._id} className="hover:bg-accent/20 transition-colors">
                    {/* User Details */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shrink-0">
                          <div className="w-full h-full bg-card rounded-full overflow-hidden flex items-center justify-center font-bold text-foreground">
                            {userItem.image ? (
                              <Image
                                src={userItem.image}
                                alt={userItem.name || "User Avatar"}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <span>{userItem.name ? userItem.name.charAt(0) : "U"}</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{userItem.name || "Member"}</p>
                          <span className="text-[11px] text-muted-foreground">
                            Joined: {new Date(userItem.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-4 text-muted-foreground font-medium">
                      <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                        <FaEnvelope className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
                        {userItem.email}
                      </span>
                    </td>

                    {/* Role Badge */}
                    <td className="py-4 px-4">
                      {userItem.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                          <FaShieldHalved className="h-3 w-3" /> Admin
                        </span>
                      ) : userItem.role === "trainer" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                          <FaUserGraduate className="h-3 w-3" /> Trainer
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent text-foreground border border-border">
                          <FaUserCheck className="h-3 w-3 text-muted-foreground" /> Member
                        </span>
                      )}
                    </td>

                    {/* Account Status */}
                    <td className="py-4 px-4">
                      {userItem.status === "blocked" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                          <FaBan className="h-3 w-3" /> Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          <FaCheck className="h-3 w-3" /> Active
                        </span>
                      )}
                    </td>

                    {/* Admin Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Make Admin Button (Only for non-admin users) */}
                        {userItem.role !== "admin" && (
                          <Button
                            size="sm"
                            variant="flat"
                            isLoading={actionLoadingId === userItem._id}
                            onClick={() => handleMakeAdmin(userItem)}
                            className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold hover:bg-cyan-500/20 text-xs">
                            Make Admin
                          </Button>
                        )}

                        {/* Conditionally Rendered Block / Unblock Button */}
                        <Button
                          size="sm"
                          isLoading={actionLoadingId === userItem._id}
                          onClick={() => handleToggleBlock(userItem)}
                          className={
                            userItem.status === "blocked"
                              ? "bg-emerald-600 text-white font-semibold text-xs shadow-sm"
                              : "bg-rose-600 text-white font-semibold text-xs shadow-sm"
                          }>
                          {userItem.status === "blocked" ? "Unblock" : "Block"}
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
    </div>
  );
}