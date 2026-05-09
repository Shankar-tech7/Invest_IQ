import React from "react";
import { Bell, Search, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-[#000000]/80 backdrop-blur-md border-b border-[#171717] sticky top-0 z-10">
      <div className="flex-1 flex items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search cases, suspects, or evidence..." 
            className="w-full bg-[#0a0a0a] border border-[#171717] rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-[#ff003c]/50 focus:ring-1 focus:ring-[#ff003c]/50 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 flex-shrink-0">
        <button className="relative p-2 text-slate-400 hover:text-[#ff003c] transition-colors rounded-full hover:bg-[#ff003c]/10">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_5px_rgba(244,63,94,0.8)]"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-[#171717]">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-200">Det. Sarah Chen</p>
            <p className="text-xs text-slate-500">Cyber Forensics Unit</p>
          </div>
          <UserCircle className="w-8 h-8 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
