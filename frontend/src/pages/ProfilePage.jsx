import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Award, Edit3, Save, BadgeCheck } from "lucide-react";

const DEFAULT_PROFILE = {
  name: "Agent 47",
  rank: "Lead Forensic Investigator",
  badge: "IQ-4721",
  division: "Alpha Forensics Unit",
  email: "agent47@investiq.gov",
  specialization: "Digital Forensics & Biometrics",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load from localStorage first (persisted edits)
    const local = localStorage.getItem("investiq_profile");
    if (local) {
      const parsed = JSON.parse(local);
      setProfile(parsed);
      setFormData(parsed);
    }

    // Try backend - silently fall back if offline
    fetch("http://127.0.0.1:5000/api/user/profile")
      .then(res => res.json())
      .then(data => {
        if (data && data.name) {
          setProfile(data);
          setFormData(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = () => {
    const updated = { ...formData };
    setProfile(updated);
    localStorage.setItem("investiq_profile", JSON.stringify(updated));
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    // Try saving to backend silently
    fetch("http://127.0.0.1:5000/api/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    }).catch(() => {});
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
          <User className="w-6 h-6 text-[#ff003c]" /> Investigator Profile
        </h2>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#ff003c] text-black font-bold rounded-lg hover:bg-[#ff003c]/80 transition-all text-sm"
        >
          {isEditing ? <><Save className="w-4 h-4" /> Save Changes</> : <><Edit3 className="w-4 h-4" /> Edit Profile</>}
        </button>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm flex items-center gap-2"
        >
          <BadgeCheck className="w-4 h-4" /> Profile saved successfully.
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Avatar Card */}
        <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center border border-white/5">
          <div className="relative w-32 h-32 mb-4">
            <img
              src={profile.avatar}
              alt="Avatar"
              className="w-full h-full rounded-full border-4 border-[#ff003c]/30 object-cover"
            />
            <div className="absolute inset-0 rounded-full border border-[#ff003c] animate-pulse pointer-events-none"></div>
          </div>
          <h3 className="text-xl font-bold text-white">{profile.name}</h3>
          <p className="text-slate-400 text-sm mt-1">{profile.rank}</p>
          <div className="mt-4 px-3 py-1 bg-[#ff003c]/10 text-[#ff003c] text-[10px] font-bold rounded-full uppercase tracking-widest border border-[#ff003c]/20">
            Active Duty
          </div>
          <div className="mt-3 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-widest border border-emerald-500/20">
            Badge: {profile.badge}
          </div>
        </div>

        {/* Details Card */}
        <div className="md:col-span-2 glass-panel p-8 rounded-2xl space-y-6 border border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: "name", label: "Full Name", icon: User },
              { key: "email", label: "Email Address", icon: Mail },
              { key: "specialization", label: "Specialization", icon: Award },
              { key: "division", label: "Division", icon: Shield }
            ].map(({ key, label, icon: Icon }) => (
              <div key={key} className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-2">
                  <Icon className="w-3 h-3" /> {label}
                </label>
                {isEditing ? (
                  <input
                    className="w-full bg-black/50 border border-[#262626] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#ff003c] transition-colors"
                    value={formData[key] || ""}
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                  />
                ) : (
                  <p className="text-white font-medium text-sm">{profile[key]}</p>
                )}
              </div>
            ))}

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-2">
                <Shield className="w-3 h-3" /> Access Level
              </label>
              <p className="text-rose-500 font-mono text-sm font-bold">LEVEL 5 (RESTRICTED)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
