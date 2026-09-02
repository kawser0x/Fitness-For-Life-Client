"use client";

import { getSession } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Retrieve authorization headers containing Better Auth session token or JWT Bearer token
 */
export async function getAuthHeaders(userEmail) {
  if (typeof window === "undefined") return {};

  let token = localStorage.getItem("access-token");

  if (!token) {
    try {
      const sessionRes = await getSession();
      token = sessionRes?.data?.session?.token || sessionRes?.data?.token;
    } catch (e) {
      console.error("Error retrieving Better Auth session token:", e);
    }
  }

  // If still no token and userEmail is available, fetch fresh JWT token
  if (!token && userEmail) {
    token = await syncJWTToken(userEmail);
  }

  return token ? { authorization: `Bearer ${token}` } : {};
}

/**
 * Sync JWT Access Token fallback
 */
export async function syncJWTToken(email) {
  if (!email || typeof window === "undefined") return null;
  try {
    const res = await fetch(`${API_URL}/api/jwt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) throw new Error("Failed to issue JWT token");
    const data = await res.json();

    if (data.token) {
      localStorage.setItem("access-token", data.token);
      return data.token;
    }
  } catch (error) {
    console.error("Error syncing JWT token:", error);
  }
  return null;
}
