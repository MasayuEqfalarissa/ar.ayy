import prisma from "@/lib/prisma";
import { CheckCircle } from "lucide-react";
import AddBucketItem from "./AddBucketItem";
import BucketItem from "./BucketItem";

export const revalidate = 0;

export default async function BucketPage() {
  const items = await prisma.bucketItem.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const completedCount = items.filter(i => i.isCompleted).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg shadow-rose-100 mb-4">
          <CheckCircle className="w-8 h-8 text-rose-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800">Our Bucket List</h1>
        <p className="text-slate-500 mt-2">Dream together, achieve together.</p>
        
        {items.length > 0 && (
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-rose-500 transition-all duration-1000" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-2">{completedCount} of {items.length} dreams completed</p>
          </div>
        )}
      </header>

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-rose-100 shadow-sm">
            <p className="text-slate-400">Your bucket list is empty. What's your first dream?</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <BucketItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <AddBucketItem />
    </div>
  );
}
