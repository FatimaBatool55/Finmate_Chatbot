"use client";

import { useState } from "react";
import Papa from "papaparse";

interface RawExpense {
  category: string;
  amount: number;
  description?: string;
  date?: string;
}

export default function UploadCSV({ onAnalyzed }: { onAnalyzed: (data: RawExpense[]) => void }) {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const expenses: RawExpense[] = results.data.map((row: any) => ({
          date: row.date || row.Date,
          category: row.category || row.Category || "Other",
          amount: parseFloat(row.amount || row.Amount || 0),
          description: row.description || row.Description || "",
        }));

        onAnalyzed(expenses);
        setLoading(false);
      },
    });
  };

  return (
    <div className="border-2 border-dashed border-[#cfe3d7] rounded-xl p-5 text-center bg-[#f7faf8] flex flex-col justify-center">
      <p className="text-sm text-[#4d6b5a] mb-3">
        Upload CSV (columns: date, category, amount, description)
      </p>
      <input type="file" accept=".csv" onChange={handleFile} className="text-sm cursor-pointer" />
      {fileName && <p className="text-xs text-[#8fa89a] mt-2">{fileName}</p>}
      {loading && <p className="text-xs text-[#16a34a] mt-2">Processing...</p>}
    </div>
  );
}