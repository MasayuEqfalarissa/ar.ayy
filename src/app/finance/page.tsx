import prisma from "@/lib/prisma";
import AddTransaction from "./AddTransaction";
import TransactionItem from "./TransactionItem";
import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";

export const revalidate = 0;

export default async function FinancePage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { date: "desc" },
  });

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
          <Wallet className="w-8 h-8 text-slate-800" />
          Our Finances
        </h1>
        <p className="text-slate-500 mt-2">Track our shared expenses and savings goals.</p>
      </header>

      {/* Main Balance Card */}
      <div className="bg-slate-800 rounded-3xl p-8 shadow-2xl text-white mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-rose-500/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"></div>
        
        <div className="relative z-10">
          <p className="text-slate-400 font-medium mb-1 flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Total Joint Balance
          </p>
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Rp {balance.toLocaleString('id-ID')}</h2>
          
          <div className="grid grid-cols-2 gap-4 border-t border-slate-700 pt-6">
            <div>
              <p className="text-slate-400 text-sm mb-1">Total Income</p>
              <p className="text-xl font-bold text-green-400 flex items-center gap-1">
                <ArrowUpRight className="w-5 h-5" /> Rp {totalIncome.toLocaleString('id-ID')}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Total Expenses</p>
              <p className="text-xl font-bold text-rose-400 flex items-center gap-1">
                <ArrowDownRight className="w-5 h-5" /> Rp {totalExpense.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Recent History</h3>
        
        {transactions.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 border-dashed">
            <p className="text-slate-500">No transactions recorded yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {transactions.map((t) => (
                <TransactionItem key={t.id} transaction={t} />
              ))}
            </div>
          </div>
        )}
      </div>

      <AddTransaction />
    </div>
  );
}
