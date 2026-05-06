"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EMOJIS = [
  { char: "🥰", label: "Senang" },
  { char: "🥺", label: "Kangen" },
  { char: "😫", label: "Lelah" },
  { char: "😤", label: "Marah" }
];

export default function MoodCheckIn({ todayMoods }: { todayMoods: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const rizkyMood = todayMoods.find(m => m.name === "Rizky")?.emoji;
  const ayuMood = todayMoods.find(m => m.name === "Ayu")?.emoji;

  const handleCheckIn = async (name: string, emoji: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, emoji }),
      });
      if (res.ok) {
        setSelectedName(null);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-rose-100/50 border border-rose-50 mb-8 flex flex-col md:flex-row items-center gap-6 justify-between">
      <div className="text-center md:text-left">
        <h2 className="text-xl font-bold text-slate-800 mb-1">Daily Mood</h2>
        <p className="text-sm text-slate-500">How are we feeling today?</p>
      </div>

      <div className="flex gap-4 md:gap-8 items-center bg-slate-50 px-6 py-4 rounded-2xl w-full md:w-auto justify-center">
        {/* Rizky's Mood */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-3xl border-2 border-indigo-100 mb-2 cursor-pointer hover:scale-105 transition-transform" onClick={() => setSelectedName("Rizky")}>
            {rizkyMood || "❓"}
          </div>
          <span className="text-xs font-bold text-slate-600">Rizky</span>
        </div>

        <div className="h-10 w-[2px] bg-slate-200 rounded-full"></div>

        {/* Ayu's Mood */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-3xl border-2 border-rose-100 mb-2 cursor-pointer hover:scale-105 transition-transform" onClick={() => setSelectedName("Ayu")}>
            {ayuMood || "❓"}
          </div>
          <span className="text-xs font-bold text-slate-600">Ayu</span>
        </div>
      </div>

      {/* Check In Modal / Dropdown */}
      {selectedName && (
        <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full relative">
            <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">How is {selectedName} feeling?</h3>
            <div className="grid grid-cols-2 gap-3">
              {EMOJIS.map((e) => (
                <button
                  key={e.label}
                  disabled={loading}
                  onClick={() => handleCheckIn(selectedName, e.char)}
                  className="p-4 bg-slate-50 hover:bg-rose-50 rounded-2xl flex flex-col items-center gap-2 transition-colors border border-slate-100"
                >
                  <span className="text-4xl">{e.char}</span>
                  <span className="text-xs font-bold text-slate-500">{e.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setSelectedName(null)} className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
