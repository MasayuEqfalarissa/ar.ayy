"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Trash2, Edit2, X } from "lucide-react";
import { useRouter } from "next/navigation";

type Memory = {
  id: number;
  title: string;
  description: string | null;
  mediaUrl: string;
  mediaType: string;
  date: Date;
};

export default function MemoryItem({ memory }: { memory: Memory }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this beautiful memory?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/memories/${memory.id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const res = await fetch(`/api/memories/${memory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setIsEditing(false);
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
      <div className="break-inside-avoid bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group relative">
        <div className="relative">
          {memory.mediaType === "video" ? (
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              src={memory.mediaUrl} 
              className="w-full object-cover" 
            />
          ) : (
            <img src={memory.mediaUrl} alt={memory.title} className="w-full object-cover" />
          )}
          
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setIsEditing(true)} className="p-2 bg-white/80 backdrop-blur rounded-full text-slate-700 hover:text-rose-500 hover:bg-white transition-colors shadow-sm">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={handleDelete} disabled={loading} className="p-2 bg-white/80 backdrop-blur rounded-full text-slate-700 hover:text-red-500 hover:bg-white transition-colors shadow-sm">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="font-bold text-lg text-slate-800">{memory.title}</h3>
          <p suppressHydrationWarning className="text-xs text-rose-500 font-medium mb-3">{format(new Date(memory.date), "MMMM d, yyyy")}</p>
          {memory.description && (
            <p className="text-slate-600 text-sm">{memory.description}</p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-rose-50">
              <h2 className="text-xl font-bold text-slate-800">Edit Memory</h2>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-rose-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input required type="text" name="title" defaultValue={memory.title} className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea name="description" rows={3} defaultValue={memory.description || ""} className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"></textarea>
              </div>

              <button disabled={loading} type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-95">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
