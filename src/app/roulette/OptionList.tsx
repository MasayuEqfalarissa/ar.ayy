"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OptionList({ initialOptions }: { initialOptions: any[] }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/roulette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        setText("");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/roulette/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New choice..."
          className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
        />
        <button 
          type="submit" 
          disabled={loading || !text.trim()}
          className="bg-slate-800 hover:bg-slate-900 text-white p-4 rounded-2xl disabled:opacity-50 transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {initialOptions.length === 0 ? (
          <p className="text-slate-400 text-sm italic">Add some options to the wheel!</p>
        ) : (
          initialOptions.map((opt) => (
            <div key={opt.id} className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-full font-bold text-sm group">
              {opt.text}
              <button 
                onClick={() => handleDelete(opt.id)}
                className="text-rose-300 hover:text-rose-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
