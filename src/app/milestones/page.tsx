import prisma from "@/lib/prisma";
import AddMilestone from "./AddMilestone";
import MilestoneCard from "./MilestoneCard";
import { Clock } from "lucide-react";

export const revalidate = 0;

export default async function MilestonesPage() {
  const milestones = await prisma.milestone.findMany({
    orderBy: { date: 'asc' }
  });

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg shadow-rose-100 mb-4">
          <Clock className="w-8 h-8 text-rose-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800">Time Together</h1>
        <p className="text-slate-500 mt-2">Tracking our favorite moments and counting down to new ones.</p>
      </header>

      <div className="space-y-6">
        {milestones.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm">
            <p className="text-slate-500">No milestones added yet. Add your anniversary or next date!</p>
          </div>
        ) : (
          milestones.map((milestone) => (
            <MilestoneCard key={milestone.id} milestone={milestone} />
          ))
        )}
      </div>

      <AddMilestone />
    </div>
  );
}
