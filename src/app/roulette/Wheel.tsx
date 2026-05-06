"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";

export default function Wheel({ initialOptions }: { initialOptions: any[] }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  
  const options = initialOptions.length > 0 
    ? initialOptions 
    : [{ text: "Bakso" }, { text: "Sushi" }, { text: "Bioskop" }, { text: "Jalan-jalan" }];

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setWinner(null);
    
    // Add 5-10 full rotations plus a random offset
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalRotation = rotation + (360 * 5) + extraDegrees;
    
    setRotation(totalRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      
      // Calculate winner
      const finalDegrees = totalRotation % 360;
      const index = Math.floor(((360 - finalDegrees) % 360) / (360 / options.length));
      setWinner(options[index].text);
    }, 4000);
  };

  const colors = [
    "bg-rose-400", "bg-rose-500", "bg-slate-700", "bg-rose-600", 
    "bg-slate-800", "bg-rose-300", "bg-slate-600", "bg-rose-700"
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64 md:w-80 md:h-80 mb-10">
        {/* Pointer */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-10 bg-rose-600 z-30 clip-path-triangle shadow-lg border-2 border-white"></div>
        
        {/* The Wheel (SVG) */}
        <div 
          className="w-full h-full rounded-full border-8 border-slate-800 shadow-2xl relative transition-transform duration-[4000ms] cubic-bezier(0.15, 0, 0.15, 1)"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full rounded-full">
            {options.map((opt, i) => {
              const angle = 360 / options.length;
              const startAngle = i * angle;
              const endAngle = (i + 1) * angle;
              
              // SVG path for a slice
              const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
              const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
              const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
              const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              const d = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
              
              const textAngle = startAngle + angle / 2;
              const tx = 50 + 30 * Math.cos((Math.PI * (textAngle - 90)) / 180);
              const ty = 50 + 30 * Math.sin((Math.PI * (textAngle - 90)) / 180);

              const colorClass = [
                "#fb7185", "#f43f5e", "#334155", "#e11d48", 
                "#1e293b", "#fda4af", "#475569", "#be123c"
              ][i % 8];

              return (
                <g key={i}>
                  <path d={d} fill={colorClass} stroke="#fff" strokeWidth="0.5" />
                  <text 
                    x={tx} 
                    y={ty} 
                    fill="#fff" 
                    fontSize={options.length > 10 ? "2" : "4"} 
                    fontWeight="bold" 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle}, ${tx}, ${ty})`}
                  >
                    {opt.text}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Center Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg z-20 border-4 border-slate-800 flex items-center justify-center">
          <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
        </div>
      </div>

      {winner ? (
        <div className="text-center mb-8 animate-bounce">
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-1">The Universe Says:</p>
          <h2 className="text-3xl font-black text-rose-500 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6" /> {winner} <Sparkles className="w-6 h-6" />
          </h2>
        </div>
      ) : (
        <p className="text-slate-400 text-sm mb-8 italic">Ready to let fate decide?</p>
      )}

      <button 
        onClick={spinWheel}
        disabled={isSpinning || options.length === 0}
        className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-black px-12 py-5 rounded-[2rem] shadow-xl shadow-rose-200 transition-all active:scale-95 text-lg"
      >
        {isSpinning ? "SPINNING..." : "SPIN THE WHEEL"}
      </button>

      <style jsx>{`
        .clip-path-triangle {
          clip-path: polygon(0 0, 100% 0, 50% 100%);
        }
      `}</style>
    </div>
  );
}
