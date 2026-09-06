interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-[#f7faf8] border border-[#e3ede7] rounded-2xl p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-[#16a34a] flex items-center justify-center text-white">
        {icon}
      </div>
      <div>
        <p className="text-xs text-[#8fa89a]">{label}</p>
        <p className="text-lg font-bold text-[#1a2e22]">{value}</p>
      </div>
    </div>
  );
}