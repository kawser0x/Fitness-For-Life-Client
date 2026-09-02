"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import {
  Dumbbell,
  User,
  Mail,
  Image as ImageIcon,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
    role: "user", // Default selection: 'user' or 'trainer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Password Rules Validation Logic
  const hasMinLength = formData.password.length >= 6;
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasLowercase = /[a-z]/.test(formData.password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  // Check if image URL is an ImgBB viewer webpage link (e.g. ibb.co.com/xxx or ibb.co/xxx)
  const isImgBBPageUrl =
    formData.image &&
    (formData.image.includes("ibb.co/") || formData.image.includes("ibb.co.com/")) &&
    !formData.image.includes("i.ibb.co");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg("");
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (!isPasswordValid) {
      setErrorMsg("Password does not meet the required security rules.");
      return;
    }

    if (isImgBBPageUrl) {
      setErrorMsg(
        "You entered an ImgBB viewer webpage link (ibb.co.com/xxx). Please use a direct image URL (e.g. https://i.ibb.co.com/.../image.jpg) or leave blank for a default avatar."
      );
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Better Auth Sign-Up with standard payload
      const res = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image:
          formData.image ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      });

      if (res?.error) {
        setErrorMsg(res.error.message || "Registration failed.");
      } else {
        // 2. Sync user role to MongoDB backend
        try {
          await fetch(`${API_URL}/api/user/sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              name: formData.name,
              image: formData.image,
              role: formData.role,
            }),
          });
        } catch (syncErr) {
          console.error("User role sync error:", syncErr);
        }

        setSuccessMsg(
          `Account registered as ${formData.role === "trainer" ? "Trainer" : "User"}! Redirecting to login...`
        );
        setTimeout(() => {
          router.push("/login");
        }, 1200);
      }
    } catch (err) {
      console.error("Register Error:", err);
      setErrorMsg(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
        newUserCallbackURL: "/",
      });
    } catch (err) {
      console.error("Google Auth Error:", err);
      setErrorMsg("Google authentication failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/20">
              <Image
                src="/assets/logo.png"
                alt="Fitness For Life Logo"
                width={60}
                height={60}
              />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Create Your <span className="text-emerald-600">Account</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Join Fitness For Life today and start your fitness transformation.
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 text-red-600 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Select Your Account Role
              </label>
              <div className="grid grid-cols-2 gap-3 pt-0.5">
                <button
                  type="button"
                  onClick={() => handleRoleSelect("user")}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    formData.role === "user"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold ring-2 ring-emerald-500/30"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}>
                  <UserCheck className="w-4 h-4" />
                  <span>User (Member)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect("trainer")}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    formData.role === "trainer"
                      ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold ring-2 ring-blue-500/30"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Trainer</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Profile Direct Image URL (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://i.ibb.co.com/example/avatar.jpg"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    isImgBBPageUrl
                      ? "border-amber-500 bg-amber-500/5"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                  } text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all`}
                />
              </div>

              {isImgBBPageUrl ? (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold leading-tight pt-1">
                  ⚠️ Note: ImgBB webpage viewer links (e.g. ibb.co.com/xxx) are HTML pages. Right-click the image and select "Copy Image Address" to get direct link (e.g. https://i.ibb.co.com/xxx.jpg).
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 font-medium pt-0.5">
                  Direct image link required (e.g. ending in .jpg, .png or starting with https://i.ibb.co...).
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
              <p className="font-semibold text-slate-500 mb-1">
                Password Requirements:
              </p>

              <div
                className={`flex items-center gap-2 font-medium ${hasMinLength ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                {hasMinLength ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <X className="w-3.5 h-3.5" />
                )}
                <span>Minimum 6 characters</span>
              </div>

              <div
                className={`flex items-center gap-2 font-medium ${hasUppercase ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                {hasUppercase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <X className="w-3.5 h-3.5" />
                )}
                <span>At least one uppercase letter (A-Z)</span>
              </div>

              <div
                className={`flex items-center gap-2 font-medium ${hasLowercase ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                {hasLowercase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <X className="w-3.5 h-3.5" />
                )}
                <span>At least one lowercase letter (a-z)</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed pt-3">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    Create Account (
                    {formData.role === "trainer" ? "Trainer" : "User"})
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold">
                Or sign up with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>

          <div className="text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-emerald-600 hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
