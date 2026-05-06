"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddBucketItem() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/bucket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsOpen(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 md:bottom-10 right-6 md:right-10 w-14 h-14 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-rose-200 transition-transform hover:scale-110 z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-rose-50">
              <h2 className="text-xl font-bold text-slate-800">Add New Dream</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-rose-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">What's the dream?</label>
                <input required type="text" name="title" placeholder="e.g. Vacation to Iceland" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">More details (Optional)</label>
                <textarea name="description" rows={3} placeholder="How can we make this happen?" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"></textarea>
              </div>

              <button disabled={loading} type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-95 mt-4">
                {loading ? "Adding..." : "Add to List ✨"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
