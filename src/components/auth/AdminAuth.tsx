"use client";

import { useState, useEffect } from "react";

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check if previously authenticated in this session
    if (sessionStorage.getItem("adminAuth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "106891") {
      sessionStorage.setItem("adminAuth", "true");
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-[#050505] z-50 flex items-center justify-center font-[family-name:var(--font-share-tech-mono)]">
      <div className="w-full max-w-md p-8 border border-gray-800 bg-[#0a0a0a] rounded-lg shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-red-900/50"></div>
        <div className="absolute top-0 left-0 w-1/3 h-1 bg-red-600 animate-pulse"></div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl text-white tracking-widest uppercase mb-2">Admin Override</h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest">Authentication Required</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER PASSCODE"
              className="w-full bg-[#111] border border-gray-700 text-center text-xl tracking-[0.5em] text-white p-4 focus:outline-none focus:border-red-500 transition-colors"
              autoFocus
            />
            {error && (
              <p className="absolute -bottom-6 left-0 w-full text-center text-xs text-red-500">
                ACCESS DENIED. INVALID PASSCODE.
              </p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-red-900/30 hover:bg-red-900/60 border border-red-900/50 text-red-500 p-4 uppercase tracking-widest transition-colors font-bold"
          >
            Authenticate
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <a href="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors uppercase">
            ← Abort and return to Core
          </a>
        </div>
      </div>
    </div>
  );
}
