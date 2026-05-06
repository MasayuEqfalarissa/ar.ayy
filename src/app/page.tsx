import Link from "next/link";
import { format } from "date-fns";
import prisma from "@/lib/prisma";
import { ArrowRight, Image as ImageIcon, Wallet, Plus } from "lucide-react";
import MoodCheckIn from "./components/MoodCheckIn";

export const revalidate = 0; // Disable caching for fresh data

export default async function Dashboard() {
  // Get start of today for mood check
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const todayMoods = await prisma.mood.findMany({
    where: {
      date: {
        gte: startOfToday,
      },
    },
  });

  // Fetch latest 3 memories
  const memories = await prisma.memory.findMany({
    orderBy: { date: "desc" },
    take: 3,
  });

  // Calculate finance summary
  const transactions = await prisma.transaction.findMany();
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
          Hello, Love! 👋
        </h1>
        <p className="text-slate-500 mt-2">Welcome back to our little digital space.</p>
      </header>

      <MoodCheckIn todayMoods={todayMoods} />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Finance Summary Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-rose-100 border border-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Wallet className="w-5 h-5 text-rose-500" />
              Our Savings
            </h2>
            <Link href="/finance" className="text-sm text-rose-500 hover:underline flex items-center">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-slate-500">Current Balance</p>
            <p className="text-4xl font-black text-slate-800">Rp {balance.toLocaleString('id-ID')}</p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 bg-green-50 rounded-2xl p-4">
              <p className="text-xs text-green-600 font-medium mb-1">Income</p>
              <p className="text-lg font-bold text-green-700">+ Rp {totalIncome.toLocaleString('id-ID')}</p>
            </div>
            <div className="flex-1 bg-rose-50 rounded-2xl p-4">
              <p className="text-xs text-rose-600 font-medium mb-1">Expense</p>
              <p className="text-lg font-bold text-rose-700">- Rp {totalExpense.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>

        {/* Quick Action Card */}
        <div className="bg-gradient-to-br from-rose-400 to-rose-600 rounded-3xl p-6 shadow-xl shadow-rose-200 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Create New Memory</h2>
            <p className="text-rose-100">Upload a new photo or video from our recent date!</p>
          </div>
          <Link href="/memories" className="mt-6 inline-flex items-center justify-center gap-2 bg-white text-rose-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all w-fit">
            <Plus className="w-5 h-5" />
            Upload Now
          </Link>
        </div>
      </div>

      {/* Recent Memories Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-rose-500" />
            Recent Memories
          </h2>
          <Link href="/memories" className="text-sm text-rose-500 hover:underline flex items-center">
            Gallery <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {memories.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-rose-200 rounded-3xl p-10 text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-rose-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">No memories yet</h3>
            <p className="text-slate-500 mb-4">Start capturing your special moments together!</p>
            <Link href="/memories" className="inline-block bg-rose-100 text-rose-600 px-5 py-2 rounded-lg font-medium hover:bg-rose-200 transition-colors">
              Add First Memory
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {memories.map((memory) => (
              <div key={memory.id} className="group relative rounded-2xl overflow-hidden aspect-square shadow-md">
                {memory.mediaType === 'video' ? (
                  <video src={memory.mediaUrl} className="w-full h-full object-cover" />
                ) : (
                  <img src={memory.mediaUrl} alt={memory.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white font-bold truncate">{memory.title}</p>
                  <p className="text-white/80 text-xs">{format(memory.date, 'MMM d, yyyy')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
