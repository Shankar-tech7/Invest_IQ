import React, { useState, useEffect } from "react";
import { Settings, Bell, Shield, Moon, Globe, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

const DEFAULT_SETTINGS = {
  notifications: true,
  darkMode: true,
  biometricLogin: false
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(() => {
    // Load from localStorage immediately — no backend needed
    const saved = localStorage.getItem("investiq_settings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Try to sync from backend silently
    fetch("http://127.0.0.1:5000/api/user/settings")
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.notifications !== "undefined") {
          setSettings(data);
        }
      })
      .catch(() => {});
  }, []);

  const toggleSetting = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    localStorage.setItem("investiq_settings", JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);

    // Sync to backend silently
    fetch("http://127.0.0.1:5000/api/user/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    }).catch(() => {});
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
        <Settings className="w-6 h-6 text-[#ff003c]" /> System Configuration
      </h2>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm flex items-center gap-2"
        >
          <BadgeCheck className="w-4 h-4" /> Settings updated.
        </motion.div>
      )}

      <div className="space-y-4">
        {[
          { key: "notifications", label: "Push Notifications", desc: "Real-time alerts for case updates", icon: Bell },
          { key: "darkMode", label: "Stealth Mode (Dark UI)", desc: "Optimized for night-shift investigations", icon: Moon },
          { key: "biometricLogin", label: "Biometric Bypass", desc: "Enable face/fingerprint authentication", icon: Shield }
        ].map((item) => (
          <div
            key={item.key}
            className="glass-panel p-6 rounded-xl flex items-center justify-between border border-white/5 hover:border-[#ff003c]/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#171717] rounded-lg flex items-center justify-center border border-[#262626]">
                <item.icon className="w-5 h-5 text-[#ff003c]" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">{item.label}</h4>
                <p className="text-[11px] text-slate-500">{item.desc}</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting(item.key)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${settings[item.key] ? 'bg-[#ff003c]' : 'bg-[#262626]'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${settings[item.key] ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
        ))}
      </div>

      <div className="glass-panel p-6 rounded-xl border border-white/5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-[#171717] rounded-lg flex items-center justify-center border border-[#262626]">
            <Globe className="w-5 h-5 text-[#ff003c]" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm">Deployment Region</h4>
            <p className="text-[11px] text-slate-500">Current localized AI server region</p>
          </div>
        </div>
        <select className="w-full bg-black border border-[#262626] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#ff003c]">
          <option>Northern Division (Primary)</option>
          <option>Southern Operations</option>
          <option>International Protocol</option>
        </select>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-white/5">
        <h4 className="text-white font-semibold text-sm mb-1">Platform Version</h4>
        <p className="text-[10px] text-slate-500 font-mono">InvestIQ Forensic Platform v4.2.0 — Build 20260509</p>
      </div>
    </div>
  );
}
