"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  FaDumbbell,
  FaPlus,
  FaPen,
  FaTrash,
  FaUsers,
  FaClock,
  FaTag,
  FaCircleCheck,
  FaXmark,
  FaCalendarDays,
  FaSpinner,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";
import { useSession } from "@/lib/auth-client";

export default function MyClassesPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const trainerEmail = user?.email || "elena.rostova@fitness.com";

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedClassForUpdate, setSelectedClassForUpdate] = useState(null);
  const [selectedClassForAttendees, setSelectedClassForAttendees] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Update Modal Form State
  const [editFormData, setEditFormData] = useState({
    className: "",
    category: "",
    duration: "",
    classSchedule: "",
    price: "",
    description: "",
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const FALLBACK_CLASS_IMAGE = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd";

  // Validate and get direct image URL or fallback to high quality fitness image
  const getValidClassImage = (url) => {
    if (!url || typeof url !== "string") return FALLBACK_CLASS_IMAGE;
    // ImgBB webpage links like https://ibb.co.com/n8YXsqg7 are HTML, not direct images
    if ((url.includes("ibb.co/") || url.includes("ibb.co.com/")) && !url.includes("i.ibb.co")) {
      return FALLBACK_CLASS_IMAGE;
    }
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
      return url;
    }
    return FALLBACK_CLASS_IMAGE;
  };

  // Fetch Trainer Classes from Backend Database
  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/classes/trainer/${trainerEmail}`);
      if (!res.ok) throw new Error("Failed to fetch classes");
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error("Error loading classes:", error);
      toast.error("Could not fetch classes from server");
    } finally {
      setLoading(false);
    }
  }, [API_URL, trainerEmail]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Open Update Modal
  const openUpdateModal = (cls) => {
    setSelectedClassForUpdate(cls);
    setEditFormData({
      className: cls.className,
      category: cls.category,
      duration: cls.duration,
      classSchedule: cls.classSchedule,
      price: cls.price,
      description: cls.description,
    });
  };

  // Submit Class Update to Backend
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await fetch(`${API_URL}/api/classes/${selectedClassForUpdate._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      if (!res.ok) throw new Error("Failed to update class");

      toast.success(`Class "${editFormData.className}" updated successfully!`);
      setSelectedClassForUpdate(null);
      fetchClasses();
    } catch (error) {
      console.error("Error updating class:", error);
      toast.error("Failed to update class details");
    } finally {
      setActionLoading(false);
    }
  };

  // Confirm Delete Class from Backend
  const handleDeleteConfirm = async () => {
    if (!classToDelete) return;
    try {
      setActionLoading(true);
      const res = await fetch(`${API_URL}/api/classes/${classToDelete._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete class");

      toast.success(`Class "${classToDelete.className}" deleted successfully.`);
      setClassToDelete(null);
      fetchClasses();
    } catch (error) {
      console.error("Error deleting class:", error);
      toast.error("Failed to delete class");
    } finally {
      setActionLoading(false);
    }
  };

  // View Class Attendees from Backend
  const openAttendeesModal = async (cls) => {
    setSelectedClassForAttendees(cls);
    try {
      setAttendeesLoading(true);
      const res = await fetch(`${API_URL}/api/classes/${cls._id}/attendees`);
      if (!res.ok) throw new Error("Failed to fetch attendees");
      const data = await res.json();
      setAttendees(data);
    } catch (error) {
      console.error("Error fetching attendees:", error);
      setAttendees([]);
    } finally {
      setAttendeesLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FaDumbbell className="h-5 w-5 text-cyan-500" />
            My Created Classes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your submitted fitness classes, update schedule/details, and view registered students.
          </p>
        </div>
        <Button
          as={Link}
          href="/dashboard/trainer/add-class"
          className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-md shrink-0"
          startContent={<FaPlus className="h-3.5 w-3.5" />}>
          Add New Class
        </Button>
      </div>

      {/* Classes Data Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-accent/40 text-muted-foreground text-xs uppercase font-semibold">
                <th className="py-3.5 px-4">Class Info</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Schedule</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Attendees</th>
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
                    No classes found in the database. Click "Add New Class" to create your first session!
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
                          <p className="font-bold text-foreground line-clamp-1">
                            {cls.className}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {cls.duration} • {cls.difficultyLevel}
                          </span>
                        </div>
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
                    <td className="py-4 px-4 text-muted-foreground text-xs font-medium max-w-[200px]">
                      <div className="flex items-center gap-1.5 text-foreground font-semibold">
                        <FaCalendarDays className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        <span className="truncate">{cls.classSchedule}</span>
                      </div>
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
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          <FaClock className="h-3 w-3 animate-spin [animation-duration:4s]" /> Pending
                        </span>
                      )}
                    </td>

                    {/* Attendees Modal Trigger */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => openAttendeesModal(cls)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 transition">
                        <FaUsers className="h-3.5 w-3.5" />
                        View Students ({cls.bookingCount || 0})
                      </button>
                    </td>

                    {/* Actions: Update & Delete */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openUpdateModal(cls)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-500/10 transition border border-transparent hover:border-blue-500/20"
                          title="Update Class">
                          <FaPen className="h-4 w-4" />
                        </button>

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

      {/* 1. UPDATE CLASS MODAL */}
      {selectedClassForUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FaPen className="h-4 w-4 text-cyan-500" />
                Update Class Details
              </h3>
              <button
                type="button"
                onClick={() => setSelectedClassForUpdate(null)}
                className="text-muted-foreground hover:text-foreground">
                <FaXmark className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase">Class Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.className}
                  onChange={(e) => setEditFormData({ ...editFormData, className: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-border text-foreground bg-background focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground uppercase">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-border text-foreground bg-background focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground uppercase">Duration</label>
                  <input
                    type="text"
                    required
                    value={editFormData.duration}
                    onChange={(e) => setEditFormData({ ...editFormData, duration: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-border text-foreground bg-background focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase">Schedule</label>
                <input
                  type="text"
                  required
                  value={editFormData.classSchedule}
                  onChange={(e) => setEditFormData({ ...editFormData, classSchedule: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-border text-foreground bg-background focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-border text-foreground bg-background focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="flat"
                  onClick={() => setSelectedClassForUpdate(null)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={actionLoading}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. VIEW STUDENTS / ATTENDEES MODAL */}
      {selectedClassForAttendees && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <FaUsers className="h-4 w-4 text-cyan-500" />
                  Enrolled Students
                </h3>
                <p className="text-xs text-muted-foreground truncate max-w-[260px]">
                  {selectedClassForAttendees.className}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClassForAttendees(null)}
                className="text-muted-foreground hover:text-foreground">
                <FaXmark className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {attendeesLoading ? (
                <div className="py-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <FaSpinner className="h-4 w-4 animate-spin text-cyan-500" />
                  Loading student roster...
                </div>
              ) : attendees.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No students have booked this class yet.
                </div>
              ) : (
                attendees.map((student, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-border bg-accent/30 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-foreground">{student.userName || "Student"}</p>
                      <p className="text-muted-foreground">{student.userEmail}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(student.date).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                size="sm"
                onClick={() => setSelectedClassForAttendees(null)}
                className="bg-accent text-foreground font-semibold">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONFIRM DELETE MODAL */}
      {classToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-500">
              <FaTrash className="h-6 w-6 shrink-0" />
              <h3 className="text-lg font-bold text-foreground">Confirm Class Deletion</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to delete <strong>"{classToDelete.className}"</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="flat"
                onClick={() => setClassToDelete(null)}>
                Cancel
              </Button>
              <Button
                color="danger"
                isLoading={actionLoading}
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