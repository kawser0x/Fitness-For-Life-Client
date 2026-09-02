"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  FaUserGraduate,
  FaClock,
  FaCircleCheck,
  FaCircleXmark,
  FaEye,
  FaXmark,
  FaSpinner,
  FaCommentDots,
  FaCalendarDays,
  FaIdBadge,
} from "react-icons/fa6";
import { Button } from "@heroui/react/button";
import { useSession } from "@/lib/auth-client";
import { getAuthHeaders } from "@/lib/jwt";

export default function AdminAppliedTrainersPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch Trainer Applications from Backend MongoDB
  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const authHeaders = await getAuthHeaders(user?.email || "admin@ironpulse.com");
      const res = await fetch(`${API_URL}/api/admin/trainer-applications`, {
        headers: authHeaders,
      });
      if (!res.ok) throw new Error("Failed to fetch trainer applications");
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error("Error loading applications:", error);
      toast.error("Could not fetch trainer applications from server");
    } finally {
      setLoading(false);
    }
  }, [API_URL, user?.email]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Open Details Modal
  const openDetailsModal = (appItem) => {
    setSelectedApp(appItem);
    setFeedback(appItem.feedback || "");
  };

  // Handle Review Action (Approve or Reject with Feedback)
  const handleReview = async (actionType) => {
    if (!selectedApp) return;

    try {
      setActionLoading(true);
      const authHeaders = await getAuthHeaders(user?.email || "admin@ironpulse.com");
      const res = await fetch(
        `${API_URL}/api/admin/trainer-applications/${selectedApp._id}/review`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...authHeaders },
          body: JSON.stringify({
            action: actionType, // "approve" | "reject"
            feedback: feedback.trim(),
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to process application review");

      toast.success(
        actionType === "approve"
          ? `Application approved! User role promoted to Trainer.`
          : `Application rejected with feedback.`
      );

      setSelectedApp(null);
      setFeedback("");
      fetchApplications();
    } catch (error) {
      console.error("Error reviewing application:", error);
      toast.error("Failed to update application review");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FaUserGraduate className="h-5 w-5 text-cyan-500" />
          Pending Trainer Applications
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review member applications to become certified trainers, evaluate experience/specialty, write feedback, and approve/reject applications.
        </p>
      </div>

      {/* Applications Data Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-accent/40 text-muted-foreground text-xs uppercase font-semibold">
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Specialty</th>
                <th className="py-3.5 px-4">Experience</th>
                <th className="py-3.5 px-4">Application Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FaSpinner className="h-6 w-6 text-cyan-500 animate-spin" />
                      <span>Loading trainer applications from MongoDB...</span>
                    </div>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No pending trainer applications found in database.
                  </td>
                </tr>
              ) : (
                applications.map((appItem) => (
                  <tr key={appItem._id} className="hover:bg-accent/20 transition-colors">
                    {/* Applicant Info */}
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-foreground">{appItem.userName || "Applicant"}</p>
                        <p className="text-xs text-muted-foreground">{appItem.userEmail}</p>
                      </div>
                    </td>

                    {/* Specialty */}
                    <td className="py-4 px-4 font-semibold text-foreground">
                      {appItem.specialty}
                    </td>

                    {/* Experience */}
                    <td className="py-4 px-4 text-muted-foreground font-medium">
                      {appItem.experience}
                    </td>

                    {/* Application Time */}
                    <td className="py-4 px-4 text-muted-foreground text-xs">
                      <span className="flex items-center gap-1.5">
                        <FaCalendarDays className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
                        {new Date(appItem.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {appItem.status === "Approved" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          <FaCircleCheck className="h-3 w-3" /> Approved
                        </span>
                      ) : appItem.status === "Rejected" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                          <FaCircleXmark className="h-3 w-3" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          <FaClock className="h-3 w-3 animate-spin [animation-duration:4s]" /> Pending
                        </span>
                      )}
                    </td>

                    {/* Details Action Button */}
                    <td className="py-4 px-4 text-right">
                      <Button
                        size="sm"
                        onClick={() => openDetailsModal(appItem)}
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-sm text-xs rounded-xl"
                        startContent={<FaEye className="h-3 w-3" />}>
                        Details & Review
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPLICANT DETAILS & REVIEW MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <FaUserGraduate className="h-5 w-5 text-cyan-500" />
                  Trainer Application Details
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Review applicant credentials and submit decision feedback.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="text-muted-foreground hover:text-foreground">
                <FaXmark className="h-5 w-5" />
              </button>
            </div>

            {/* Applicant Information Grid (Experience, Specialty, Time) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-accent/40 border border-border space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                  <FaIdBadge className="h-3.5 w-3.5 text-cyan-500" /> Applicant Name
                </span>
                <p className="font-bold text-foreground text-sm">{selectedApp.userName}</p>
                <p className="text-muted-foreground">{selectedApp.userEmail}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-accent/40 border border-border space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                  <FaCalendarDays className="h-3.5 w-3.5 text-blue-500" /> Application Time
                </span>
                <p className="font-bold text-foreground text-sm">
                  {new Date(selectedApp.createdAt).toLocaleDateString()}
                </p>
                <span className="text-muted-foreground">
                  {new Date(selectedApp.createdAt).toLocaleTimeString()}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-accent/40 border border-border space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                  <FaUserGraduate className="h-3.5 w-3.5 text-emerald-500" /> Experience
                </span>
                <p className="font-bold text-foreground text-sm">{selectedApp.experience}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-accent/40 border border-border space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                  <FaClock className="h-3.5 w-3.5 text-amber-500" /> Specialty Area
                </span>
                <p className="font-bold text-foreground text-sm">{selectedApp.specialty}</p>
              </div>
            </div>

            {/* Admin Feedback Input Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <FaCommentDots className="h-3.5 w-3.5 text-cyan-500" />
                Admin Feedback Message
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write feedback message for applicant regarding decision..."
                className="w-full px-4 py-2.5 rounded-2xl border border-border text-foreground text-xs focus:outline-none focus:border-cyan-500 transition leading-relaxed bg-background"
              />
            </div>

            {/* Modal Actions: Approve or Reject */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
              <Button
                variant="flat"
                color="danger"
                isLoading={actionLoading}
                onClick={() => handleReview("reject")}
                className="bg-rose-500/10 text-rose-500 font-bold hover:bg-rose-500 hover:text-white rounded-xl">
                Reject Application
              </Button>
              <Button
                isLoading={actionLoading}
                onClick={() => handleReview("approve")}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-md rounded-xl">
                Approve as Trainer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}