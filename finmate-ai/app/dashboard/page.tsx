"use client";

import { useState, useEffect } from "react";
import UploadCSV from "@/components/UploadCSV";
import ExpenseChart from "@/components/ExpenseChart";
import StatCard from "@/components/StatCard";
import { Wallet, TrendingUp, Hash, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

const CATEGORIES = ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Health", "Other"];

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const supabase = createClient();

  const fetchExpenses = async () => {
    const { data, error } = await supabase.from("expenses").select("*").order("created_at", { ascending: false });
    if (!error && data) setExpenses(data as Expense[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = async () => {
    if (!amount || Number(amount) <= 0) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("expenses").insert({
      user_id: user.id,
      category,
      amount: Number(amount),
      description,
    });
    setAmount("");
    setDescription("");
    fetchExpenses();
  };

  const deleteExpense = async (id: string) => {
    await supabase.from("expenses").delete().eq("id", id);
    fetchExpenses();
  };

  const handleCsvExpenses = async (csvExpenses: { category: string; amount: number; description?: string }[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const rows = csvExpenses.map((e) => ({
      user_id: user.id,
      category: e.category || "Other",
      amount: e.amount,
      description: e.description || "",
    }));

    await supabase.from("expenses").insert(rows);
    fetchExpenses();
  };

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
  });
  const categoryBreakdown = Object.entries(categoryTotals)
    .map(([cat, amt]) => ({
      category: cat,
      amount: amt,
      percentage: totalSpent > 0 ? ((amt / totalSpent) * 100).toFixed(1) : "0",
    }))
    .sort((a, b) => b.amount - a.amount);
  const topCategory = categoryBreakdown[0]?.category || "N/A";

  if (loading) return <div className="p-10 text-[#8fa89a] text-sm">Loading...</div>;

  return (
    <div className="min-h-screen px-8 py-10 max-w-4xl mx-auto bg-white">
      <h1 className="text-xl font-semibold text-[#1a2e22] mb-1">Expense Dashboard</h1>
      <p className="text-[#8fa89a] mb-8 text-sm">Add expenses manually or upload a CSV</p>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-[#f7faf8] border border-[#e3ede7] rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-[#1a2e22] mb-3">Add Expense</h2>
          <div className="space-y-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white border border-[#e3ede7] rounded-xl px-4 py-2.5 text-sm text-[#1a2e22] focus:outline-none focus:ring-2 focus:ring-[#16a34a] cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount (PKR)"
              className="w-full bg-white border border-[#e3ede7] rounded-xl px-4 py-2.5 text-sm text-[#1a2e22] placeholder-[#8fa89a] focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full bg-white border border-[#e3ede7] rounded-xl px-4 py-2.5 text-sm text-[#1a2e22] placeholder-[#8fa89a] focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
            />
            <button
              type="button"
              onClick={addExpense}
              className="w-full flex items-center justify-center gap-2 bg-[#16a34a] text-white py-2.5 rounded-xl hover:bg-[#15803d] transition-colors cursor-pointer text-sm font-medium"
            >
              <Plus size={16} />
              Add Expense
            </button>
          </div>
        </div>

        <UploadCSV onAnalyzed={handleCsvExpenses} />
      </div>

      {expenses.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Total Spent" value={`PKR ${totalSpent.toLocaleString()}`} icon={<Wallet size={20} />} />
            <StatCard label="Top Category" value={topCategory} icon={<TrendingUp size={20} />} />
            <StatCard label="Transactions" value={String(expenses.length)} icon={<Hash size={20} />} />
          </div>

          <ExpenseChart data={categoryBreakdown} totalSpent={totalSpent} />

          <div className="bg-[#f7faf8] border border-[#e3ede7] rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-[#1a2e22] mb-3">Recent Expenses</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {expenses.map((e) => (
                <div key={e.id} className="flex items-center justify-between bg-white border border-[#e3ede7] rounded-xl px-4 py-2.5">
                  <div>
                    <p className="text-sm text-[#1a2e22] font-medium">{e.category}</p>
                    <p className="text-xs text-[#8fa89a]">{e.description || e.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#1a2e22]">PKR {Number(e.amount).toLocaleString()}</span>
                    <button
                      type="button"
                      onClick={() => deleteExpense(e.id)}
                      className="text-[#8fa89a] hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}