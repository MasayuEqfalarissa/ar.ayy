"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Heart, Wallet, Clock, LogOut, CheckCircle, Disc } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Memories", href: "/memories", icon: Heart },
    { name: "Finance", href: "/finance", icon: Wallet },
    { name: "Milestones", href: "/milestones", icon: Clock },
    { name: "Bucket List", href: "/bucket", icon: CheckCircle },
    { name: "Roulette", href: "/roulette", icon: Disc },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white/80 backdrop-blur-md shadow-xl border-r border-rose-100 z-50">
        <div className="p-8 flex items-center gap-3 text-rose-500">
          <Heart className="w-8 h-8 fill-rose-500 animate-pulse" />
          <h1 className="text-2xl font-bold tracking-tight">ar.ayy</h1>
        </div>
        <div className="flex-1 flex flex-col gap-2 px-4 mt-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium
                  ${isActive 
                    ? "bg-rose-500 text-white shadow-md shadow-rose-200 translate-x-2" 
                    : "text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:translate-x-1"
                  }`}
              >
                <link.icon className={`w-5 h-5 ${isActive ? "" : "opacity-70"}`} />
                {link.name}
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-rose-50">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all">
            <LogOut className="w-5 h-5 opacity-70" />
            Logout
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-rose-100 z-50 pb-safe">
        <div className="flex justify-around items-center h-16 px-6">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="relative flex flex-col items-center justify-center w-16 h-full"
              >
                <div className={`flex flex-col items-center justify-center transition-all duration-300 ${isActive ? "-translate-y-4" : "translate-y-0"}`}>
                  <div className={`p-3 rounded-full transition-all duration-300 ${isActive ? "bg-rose-500 text-white shadow-lg shadow-rose-200" : "text-slate-400"}`}>
                    <link.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-medium mt-1 absolute -bottom-1 transition-all duration-300 ${isActive ? "opacity-100 text-rose-600" : "opacity-0"}`}>
                    {link.name}
                  </span>
                </div>
              </Link>
            );
          })}
          
          {/* Mobile Logout Button */}
          <button
            onClick={handleLogout}
            className="relative flex flex-col items-center justify-center w-16 h-full text-slate-400"
          >
            <div className="flex flex-col items-center justify-center transition-all duration-300 translate-y-0">
              <div className="p-3 rounded-full transition-all duration-300 text-slate-400">
                <LogOut className="w-6 h-6" />
              </div>
            </div>
          </button>
        </div>
      </nav>
    </>
  );
}
