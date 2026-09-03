"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  FaDumbbell,
  FaCircleCheck,
  FaCircleXmark,
  FaClock,
  FaTrash,
  FaSpinner,
  FaTag,
  FaCalendarDays,
  FaUserGraduate,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";
import { useSession } from "@/lib/auth-client";
import { getAuthHeaders } from "@/lib/jwt";

export default function AdminManageClassesPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [classToDelete, setClassToDelete] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL ;
  const FALLBACK_CLASS_IMAGE = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd";

  const getValidClassImage = (url) => {
    if (!url || typeof url !== "string") return FALLBACK_CLASS_IMAGE;
    if ((url.includes("ibb.co/") || url.includes("ibb.co.com/")) && !url.includes("i.ibb.co")) {
      return FALLBACK_CLASS_IMAGE;
    }
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
      return url;
    }
    return FALLBACK_CLASS_IMAGE;
  };

  // Fetch all classes from MongoDB (Pending, Approved, Rejected)
  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const authHeaders = await getAuthHeaders(user?.email || "admin@ironpulse.com");
      const res = await fetch(`${API_URL}/api/admin/classes`, {
        headers: authHeaders,
      });
      if (!res.ok) throw new Error("Failed to fetch admin classes");
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error("Error loading classes:", error);
      toast.error("Could not fetch classes from server");
    } finally {
      setLoading(false);
    }
  }, [API_URL, user?.email]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Handle Status Update (Approve / Reject)
  const handleStatusChange = async (classId, newStatus) => {
    try {
      setActionLoadingId(classId);
      const authHeaders = await getAuthHeaders(user?.email || "admin@ironpulse.com");
      const res = await fetch(`${API_URL}/api/admin/classes/${classId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update class status");

      toast.success(
        newStatus === "Approved"
          ? "Class approved successfully! It is now visible on the public site."
          : "Class status set to Rejected."
      );

      fetchClasses();
    } catch (error) {
      console.error("Error updating class status:", error);
      toast.error("Failed to update class status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Delete Class
  const handleDeleteConfirm = async () => {
    if (!classToDelete) return;
    try {
      setActionLoadingId(classToDelete._id);
      const authHeaders = await getAuthHeaders(user?.email || "admin@ironpulse.com");
      const res = await fetch(`${API_URL}/api/classes/${classToDelete._id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (!res.ok) throw new Error("Failed to delete class");

      toast.success(`Class "${classToDelete.className}" deleted successfully.`);
      setClassToDelete(null);
      fetchClasses();
    } catch (error) {
      console.error("Error deleting class:", error);
      toast.error("Failed to delete class");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FaDumbbell className="h-5 w-5 text-cyan-500" />
          Manage Submitted Classes
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review trainer class submissions, approve or reject sessions, and delete inappropriate class listings.
        </p>
      </div>

      {/* Data Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-accent/40 text-muted-foreground text-xs uppercase font-semibold">
                <th className="py-3.5 px-4">Class Details</th>
                <th className="py-3.5 px-4">Trainer</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Schedule</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FaSpinner className="h-6 w-6 text-cyan-500 animate-spin" />
                      <span>Loading classes from MongoDB...</span>
                    </div>
                  </td>
                </tr>
              ) : classes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No submitted classes found in database.
                  </td>
                </tr>
              ) : (
                classes.map((cls) => (
                  <tr key={cls._id} className="hover:bg-accent/20 transition-colors">
                    {/* Class Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-accent shrink-0 border border-border">
                          <Image
                            src={getValidClassImage(cls.image)}
                            alt={cls.className}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <p className="font-bold text-foreground line-clamp-1">{cls.className}</p>
                          <span className="text-xs text-muted-foreground">
                            {cls.duration} • {cls.difficultyLevel}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Trainer Info */}
                    <td className="py-4 px-4">
                      <div className="text-xs">
                        <p className="font-bold text-foreground flex items-center gap-1">
                          <FaUserGraduate className="h-3 w-3 text-cyan-500" />
                          {cls.trainerName || "Trainer"}
                        </p>
                        <p className="text-muted-foreground truncate max-w-[150px]">
                          {cls.trainerEmail}
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-accent border border-border">
                        <FaTag className="h-3 w-3 text-cyan-500" />
                        {cls.category}
                      </span>
                    </td>

                    {/* Schedule */}
                    <td className="py-4 px-4 text-muted-foreground text-xs font-medium max-w-[180px]">
                      <span className="flex items-center gap-1.5 text-foreground font-semibold truncate">
                        <FaCalendarDays className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        {cls.classSchedule}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-bold text-emerald-500">
                      ${typeof cls.price === "number" ? cls.price.toFixed(2) : cls.price}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {cls.status === "Approved" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          <FaCircleCheck className="h-3 w-3" /> Approved
                        </span>
                      ) : cls.status === "Rejected" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                          <FaCircleXmark className="h-3 w-3" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          <FaClock className="h-3 w-3 animate-spin [animation-duration:4s]" /> Pending
                        </span>
                      )}
                    </td>

                    {/* Actions: Approve, Reject, Delete */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {cls.status !== "Approved" && (
                          <Button
                            size="sm"
                            isLoading={actionLoadingId === cls._id}
                            onClick={() => handleStatusChange(cls._id, "Approved")}
                            className="bg-emerald-600 text-white font-bold text-xs shadow-sm">
                            Approve
                          </Button>
                        )}

                        {cls.status !== "Rejected" && (
                          <Button
                            size="sm"
                            variant="flat"
                            color="danger"
                            isLoading={actionLoadingId === cls._id}
                            onClick={() => handleStatusChange(cls._id, "Rejected")}
                            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold hover:bg-amber-500/20 text-xs">
                            Reject
                          </Button>
                        )}

                        <button
                          type="button"
                          onClick={() => setClassToDelete(cls)}
                          className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition border border-transparent hover:border-rose-500/20"
                          title="Delete Class">
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRM DELETE MODAL */}
      {classToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-500">
              <FaTrash className="h-6 w-6 shrink-0" />
              <h3 className="text-lg font-bold text-foreground">Confirm Deletion</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to delete <strong>"{classToDelete.className}"</strong>? This will permanently remove it from the platform.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="flat" onClick={() => setClassToDelete(null)}>
                Cancel
              </Button>
              <Button
                color="danger"
                isLoading={actionLoadingId === classToDelete._id}
                className="bg-rose-600 text-white font-bold"
                onClick={handleDeleteConfirm}>
                Delete Class
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}