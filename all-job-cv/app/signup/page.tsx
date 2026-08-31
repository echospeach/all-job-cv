"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy to continue.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not create your account.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (signInRes?.error) {
      setError("Account created, but sign-in failed. Please try signing in.");
    } else {
      router.push("/builder");
      router.refresh();
    }
  }

  function handleGoogleSignUp() {
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy to continue.");
      return;
    }
    signIn("google", { callbackUrl: "/builder" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0EEE8] px-6">
      <div className="w-full max-w-sm rounded-lg border border-[#D8D3C8] bg-white p-8">
        <h1 className="mb-1 text-xl font-semibold text-[#202A3C]">Create your account</h1>
        <p className="mb-6 text-sm text-[#8B8578]">Start building your CV in minutes.</p>

        <label className="mb-4 flex items-start gap-2 text-sm text-[#5C5A52]">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[#D8D3C8] accent-[#3F6C51]"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" target="_blank" className="font-medium text-[#3F6C51] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" target="_blank" className="font-medium text-[#3F6C51] hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>

        <button
          onClick={handleGoogleSignUp}
          className="mb-4 w-full rounded-lg border border-[#D8D3C8] px-4 py-2.5 text-sm font-medium text-[#202A3C] hover:bg-[#F0EEE8]"
        >
          Continue with Google
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#D8D3C8]" />
          <span className="text-xs text-[#8B8578]">or</span>
          <div className="h-px flex-1 bg-[#D8D3C8]" />
        </div>

        <form onSubmit={handleSignUp} className="space-y-3">
          <input
            type="text"
            className="input"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            required
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            className="input"
            placeholder="Password (min. 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-[#993C1D]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#202A3C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2C3B52] disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#8B8578]">
          Already have an account?{" "}
          <Link href="/signin" className="font-medium text-[#3F6C51] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
