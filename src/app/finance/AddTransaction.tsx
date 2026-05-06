"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddTransaction() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const res = await fetch("/api/transactions", {
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
        className="fixed bottom-24 md:bottom-10 right-6 md:right-10 w-14 h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-full flex items-center justify-center shadow-xl shadow-slate-200 transition-transform hover:scale-110 z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Add Transaction</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input required type="radio" name="type" value="expense" className="peer sr-only" defaultChecked />
                  <div className="text-center py-2 px-4 rounded-xl border-2 border-slate-200 peer-checked:border-rose-500 peer-checked:bg-rose-50 peer-checked:text-rose-600 font-bold transition-all">Expense</div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input required type="radio" name="type" value="income" className="peer sr-only" />
                  <div className="text-center py-2 px-4 rounded-xl border-2 border-slate-200 peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-600 font-bold transition-all">Income</div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (Rp)</label>
                <input required type="number" name="amount" min="0" className="w-full border border-slate-200 rounded-xl px-4 py-2 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-slate-800" placeholder="50000" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select required name="category" className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800 bg-white">
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Dates & Fun">Dates & Fun</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Savings">Savings</option>
                  <option value="Bills">Bills</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input required type="date" name="date" className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                <input type="text" name="description" className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800" placeholder="Dinner at Mall" />
              </div>

              <button disabled={loading} type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 mt-4">
                {loading ? "Saving..." : "Save Transaction"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
