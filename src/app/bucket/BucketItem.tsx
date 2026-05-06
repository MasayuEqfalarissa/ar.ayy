"use client";

import { useState } from "react";
import { Check, Trash2, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function BucketItem({ item }: { item: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggleComplete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bucket/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !item.isCompleted }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Remove this dream from the list?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bucket/${item.id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-3xl p-5 shadow-md border-2 transition-all ${item.isCompleted ? "border-green-100 bg-green-50/30" : "border-rose-50"}`}>
      <div className="flex items-start gap-4">
        <button 
          onClick={toggleComplete}
          disabled={loading}
          className={`mt-1 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${item.isCompleted ? "bg-green-500 border-green-500 text-white" : "border-slate-200 hover:border-rose-300"}`}
        >
          {item.isCompleted && <Check className="w-5 h-5" />}
        </button>

        <div className="flex-1">
          <h3 className={`text-lg font-bold ${item.isCompleted ? "text-slate-400 line-through" : "text-slate-800"}`}>
            {item.title}
          </h3>
          {item.description && (
            <p className={`text-sm mt-1 ${item.isCompleted ? "text-slate-300" : "text-slate-500"}`}>
              {item.description}
            </p>
          )}
          
          {item.isCompleted && item.completedAt && (
            <div className="flex items-center gap-1 mt-3 text-[10px] font-bold text-green-600 bg-green-100 w-fit px-2 py-0.5 rounded-full uppercase tracking-wider">
              <Calendar className="w-3 h-3" />
              Completed {format(new Date(item.completedAt), "MMM d, yyyy")}
            </div>
          )}
        </div>

        <button 
          onClick={handleDelete}
          disabled={loading}
          className="text-slate-300 hover:text-rose-500 p-2 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
