import React from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ShieldAlert,
  Activity,
  FileText,
  Video,
  Network,
  Clock,
  Settings,
  LogOut,
  Cpu,
  User
} from "lucide-react";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: Activity },
  { name: "Autopsy Analysis", path: "/autopsy", icon: FileText },
  { name: "Time of Death", path: "/tod", icon: Clock },
  { name: "CCTV Analysis", path: "/cctv", icon: Video },
  { name: "Evidence Map", path: "/evidence", icon: Network },
  { name: "Scene Reconstruction", path: "/reconstruction", icon: Cpu },
  { name: "Agent Profile", path: "/profile", icon: User }
];

export default function Sidebar({ setIsLoggedIn }) {

  const location = useLocation();

  const navigate = useNavigate();

  const handleLogout = async () => {

    try {

      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST"
      });

    } catch (err) {}

    localStorage.removeItem("isLoggedIn");

    localStorage.removeItem("investiq_user");

    setIsLoggedIn(false);

    navigate("/login");
  };

  return (
    <aside className="w-64 flex flex-col bg-[#000000] border-r border-[#171717] shadow-xl relative z-10">

      <div className="p-6 flex items-center gap-3 border-b border-[#171717]">

        <ShieldAlert className="w-8 h-8 text-[#ff003c]" />

        <div>
          <h1 className="text-xl font-bold tracking-wider text-slate-100 uppercase">
            InvestIQ
          </h1>

          <p className="text-[10px] text-[#ff003c] uppercase tracking-widest">
            Forensic AI
          </p>
        </div>
      </div>

      <div className="px-6 py-3 bg-[#ff003c]/5 border-y border-[#ff003c]/10 mb-2">
        <p className="text-[9px] text-[#ff003c] font-mono tracking-tighter opacity-70">
          SYSTEM_ID: INVESTIQ_PROT_V4
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">

        {navItems.map((item) => {

          const isActive = location.pathname === item.path;

          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",

                isActive
                  ? "bg-[#ff003c]/10 text-[#ff003c] neon-border-primary"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#171717]/50"
              )}
            >

              <Icon
                className={cn(
                  "w-5 h-5",
                  isActive
                    ? "text-[#ff003c]"
                    : "group-hover:text-slate-200"
                )}
              />

              {item.name}

            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#171717] space-y-2">

        <Link
          to="/settings"
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",

            location.pathname === "/settings"
              ? "bg-[#ff003c]/10 text-[#ff003c] border border-[#ff003c]/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-[#171717]/50"
          )}
        >

          <Settings className="w-5 h-5" />

          Settings

        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
        >

          <LogOut className="w-5 h-5" />

          Logout

        </button>
      </div>
    </aside>
  );
}