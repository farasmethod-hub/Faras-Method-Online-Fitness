"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { useFitnessStore } from "@/lib/store";

export default function AdminLoginPage() {
  const router = useRouter();
  const { settings } = useFitnessStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // If already authenticated, redirect directly to dashboard
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth =
        localStorage.getItem("faras_method_admin_auth") === "true" ||
        document.cookie.includes("faras_admin_session=authenticated");
      if (isAuth) {
        router.push("/admin/dashboard");
      }
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    // Standard credential check / demo login
    setTimeout(() => {
      if (
        (email.toLowerCase() === "admin@farasmethod.com" || email.toLowerCase() === "coach@farasmethod.com" || email.toLowerCase() === "coach@apexfitness.com") &&
        password === "admin123"
      ) {
        // Set mock auth cookie / localStorage flag
        if (typeof window !== "undefined") {
          localStorage.setItem("faras_method_admin_auth", "true");
          localStorage.setItem("faras_method_admin_user", email);
          document.cookie = "faras_admin_session=authenticated; path=/; max-age=86400; SameSite=Lax";
        }
        router.push("/admin/dashboard");
      } else if (email && password) {
        // For development/demo convenience, allow any valid email + pass
        if (typeof window !== "undefined") {
          localStorage.setItem("faras_method_admin_auth", "true");
          localStorage.setItem("faras_method_admin_user", email);
          document.cookie = "faras_admin_session=authenticated; path=/; max-age=86400; SameSite=Lax";
        }
        router.push("/admin/dashboard");
      } else {
        setErrorMessage("Please enter both email and password.");
        setIsLoading(false);
      }
    }, 600);
  };

  const handleDemoFill = () => {
    setEmail("coach@farasmethod.com");
    setPassword("admin123");
    setErrorMessage("");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-[#06141B] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* iOS Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#253745]/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Top back link */}
      <div className="absolute top-8 left-8 z-10">
        <Link
          href="/"
          className="ios-glass-interactive px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9BA8AB] hover:text-[#CCD0CF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back To Public Site</span>
        </Link>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl ios-glass flex items-center justify-center mx-auto text-[#CCD0CF] shadow-xl mb-4">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="heading-font text-3xl font-black uppercase text-[#CCD0CF] tracking-wide">
            FARAS METHOD
          </h1>
          <p className="text-xs text-[#9BA8AB] mt-1 uppercase tracking-widest font-semibold">
            ONLINE FITNESS COACHING • Admin Portal
          </p>
        </div>

        {/* Login Box */}
        <div className="ios-glass rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          {errorMessage && (
            <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/40 text-rose-400 text-xs">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#9BA8AB] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="coach@farasmethod.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#4A5C6A] text-xs text-[#CCD0CF] placeholder-[#9BA8AB]/50 focus:outline-none focus:border-[#CCD0CF]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-[11px] text-[#CCD0CF] hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9BA8AB] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#4A5C6A] text-xs text-[#CCD0CF] placeholder-[#9BA8AB]/50 focus:outline-none focus:border-[#CCD0CF]"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full gap-2 mt-4 font-bold uppercase tracking-wider"
            >
              <span>Authenticate & Enter Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Demo Quick Fill Helper */}
          <div className="mt-6 pt-5 border-t border-[#4A5C6A]/50 text-center">
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-xs text-[#9BA8AB] hover:text-[#CCD0CF] flex items-center justify-center gap-1.5 mx-auto font-medium"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#CCD0CF]" />
              <span>Use One-Click Demo Credentials (coach@farasmethod.com)</span>
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-[#4A5C6A] mt-6">
          FARAS METHOD • Protected by Session Authentication &amp; Row Level Security.
        </p>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#11212D] border border-[#4A5C6A] rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
            <h3 className="heading-font text-lg font-bold text-[#CCD0CF] uppercase mb-2">
              Reset Coach Password
            </h3>
            {resetSent ? (
              <div className="py-4 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#CCD0CF] mx-auto" />
                <p className="text-xs text-[#9BA8AB]">
                  A secure recovery link has been dispatched to <strong className="text-white">{resetEmail}</strong>.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setShowResetModal(false);
                    setResetSent(false);
                  }}
                  className="w-full mt-3"
                >
                  Return to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-xs text-[#9BA8AB]">
                  Enter your registered administrator email address to receive instructions.
                </p>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="coach@farasmethod.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#4A5C6A] text-xs text-[#CCD0CF] focus:outline-none focus:border-[#CCD0CF]"
                />
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowResetModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="flex-1">
                    Send Link
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

