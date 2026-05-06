"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError("Oops! Username atau password salah 💔");
      }
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-slate-800 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <Heart className="w-12 h-12 text-rose-500 fill-rose-500 mx-auto mb-4 animate-pulse" />
          <h1 className="text-3xl font-black text-white mb-2">ar.ayy</h1>
          <p className="text-slate-300">Welcome to our private space.</p>
        </div>

        <form onSubmit={handleLogin} className="p-8">
          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-medium mb-6 text-center border border-rose-100">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all font-medium"
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all font-medium"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-95 disabled:opacity-70"
          >
            {loading ? "Unlocking..." : "Enter Our Space"}
          </button>
        </form>
      </div>
    </div>
  );
}
