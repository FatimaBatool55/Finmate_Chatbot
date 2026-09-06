"use client";

import { useState, useEffect } from "react";
import { Target, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchGoals = async () => {
    const { data, error } = await supabase.from("goals").select("*").order("created_at", { ascending: false });
    if (!error && data) setGoals(data as Goal[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const addGoal = async () => {
    if (!name || !target) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("goals").insert({
      user_id: user.id,
      name,
      target: Number(target),
      saved: 0,
    });
    setName("");
    setTarget("");
    fetchGoals();
  };

  const updateSaved = async (id: string, currentSaved: number, amount: number) => {
    const newSaved = Math.max(0, currentSaved + amount);
    await supabase.from("goals").update({ saved: newSaved }).eq("id", id);
    fetchGoals();
  };

  const deleteGoal = async (id: string) => {
    await supabase.from("goals").delete().eq("id", id);
    fetchGoals();
  };

  if (loading) return <div className="p-10 text-[#8fa89a] text-sm">Loading...</div>;

  return (
    <div className="min-h-screen px-8 py-10 max-w-3xl mx-auto bg-white">
      <h1 className="text-xl font-semibold text-[#1a2e22] mb-1 flex items-center gap-2">
        <Target className="text-[#16a34a]" size={20} />
        Savings Goals
      </h1>
      <p className="text-[#8fa89a] mb-8 text-sm">Track progress toward your financial targets</p>

      <div className="bg-[#f7faf8] border border-[#e3ede7] rounded-2xl p-5 flex gap-3 mb-8">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Goal name (e.g. New Laptop)"
          className="flex-1 bg-white border border-[#e3ede7] rounded-xl px-4 py-2.5 text-sm text-[#1a2e22] placeholder-[#8fa89a] focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
        />
        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Target PKR"
          type="number"
          className="w-40 bg-white border border-[#e3ede7] rounded-xl px-4 py-2.5 text-sm text-[#1a2e22] placeholder-[#8fa89a] focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
        />
        <button
          type="button"
          onClick={addGoal}
          className="bg-[#16a34a] text-white px-4 rounded-xl hover:bg-[#15803d] transition-colors cursor-pointer"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => {
          const pct = Math.min(100, (goal.saved / goal.target) * 100);
          return (
            <div key={goal.id} className="bg-[#f7faf8] border border-[#e3ede7] rounded-2xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-[#1a2e22] font-semibold">{goal.name}</h3>
                  <p className="text-xs text-[#8fa89a]">
                    PKR {goal.saved.toLocaleString()} / {goal.target.toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteGoal(goal.id)}
                  className="text-[#8fa89a] hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="w-full h-2.5 bg-[#e3ede7] rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-[#16a34a] rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex gap-2 items-center flex-wrap">
                <button
                  type="button"
                  onClick={() => updateSaved(goal.id, goal.saved, 5000)}
                  className="text-xs px-3 py-1.5 rounded-full bg-[#dcfce7] text-[#15803d] hover:bg-[#bbf7d0] transition-colors cursor-pointer"
                >
                  + Add PKR 5,000
                </button>
                <button
                  type="button"
                  onClick={() => updateSaved(goal.id, goal.saved, -5000)}
                  className="text-xs px-3 py-1.5 rounded-full bg-[#fee2e2] text-[#b91c1c] hover:bg-[#fecaca] transition-colors cursor-pointer"
                >
                  - Remove PKR 5,000
                </button>
                <span className="text-xs text-[#8fa89a]">{pct.toFixed(0)}% complete</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}