import Link from "next/link";
import { LogIn, UserPlus, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      <div className="text-center max-w-xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#dcfce7] text-[#15803d] text-xs mb-6">
          <Sparkles size={14} />
          Powered by Groq and LangGraph
        </div>

        <h1 className="text-4xl font-bold text-[#1a2e22] mb-4 tracking-tight">
          Fin<span className="text-[#16a34a]">Mate</span> AI
        </h1>
        <p className="text-[#6b8577] mb-10 text-lg">
          Your personal finance assistant. Chat, track expenses, and hit your savings goals.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/signup"
            className="flex items-center gap-2 bg-[#16a34a] text-white font-medium px-6 py-3 rounded-full hover:bg-[#15803d] transition-colors"
          >
            <UserPlus size={18} />
            Get Started
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 border border-[#e3ede7] text-[#4d6b5a] px-6 py-3 rounded-full hover:bg-[#f7faf8] transition-colors"
          >
            <LogIn size={18} />
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}