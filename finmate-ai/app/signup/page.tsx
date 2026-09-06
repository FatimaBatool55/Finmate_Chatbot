"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Wallet } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({ email, password });
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

        <h1 className="text-xl font-semibold text-[#1a2e22] mb-1 text-center">Create account</h1>
        <p className="text-sm text-[#8fa89a] mb-6 text-center">Start tracking your finances</p>

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
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            className="w-full bg-[#f7faf8] border border-[#e3ede7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
          />

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="button"
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-[#16a34a] text-white py-2.5 rounded-xl hover:bg-[#15803d] transition-colors cursor-pointer text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </div>

        <p className="text-center text-sm text-[#8fa89a] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#16a34a] font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}