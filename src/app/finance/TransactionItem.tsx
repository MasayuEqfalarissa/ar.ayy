"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Trash2, Edit2, X, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useRouter } from "next/navigation";

type Transaction = {
  id: number;
  type: string;
  amount: number;
  category: string;
  description: string | null;
  date: Date;
};

export default function TransactionItem({ transaction }: { transaction: Transaction }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this transaction?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions/${transaction.id}`, { method: "DELETE" });
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
      const res = await fetch(`/api/transactions/${transaction.id}`, {
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
      <div className="p-4 md:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
            {transaction.type === 'income' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
          </div>
          <div>
            <p className="font-bold text-slate-800">{transaction.category}</p>
            <p suppressHydrationWarning className="text-sm text-slate-500 flex items-center gap-2">
              {format(new Date(transaction.date), "MMM d, yyyy")} 
              {transaction.description && <span className="hidden md:inline">• {transaction.description}</span>}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className={`font-black text-lg ${transaction.type === 'income' ? 'text-green-600' : 'text-slate-800'}`}>
              {transaction.type === 'income' ? '+' : '-'} Rp {transaction.amount.toLocaleString('id-ID')}
            </p>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setIsEditing(true)} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={handleDelete} disabled={loading} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Edit Transaction</h2>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input required type="radio" name="type" value="expense" className="peer sr-only" defaultChecked={transaction.type === "expense"} />
                  <div className="text-center py-2 px-4 rounded-xl border-2 border-slate-200 peer-checked:border-rose-500 peer-checked:bg-rose-50 peer-checked:text-rose-600 font-bold transition-all">Expense</div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input required type="radio" name="type" value="income" className="peer sr-only" defaultChecked={transaction.type === "income"} />
                  <div className="text-center py-2 px-4 rounded-xl border-2 border-slate-200 peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-600 font-bold transition-all">Income</div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (Rp)</label>
                <input required type="number" name="amount" min="0" defaultValue={transaction.amount} className="w-full border border-slate-200 rounded-xl px-4 py-2 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-slate-800" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select required name="category" defaultValue={transaction.category} className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800 bg-white">
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
                <input required type="date" name="date" defaultValue={new Date(transaction.date).toISOString().split('T')[0]} className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                <input type="text" name="description" defaultValue={transaction.description || ""} className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800" />
              </div>

              <button disabled={loading} type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 mt-4">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
