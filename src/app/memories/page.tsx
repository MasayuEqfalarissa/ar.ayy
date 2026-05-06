import prisma from "@/lib/prisma";
import UploadMemory from "./UploadMemory";
import MemoryItem from "./MemoryItem";
import { Image as ImageIcon, Heart } from "lucide-react";

export const revalidate = 0;

export default async function MemoriesPage() {
  const memories = await prisma.memory.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg shadow-rose-100 mb-4">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800">Our Digital Memory Box</h1>
        <p className="text-slate-500 mt-2">Every moment is a treasure.</p>
      </header>

      {memories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ImageIcon className="w-16 h-16 text-rose-200 mb-4" />
          <h2 className="text-xl font-bold text-slate-700">It's pretty empty here!</h2>
          <p className="text-slate-500 max-w-sm mt-2">Tap the + button below to start adding your favorite photos and videos together.</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {memories.map((memory) => (
            <MemoryItem key={memory.id} memory={memory} />
          ))}
        </div>
      )}

      <UploadMemory />
    </div>
  );
}
