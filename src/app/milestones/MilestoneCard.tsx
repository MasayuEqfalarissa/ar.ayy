"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";

type Milestone = {
  id: number;
  title: string;
  date: Date;
};

export default function MilestoneCard({ milestone }: { milestone: Milestone }) {
  const router = useRouter();
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const milestoneDate = new Date(milestone.date);
  const isPast = milestoneDate < now;
  
  // Calculate differences
  const diffTime = Math.abs(now.getTime() - milestoneDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
  const diffMinutes = Math.floor((diffTime / 1000 / 60) % 60);
  const diffSeconds = Math.floor((diffTime / 1000) % 60);

  const handleDelete = async () => {
    if (!confirm("Delete this milestone?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/milestones/${milestone.id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border border-rose-100 relative group overflow-hidden">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-rose-50 rounded-full blur-2xl z-0"></div>
      
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-slate-800">{milestone.title}</h3>
          <p className="text-sm text-slate-500 mb-4" suppressHydrationWarning>{format(milestoneDate, "MMMM d, yyyy")}</p>
        </div>
        
        <button 
          onClick={handleDelete} 
          disabled={loading}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-rose-500 rounded-full hover:bg-rose-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="relative z-10 bg-slate-800 rounded-2xl p-4 text-white flex flex-wrap gap-4 items-center justify-around shadow-inner mt-2">
        <div className="text-center">
          <p className="text-3xl font-black text-rose-400" suppressHydrationWarning>{diffDays}</p>
          <p className="text-xs text-slate-400 font-medium">DAYS</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold" suppressHydrationWarning>{diffHours}</p>
          <p className="text-xs text-slate-400 font-medium">HRS</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold" suppressHydrationWarning>{diffMinutes}</p>
          <p className="text-xs text-slate-400 font-medium">MIN</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-rose-300" suppressHydrationWarning>{diffSeconds}</p>
          <p className="text-xs text-slate-400 font-medium">SEC</p>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">
          {isPast ? "Time since this moment ⏳" : "Countdown to this moment 🎯"}
        </span>
      </div>
    </div>
  );
}
