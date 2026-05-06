"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddMilestone() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-8 w-14 h-14 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-lg shadow-rose-200 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-rose-50">
              <h2 className="text-xl font-bold text-slate-800">Add Milestone</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-rose-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input required type="text" name="title" placeholder="e.g. Our Anniversary" className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input required type="datetime-local" name="date" className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200" />
              </div>

              <button disabled={loading} type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-95 mt-4">
                {loading ? "Adding..." : "Save Milestone"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
