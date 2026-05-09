import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  Award,
  Edit3,
  Save,
  BadgeCheck
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const DEFAULT_PROFILE = {
  name: "Agent 47",
  rank: "Lead Forensic Investigator",
  badge: "IQ-4721",
  division: "Alpha Forensics Unit",
  email: "agent47@investiq.gov",
  specialization: "Digital Forensics & Biometrics",
  avatar:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
};

export default function ProfilePage() {

  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState(DEFAULT_PROFILE);

  const [saved, setSaved] = useState(false);

  useEffect(() => {

    const local = localStorage.getItem("investiq_profile");

    if (local) {
      const parsed = JSON.parse(local);

      setProfile(parsed);

      setFormData(parsed);
    }

    // CURRENT LOGGED USER
    const username = localStorage.getItem("username");

    fetch(
      `${API_URL}/api/user/profile?username=${username}`
    )
      .then((res) => res.json())

      .then((data) => {

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

    localStorage.setItem(
      "investiq_profile",
      JSON.stringify(updated)
    );

    setIsEditing(false);

    setSaved(true);

    setTimeout(() => setSaved(false), 2000);

    // CURRENT USERNAME
    const username = localStorage.getItem("username");

    fetch(
      `${API_URL}/api/user/profile?username=${username}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(updated)
      }
    ).catch(() => {});
  };

  return (
    <div className="max-w-5xl mx-auto">

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center gap-2"
        >
          <BadgeCheck className="w-5 h-5" />
          Profile updated successfully
        </motion.div>
      )}

      <div className="glass-panel rounded-3xl p-8 border border-white/5">

        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* AVATAR */}
          <div className="flex flex-col items-center">

            <img
              src={profile.avatar}
              alt="profile"
              className="w-40 h-40 rounded-3xl object-cover border-4 border-[#ff003c]/30 shadow-[0_0_25px_rgba(255,0,60,0.2)]"
            />

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#ff003c]/10 border border-[#ff003c]/30 rounded-xl text-[#ff003c] hover:bg-[#ff003c]/20 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>

          </div>

          {/* DETAILS */}
          <div className="flex-1 space-y-6">

            <div>
              <h1 className="text-4xl font-black text-white uppercase tracking-tight">
                {profile.name}
              </h1>

              <p className="text-[#ff003c] font-bold uppercase tracking-widest text-sm mt-1">
                {profile.rank}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

              {/* BADGE */}
              <div className="glass-panel p-5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-[#ff003c]" />
                  <h3 className="text-sm uppercase text-slate-400 tracking-wider">
                    Badge ID
                  </h3>
                </div>

                <p className="text-white font-bold text-lg">
                  {profile.badge}
                </p>
              </div>

              {/* DIVISION */}
              <div className="glass-panel p-5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5 text-[#ff003c]" />
                  <h3 className="text-sm uppercase text-slate-400 tracking-wider">
                    Division
                  </h3>
                </div>

                <p className="text-white font-bold text-lg">
                  {profile.division}
                </p>
              </div>

              {/* EMAIL */}
              <div className="glass-panel p-5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-[#ff003c]" />
                  <h3 className="text-sm uppercase text-slate-400 tracking-wider">
                    Email
                  </h3>
                </div>

                {
                  isEditing ? (
                    <input
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value
                        })
                      }
                      className="w-full bg-black border border-[#262626] rounded-xl px-4 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white font-bold">
                      {profile.email}
                    </p>
                  )
                }

              </div>

              {/* SPECIALIZATION */}
              <div className="glass-panel p-5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-[#ff003c]" />
                  <h3 className="text-sm uppercase text-slate-400 tracking-wider">
                    Specialization
                  </h3>
                </div>

                {
                  isEditing ? (
                    <input
                      value={formData.specialization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialization: e.target.value
                        })
                      }
                      className="w-full bg-black border border-[#262626] rounded-xl px-4 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white font-bold">
                      {profile.specialization}
                    </p>
                  )
                }

              </div>

            </div>

            {
              isEditing && (
                <button
                  onClick={handleSave}
                  className="mt-4 flex items-center gap-2 px-6 py-3 bg-[#ff003c] text-black font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              )
            }

          </div>

        </div>

      </div>
    </div>
  );
}