"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  FaReceipt,
  FaEnvelope,
  FaCalendarDays,
  FaCreditCard,
  FaDollarSign,
  FaSpinner,
  FaShieldHalved,
} from "react-icons/fa6";
import { getAuthHeaders } from "@/lib/jwt";

export default function AdminTransactionsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch transactions from backend
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const authHeaders = await getAuthHeaders(user?.email || "admin@ironpulse.com");
      const res = await fetch(`${API_URL}/api/admin/transactions`, {
        headers: authHeaders,
      });
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast.error("Failed to load payment transaction history");
    } finally {
      setLoading(false);
    }
  }, [API_URL, user?.email]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FaReceipt className="h-5 w-5 text-cyan-500" />
            Stripe Payment Transactions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Read-only audit log of all class booking payments processed via Stripe.
          </p>
        </div>

        {/* Stats Summary Card */}
        <div className="px-5 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-500">
            <FaDollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] uppercase font-bold text-cyan-600 dark:text-cyan-400">Total Volume</p>
            <p className="text-lg font-black text-foreground">
              ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-accent/40 text-muted-foreground text-xs uppercase font-semibold">
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">User Email</th>
                <th className="py-3.5 px-4">Class Name</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FaSpinner className="h-6 w-6 text-cyan-500 animate-spin" />
                      <span>Loading payment transactions from MongoDB...</span>
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No payment transactions recorded in database yet.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-accent/20 transition-colors">
                    {/* Transaction ID */}
                    <td className="py-4 px-4 font-mono text-xs text-foreground font-semibold">
                      <span className="inline-flex items-center gap-1.5 bg-accent/60 px-2.5 py-1 rounded-lg border border-border">
                        <FaCreditCard className="h-3 w-3 text-cyan-500" />
                        {tx.transactionId}
                      </span>
                    </td>

                    {/* User Email */}
                    <td className="py-4 px-4 text-foreground font-medium">
                      <span className="flex items-center gap-1.5">
                        <FaEnvelope className="h-3.5 w-3.5 text-muted-foreground" />
                        {tx.userEmail}
                      </span>
                    </td>

                    {/* Class Name */}
                    <td className="py-4 px-4 text-foreground font-semibold">
                      {tx.className}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-muted-foreground text-xs font-medium">
                      <span className="flex items-center gap-1.5">
                        <FaCalendarDays className="h-3.5 w-3.5 text-blue-500" />
                        {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4 font-bold text-emerald-500">
                      ${tx.amount.toFixed(2)}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        <FaShieldHalved className="h-3 w-3" /> {tx.paymentStatus || "Paid"}
                      </span>
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
