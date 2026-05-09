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

    fetch(`${API_URL}/api/user/profile`)
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

    fetch(`${API_URL}/api/user/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updated)
    }).catch(() => {});
  };

  return <div>Your existing JSX remains same here</div>;
}