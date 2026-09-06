"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Wallet } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-[#16a34a] flex items-center justify-center">
            <Wallet size={18} className="text-white" />
          </div>
          <span className="text-[#1a2e22] font-bold text-lg">FinMate</span>
        </div>

        <h1 className="text-xl font-semibold text-[#1a2e22] mb-1 text-center">Welcome back</h1>
        <p className="text-sm text-[#8fa89a] mb-6 text-center">Log in to your account</p>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#f7faf8] border border-[#e3ede7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-[#f7faf8] border border-[#e3ede7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
          />

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#16a34a] text-white py-2.5 rounded-xl hover:bg-[#15803d] transition-colors cursor-pointer text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </div>

        <p className="text-center text-sm text-[#8fa89a] mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#16a34a] font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}