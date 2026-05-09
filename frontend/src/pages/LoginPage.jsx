import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Lock, User, Key, Eye, EyeOff, Terminal } from "lucide-react";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsAuthenticating(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      
      if (data.success) {
        // Success animation delay
        setTimeout(() => {
          onLogin(data.user);
        }, 1000);
      } else {
        setError(data.message);
        setIsAuthenticating(false);
      }
    } catch (err) {
      setError("Secure link failure. Ensure InvestIQ Backend is running on 127.0.0.1:5000.");
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* HUD Background Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ff003c]/10 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff003c] to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff003c] to-transparent animate-pulse"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full z-10"
      >
        <div className="glass-panel p-8 rounded-3xl border border-white/5 relative shadow-2xl">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#ff003c]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#ff003c]/30 shadow-[0_0_20px_rgba(255,0,60,0.2)]">
              <ShieldAlert className="w-10 h-10 text-[#ff003c]" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">InvestIQ</h1>
            <p className="text-[10px] text-[#ff003c] uppercase tracking-[0.3em] font-bold mt-1">InvestIQ Protocol Alpha</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">Terminal ID</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-500 group-focus-within:text-[#ff003c] transition-colors" />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="AGENT_ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#262626] rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-700 text-sm focus:outline-none focus:border-[#ff003c] focus:ring-1 focus:ring-[#ff003c]/20 transition-all font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">Access Cipher</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-slate-500 group-focus-within:text-[#ff003c] transition-colors" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="CIPHER_KEY"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#262626] rounded-xl pl-11 pr-11 py-3 text-white placeholder-slate-700 text-sm focus:outline-none focus:border-[#ff003c] focus:ring-1 focus:ring-[#ff003c]/20 transition-all font-mono"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2 text-rose-500 text-xs font-bold"
              >
                <Lock className="w-4 h-4" />
                {error.toUpperCase()}
              </motion.div>
            )}

            <button 
              disabled={isAuthenticating}
              className={`w-full py-4 rounded-xl text-black font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(255,0,60,0.3)] hover:shadow-[0_0_30px_rgba(255,0,60,0.5)] flex items-center justify-center gap-2
                ${isAuthenticating ? 'bg-[#ff003c]/50 cursor-not-allowed' : 'bg-[#ff003c] hover:bg-[#ff003c]/90 active:scale-[0.98]'}`}
            >
              {isAuthenticating ? (
                <>
                  <Terminal className="w-4 h-4 animate-bounce" /> AUTHENTICATING...
                </>
              ) : "ESTABLISH SECURE LINK"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] text-slate-600 font-mono tracking-tighter">
              RESTRICTED ACCESS: AUTHORIZED GOVERNMENT PERSONNEL ONLY<br/>
              ALL TERMINAL ACTIVITY IS LOGGED AND ENCRYPTED
            </p>
          </div>

          {/* Corner Decors */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#ff003c]/30 rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#ff003c]/30 rounded-bl-3xl"></div>
        </div>
      </motion.div>
    </div>
  );
}
