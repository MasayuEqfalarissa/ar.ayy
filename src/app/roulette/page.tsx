import prisma from "@/lib/prisma";
import { Disc } from "lucide-react";
import Wheel from "./Wheel";
import OptionList from "./OptionList";

export const revalidate = 0;

export default async function RoulettePage() {
  const options = await prisma.rouletteOption.findMany();

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg shadow-rose-100 mb-4">
          <Disc className="w-8 h-8 text-rose-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800">Date Roulette</h1>
        <p className="text-slate-500 mt-2">Can't decide? Let fate choose for you.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-rose-50">
          <Wheel initialOptions={options} />
        </div>
        
        <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-rose-50">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Your Choices</h2>
          <OptionList initialOptions={options} />
        </div>
      </div>
    </div>
  );
}
