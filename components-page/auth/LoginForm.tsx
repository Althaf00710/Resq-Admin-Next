'use client';

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";

// --- GraphQL ---
export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      message
      success
      user {
        id
        name
        username
        profilePicturePath
      }
    }
  }
`;

export default function LoginPage() {
  // --- Config ---
  const redirectTo = "/"; // change to "/dashboard" or wherever after sign-in

  // --- Quote rotation ---
  const quotes = useMemo(
    () => [
      "Save lives.",
      "Every second counts.",
      "Be the calm in chaos.",
      "Call. Care. Coordinate.",
      "Help is on the way.",
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const [loginUser, { loading }] = useMutation(LOGIN_USER);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % quotes.length), 3200);
    return () => clearInterval(id);
  }, [quotes.length]);

  // --- Form submit ---
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await loginUser({ variables: { username, password } });
      const res = data?.loginUser;

      if (res?.success) {
        const token = res.message; // JWT token comes in `message`
        const user = res.user;
        // Persist
        localStorage.setItem("resq.admin.jwt", token);
        localStorage.setItem("resq.admin", JSON.stringify(user));
        // Navigate
        router.replace(redirectTo);
      } else {
        setError(res?.message || "Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong while logging in.");
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
      {/* Left: Quote Panel */}
      <aside className="relative hidden md:flex items-center justify-center p-10 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600">
        {/* Subtle decorative grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,.22) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 max-w-xl text-center text-white">
          <div className="text-sm/6 uppercase tracking-widest font-medium/relaxed opacity-90">
            ResQ • Emergency Response
          </div>

          <AnimatePresence mode="popLayout">
            <motion.h1
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              aria-live="polite"
              className="mt-4 text-4xl xl:text-5xl font-semibold tracking-tight drop-shadow-sm"
            >
              {quotes[index]}
            </motion.h1>
          </AnimatePresence>

          <p className="mt-4 text-white/85 text-base md:text-lg max-w-md mx-auto">
            A modern, fast, and secure way to sign in. Built for focus and clarity.
          </p>
        </div>

        {/* Soft glow accents */}
        <div className="absolute -bottom-24 -left-24 w-[24rem] h-[24rem] rounded-full blur-3xl bg-fuchsia-400/40" />
        <div className="absolute -top-24 -right-24 w-[22rem] h-[22rem] rounded-full blur-3xl bg-indigo-400/40" />
      </aside>

      {/* Right: Auth Form */}
      <main className="relative flex items-center justify-center p-6 md:p-10 bg-slate-200 dark:bg-slate-950">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Please sign in to continue
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-md shadow-[0_10px_40px_-15px_rgba(0,0,0,0.4)] border border-white/40 dark:border-white/10 p-6 md:p-7 space-y-5"
          >
            {/* Error */}
            {error && (
              <div
                className="text-sm rounded-lg border border-red-200/70 bg-red-50/80 text-red-700 px-3 py-2"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            <div className="space-y-2">
              <img src="/App_Logo.png" alt="ResQ Logo" className="h-12 mx-auto mb-2" />
            </div>


            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="your.username"
                className="w-full rounded-xl border border-slate-300/80 dark:border-white/10 bg-white/90 dark:bg-white/5 px-4 py-3 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500/70 transition"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300/80 dark:border-white/10 bg-white/90 dark:bg-white/5 px-4 py-3 pr-12 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500/70 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-2.5 my-auto inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100/80 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-5 text-slate-500" /> : <Eye className="size-5 text-slate-500" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full rounded-xl py-3.5 font-medium tracking-wide shadow-lg disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white hover:from-indigo-500 hover:to-fuchsia-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Small footer */}
          <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
            Team ResQ • Emergency Response Admin Panel. <br></br>
            Developed by <span className="text-orange-500">Althaf.</span>
          </p>
        </div>
      </main>
    </div>
  );
}
