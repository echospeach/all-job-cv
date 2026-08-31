"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCredentialsSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Incorrect email or password.");
    } else {
      router.push("/builder");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0EEE8] px-6">
      <div className="w-full max-w-sm rounded-lg border border-[#D8D3C8] bg-white p-8">
        <h1 className="mb-1 text-xl font-semibold text-[#202A3C]">Sign in</h1>
        <p className="mb-6 text-sm text-[#8B8578]">Welcome back to ALL JOB CV.</p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/builder" })}
          className="mb-4 w-full rounded-lg border border-[#D8D3C8] px-4 py-2.5 text-sm font-medium text-[#202A3C] hover:bg-[#F0EEE8]"
        >
          Continue with Google
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#D8D3C8]" />
          <span className="text-xs text-[#8B8578]">or</span>
          <div className="h-px flex-1 bg-[#D8D3C8]" />
        </div>

        <form onSubmit={handleCredentialsSignIn} className="space-y-3">
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-[#993C1D]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#202A3C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2C3B52] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#8B8578]">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-[#3F6C51] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
